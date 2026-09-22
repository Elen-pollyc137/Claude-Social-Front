"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buscarFamilia } from "@/src/services/familias";
import { excluirMembro } from "@/src/services/membros";
import { Familia } from "@/src/types/familia.type";
import { MembroFamiliar } from "@/src/types/membro.type";
import styles from "../familias.module.scss";
import detailStyles from "./detail.module.scss";
import FamilyHeader from "./components/FamilyHeader";
import FamilyTabs, { FamilyTab } from "./components/FamilyTabs";
import FamilyDataCard from "./components/FamilyDataCard";
import CadUnicoCard from "./components/CadUnicoCard";
import FamilyMembers from "./components/FamilyMembers";
import AtendimentosTab from "./AtendimentosTab";
import DocumentosTab from "./DocumentosTab";

type FamiliaDetalhada = Familia & {
  membros?: MembroFamiliar[];
};

export default function FamiliaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [familia, setFamilia] = useState<FamiliaDetalhada | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [aba, setAba] = useState<FamilyTab>("visao-geral");

  function carregar() {
    return buscarFamilia(id)
      .then((data) => setFamilia(data as FamiliaDetalhada))
      .catch(() => router.push("/familias"))
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, router]);

  async function handleExcluirMembro(membroId: string) {
    if (!confirm("Deseja excluir este membro?")) return;
    await excluirMembro(membroId);
    carregar();
  }

  if (carregando) {
    return (
      <main className={styles.detailPage}>
        <p className={styles.empty}>Carregando…</p>
      </main>
    );
  }

  if (!familia) return null;

  const membros = familia.membros ?? [];

  return (
    <main className={`${styles.detailPage} ${detailStyles.page}`}>
      <p className={detailStyles.breadcrumb}>
        <Link href="/familias">Famílias</Link>
        <span>/</span>
        {familia.responsavelNome}
      </p>

      <FamilyHeader familia={familia} />

      <FamilyTabs active={aba} onChange={setAba} />

      {aba === "visao-geral" && (
        <div className={detailStyles.overviewGrid}>
          <FamilyDataCard familia={familia} />

          <div className={detailStyles.rightColumn}>
            <CadUnicoCard familia={familia} />
          </div>
        </div>
      )}

      {aba === "membros" && (
        <FamilyMembers familiaId={id} membros={membros} onExcluir={handleExcluirMembro} />
      )}

      {aba === "atendimentos" && <AtendimentosTab familiaId={id} />}
      {aba === "documentos" && <DocumentosTab familiaId={id} />}
    </main>
  );
}
