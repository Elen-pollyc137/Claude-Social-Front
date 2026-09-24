"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Printer, X } from "lucide-react";
import styles from "./styles.module.scss";

export default function PdfPreviewModal({
  titulo,
  nomeArquivo,
  carregar,
  onClose,
}: {
  titulo: string;
  nomeArquivo: string;
  /** Busca o PDF e devolve uma URL blob; o modal a libera ao fechar. */
  carregar: () => Promise<string>;
  onClose: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    let urlCriada: string | null = null;

    carregar()
      .then((u) => {
        urlCriada = u;
        if (ativo) setUrl(u);
        else window.URL.revokeObjectURL(u);
      })
      .catch((error: unknown) => {
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (ativo) {
          setErro(
            status === 403
              ? "Você não tem permissão para visualizar este documento."
              : "Não foi possível gerar o PDF."
          );
        }
      });

    return () => {
      ativo = false;
      if (urlCriada) window.URL.revokeObjectURL(urlCriada);
    };
    // Carrega uma única vez por abertura do modal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  function imprimir() {
    iframeRef.current?.contentWindow?.print();
  }

  function baixar() {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3>{titulo}</h3>
          <div className={styles.actions}>
            <button type="button" className={styles.btn} onClick={baixar} disabled={!url}>
              <Download size={16} /> Baixar
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={imprimir}
              disabled={!url}
            >
              <Printer size={16} /> Imprimir
            </button>
            <button type="button" className={styles.btnClose} onClick={onClose} title="Fechar">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className={styles.body}>
          {erro ? (
            <p className={styles.status}>{erro}</p>
          ) : url ? (
            <iframe ref={iframeRef} src={url} className={styles.frame} title={titulo} />
          ) : (
            <p className={styles.status}>Gerando PDF…</p>
          )}
        </div>
      </div>
    </div>
  );
}
