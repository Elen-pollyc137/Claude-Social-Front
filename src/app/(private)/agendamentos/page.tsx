"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/src/services/api";
import { Agendamento, TipoAtendimento, StatusAgendamento } from "@/src/types/agendamento.type";
import { Familia } from "@/src/types/familia.type";
import styles from "./agendamentos.module.scss";

type UsuarioSimples = { id: string; nome: string; perfil: string; status: string };

type FormData = {
  familiaId: string;
  tecnicoId: string;
  tipo: TipoAtendimento;
  titulo: string;
  observacoes: string;
  dataHora: string;
  duracaoMinutos: number;
  status: StatusAgendamento;
  compareceu: boolean;
};

const initialForm: FormData = {
  familiaId: "",
  tecnicoId: "",
  tipo: "INDIVIDUAL",
  titulo: "",
  observacoes: "",
  dataHora: "",
  duracaoMinutos: 60,
  status: "AGENDADO",
  compareceu: false,
};

const tipoLabel: Record<TipoAtendimento, string> = {
  INDIVIDUAL: "Individual",
  VISITA_DOMICILIAR: "Visita domiciliar",
  ENCAMINHAMENTO: "Encaminhamento",
  ACOMPANHAMENTO_FAMILIAR: "Acompanhamento familiar",
};

const statusLabel: Record<StatusAgendamento, string> = {
  AGENDADO: "Agendado",
  CONFIRMADO: "Confirmado",
  EM_ATENDIMENTO: "Em atendimento",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
  FALTOU: "Faltou",
  REAGENDADO: "Reagendado",
};

function formatDataHora(iso: string) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("pt-BR") +
    " " +
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}

