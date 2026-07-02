"use client";

import { useEffect, useMemo, useState } from "react";
import { listarAtendimentos } from "@/src/services/atendimentos";
import type { Atendimento } from "@/src/types/atendimento.type";
import type { TipoAtendimento } from "@/src/types/agendamento.type";
import styles from "./prontuarios.module.scss";

const tipoLabel: Record<TipoAtendimento, string> = {
  INDIVIDUAL: "Individual",
  VISITA_DOMICILIAR: "Visita domiciliar",
  ENCAMINHAMENTO: "Encaminhamento",
  ACOMPANHAMENTO_FAMILIAR: "Acompanhamento familiar",
};

const tipoColor: Record<TipoAtendimento, string> = {
  INDIVIDUAL: "var(--color-primary)",
  VISITA_DOMICILIAR: "var(--color-accent)",
  ENCAMINHAMENTO: "var(--color-primary-dark)",
  ACOMPANHAMENTO_FAMILIAR: "var(--color-surface-dark)",
};

function localizacaoDe(a: Atendimento): string {
  if (a.localAtendimento?.trim()) return a.localAtendimento.trim();
  const bairro = a.familia?.bairro;
  const cidade = a.familia?.cidade;
  if (bairro && cidade) return `${bairro}, ${cidade}`;
  return bairro || cidade || "Não informado";
}

function ultimosMeses(qtd: number) {
  const hoje = new Date();
  const meses: { chave: string; label: string }[] = [];
  for (let i = qtd - 1; i >= 0; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    meses.push({
      chave: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
    });
  }
  return meses;
}

export default function ProntuariosPage() {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarAtendimentos()
      .then(setAtendimentos)
      .finally(() => setCarregando(false));
  }, []);

  const porTipo = useMemo(() => {
    const contagem: Partial<Record<TipoAtendimento, number>> = {};
    atendimentos.forEach((a) => {
      contagem[a.tipo] = (contagem[a.tipo] ?? 0) + 1;
    });
    return contagem;
  }, [atendimentos]);
  const maxPorTipo = Math.max(1, ...Object.values(porTipo));

  const meses = useMemo(() => ultimosMeses(6), []);
  const porMes = useMemo(() => {
    const contagem: Record<string, number> = {};
    meses.forEach((m) => (contagem[m.chave] = 0));
    atendimentos.forEach((a) => {
      const d = new Date(a.dataAtendimento);
      const chave = `${d.getFullYear()}-${d.getMonth()}`;
      if (chave in contagem) contagem[chave] += 1;
    });
    return contagem;
  }, [atendimentos, meses]);
  const maxPorMes = Math.max(1, ...Object.values(porMes));

  const porLocal = useMemo(() => {
    const contagem = new Map<string, number>();
    atendimentos.forEach((a) => {
      const local = localizacaoDe(a);
      contagem.set(local, (contagem.get(local) ?? 0) + 1);
    });
    return Array.from(contagem.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [atendimentos]);
  const maxPorLocal = Math.max(1, ...porLocal.map(([, total]) => total));
  const localTopo = porLocal[0]?.[0];

  const mapaSrc = localTopo
    ? `https://www.google.com/maps?q=${encodeURIComponent(`${localTopo}, Porteirinha, MG`)}&output=embed`
    : "https://www.google.com/maps?q=Porteirinha,+MG&output=embed";

  const sigilosos = atendimentos.filter((a) => a.sigiloso).length;

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Relatório de Atendimentos</h1>
      <p className={styles.sub}>Visão geral dos atendimentos registrados</p>

      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.cardPrimary}`}>
          <span className={styles.cardLabel}>Total de atendimentos</span>
          <span className={styles.cardValue}>{carregando ? "—" : atendimentos.length}</span>
        </div>
        <div className={`${styles.card} ${styles.cardGreen}`}>
          <span className={styles.cardLabel}>Locais distintos</span>
          <span className={styles.cardValue}>{carregando ? "—" : porLocal.length}</span>
        </div>
        <div className={`${styles.card} ${styles.cardDark}`}>
          <span className={styles.cardLabel}>Sigilosos</span>
          <span className={styles.cardValue}>{carregando ? "—" : sigilosos}</span>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Atendimentos por tipo</h2>
          </div>
          <div className={styles.chartBody}>
            {carregando ? (
              <p className={styles.empty}>Carregando…</p>
            ) : atendimentos.length === 0 ? (
              <p className={styles.empty}>Nenhum atendimento registrado.</p>
            ) : (
              (Object.keys(tipoLabel) as TipoAtendimento[]).map((tipo) => (
                <div key={tipo} className={styles.barRow}>
                  <span className={styles.barLabel}>{tipoLabel[tipo]}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: `${((porTipo[tipo] ?? 0) / maxPorTipo) * 100}%`,
                        background: tipoColor[tipo],
                      }}
                    />
                  </div>
                  <span className={styles.barValue}>{porTipo[tipo] ?? 0}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Atendimentos por mês</h2>
          </div>
          {carregando ? (
            <p className={styles.empty}>Carregando…</p>
          ) : (
            <div className={styles.columnsBody}>
              {meses.map((m) => (
                <div key={m.chave} className={styles.columnItem}>
                  <div className={styles.columnTrack}>
                    <div
                      className={styles.columnFill}
                      style={{ height: `${((porMes[m.chave] ?? 0) / maxPorMes) * 100}%` }}
                    />
                  </div>
                  <span className={styles.columnValue}>{porMes[m.chave] ?? 0}</span>
                  <span className={styles.columnLabel}>{m.label}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className={`${styles.section} ${styles.mapSection}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Locais com mais atendimentos</h2>
        </div>
        <div className={styles.mapLayout}>
          <div className={styles.ranking}>
            {carregando ? (
              <p className={styles.empty}>Carregando…</p>
            ) : porLocal.length === 0 ? (
              <p className={styles.empty}>Nenhum local informado.</p>
            ) : (
              <ol className={styles.rankingList}>
                {porLocal.map(([local, total], i) => (
                  <li key={local} className={styles.rankingItem}>
                    <span className={styles.rankingPos}>{i + 1}º</span>
                    <div className={styles.rankingInfo}>
                      <span className={styles.rankingLocal}>{local}</span>
                      <div className={styles.rankingTrack}>
                        <div
                          className={styles.rankingFill}
                          style={{ width: `${(total / maxPorLocal) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className={styles.rankingValue}>{total}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
          <iframe
            className={styles.mapFrame}
            title="Mapa dos locais de maior atendimento"
            src={mapaSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
