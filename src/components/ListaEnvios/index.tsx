"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Inbox } from "lucide-react";
import { listarEnviados, listarRecebidos, listarTodosEnvios } from "@/src/services/envios";
import { type EnvioResumo, type StatusEnvio, statusEnvioLabel, statusEnvioTone } from "@/src/types/envio.type";
import { formatarDataHora } from "@/src/utils/formatacao";
import Badge from "@/src/components/ui/Badge";
import EmptyState from "@/src/components/ui/EmptyState";
import styles from "@/src/styles/envios.module.scss";

export type ModoLista = "recebidos" | "enviados" | "todos";

const carregarPorModo = {
  recebidos: listarRecebidos,
  enviados: listarEnviados,
  todos: listarTodosEnvios,
};

const filtros: { id: string; rotulo: string; status?: StatusEnvio[] }[] = [
  { id: "abertos", rotulo: "Em aberto", status: ["ENVIADO", "VISUALIZADO", "RESPONDIDO"] },
  { id: "concluidos", rotulo: "Concluídos", status: ["CONCLUIDO"] },
  { id: "cancelados", rotulo: "Cancelados", status: ["CANCELADO"] },
  { id: "todos", rotulo: "Todos" },
];

function Pessoa({ nome, unidade }: { nome: string; unidade: { nome: string } | null }) {
  return (
    <>
      {nome}
      <span className={styles.sub}>{unidade?.nome ?? "Unidade não informada"}</span>
    </>
  );
}

export default function ListaEnvios({ modo }: { modo: ModoLista }) {
  const router = useRouter();
  const [filtro, setFiltro] = useState(filtros[0]!);
  // Resultado da última consulta; enquanto não corresponde ao filtro atual, a lista está carregando.
  const [resultado, setResultado] = useState<{ chave: string; envios: EnvioResumo[]; erro: string } | null>(null);
  const chave = `${modo}:${filtro.id}`;

  useEffect(() => {
    let ativo = true;
    carregarPorModo[modo](filtro.status)
      .then((envios) => ativo && setResultado({ chave, envios, erro: "" }))
      .catch(() => ativo && setResultado({ chave, envios: [], erro: "Não foi possível carregar os envios." }));
    return () => {
      ativo = false;
    };
  }, [modo, filtro, chave]);

  const carregando = resultado?.chave !== chave;
  const envios = carregando ? [] : resultado.envios;
  const erro = carregando ? "" : resultado.erro;

  const mostrarDe = modo !== "enviados";
  const mostrarPara = modo !== "recebidos";

  return (
    <>
      <div className={styles.tabs}>
        {filtros.map((f) => (
          <button
            key={f.id}
            className={`${styles.tab} ${f.id === filtro.id ? styles.tabActive : ""}`}
            onClick={() => setFiltro(f)}
          >
            {f.rotulo}
          </button>
        ))}
      </div>

      {erro && <p className={styles.erro}>{erro}</p>}

      <div className={styles.tableWrap}>
        {carregando ? (
          <p className={styles.empty}>Carregando…</p>
        ) : envios.length === 0 ? (
          <EmptyState
            icon={<Inbox size={26} />}
            title="Nenhum parecer aqui"
            description={
              modo === "recebidos"
                ? "Os pareceres enviados a você aparecem nesta caixa."
                : "Envie um parecer pela aba Atendimentos do prontuário da família."
            }
          />
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Parecer</th>
                {mostrarDe && <th>De</th>}
                {mostrarPara && <th>Para</th>}
                <th>Finalidade</th>
                <th>Enviado em</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {envios.map((e) => (
                <tr
                  key={e.id}
                  className={`${styles.clickableRow} ${modo === "recebidos" && e.status === "ENVIADO" ? styles.naoLido : ""}`}
                  onClick={() => router.push(`/envios/${e.id}`)}
                >
                  <td>
                    {e.parecerTitulo}
                    <span className={styles.sub}>
                      Família de {e.familiaNome}
                      {e.versao > 1 && ` · versão ${e.versao}`}
                    </span>
                  </td>
                  {mostrarDe && (
                    <td>
                      <Pessoa nome={e.remetente.nome} unidade={e.unidadeOrigem} />
                    </td>
                  )}
                  {mostrarPara && (
                    <td>
                      <Pessoa nome={e.destinatario.nome} unidade={e.unidadeDestino} />
                    </td>
                  )}
                  <td>{e.finalidade}</td>
                  <td>{formatarDataHora(e.enviadoEm)}</td>
                  <td>
                    <Badge tone={statusEnvioTone[e.status]} dot>
                      {statusEnvioLabel[e.status]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
