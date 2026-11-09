"use client";

import { useEffect, useState } from "react";
import { Network } from "lucide-react";
import {
  atualizarVinculoProfissional,
  criarVinculoProfissional,
  excluirVinculoProfissional,
  listarUnidades,
  listarVinculosProfissionais,
} from "@/src/services/unidades";
import { listarUsuarios } from "@/src/services/usuarios";
import { sugestoesFuncao, type Unidade, type VinculoProfissional } from "@/src/types/unidade.type";
import { perfilUsuarioLabel, type Usuario } from "@/src/types/usuario.type";
import { useUsuarioLogado } from "@/src/hooks/useUsuarioLogado";
import { mensagemErro } from "@/src/utils/formatacao";
import PageHeader from "@/src/components/ui/PageHeader";
import Button from "@/src/components/ui/Button";
import Badge from "@/src/components/ui/Badge";
import EmptyState from "@/src/components/ui/EmptyState";
import styles from "@/src/styles/envios.module.scss";

const formVazio = { usuarioId: "", unidadeId: "", funcao: "" };

export default function VinculosPage() {
  const { ehGestao } = useUsuarioLogado();
  const [vinculos, setVinculos] = useState<VinculoProfissional[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroUnidade, setFiltroUnidade] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(formVazio);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [editandoFuncao, setEditandoFuncao] = useState<{ id: string; funcao: string } | null>(null);

  function carregar() {
    return listarVinculosProfissionais()
      .then(setVinculos)
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregar();
    listarUnidades({ ativa: true }).then(setUnidades).catch(() => {});
    listarUsuarios()
      .then((lista) => setUsuarios(lista.filter((u) => u.status === "ATIVO")))
      .catch(() => {});
  }, []);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.usuarioId || !form.unidadeId || !form.funcao.trim()) {
      setErro("Preencha profissional, unidade e função.");
      return;
    }
    setSalvando(true);
    setErro("");
    try {
      await criarVinculoProfissional({ ...form, funcao: form.funcao.trim() });
      setForm({ ...formVazio, unidadeId: form.unidadeId });
      setMostrarForm(false);
      carregar();
    } catch (error) {
      setErro(mensagemErro(error, "Não foi possível criar o vínculo."));
    } finally {
      setSalvando(false);
    }
  }

  async function atualizar(id: string, dados: { funcao?: string; ativo?: boolean }) {
    try {
      await atualizarVinculoProfissional(id, dados);
      setEditandoFuncao(null);
      carregar();
    } catch (error) {
      alert(mensagemErro(error, "Não foi possível atualizar o vínculo."));
    }
  }

  async function remover(v: VinculoProfissional) {
    if (!confirm(`Remover ${v.usuario.nome} da unidade ${v.unidade.nome}?`)) return;
    try {
      await excluirVinculoProfissional(v.id);
      carregar();
    } catch (error) {
      alert(mensagemErro(error, "Não foi possível remover o vínculo."));
    }
  }

  const visiveis = filtroUnidade ? vinculos.filter((v) => v.unidadeId === filtroUnidade) : vinculos;

  return (
    <main className={styles.container}>
      <PageHeader
        title="Vínculos dos profissionais"
        description="Em quais unidades cada profissional atua. Um profissional pode atuar em mais de uma."
        action={
          ehGestao && !mostrarForm ? (
            <Button
              onClick={() => {
                setErro("");
                setForm({ ...formVazio, unidadeId: filtroUnidade });
                setMostrarForm(true);
              }}
            >
              + Novo vínculo
            </Button>
          ) : undefined
        }
      />

      {mostrarForm && (
        <form className={styles.card} onSubmit={handleSalvar}>
          <p className={styles.sectionTitle}>Novo vínculo</p>
          {erro && <p className={styles.erro}>{erro}</p>}
          {unidades.length === 0 && (
            <p className={styles.aviso}>Cadastre uma unidade ativa antes de criar vínculos.</p>
          )}
          <div className={styles.formGrid}>
            <label className={styles.label}>
              Profissional *
              <select
                className={styles.select}
                value={form.usuarioId}
                onChange={(e) => setForm({ ...form, usuarioId: e.target.value })}
              >
                <option value="">Selecione…</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome} ({perfilUsuarioLabel[u.perfil]})
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.label}>
              Unidade *
              <select
                className={styles.select}
                value={form.unidadeId}
                onChange={(e) => setForm({ ...form, unidadeId: e.target.value })}
              >
                <option value="">Selecione…</option>
                {unidades.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome} ({u.tipo})
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.label}>
              Função *
              <input
                className={styles.input}
                list="sugestoes-funcao"
                value={form.funcao}
                onChange={(e) => setForm({ ...form, funcao: e.target.value })}
              />
              <datalist id="sugestoes-funcao">
                {sugestoesFuncao.map((f) => (
                  <option key={f} value={f} />
                ))}
              </datalist>
            </label>
          </div>
          <div className={styles.formFooter}>
            <button type="button" className={styles.btnCancel} onClick={() => setMostrarForm(false)}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnSalvar} disabled={salvando}>
              {salvando ? "Salvando…" : "Vincular"}
            </button>
          </div>
        </form>
      )}

      <div className={styles.filters}>
        <select
          className={styles.select}
          value={filtroUnidade}
          onChange={(e) => setFiltroUnidade(e.target.value)}
        >
          <option value="">Todas as unidades</option>
          {unidades.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nome}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.tableWrap}>
        {carregando ? (
          <p className={styles.empty}>Carregando…</p>
        ) : visiveis.length === 0 ? (
          <EmptyState icon={<Network size={26} />} title="Nenhum vínculo encontrado" />
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Profissional</th>
                <th>Perfil</th>
                <th>Unidade</th>
                <th>Função</th>
                <th>Situação</th>
                {ehGestao && <th></th>}
              </tr>
            </thead>
            <tbody>
              {visiveis.map((v) => (
                <tr key={v.id}>
                  <td>
                    {v.usuario.nome}
                    <span className={styles.sub}>{v.usuario.email}</span>
                  </td>
                  <td>{perfilUsuarioLabel[v.usuario.perfil]}</td>
                  <td>
                    {v.unidade.nome}
                    <span className={styles.sub}>{v.unidade.tipo}</span>
                  </td>
                  <td>
                    {editandoFuncao?.id === v.id ? (
                      <input
                        className={styles.input}
                        list="sugestoes-funcao"
                        autoFocus
                        value={editandoFuncao.funcao}
                        onChange={(e) => setEditandoFuncao({ id: v.id, funcao: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") atualizar(v.id, { funcao: editandoFuncao.funcao });
                          if (e.key === "Escape") setEditandoFuncao(null);
                        }}
                      />
                    ) : (
                      v.funcao
                    )}
                  </td>
                  <td>
                    <Badge tone={v.ativo ? "success" : "neutral"} dot>
                      {v.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </td>
                  {ehGestao && (
                    <td>
                      <div className={styles.rowActions}>
                        {editandoFuncao?.id === v.id ? (
                          <>
                            <button
                              className={styles.linkBtn}
                              onClick={() => atualizar(v.id, { funcao: editandoFuncao.funcao })}
                            >
                              Salvar
                            </button>
                            <button className={styles.linkBtn} onClick={() => setEditandoFuncao(null)}>
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <button
                            className={styles.linkBtn}
                            onClick={() => setEditandoFuncao({ id: v.id, funcao: v.funcao })}
                          >
                            Editar função
                          </button>
                        )}
                        <button className={styles.linkBtn} onClick={() => atualizar(v.id, { ativo: !v.ativo })}>
                          {v.ativo ? "Inativar" : "Reativar"}
                        </button>
                        <button className={`${styles.linkBtn} ${styles.linkBtnDanger}`} onClick={() => remover(v)}>
                          Remover
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
