"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { enviarParecer, listarEnviosDoParecer } from "@/src/services/envios";
import { listarUnidades, listarVinculosProfissionais, minhasUnidades } from "@/src/services/unidades";
import type { Unidade, VinculoProfissional } from "@/src/types/unidade.type";
import { type EnvioResumo, statusEnvioLabel, statusEnvioTone } from "@/src/types/envio.type";
import { formatarData, mensagemErro } from "@/src/utils/formatacao";
import Badge from "@/src/components/ui/Badge";
import styles from "@/src/styles/envios.module.scss";

const sugestoesFinalidade = [
  "Acompanhamento conjunto",
  "Inclusão no PAEFI",
  "Avaliação para concessão de benefício",
  "Contrarreferência",
  "Para ciência",
];

export default function EnviarParecerModal({
  parecerId,
  titulo,
  usuarioLogadoId,
  onClose,
}: {
  parecerId: string;
  titulo: string;
  usuarioLogadoId: string;
  onClose: () => void;
}) {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [origens, setOrigens] = useState<VinculoProfissional[]>([]);
  const [profissionais, setProfissionais] = useState<VinculoProfissional[]>([]);
  const [anteriores, setAnteriores] = useState<EnvioResumo[]>([]);
  const [unidadeDestinoId, setUnidadeDestinoId] = useState("");
  const [destinatarioId, setDestinatarioId] = useState("");
  const [unidadeOrigemId, setUnidadeOrigemId] = useState("");
  const [finalidade, setFinalidade] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState<EnvioResumo | null>(null);

  useEffect(() => {
    listarUnidades({ ativa: true }).then(setUnidades).catch(() => {});
    listarEnviosDoParecer(parecerId).then(setAnteriores).catch(() => {});
    minhasUnidades()
      .then((vinculos) => {
        setOrigens(vinculos);
        if (vinculos.length === 1) setUnidadeOrigemId(vinculos[0]!.unidadeId);
      })
      .catch(() => {});
  }, [parecerId]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  function escolherUnidade(id: string) {
    setUnidadeDestinoId(id);
    setDestinatarioId("");
    setProfissionais([]);
    if (!id) return;
    // Só quem pode receber: ativo, com perfil técnico e que não seja o próprio remetente.
    listarVinculosProfissionais({ unidadeId: id, ativo: true })
      .then((vinculos) =>
        setProfissionais(
          vinculos.filter(
            (v) => v.usuario.status === "ATIVO" && v.usuario.perfil !== "CONSULTA" && v.usuarioId !== usuarioLogadoId
          )
        )
      )
      .catch(() => {});
  }

  async function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!unidadeDestinoId || !destinatarioId) {
      setErro("Selecione a unidade e o profissional de destino.");
      return;
    }
    if (!finalidade.trim()) {
      setErro("Informe a finalidade do envio.");
      return;
    }
    setEnviando(true);
    setErro("");
    try {
      const envio = await enviarParecer(parecerId, {
        unidadeDestinoId,
        destinatarioId,
        unidadeOrigemId: unidadeOrigemId || undefined,
        finalidade: finalidade.trim(),
        mensagem: mensagem.trim() || undefined,
      });
      setEnviado(envio);
    } catch (error) {
      setErro(mensagemErro(error, "Não foi possível enviar o parecer."));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Enviar parecer"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Enviar para profissional</h3>
        <p className={styles.modalSub}>{titulo}</p>

        {enviado ? (
          <>
            <p className={styles.aviso}>
              Parecer enviado para <strong>{enviado.destinatario.nome}</strong> ({enviado.unidadeDestino.nome}).
              Acompanhe a situação em Enviados.
            </p>
            <div className={styles.formFooter}>
              <Link href={`/envios/${enviado.id}`} className={styles.btnCancel}>
                Ver envio
              </Link>
              <button type="button" className={styles.btnSalvar} onClick={onClose}>
                Fechar
              </button>
            </div>
          </>
        ) : (
          <form className={styles.modalForm} onSubmit={handleEnviar}>
            {erro && <p className={styles.erro}>{erro}</p>}

            {origens.length > 1 && (
              <label className={styles.label}>
                Enviar a partir de
                <select
                  className={styles.select}
                  value={unidadeOrigemId}
                  onChange={(e) => setUnidadeOrigemId(e.target.value)}
                >
                  <option value="">Selecione…</option>
                  {origens.map((v) => (
                    <option key={v.unidadeId} value={v.unidadeId}>
                      {v.unidade.nome}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className={styles.label}>
              Unidade de destino *
              <select
                className={styles.select}
                value={unidadeDestinoId}
                onChange={(e) => escolherUnidade(e.target.value)}
              >
                <option value="">Selecione…</option>
                {unidades.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome} ({u.tipo})
                  </option>
                ))}
              </select>
              {unidades.length === 0 && (
                <span className={styles.hint}>Nenhuma unidade cadastrada. Peça à coordenação para cadastrar.</span>
              )}
            </label>

            <label className={styles.label}>
              Profissional *
              <select
                className={styles.select}
                value={destinatarioId}
                disabled={!unidadeDestinoId}
                onChange={(e) => setDestinatarioId(e.target.value)}
              >
                <option value="">{unidadeDestinoId ? "Selecione…" : "Escolha a unidade primeiro"}</option>
                {profissionais.map((v) => (
                  <option key={v.usuarioId} value={v.usuarioId}>
                    {v.usuario.nome} — {v.funcao}
                  </option>
                ))}
              </select>
              {unidadeDestinoId && profissionais.length === 0 && (
                <span className={styles.hint}>Nenhum profissional vinculado a esta unidade pode receber pareceres.</span>
              )}
            </label>

            <label className={styles.label}>
              Finalidade *
              <input
                className={styles.input}
                list="sugestoes-finalidade"
                value={finalidade}
                onChange={(e) => setFinalidade(e.target.value)}
              />
              <datalist id="sugestoes-finalidade">
                {sugestoesFinalidade.map((f) => (
                  <option key={f} value={f} />
                ))}
              </datalist>
            </label>

            <label className={styles.label}>
              Mensagem
              <textarea className={styles.textarea} value={mensagem} onChange={(e) => setMensagem(e.target.value)} />
            </label>

            <span className={styles.hint}>
              O destinatário recebe uma cópia do parecer como está agora. Alterações posteriores precisam ser
              enviadas novamente. O restante do prontuário não é compartilhado.
            </span>

            {anteriores.length > 0 && (
              <div>
                <p className={styles.sectionTitle}>Envios anteriores deste parecer</p>
                {anteriores.map((a) => (
                  <p key={a.id} className={styles.hint}>
                    {formatarData(a.enviadoEm)} · {a.destinatario.nome} ({a.unidadeDestino.nome}) · v{a.versao}{" "}
                    <Badge tone={statusEnvioTone[a.status]}>{statusEnvioLabel[a.status]}</Badge>
                  </p>
                ))}
              </div>
            )}

            <div className={styles.formFooter}>
              <button type="button" className={styles.btnCancel} onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className={styles.btnSalvar} disabled={enviando}>
                {enviando ? "Enviando…" : "Enviar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