function toDateTimeLocal(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioSimples[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusAgendamento | "">("");
  const [filtroBusca, setFiltroBusca] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(initialForm);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const params: Record<string, string> = {};
      if (filtroDataInicio) params.dataInicio = new Date(filtroDataInicio).toISOString();
      if (filtroDataFim) {
        const fim = new Date(filtroDataFim);
        fim.setHours(23, 59, 59);
        params.dataFim = fim.toISOString();
      }
      if (filtroStatus) params.status = filtroStatus;

      const res = await api.get<Agendamento[]>("/agendamentos", { params });
      setAgendamentos(res.data);
    } finally {
      setCarregando(false);
    }
  }, [filtroDataInicio, filtroDataFim, filtroStatus]);

  useEffect(() => {
    carregar();
    Promise.all([
      api.get<Familia[]>("/familias"),
      api.get<UsuarioSimples[]>("/usuarios"),
    ]).then(([resFam, resUsu]) => {
      setFamilias(resFam.data);
      setUsuarios(resUsu.data.filter((u) => u.status === "ATIVO"));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const agendamentosFiltrados = agendamentos.filter((a) => {
    if (!filtroBusca) return true;
    const busca = filtroBusca.toLowerCase();
    return (
      a.familia.responsavelNome.toLowerCase().includes(busca) ||
      a.tecnico.nome.toLowerCase().includes(busca) ||
      (a.titulo ?? "").toLowerCase().includes(busca)
    );
  });

  function abrirNovo() {
    setEditandoId(null);
    setForm(initialForm);
    setModalAberto(true);
  }

  function abrirEdicao(a: Agendamento) {
    setEditandoId(a.id);
    setForm({
      familiaId: a.familiaId,
      tecnicoId: a.tecnicoId,
      tipo: a.tipo,
      titulo: a.titulo ?? "",
      observacoes: a.observacoes ?? "",
      dataHora: toDateTimeLocal(a.dataHora),
      duracaoMinutos: a.duracaoMinutos ?? 60,
      status: a.status,
      compareceu: a.compareceu ?? false,
    });
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setEditandoId(null);
    setForm(initialForm);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "duracaoMinutos"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      const payload = {
        ...form,
        dataHora: new Date(form.dataHora).toISOString(),
        titulo: form.titulo || undefined,
        observacoes: form.observacoes || undefined,
        compareceu: form.compareceu || undefined,
      };

      if (editandoId) {
        await api.put(`/agendamentos/${editandoId}`, payload);
      } else {
        await api.post("/agendamentos", payload);
      }

      fecharModal();
      carregar();
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id: string) {
    if (!confirm("Deseja excluir este agendamento?")) return;
    await api.delete(`/agendamentos/${id}`);
    carregar();
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.heading}>Agendamentos</h1>
          <p className={styles.sub}>Gestão de atendimentos e visitas</p>
        </div>
        <button className={styles.btnNovo} onClick={abrirNovo}>
          + Novo agendamento
        </button>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Buscar família, técnico ou título..."
          value={filtroBusca}
          onChange={(e) => setFiltroBusca(e.target.value)}
          className={styles.inputBusca}
        />
        <input
          type="date"
          value={filtroDataInicio}
          onChange={(e) => setFiltroDataInicio(e.target.value)}
          className={styles.inputFiltro}
          title="Data início"
        />
        <input
          type="date"
          value={filtroDataFim}
          onChange={(e) => setFiltroDataFim(e.target.value)}
          className={styles.inputFiltro}
          title="Data fim"
        />
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value as StatusAgendamento | "")}
          className={styles.inputFiltro}
        >
          <option value="">Todos os status</option>
          {(Object.entries(statusLabel) as [StatusAgendamento, string][]).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <button className={styles.btnFiltrar} onClick={carregar}>
          Filtrar
        </button>
      </div>

      <div className={styles.tableWrap}>
        {carregando ? (
          <p className={styles.empty}>Carregando…</p>
        ) : agendamentosFiltrados.length === 0 ? (
          <p className={styles.empty}>Nenhum agendamento encontrado.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Data / Hora</th>
                <th>Família</th>
                <th>Técnico</th>
                <th>Tipo</th>
                <th>Duração</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {agendamentosFiltrados.map((a) => (
                <tr key={a.id}>
                  <td className={styles.dataHora}>{formatDataHora(a.dataHora)}</td>
                  <td className={styles.familia}>{a.familia.responsavelNome}</td>
                  <td>{a.tecnico.nome}</td>
                  <td>{tipoLabel[a.tipo]}</td>
                  <td>{a.duracaoMinutos ?? 60} min</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        styles[`badge_${a.status}` as keyof typeof styles]
                      }`}
                    >
                      {statusLabel[a.status]}
                    </span>
                  </td>
                  <td>
                    <div className={styles.acoes}>
                      <button className={styles.btnEdit} onClick={() => abrirEdicao(a)}>
                        Editar
                      </button>
                      <button className={styles.btnDelete} onClick={() => excluir(a.id)}>
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalAberto && (
        <div className={styles.overlay} onClick={fecharModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editandoId ? "Editar agendamento" : "Novo agendamento"}</h2>
              <button className={styles.btnClose} onClick={fecharModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <label className={styles.label}>
                  Família *
                  <select
                    name="familiaId"
                    value={form.familiaId}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  >
                    <option value="">Selecione a família...</option>
                    {familias.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.responsavelNome}
                        {f.codigoFamiliar ? ` (${f.codigoFamiliar})` : ""}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.label}>
                  Técnico responsável *
                  <select
                    name="tecnicoId"
                    value={form.tecnicoId}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  >
                    <option value="">Selecione o técnico...</option>
                    {usuarios.map((u) => (
                      <option key={u.id} value={u.id}>{u.nome}</option>
                    ))}
                  </select>
                </label>

                <label className={styles.label}>
                  Tipo de atendimento *
                  <select
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  >
                    {(Object.entries(tipoLabel) as [TipoAtendimento, string][]).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </label>

                <label className={styles.label}>
                  Status
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={styles.input}
                  >
                    {(Object.entries(statusLabel) as [StatusAgendamento, string][]).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </label>

                <label className={styles.label}>
                  Data e hora *
                  <input
                    type="datetime-local"
                    name="dataHora"
                    value={form.dataHora}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                </label>

                <label className={styles.label}>
                  Duração (minutos)
                  <input
                    type="number"
                    name="duracaoMinutos"
                    value={form.duracaoMinutos}
                    onChange={handleChange}
                    min={15}
                    step={15}
                    className={styles.input}
                  />
                </label>

                <label className={`${styles.label} ${styles.full}`}>
                  Título
                  <input
                    type="text"
                    name="titulo"
                    value={form.titulo}
                    onChange={handleChange}
                    placeholder="Opcional"
                    className={styles.input}
                  />
                </label>

                <label className={`${styles.label} ${styles.full}`}>
                  Observações
                  <textarea
                    name="observacoes"
                    value={form.observacoes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Opcional"
                    className={styles.textarea}
                  />
                </label>

                {editandoId && (
                  <label className={`${styles.checkLabel} ${styles.full}`}>
                    <input
                      type="checkbox"
                      name="compareceu"
                      checked={form.compareceu}
                      onChange={handleChange}
                    />
                    Família compareceu ao atendimento
                  </label>
                )}
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnCancel} onClick={fecharModal}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnSalvar} disabled={salvando}>
                  {salvando ? "Salvando…" : editandoId ? "Atualizar" : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
