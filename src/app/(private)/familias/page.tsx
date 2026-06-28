"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listarFamilias, excluirFamilia } from "@/src/services/familias";
import { Familia, StatusFamilia } from "@/src/types/familia.type";
import styles from "./familias.module.scss";

const statusLabel: Record<StatusFamilia, string> = {
  ATIVA: "Ativa",
  INATIVA: "Inativa",
  EM_ACOMPANHAMENTO: "Em acompanhamento",
};

export default function FamiliasPage() {
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
      <div className={styles.header}>
        <h1>Famílias</h1>
        <Link href="/familias/novo" className={styles.btnNovo}>
          + Nova família
        </Link>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Buscar por nome, CPF, NIS, código..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && carregar()}
          className={styles.inputBusca}
        />
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value as StatusFamilia | "")}
          className={styles.inputFiltro}
        >
          <option value="">Todos os status</option>
          {(Object.entries(statusLabel) as [StatusFamilia, string][]).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <button className={styles.btnFiltrar} onClick={carregar}>
          Filtrar
        </button>
      </div>

      <div className={styles.tableWrap}>
        {carregando ? (
          <p className={styles.empty}>Carregando…</p>
        ) : familias.length === 0 ? (
          <p className={styles.empty}>Nenhuma família encontrada.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Responsável</th>
                <th>CPF</th>
                <th>NIS</th>
                <th>Telefone</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {familias.map((familia) => (
                <tr key={familia.id}>
                  <td>{familia.responsavelNome}</td>
                  <td>{familia.responsavelCpf || "-"}</td>
                  <td>{familia.responsavelNis || "-"}</td>
                  <td>{familia.telefone || "-"}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        styles[`badge_${familia.status}` as keyof typeof styles]
                      }`}
                    >
                      {statusLabel[familia.status]}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={`/familias/${familia.id}`}
                        className={styles.view}
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/familias/${familia.id}/editar`}
                        className={styles.edit}
                      >
                        Editar
                      </Link>
                      <button
                        className={styles.delete}
                        onClick={() => handleExcluir(familia.id)}
                      >
                        Excluir
                      </button>
                    </div>
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
