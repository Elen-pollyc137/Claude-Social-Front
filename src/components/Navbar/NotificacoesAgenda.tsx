"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CalendarDays } from "lucide-react";
import { listarAgendamentos } from "@/src/services/agendamento";
import type { Agendamento, StatusAgendamento } from "@/src/types/agendamento.type";
import { tipoAtendimentoLabel } from "@/src/types/atendimento.type";
import styles from "./NotificacoesAgenda.module.scss";

const DIAS_A_FRENTE = 7;
const INTERVALO_ATUALIZACAO_MS = 5 * 60 * 1000;

// Agendamentos já resolvidos não precisam de atenção do técnico.
const STATUS_ENCERRADOS: StatusAgendamento[] = ["CONCLUIDO", "CANCELADO", "FALTOU"];

const statusLabel: Record<StatusAgendamento, string> = {
  AGENDADO: "Agendado",
  CONFIRMADO: "Confirmado",
  EM_ATENDIMENTO: "Em atendimento",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
  FALTOU: "Faltou",
  REAGENDADO: "Reagendado",
};

function inicioDoDia(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function mesmoDia(a: Date, b: Date) {
  return inicioDoDia(a).getTime() === inicioDoDia(b).getTime();
}

function formatarHora(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatarDia(iso: string) {
  return new Date(iso)
    .toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" })
    .replace(".", "");
}

export default function NotificacoesAgenda({ tecnicoId }: { tecnicoId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [aberto, setAberto] = useState(false);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  const carregar = useCallback(() => {
    const hoje = inicioDoDia(new Date());
    const fim = new Date(hoje);
    fim.setDate(fim.getDate() + DIAS_A_FRENTE + 1);

    return listarAgendamentos({
      tecnicoId,
      dataInicio: hoje.toISOString(),
      dataFim: fim.toISOString(),
    })
      .then((dados) => {
        setAgendamentos(dados.filter((a) => !STATUS_ENCERRADOS.includes(a.status)));
        setErro(false);
      })
      .catch(() => setErro(true))
      .finally(() => setCarregando(false));
  }, [tecnicoId]);

  useEffect(() => {
    carregar();
    const intervalo = window.setInterval(carregar, INTERVALO_ATUALIZACAO_MS);
    return () => window.clearInterval(intervalo);
  }, [carregar]);

  useEffect(() => {
    if (!aberto) return;

    function handleClickFora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false);
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setAberto(false);
    }
    document.addEventListener("mousedown", handleClickFora);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickFora);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [aberto]);

  function alternar() {
    if (!aberto) carregar();
    setAberto((v) => !v);
  }

  const agora = new Date();
  const deHoje = agendamentos.filter((a) => mesmoDia(new Date(a.dataHora), agora));
  const proximos = agendamentos.filter((a) => !mesmoDia(new Date(a.dataHora), agora));
  const pendentesHoje = deHoje.length;

  function renderItem(a: Agendamento, mostrarDia: boolean) {
    const atrasado = new Date(a.dataHora) < agora && a.status !== "EM_ATENDIMENTO";
    return (
      <li key={a.id}>
        <Link
          href={`/familias/${a.familiaId}`}
          className={styles.item}
          onClick={() => setAberto(false)}
        >
          <div className={styles.quando}>
            <strong>{formatarHora(a.dataHora)}</strong>
            {mostrarDia && <span>{formatarDia(a.dataHora)}</span>}
          </div>
          <div className={styles.info}>
            <span className={styles.familia}>{a.familia?.responsavelNome ?? "Família"}</span>
            <span className={styles.meta}>
              {a.titulo || tipoAtendimentoLabel[a.tipo]}
              {a.duracaoMinutos ? ` · ${a.duracaoMinutos} min` : ""}
            </span>
          </div>
          <span
            className={`${styles.status} ${atrasado ? styles.statusAtrasado : styles[`status_${a.status}`] ?? ""}`}
          >
            {atrasado ? "Atrasado" : statusLabel[a.status]}
          </span>
        </Link>
      </li>
    );
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={alternar}
        title="Meus agendamentos"
        aria-expanded={aberto}
        aria-label={
          pendentesHoje > 0
            ? `Meus agendamentos: ${pendentesHoje} hoje`
            : "Meus agendamentos"
        }
      >
        <Bell size={18} strokeWidth={2} />
        {pendentesHoje > 0 && (
          <span className={styles.contador}>{pendentesHoje > 9 ? "9+" : pendentesHoje}</span>
        )}
      </button>

      {aberto && (
        <div className={styles.card} role="dialog" aria-label="Meus agendamentos">
          <div className={styles.header}>
            <div>
              <h3>Meus agendamentos</h3>
              <p>Você como técnico responsável · próximos {DIAS_A_FRENTE} dias</p>
            </div>
          </div>

          <div className={styles.body}>
            {carregando ? (
              <p className={styles.vazio}>Carregando…</p>
            ) : erro ? (
              <p className={styles.vazio}>Não foi possível carregar os agendamentos.</p>
            ) : agendamentos.length === 0 ? (
              <div className={styles.vazio}>
                <CalendarDays size={22} />
                <span>Nenhum agendamento pendente para você.</span>
              </div>
            ) : (
              <>
                <p className={styles.grupo}>Hoje ({deHoje.length})</p>
                {deHoje.length > 0 ? (
                  <ul className={styles.lista}>{deHoje.map((a) => renderItem(a, false))}</ul>
                ) : (
                  <p className={styles.grupoVazio}>Nada agendado para hoje.</p>
                )}

                {proximos.length > 0 && (
                  <>
                    <p className={styles.grupo}>Próximos dias ({proximos.length})</p>
                    <ul className={styles.lista}>{proximos.map((a) => renderItem(a, true))}</ul>
                  </>
                )}
              </>
            )}
          </div>

          <Link href="/agendamentos" className={styles.footer} onClick={() => setAberto(false)}>
            Ver agenda completa
          </Link>
        </div>
      )}
    </div>
  );
}
