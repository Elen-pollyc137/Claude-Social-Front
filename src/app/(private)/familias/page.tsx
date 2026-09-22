"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
import { listarFamilias, excluirFamilia } from "@/src/services/familias";
import { Familia, StatusFamilia, statusFamiliaLabel, statusFamiliaTone } from "@/src/types/familia.type";
import PageHeader from "@/src/components/ui/PageHeader";
import Button from "@/src/components/ui/Button";
import Badge from "@/src/components/ui/Badge";
import EmptyState from "@/src/components/ui/EmptyState";
import DropdownMenu from "@/src/components/ui/DropdownMenu";
import styles from "./familias.module.scss";

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

export default function FamiliasPage() {
  const router = useRouter();
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusFamilia | "">("");
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    setCarregando(true);
    try {
      const data = await listarFamilias({
        busca: busca || undefined,
        status: filtroStatus || undefined,
      });
      setFamilias(data);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleExcluir(id: string) {
    if (!confirm("Deseja excluir esta família?")) return;
    await excluirFamilia(id);
    carregar();
  }

  return (
    <main className={styles.container}>
      <PageHeader
        title="Famílias"
        description="Gerencie famílias e seus respectivos membros"
        action={<Button href="/familias/novo">+ Nova família</Button>}
      />

      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nome, CPF, NIS, código..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && carregar()}
            className={styles.inputBusca}
          />
        </div>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value as StatusFamilia | "")}
          className={styles.inputFiltro}
        >
          <option value="">Todos os status</option>
          {(Object.entries(statusFamiliaLabel) as [StatusFamilia, string][]).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <Button variant="secondary" onClick={carregar}>
          Filtrar
        </Button>
      </div>

      {!carregando && (
        <p className={styles.resultCount}>
          {familias.length} {familias.length === 1 ? "família encontrada" : "famílias encontradas"}
        </p>
      )}

      <div className={styles.tableWrap}>
        {carregando ? (
          <p className={styles.empty}>Carregando…</p>
        ) : familias.length === 0 ? (
          <EmptyState
            icon={<Users size={26} />}
            title="Nenhuma família encontrada"
            description="Ajuste a busca ou cadastre uma nova família."
          />
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Responsável</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {familias.map((familia) => (
                <tr
                  key={familia.id}
                  className={styles.clickableRow}
                  onClick={() => router.push(`/familias/${familia.id}`)}
                >
                  <td>
                    <div className={styles.rowName}>
                      <div className={styles.rowAvatar}>{iniciais(familia.responsavelNome)}</div>
                      <div>
                        <div>{familia.responsavelNome}</div>
                        {familia.numeroPasta && (
                          <div className={styles.rowSub}>Pasta {familia.numeroPasta}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{familia.responsavelCpf || "-"}</td>
                  <td>{familia.telefone || "-"}</td>
                  <td>
                    <Badge tone={statusFamiliaTone[familia.status]} dot>
                      {statusFamiliaLabel[familia.status]}
                    </Badge>
                  </td>
                  <td className={styles.actionsCell} onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu
                      trigger={({ onClick }) => (
                        <button type="button" className={styles.rowMenuTrigger} onClick={onClick}>
                          <MoreHorizontal size={16} />
                        </button>
                      )}
                    >
                      <DropdownMenu.Item href={`/familias/${familia.id}`}>
                        <Eye size={15} /> Visualizar
                      </DropdownMenu.Item>
                      <DropdownMenu.Item href={`/familias/${familia.id}/editar`}>
                        <Pencil size={15} /> Editar
                      </DropdownMenu.Item>
                      <DropdownMenu.Divider />
                      <DropdownMenu.Item danger onClick={() => handleExcluir(familia.id)}>
                        <Trash2 size={15} /> Excluir
                      </DropdownMenu.Item>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
