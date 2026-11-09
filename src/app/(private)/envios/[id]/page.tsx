"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { acaoEnvio, buscarEnvio, obterPdfEnvio } from "@/src/services/envios";
import {
  type EnvioDetalhado,
  acaoHistoricoLabel,
  statusEnvioLabel,
  statusEnvioTone,
} from "@/src/types/envio.type";
import { resultadoParecerLabel } from "@/src/types/atendimento.type";
import { useUsuarioLogado } from "@/src/hooks/useUsuarioLogado";
import { formatarData, formatarDataHora, mensagemErro } from "@/src/utils/formatacao";
import Badge from "@/src/components/ui/Badge";
import Button from "@/src/components/ui/Button";
import PdfPreviewModal from "@/src/components/ui/PdfPreviewModal";
import styles from "@/src/styles/envios.module.scss";

type Acao = "responder" | "concluir" | "cancelar";

const textosAcao: Record<Acao, { titulo: string; rotulo: string; botao: string; obrigatorio: boolean }> = {
  responder: { titulo: "Responder", rotulo: "Resposta *", botao: "Enviar resposta", obrigatorio: true },
  concluir: {
    titulo: "Concluir",
    rotulo: "Providência adotada (opcional)",
    botao: "Concluir",
    obrigatorio: false,
  },
  cancelar: { titulo: "Cancelar envio", rotulo: "Motivo (opcional)", botao: "Cancelar envio", obrigatorio: false },
};

const secoesParecer = [
  ["motivoSolicitacao", "Motivo da solicitação"],
  ["situacaoSocioeconomica", "Situação socioeconômica"],
  ["situacaoMoradia", "Situação de moradia"],
  ["situacaoSaude", "Situação de saúde"],
  ["analiseTecnica", "Análise técnica"],
  ["conteudo", "Parecer"],
  ["conclusao", "Conclusão"],
] as const;

function Info({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className={styles.infoItem}>
      <span>{rotulo}</span>
      <span>{children || "—"}</span>
    </div>
  );
}

