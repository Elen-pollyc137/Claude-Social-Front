"use client";

import { useState } from "react";
import PageHeader from "@/src/components/ui/PageHeader";
import ListaEnvios from "@/src/components/ListaEnvios";
import { useUsuarioLogado } from "@/src/hooks/useUsuarioLogado";
import styles from "@/src/styles/envios.module.scss";

export default function EnviadosPage() {
  const { ehGestao } = useUsuarioLogado();
  const [escopo, setEscopo] = useState<"enviados" | "todos">("enviados");

  return (
    <main className={styles.container}>
      <PageHeader title="Enviados" description="Acompanhe a situação dos pareceres que você enviou" />

      {ehGestao && (
        <div className={styles.filters}>
          <select
            className={styles.select}
            value={escopo}
            onChange={(e) => setEscopo(e.target.value as "enviados" | "todos")}
          >
            <option value="enviados">Meus envios</option>
            <option value="todos">Todos os envios das minhas unidades (coordenação)</option>
          </select>
        </div>
      )}

      <ListaEnvios key={escopo} modo={escopo} />
    </main>
  );
}
