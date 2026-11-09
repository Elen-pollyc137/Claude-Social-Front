"use client";

import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { atualizarUnidade, criarUnidade, listarUnidades, UnidadeBody } from "@/src/services/unidades";
import type { TipoUnidade, Unidade } from "@/src/types/unidade.type";
import { useUsuarioLogado } from "@/src/hooks/useUsuarioLogado";
import { mensagemErro } from "@/src/utils/formatacao";
import PageHeader from "@/src/components/ui/PageHeader";
import Button from "@/src/components/ui/Button";
import Badge from "@/src/components/ui/Badge";
import EmptyState from "@/src/components/ui/EmptyState";
import styles from "@/src/styles/envios.module.scss";

type Form = Required<Omit<UnidadeBody, "ativa">>;

const formVazio: Form = {
  nome: "",
  tipo: "CRAS",
  codigo: "",
  endereco: "",
  bairro: "",
  cidade: "",
  telefone: "",
  email: "",
};

const camposTexto: [keyof Omit<Form, "nome" | "tipo">, string][] = [
  ["codigo", "Código (CNEAS/ID SUAS)"],
  ["telefone", "Telefone"],
  ["email", "E-mail"],
  ["endereco", "Endereço"],
  ["bairro", "Bairro"],
  ["cidade", "Cidade"],
];

export default function UnidadesPage() {
  const { ehGestao } = useUsuarioLogado();
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<TipoUnidade | "">("");
  // null = formulário fechado; "" = nova unidade; id = edição.
  const [editando, setEditando] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(formVazio);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  function carregar() {
    return listarUnidades()
      .then(setUnidades)
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirNova() {
    setForm(formVazio);
    setErro("");
    setEditando("");
  }

  function abrirEdicao(u: Unidade) {
    setForm({
      nome: u.nome,
      tipo: u.tipo,
      codigo: u.codigo ?? "",
      endereco: u.endereco ?? "",
      bairro: u.bairro ?? "",
      cidade: u.cidade ?? "",
      telefone: u.telefone ?? "",
      email: u.email ?? "",
    });
    setErro("");
    setEditando(u.id);
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim()) {
      setErro("Informe o nome da unidade.");
      return;
    }
    setSalvando(true);
    setErro("");
    try {
      if (editando) await atualizarUnidade(editando, form);
      else await criarUnidade(form);
      setEditando(null);
      carregar();
    } catch (error) {
      setErro(mensagemErro(error, "Não foi possível salvar a unidade."));
    } finally {
      setSalvando(false);
    }
  }

  async function alternarSituacao(u: Unidade) {
    const acao = u.ativa ? "inativar" : "reativar";
    if (!confirm(`Deseja ${acao} a unidade ${u.nome}?`)) return;
    try {
      await atualizarUnidade(u.id, { ativa: !u.ativa });
      carregar();
    } catch (error) {
      alert(mensagemErro(error, `Não foi possível ${acao} a unidade.`));
    }
  }

  const visiveis = filtroTipo ? unidades.filter((u) => u.tipo === filtroTipo) : unidades;

  return (
    <main className={styles.container}>
      <PageHeader
        title="Unidades"
        description="CRAS e CREAS que utilizam o sistema"
        action={ehGestao && editando === null ? <Button onClick={abrirNova}>+ Nova unidade</Button> : undefined}
      />

      {editando !== null && (
        <form className={styles.card} onSubmit={handleSalvar}>
          <p className={styles.sectionTitle}>{editando ? "Editar unidade" : "Nova unidade"}</p>
          {erro && <p className={styles.erro}>{erro}</p>}
          <div className={styles.formGrid}>
            <label className={`${styles.label} ${styles.full}`}>
              Nome *
              <input
                className={styles.input}
                value={form.nome}
                placeholder="Ex.: CRAS Vila Guilhermina"
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </label>
            <label className={styles.label}>
              Tipo *
              <select
                className={styles.select}
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoUnidade })}
              >
                <option value="CRAS">CRAS</option>
                <option value="CREAS">CREAS</option>
              </select>
            </label>
            {camposTexto.map(([campo, rotulo]) => (
              <label key={campo} className={styles.label}>
                {rotulo}
                <input
                  className={styles.input}
                  value={form[campo]}
                  onChange={(e) => setForm({ ...form, [campo]: e.target.value })}
                />
              </label>
            ))}
          </div>
          <div className={styles.formFooter}>
            <button type="button" className={styles.btnCancel} onClick={() => setEditando(null)}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnSalvar} disabled={salvando}>
              {salvando ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </form>
      )}

      <div className={styles.filters}>
        <select
          className={styles.select}
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value as TipoUnidade | "")}
        >
          <option value="">Todos os tipos</option>
          <option value="CRAS">CRAS</option>
          <option value="CREAS">CREAS</option>
        </select>
      </div>

      <div className={styles.tableWrap}>
        {carregando ? (
          <p className={styles.empty}>Carregando…</p>
        ) : visiveis.length === 0 ? (
          <EmptyState
            icon={<Building2 size={26} />}
            title="Nenhuma unidade cadastrada"
            description="Cadastre os CRAS e CREAS para vincular profissionais e famílias."
          />
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Unidade</th>
                <th>Tipo</th>
                <th>Localização</th>
                <th>Contato</th>
                <th>Profissionais</th>
                <th>Situação</th>
                {ehGestao && <th></th>}
              </tr>
            </thead>
            <tbody>
              {visiveis.map((u) => (
                <tr key={u.id}>
                  <td>
                    {u.nome}
                    {u.codigo && <span className={styles.sub}>Código {u.codigo}</span>}
                  </td>
                  <td>{u.tipo}</td>
                  <td>
                    {[u.endereco, u.bairro].filter(Boolean).join(", ") || "—"}
                    {u.cidade && <span className={styles.sub}>{u.cidade}</span>}
                  </td>
                  <td>
                    {u.telefone || "—"}
                    {u.email && <span className={styles.sub}>{u.email}</span>}
                  </td>
                  <td>{u._count?.profissionais ?? 0}</td>
                  <td>
                    <Badge tone={u.ativa ? "success" : "neutral"} dot>
                      {u.ativa ? "Ativa" : "Inativa"}
                    </Badge>
                  </td>
                  {ehGestao && (
                    <td>
                      <div className={styles.rowActions}>
                        <button className={styles.linkBtn} onClick={() => abrirEdicao(u)}>
                          Editar
                        </button>
                        <button
                          className={`${styles.linkBtn} ${u.ativa ? styles.linkBtnDanger : ""}`}
                          onClick={() => alternarSituacao(u)}
                        >
                          {u.ativa ? "Inativar" : "Reativar"}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
