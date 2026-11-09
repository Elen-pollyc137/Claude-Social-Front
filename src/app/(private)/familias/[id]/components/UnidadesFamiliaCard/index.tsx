"use client";

import { useEffect, useState } from "react";
import {
  encerrarVinculoFamilia,
  listarUnidades,
  listarUnidadesDaFamilia,
  vincularFamiliaUnidade,
} from "@/src/services/unidades";
import {
  type TipoVinculoFamiliaUnidade,
  type Unidade,
  type VinculoFamiliaUnidade,
  tipoVinculoFamiliaLabel,
} from "@/src/types/unidade.type";
import { formatarData, mensagemErro } from "@/src/utils/formatacao";
import Card from "@/src/components/ui/Card";
import Badge from "@/src/components/ui/Badge";
import { useUsuarioLogado } from "@/src/hooks/useUsuarioLogado";
import styles from "./styles.module.scss";

export default function UnidadesFamiliaCard({ familiaId }: { familiaId: string }) {
  const { podeEditar } = useUsuarioLogado();
  const [vinculos, setVinculos] = useState<VinculoFamiliaUnidade[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const [unidadeId, setUnidadeId] = useState("");
  const [tipo, setTipo] = useState<TipoVinculoFamiliaUnidade>("REFERENCIA");
  const [erro, setErro] = useState("");

  function carregar() {
    return listarUnidadesDaFamilia(familiaId).then(setVinculos).catch(() => {});
  }

  useEffect(() => {
    carregar();
    listarUnidades({ ativa: true }).then(setUnidades).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familiaId]);

  async function vincular(e: React.FormEvent) {
    e.preventDefault();
    if (!unidadeId) {
      setErro("Selecione a unidade.");
      return;
    }
    try {
      await vincularFamiliaUnidade(familiaId, { unidadeId, tipo });
      setMostrarForm(false);
      setUnidadeId("");
      setErro("");
      carregar();
    } catch (error) {
      setErro(mensagemErro(error, "Não foi possível vincular a unidade."));
    }
  }

  async function encerrar(v: VinculoFamiliaUnidade) {
    if (!confirm(`Encerrar o vínculo com ${v.unidade.nome}?`)) return;
    try {
      await encerrarVinculoFamilia(v.id);
      carregar();
    } catch (error) {
      alert(mensagemErro(error, "Não foi possível encerrar o vínculo."));
    }
  }

  const vigentes = vinculos.filter((v) => !v.dataFim);
  const encerrados = vinculos.filter((v) => v.dataFim);

  return (
    <Card
      title="Unidades"
      action={
        podeEditar ? (
          <button type="button" className={styles.link} onClick={() => setMostrarForm((v) => !v)}>
            {mostrarForm ? "Cancelar" : "+ Vincular"}
          </button>
        ) : undefined
      }
    >
      {podeEditar && mostrarForm && (
        <form className={styles.form} onSubmit={vincular}>
          {erro && <p className={styles.erro}>{erro}</p>}
          <select className={styles.input} value={unidadeId} onChange={(e) => setUnidadeId(e.target.value)}>
            <option value="">Unidade…</option>
            {unidades.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome} ({u.tipo})
              </option>
            ))}
          </select>
          <select
            className={styles.input}
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoVinculoFamiliaUnidade)}
          >
            {Object.entries(tipoVinculoFamiliaLabel).map(([valor, rotulo]) => (
              <option key={valor} value={valor}>
                {rotulo}
              </option>
            ))}
          </select>
          {tipo === "REFERENCIA" && vigentes.some((v) => v.tipo === "REFERENCIA") && (
            <p className={styles.hint}>A unidade de referência atual será encerrada.</p>
          )}
          <button type="submit" className={styles.btn}>
            Salvar
          </button>
        </form>
      )}

      {vigentes.length === 0 ? (
        <p className={styles.vazio}>Nenhuma unidade vinculada.</p>
      ) : (
        <ul className={styles.lista}>
          {vigentes.map((v) => (
            <li key={v.id}>
              <div>
                <strong>{v.unidade.nome}</strong>
                <span>
                  {tipoVinculoFamiliaLabel[v.tipo]} · desde {formatarData(v.dataInicio)}
                </span>
              </div>
              <div className={styles.acoes}>
                <Badge tone={v.unidade.tipo === "CREAS" ? "warning" : "success"}>{v.unidade.tipo}</Badge>
                {podeEditar && (
                  <button type="button" className={styles.link} onClick={() => encerrar(v)}>
                    Encerrar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {encerrados.length > 0 && (
        <>
          <button type="button" className={styles.link} onClick={() => setMostrarHistorico((v) => !v)}>
            {mostrarHistorico ? "Ocultar histórico" : `Ver histórico (${encerrados.length})`}
          </button>
          {mostrarHistorico && (
            <ul className={`${styles.lista} ${styles.historico}`}>
              {encerrados.map((v) => (
                <li key={v.id}>
                  <div>
                    <strong>{v.unidade.nome}</strong>
                    <span>
                      {tipoVinculoFamiliaLabel[v.tipo]} · {formatarData(v.dataInicio)} a {formatarData(v.dataFim!)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Card>
  );
}
