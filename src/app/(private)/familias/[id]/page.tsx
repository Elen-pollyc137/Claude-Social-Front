"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buscarFamilia, excluirFamilia } from "@/src/services/familias";
import { Familia, StatusFamilia } from "@/src/types/familia.type";
import styles from "../familias.module.scss";

type MembroFamiliar = {
  id: string;
  nome: string;
  cpf?: string;
  parentesco?: string;
  dataNascimento?: string;
  sexo?: string;
  renda?: number;
};

type FamiliaDetalhada = Familia & {
  membros?: MembroFamiliar[];
};

const statusLabel: Record<StatusFamilia, string> = {
  ATIVA: "Ativa",
  INATIVA: "Inativa",
  EM_ACOMPANHAMENTO: "Em acompanhamento",
};

function infoItem(label: string, value?: string | null) {
  return (
    <div className={styles.infoItem}>
      <span>{label}</span>
      <span>{value || "—"}</span>
    </div>
  );
}

export default function FamiliaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [familia, setFamilia] = useState<FamiliaDetalhada | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarFamilia(id)
      .then((data) => setFamilia(data as FamiliaDetalhada))
      .catch(() => router.push("/familias"))
      .finally(() => setCarregando(false));
  }, [id, router]);

  async function handleExcluir() {
    if (!confirm("Deseja excluir esta família?")) return;
    await excluirFamilia(id);
    router.push("/familias");
  }

  if (carregando) {
    return (
      <main className={styles.detailPage}>
        <p className={styles.empty}>Carregando…</p>
      </main>
    );
  }

  if (!familia) return null;

  return (
    <main className={styles.detailPage}>
      <div className={styles.detailHeader}>
        <div>
          <Link href="/familias" className={styles.btnBack}>
            ← Famílias
          </Link>
          <h1>{familia.responsavelNome}</h1>
          {familia.codigoFamiliar && (
            <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
              Código: {familia.codigoFamiliar}
            </span>
          )}
        </div>
        <div className={styles.detailActions}>
          <span
            className={`${styles.badge} ${
              styles[`badge_${familia.status}` as keyof typeof styles]
            }`}
          >
            {statusLabel[familia.status]}
          </span>
          <Link href={`/familias/${id}/editar`} className={styles.btnEdit}>
            Editar
          </Link>
          <button className={styles.btnDelete} onClick={handleExcluir}>
            Excluir
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.sectionTitle}>Dados do responsável</p>
        <div className={styles.infoGrid}>
          {infoItem("CPF", familia.responsavelCpf)}
          {infoItem("NIS", familia.responsavelNis)}
          {infoItem("Telefone", familia.telefone)}
          {infoItem("E-mail", familia.email)}
          {infoItem("Território", familia.territorio)}
          {infoItem(
            "Cadastrado em",
            new Date(familia.criadoEm).toLocaleDateString("pt-BR")
          )}
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.sectionTitle}>Endereço</p>
        <div className={styles.infoGrid}>
          {infoItem("CEP", familia.cep)}
          {infoItem("Endereço", familia.endereco)}
          {infoItem("Número", familia.numero)}
          {infoItem("Complemento", familia.complemento)}
          {infoItem("Bairro", familia.bairro)}
          {infoItem("Cidade", familia.cidade)}
          {infoItem("Estado", familia.estado)}
        </div>
      </div>

      {familia.membros && familia.membros.length > 0 && (
        <div className={styles.card}>
          <p className={styles.sectionTitle}>
            Membros ({familia.membros.length})
          </p>
          <table className={styles.membrosTable}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Parentesco</th>
                <th>Sexo</th>
              </tr>
            </thead>
            <tbody>
              {familia.membros.map((m) => (
                <tr key={m.id}>
                  <td>{m.nome}</td>
                  <td>{m.cpf || "—"}</td>
                  <td>{m.parentesco || "—"}</td>
                  <td>{m.sexo || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