export default function EnvioDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { usuario } = useUsuarioLogado();
  const [envio, setEnvio] = useState<EnvioDetalhado | null>(null);
  const [erroCarga, setErroCarga] = useState("");
  const [acao, setAcao] = useState<Acao | null>(null);
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [pdfAberto, setPdfAberto] = useState(false);

  function carregar() {
    return buscarEnvio(id)
      .then(setEnvio)
      .catch((error) => setErroCarga(mensagemErro(error, "Não foi possível abrir o envio.")));
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (erroCarga) {
    return (
      <main className={`${styles.container} ${styles.narrow}`}>
        <p className={styles.erro}>{erroCarga}</p>
        <Button href="/caixa-entrada" variant="secondary">
          Voltar à caixa de entrada
        </Button>
      </main>
    );
  }

  if (!envio || !usuario) {
    return (
      <main className={`${styles.container} ${styles.narrow}`}>
        <p className={styles.empty}>Carregando…</p>
      </main>
    );
  }

  const souDestinatario = envio.destinatarioId === usuario.id;
  const souRemetente = envio.remetenteId === usuario.id;
  const aberto = envio.status !== "CONCLUIDO" && envio.status !== "CANCELADO";
  const copia = envio.conteudo;
  const familia = copia.familia;

  function abrirAcao(nova: Acao) {
    setAcao(nova);
    setTexto("");
    setErro("");
  }

  async function confirmarAcao(e: React.FormEvent) {
    e.preventDefault();
    if (!acao) return;
    if (textosAcao[acao].obrigatorio && !texto.trim()) {
      setErro("Escreva a resposta.");
      return;
    }
    setSalvando(true);
    setErro("");
    try {
      await acaoEnvio(id, acao, texto.trim() || undefined);
      setAcao(null);
      await carregar();
    } catch (error) {
      setErro(mensagemErro(error, "Não foi possível registrar a ação."));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className={`${styles.container} ${styles.narrow}`}>
      <p className={styles.breadcrumb}>
        {souRemetente && !souDestinatario ? (
          <Link href="/enviados">Enviados</Link>
        ) : (
          <Link href="/caixa-entrada">Caixa de entrada</Link>
        )}
        <span>/</span>
        {copia.titulo}
      </p>

      <div className={styles.detailHeader}>
        <div>
          <h1>{copia.titulo}</h1>
          <Badge tone={statusEnvioTone[envio.status]} dot>
            {statusEnvioLabel[envio.status]}
          </Badge>
        </div>
        <div className={styles.headerActions}>
          <Button variant="secondary" onClick={() => setPdfAberto(true)}>
            <FileText size={16} /> Ver PDF
          </Button>
          {souDestinatario && aberto && (
            <>
              <Button variant="secondary" onClick={() => abrirAcao("responder")}>
                Responder
              </Button>
              <Button onClick={() => abrirAcao("concluir")}>Concluir</Button>
            </>
          )}
          {souRemetente && aberto && (
            <Button variant="danger" onClick={() => abrirAcao("cancelar")}>
              Cancelar envio
            </Button>
          )}
        </div>
      </div>

      {acao && (
        <form className={styles.card} onSubmit={confirmarAcao}>
          <p className={styles.sectionTitle}>{textosAcao[acao].titulo}</p>
          {erro && <p className={styles.erro}>{erro}</p>}
          <label className={styles.label}>
            {textosAcao[acao].rotulo}
            <textarea
              className={styles.textarea}
              autoFocus
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
          </label>
          <div className={styles.formFooter}>
            <button type="button" className={styles.btnCancel} onClick={() => setAcao(null)}>
              Voltar
            </button>
            <button
              type="submit"
              className={`${styles.btnSalvar} ${acao === "cancelar" ? styles.btnPerigo : ""}`}
              disabled={salvando}
            >
              {salvando ? "Salvando…" : textosAcao[acao].botao}
            </button>
          </div>
        </form>
      )}

      <section className={styles.card}>
        <p className={styles.sectionTitle}>Dados do envio</p>
        <div className={styles.infoGrid}>
          <Info rotulo="De">
            {envio.remetente.nome}
            {envio.unidadeOrigem && <span className={styles.sub}>{envio.unidadeOrigem.nome}</span>}
          </Info>
          <Info rotulo="Para">
            {envio.destinatario.nome}
            <span className={styles.sub}>{envio.unidadeDestino.nome}</span>
          </Info>
          <Info rotulo="Finalidade">{envio.finalidade}</Info>
          <Info rotulo="Enviado em">{formatarDataHora(envio.enviadoEm)}</Info>
          <Info rotulo="Visualizado em">{envio.visualizadoEm && formatarDataHora(envio.visualizadoEm)}</Info>
          <Info rotulo="Versão do parecer">{envio.versao}</Info>
        </div>
        {envio.mensagem && (
          <div className={styles.documentoSecao}>
            <h3>Mensagem</h3>
            <p>{envio.mensagem}</p>
          </div>
        )}
      </section>

      <section className={styles.card}>
        <p className={styles.sectionTitle}>Parecer — versão recebida</p>
        <div className={styles.infoGrid}>
          <Info rotulo="Responsável familiar">{familia.responsavelNome}</Info>
          <Info rotulo="CPF">{familia.responsavelCpf}</Info>
          <Info rotulo="NIS">{familia.responsavelNis}</Info>
          <Info rotulo="Endereço">
            {[familia.endereco, familia.numero, familia.bairro, familia.cidade].filter(Boolean).join(", ")}
          </Info>
          <Info rotulo="Data do parecer">{formatarData(copia.dataParecer)}</Info>
          <Info rotulo="Técnico(a)">{copia.tecnico.nome}</Info>
          {copia.resultado && <Info rotulo="Resultado">{resultadoParecerLabel[copia.resultado]}</Info>}
        </div>
        {secoesParecer.map(([campo, rotulo]) =>
          copia[campo]?.trim() ? (
            <div key={campo} className={styles.documentoSecao}>
              <h3>{rotulo}</h3>
              <p>{copia[campo]}</p>
            </div>
          ) : null
        )}
      </section>

      <section className={styles.card}>
        <p className={styles.sectionTitle}>Histórico</p>
        <ol className={styles.historico}>
          {envio.historico.map((h) => (
            <li key={h.id} className={styles.historicoItem}>
              <div className={styles.historicoMeta}>
                <strong>{h.usuario.nome}</strong> {acaoHistoricoLabel[h.acao]}
                <time>{formatarDataHora(h.criadoEm)}</time>
              </div>
              {h.texto && <p className={styles.historicoTexto}>{h.texto}</p>}
            </li>
          ))}
        </ol>
      </section>

      {pdfAberto && (
        <PdfPreviewModal
          titulo={copia.titulo}
          nomeArquivo={`parecer-enviado-${envio.id.slice(0, 8)}.pdf`}
          carregar={() => obterPdfEnvio(envio.id)}
          onClose={() => setPdfAberto(false)}
        />
      )}
    </main>
  );
}
