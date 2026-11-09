"use client";

import { useState } from "react";
import { MoreHorizontal, Printer, Download, Pencil, Trash2 } from "lucide-react";
import { Familia } from "@/src/types/familia.type";
import { obterPdfProntuario } from "@/src/services/familias";
import Button from "@/src/components/ui/Button";
import DropdownMenu from "@/src/components/ui/DropdownMenu";
import PdfPreviewModal from "@/src/components/ui/PdfPreviewModal";
import { useUsuarioLogado } from "@/src/hooks/useUsuarioLogado";
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
  const { podeEditar } = useUsuarioLogado();
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [fichaAberta, setFichaAberta] = useState(false);

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
        {podeEditar && <Button href={`/familias/${familia.id}/editar`}>Editar família</Button>}

        <DropdownMenu
          trigger={({ onClick }) => (
            <button type="button" className={styles.menuTrigger} onClick={onClick} title="Mais ações">
              <MoreHorizontal size={18} />
            </button>
          )}
        >
          {podeEditar && (
            <DropdownMenu.Item href={`/familias/${familia.id}/editar`}>
              <Pencil size={15} /> Editar
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Item onClick={() => setFichaAberta(true)}>
            <Printer size={15} /> Imprimir ficha
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => exportarDados(familia)}>
            <Download size={15} /> Exportar dados
          </DropdownMenu.Item>
          {podeEditar && (
            <>
              <DropdownMenu.Divider />
              <DropdownMenu.Item danger onClick={() => setModalExcluirAberto(true)}>
                <Trash2 size={15} /> Excluir família
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu>
      </div>

      {fichaAberta && (
        <PdfPreviewModal
          titulo={`Prontuário — ${familia.responsavelNome}`}
          nomeArquivo={`prontuario-${familia.numeroPasta ?? familia.id.slice(0, 8)}.pdf`}
          carregar={() => obterPdfProntuario(familia.id)}
          onClose={() => setFichaAberta(false)}
        />
      )}

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
