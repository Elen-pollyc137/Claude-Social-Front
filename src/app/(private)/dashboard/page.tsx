"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/services/api";
import { Agendamento } from "@/src/types/agendamento.type";
import styles from "./dashboard.module.scss";

const tipoLabel: Record<string, string> = {
  INDIVIDUAL: "Individual",
  VISITA_DOMICILIAR: "Visita domiciliar",
  ENCAMINHAMENTO: "Encaminhamento",
  ACOMPANHAMENTO_FAMILIAR: "Acompanhamento",
};

const statusLabel: Record<string, string> = {
  AGENDADO: "Agendado",
  CONFIRMADO: "Confirmado",
  EM_ATENDIMENTO: "Em atendimento",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
  FALTOU: "Faltou",
  REAGENDADO: "Reagendado",
};

function formatHora(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function dataHoje() {
  const d = new Date();
  const inicio = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0).toISOString();
  const fim = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59).toISOString();
  return { inicio, fim };
}

export default function DashboardPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [totalFamilias, setTotalFamilias] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const { inicio, fim } = dataHoje();

    Promise.all([
      api.get<Agendamento[]>("/agendamentos", {
        params: { dataInicio: inicio, dataFim: fim },
      }),
      api.get<unknown[]>("/familias"),
    ])
      .then(([resAgend, resFamilias]) => {
        setAgendamentos(resAgend.data);
        setTotalFamilias(resFamilias.data.length);
      })
      .finally(() => setCarregando(false));
  }, []);

  const confirmados = agendamentos.filter(
    (a) => a.status === "CONFIRMADO" || a.status === "EM_ATENDIMENTO"
  ).length;
  const pendentes = agendamentos.filter((a) => a.status === "AGENDADO").length;

  const dataExtenso = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Dashboard</h1>
      <p className={styles.sub}>{dataExtenso}</p>

      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.cardPrimary}`}>
          <div className={styles.cardIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
            </svg>
          </div>
          <span className={styles.cardLabel}>Agendamentos hoje</span>
          <span className={styles.cardValue}>
            {carregando ? "—" : agendamentos.length}
          </span>
        </div>

        <div className={`${styles.card} ${styles.cardGreen}`}>
          <div className={styles.cardIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <span className={styles.cardLabel}>Confirmados</span>
          <span className={styles.cardValue}>
            {carregando ? "—" : confirmados}
          </span>
        </div>

        <div className={`${styles.card} ${styles.cardMuted}`}>
          <div className={styles.cardIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
          <span className={styles.cardLabel}>Pendentes</span>
          <span className={styles.cardValue}>
            {carregando ? "—" : pendentes}
          </span>
        </div>

        <div className={`${styles.card} ${styles.cardDark}`}>
          <div className={styles.cardIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="7" r="3" />
              <path d="M2 20c0-3.87 3.13-7 7-7s7 3.13 7 7H2z" />
              <circle cx="17" cy="8" r="2.5" />
              <path d="M17 13c2.76 0 5 2.24 5 5h-5.5A8.96 8.96 0 0 0 14 13.4 5.42 5.42 0 0 1 17 13z" />
            </svg>
          </div>
          <span className={styles.cardLabel}>Famílias cadastradas</span>
          <span className={styles.cardValue}>
            {carregando || totalFamilias === null ? "—" : totalFamilias}
          </span>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Agendamentos do dia</h2>
          <span className={styles.dateTag}>
            {new Date().toLocaleDateString("pt-BR")}
          </span>
        </div>

        {carregando ? (
          <p className={styles.empty}>Carregando…</p>
        ) : agendamentos.length === 0 ? (
          <p className={styles.empty}>Nenhum agendamento para hoje.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Horário</th>
                <th>Família</th>
                <th>Técnico</th>
                <th>Tipo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {agendamentos.map((a) => (
                <tr key={a.id}>
                  <td className={styles.hora}>{formatHora(a.dataHora)}</td>
                  <td className={styles.familia}>{a.familia.responsavelNome}</td>
                  <td>{a.tecnico.nome}</td>
                  <td>{tipoLabel[a.tipo] ?? a.tipo}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${styles[`badge_${a.status}` as keyof typeof styles]}`}
                    >
                      {statusLabel[a.status] ?? a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className={`${styles.section} ${styles.mapSection}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Localização — Porteirinha, MG</h2>
        </div>
        <iframe
          className={styles.mapFrame}
          title="Mapa de Porteirinha, MG"
          src="https://www.google.com/maps?q=Porteirinha,+MG&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </div>
  );
}
