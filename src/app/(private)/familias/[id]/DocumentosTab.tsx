"use client";

import { useEffect, useRef, useState } from "react";
import {
  baixarDocumento,
  excluirDocumento,
  listarDocumentos,
  listarTiposDocumentos,
  uploadDocumento,
  visualizarDocumento,
} from "@/src/services/documentos";
import { Documento, TipoDocumento, formatarTamanhoArquivo } from "@/src/types/documento.type";
import styles from "../familias.module.scss";
import { useUsuarioLogado } from "@/src/hooks/useUsuarioLogado";

function formatarData(data: string): string {
  return new Date(data).toLocaleDateString("pt-BR");
}

export default function DocumentosTab({ familiaId }: { familiaId: string }) {
  const { podeEditar } = useUsuarioLogado();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [tipos, setTipos] = useState<TipoDocumento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [tipoDocumentoId, setTipoDocumentoId] = useState("");
  const [descricao, setDescricao] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [preview, setPreview] = useState<{ id: string; nome: string; url: string } | null>(null);
  const [carregandoPreview, setCarregandoPreview] = useState<string | null>(null);

  function carregar() {
    setCarregando(true);
    return Promise.all([listarDocumentos({ familiaId }), listarTiposDocumentos()])
      .then(([documentosData, tiposData]) => {
        setDocumentos(documentosData);
        setTipos(tiposData.filter((t) => t.ativo));
      })
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregar();
    fecharPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familiaId]);

  useEffect(() => {
    return () => {
      if (preview) window.URL.revokeObjectURL(preview.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fecharPreview() {
    setPreview((atual) => {
      if (atual) window.URL.revokeObjectURL(atual.url);
      return null;
    });
  }

  async function togglePreview(d: Documento) {
    if (preview?.id === d.id) {
      fecharPreview();
      return;
    }
    if (preview) window.URL.revokeObjectURL(preview.url);

    setCarregandoPreview(d.id);
    try {
      const url = await visualizarDocumento(d.id, d.tipoMime);
      setPreview({ id: d.id, nome: d.nomeArquivo, url });
    } catch {
      setErro("Não foi possível carregar a pré-visualização.");
    } finally {
      setCarregandoPreview(null);
    }
  }

  function ampliarPreview() {
    iframeRef.current?.requestFullscreen?.();
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (!arquivo) {
      setErro("Selecione um arquivo.");
      return;
    }

    setEnviando(true);
    try {
      await uploadDocumento({
        familiaId,
        arquivo,
        tipoDocumentoId: tipoDocumentoId || undefined,
        descricao: descricao || undefined,
      });
      setArquivo(null);
      setTipoDocumentoId("");
      setDescricao("");
      if (inputRef.current) inputRef.current.value = "";
      carregar();
    } catch {
      setErro("Não foi possível enviar o arquivo.");
    } finally {
      setEnviando(false);
    }
  }

  async function handleExcluir(id: string) {
    if (!confirm("Deseja excluir este documento?")) return;
    await excluirDocumento(id);
    carregar();
  }

  return (
    <div className={styles.card}>
      <p className={styles.sectionTitle}>Documentos ({documentos.length})</p>

      {podeEditar && (
      <form onSubmit={handleUpload} className={styles.uploadForm}>
        {erro && <p className={styles.erro}>{erro}</p>}
        <div className={styles.uploadRow}>
          <input
            ref={inputRef}
            type="file"
            className={styles.input}
            onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
          />
          <select
            className={styles.input}
            value={tipoDocumentoId}
            onChange={(e) => setTipoDocumentoId(e.target.value)}
          >
            <option value="">Tipo de documento…</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>
          <input
            type="text"
            className={styles.input}
            placeholder="Descrição (opcional)"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <button type="submit" className={styles.btnSalvar} disabled={enviando}>
            {enviando ? "Enviando…" : "Enviar"}
          </button>
        </div>
      </form>
      )}

      {carregando ? (
        <p className={styles.empty}>Carregando…</p>
      ) : documentos.length > 0 ? (
        <ul className={styles.docList}>
          {documentos.map((d) => (
            <li key={d.id} className={styles.docItem}>
              <div className={styles.docRow}>
                <div className={styles.docIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
                  </svg>
                </div>
                <div className={styles.docInfo}>
                  <strong>{d.nomeArquivo}</strong>
                  <span>
                    {d.tipoDocumento?.nome ?? "Sem tipo"} · {formatarTamanhoArquivo(d.tamanho)} ·{" "}
                    {formatarData(d.criadoEm)}
                  </span>
                  {d.descricao && <span className={styles.docDescricao}>{d.descricao}</span>}
                </div>
                <div className={styles.rowActions}>
                  <button
                    className={styles.view}
                    onClick={() => togglePreview(d)}
                    disabled={carregandoPreview === d.id}
                  >
                    {carregandoPreview === d.id
                      ? "Carregando…"
                      : preview?.id === d.id
                        ? "Fechar"
                        : "Visualizar"}
                  </button>
                  <button
                    className={styles.view}
                    onClick={() => baixarDocumento(d.id, d.nomeArquivo)}
                  >
                    Baixar
                  </button>
                  {podeEditar && (
                    <button className={styles.delete} onClick={() => handleExcluir(d.id)}>
                      Excluir
                    </button>
                  )}
                </div>
              </div>

              {preview?.id === d.id && (
                <div className={styles.docPreview}>
                  <div className={styles.docPreviewHeader}>
                    <h4>Preview de {preview.nome}</h4>
                    <div className={styles.previewHeaderActions}>
                      <button
                        type="button"
                        className={styles.btnAmpliar}
                        title="Abrir em tela cheia"
                        onClick={ampliarPreview}
                      >
                        ⛶ Ampliar
                      </button>
                      <button
                        type="button"
                        className={styles.btnAbrir}
                        title="Abrir em nova aba"
                        onClick={() => window.open(preview.url, "_blank")}
                      >
                        ↗ Abrir
                      </button>
                    </div>
                  </div>
                  <iframe
                    ref={iframeRef}
                    src={preview.url}
                    className={styles.previewFrame}
                    title={`Preview de ${preview.nome}`}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>Nenhum documento enviado.</p>
      )}
    </div>
  );
}
