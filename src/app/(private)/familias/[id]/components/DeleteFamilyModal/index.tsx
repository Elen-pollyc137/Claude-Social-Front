"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { excluirFamilia } from "@/src/services/familias";
import styles from "./styles.module.scss";

const PALAVRA_CONFIRMACAO = "EXCLUIR";

export default function DeleteFamilyModal({
  familiaId,
  nome,
  onClose,
}: {
  familiaId: string;
  nome: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [excluindo, setExcluindo] = useState(false);

  async function handleExcluir() {
    setExcluindo(true);
    try {
      await excluirFamilia(familiaId);
      router.push("/familias");
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Excluir família?</h3>
        <p>
          Você está prestes a excluir <strong>{nome}</strong>. Esta ação não poderá ser desfeita.
        </p>
        <label className={styles.label}>
          <span>
            Digite <strong>{PALAVRA_CONFIRMACAO}</strong> para confirmar
          </span>
          <input
            type="text"
            className={styles.input}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            autoFocus
          />
        </label>
        <div className={styles.actions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className={styles.btnConfirm}
            disabled={texto !== PALAVRA_CONFIRMACAO || excluindo}
            onClick={handleExcluir}
          >
            {excluindo ? "Excluindo…" : "Excluir família"}
          </button>
        </div>
      </div>
    </div>
  );
}
