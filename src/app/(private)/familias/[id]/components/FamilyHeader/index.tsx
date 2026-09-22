"use client";

import { useState } from "react";
import { MoreHorizontal, Printer, Download, Pencil, Trash2 } from "lucide-react";
import { Familia } from "@/src/types/familia.type";
import Button from "@/src/components/ui/Button";
import DropdownMenu from "@/src/components/ui/DropdownMenu";
import StatusBadge from "../StatusBadge";
import DeleteFamilyModal from "../DeleteFamilyModal";
import styles from "./styles.module.scss";

function formatarData(data?: string): string {
  if (!data) return "—";
  return new Date(data).toLocaleDateString("pt-BR");
}

function exportarDados(familia: Familia) {
  const blob = new Blob([JSON.stringify(familia, null, 2)], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `familia-${familia.id}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export default function FamilyHeader({ familia }: { familia: Familia }) {
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

  const metaPartes = [
    familia.numeroPasta ? `Pasta ${familia.numeroPasta}` : null,
    `Cadastrada em ${formatarData(familia.criadoEm)}`,
  ].filter(Boolean);

  return (
    <header className={styles.familyHeader}>
      <div>
        <div className={styles.titleRow}>
          <h1>{familia.responsavelNome}</h1>
          <StatusBadge status={familia.status} />
        </div>
        <p>{metaPartes.join(" • ")}</p>
      </div>

      <div className={styles.actions}>
        <Button href={`/familias/${familia.id}/editar`}>Editar família</Button>

        <DropdownMenu
          trigger={({ onClick }) => (
            <button type="button" className={styles.menuTrigger} onClick={onClick} title="Mais ações">
              <MoreHorizontal size={18} />
            </button>
          )}
        >
          <DropdownMenu.Item href={`/familias/${familia.id}/editar`}>
            <Pencil size={15} /> Editar
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => window.print()}>
            <Printer size={15} /> Imprimir ficha
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => exportarDados(familia)}>
            <Download size={15} /> Exportar dados
          </DropdownMenu.Item>
          <DropdownMenu.Divider />
          <DropdownMenu.Item danger onClick={() => setModalExcluirAberto(true)}>
            <Trash2 size={15} /> Excluir família
          </DropdownMenu.Item>
        </DropdownMenu>
      </div>

      {modalExcluirAberto && (
        <DeleteFamilyModal
          familiaId={familia.id}
          nome={familia.responsavelNome}
          onClose={() => setModalExcluirAberto(false)}
        />
      )}
    </header>
  );
}
