"use client";

import { useEffect, useState } from "react";
import {
  criarAtendimento,
  excluirAtendimento,
  listarAtendimentos,
} from "@/src/services/atendimentos";
import { listarUsuarios } from "@/src/services/usuarios";
import { Atendimento, tipoAtendimentoLabel } from "@/src/types/atendimento.type";
import type { TipoAtendimento } from "@/src/types/agendamento.type";
import { Usuario } from "@/src/types/usuario.type";
import styles from "../familias.module.scss";

type FormData = {
  tecnicoId: string;
  tipo: TipoAtendimento;
  titulo: string;
  descricao: string;
  dataAtendimento: string;
  localAtendimento: string;
  sigiloso: boolean;
};

const initialForm: FormData = {
  tecnicoId: "",
  tipo: "INDIVIDUAL",
  titulo: "",
  descricao: "",
  dataAtendimento: new Date().toISOString().slice(0, 16),
  localAtendimento: "",
  sigiloso: false,
};

function formatarDataHora(data: string): string {
  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AtendimentosTab({ familiaId }: { familiaId: string }) {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [tecnicos, setTecnicos] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState<FormData>(initialForm);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  function carregar() {
    setCarregando(true);
    return Promise.all([listarAtendimentos({ familiaId }), listarUsuarios()])
      .then(([atendimentosData, usuariosData]) => {
        setAtendimentos(atendimentosData);
        setTecnicos(usuariosData.filter((u) => u.status === "ATIVO"));
      })
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familiaId]);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (!form.tecnicoId) {
      setErro("Selecione o técnico responsável.");
      return;
    }
    if (!form.descricao.trim()) {
      setErro("A descrição é obrigatória.");
      return;
    }

    setSalvando(true);
    try {
      await criarAtendimento({
        familiaId,
        tecnicoId: form.tecnicoId,
        tipo: form.tipo,
        titulo: form.titulo || undefined,
        descricao: form.descricao,
        dataAtendimento: new Date(form.dataAtendimento).toISOString(),
        localAtendimento: form.localAtendimento || undefined,
        sigiloso: form.sigiloso,
      });
      setForm(initialForm);
      setMostrarForm(false);
      carregar();
    } catch {
      setErro("Não foi possível registrar o atendimento.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(id: string) {
    if (!confirm("Deseja excluir este atendimento?")) return;
    await excluirAtendimento(id);
    carregar();
  }

  return (
    <div className={styles.card}>
      <div className={styles.membrosHeader}>
        <p className={styles.sectionTitle}>Atendimentos ({atendimentos.length})</p>
        <button className={styles.btnNovo} onClick={() => setMostrarForm((v) => !v)}>
          {mostrarForm ? "Cancelar" : "+ Novo atendimento"}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSalvar} className={styles.inlineForm}>
          {erro && <p className={styles.erro}>{erro}</p>}
          <div className={styles.formGrid}>
            <label className={styles.label}>
              Técnico responsável
              <select
                className={styles.input}
                value={form.tecnicoId}
                onChange={(e) => setForm({ ...form, tecnicoId: e.target.value })}
              >
                <option value="">Selecione…</option>
                {tecnicos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Tipo
              <select
                className={styles.input}
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoAtendimento })}
              >
                {Object.entries(tipoAtendimentoLabel).map(([valor, label]) => (
                  <option key={valor} value={valor}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Data e hora
              <input
                type="datetime-local"
                className={styles.input}
                value={form.dataAtendimento}
                onChange={(e) => setForm({ ...form, dataAtendimento: e.target.value })}
              />
            </label>

            <label className={styles.label}>
              Local
              <input
                type="text"
                className={styles.input}
                value={form.localAtendimento}
                onChange={(e) => setForm({ ...form, localAtendimento: e.target.value })}
              />
            </label>

            <label className={`${styles.label} ${styles.full}`}>
              Título
              <input
                type="text"
                className={styles.input}
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              />
            </label>

            <label className={`${styles.label} ${styles.full}`}>
              Descrição
              <textarea
                className={styles.textarea}
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />
            </label>

            <label className={`${styles.label} ${styles.checkboxLabel} ${styles.full}`}>
              <input
                type="checkbox"
                checked={form.sigiloso}
                onChange={(e) => setForm({ ...form, sigiloso: e.target.checked })}
              />
              Atendimento sigiloso
            </label>
          </div>

          <div className={styles.formFooter}>
            <button type="submit" className={styles.btnSalvar} disabled={salvando}>
              {salvando ? "Salvando…" : "Registrar atendimento"}
            </button>
          </div>
        </form>
      )}

      {carregando ? (
        <p className={styles.empty}>Carregando…</p>
      ) : atendimentos.length > 0 ? (
        <div className={styles.timeline}>
          {atendimentos.map((a) => (
            <div className={styles.timelineItem} key={a.id}>
              <div className={styles.timelineHeader}>
                <div>
                  <strong>{a.titulo || tipoAtendimentoLabel[a.tipo]}</strong>
                  {a.sigiloso && <span className={styles.tagSigiloso}>Sigiloso</span>}
                </div>
                <button className={styles.delete} onClick={() => handleExcluir(a.id)}>
                  Excluir
                </button>
              </div>
              <p className={styles.timelineMeta}>
                {tipoAtendimentoLabel[a.tipo]} · {formatarDataHora(a.dataAtendimento)} ·{" "}
                {a.tecnico.nome}
                {a.localAtendimento && <> · {a.localAtendimento}</>}
              </p>
              <p className={styles.timelineDescricao}>{a.descricao}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>Nenhum atendimento registrado.</p>
      )}
    </div>
  );
}
