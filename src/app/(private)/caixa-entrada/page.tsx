"use client";

import PageHeader from "@/src/components/ui/PageHeader";
import ListaEnvios from "@/src/components/ListaEnvios";
import styles from "@/src/styles/envios.module.scss";

export default function CaixaEntradaPage() {
  return (
    <main className={styles.container}>
      <PageHeader title="Caixa de entrada" description="Pareceres enviados a você por outros profissionais" />
      <ListaEnvios modo="recebidos" />
    </main>
  );
}
