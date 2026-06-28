"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  listarAgendamentos,
  criarAgendamento,
  atualizarAgendamento,
  excluirAgendamento,
} from "@/src/services/agendamento";
import { listarFamilias } from "@/src/services/familias";
import { api } from "@/src/services/api";
import { Agendamento, TipoAtendimento, StatusAgendamento } from "@/src/types/agendamento.type";
import { Familia } from "@/src/types/familia.type";
import styles from "./agendamentos.module.scss";

type UsuarioSimples = { id: string; nome: string; perfil: string; status: string };

type FormData = {
  familiaId: string;
  tecnicoId: string;
  tipo: TipoAtendimento;
  titulo: string;
  observacoes: string;
  dataHora: string;
  duracaoMinutos: number;
  status: StatusAgendamento;
  compareceu: boolean;
};

const initialForm: FormData = {
  familiaId: "",
  tecnicoId: "",
  tipo: "INDIVIDUAL",
  titulo: "",
  observacoes: "",
  dataHora: "",
  duracaoMinutos: 60,
  status: "AGENDADO",
  compareceu: false,
};

const tipoLabel: Record<TipoAtendimento, string> = {
  INDIVIDUAL: "Individual",
  VISITA_DOMICILIAR: "Visita domiciliar",
  ENCAMINHAMENTO: "Encaminhamento",
  ACOMPANHAMENTO_FAMILIAR: "Acompanhamento familiar",
};

const statusLabel: Record<StatusAgendamento, string> = {
  AGENDADO: "Agendado",
  CONFIRMADO: "Confirmado",
  EM_ATENDIMENTO: "Em atendimento",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
  FALTOU: "Faltou",
  REAGENDADO: "Reagendado",
};

const statusColor: Record<StatusAgendamento, string> = {
  AGENDADO: "#4caf50",
  CONFIRMADO: "#2196f3",
  EM_ATENDIMENTO: "#ff9800",
  CONCLUIDO: "#8bc34a",
  CANCELADO: "#e91e63",
  FALTOU: "#9c27b0",
  REAGENDADO: "#ffc107",
};

const WEEK_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const DAY_NAMES_FULL = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
  "Quinta-feira", "Sexta-feira", "Sábado",
];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 07:00 – 19:00

function buildCalendarGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();

  const days: { date: Date; isCurrentMonth: boolean }[] = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month, -i), isCurrentMonth: false });
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push({ date: new Date(year, month, d), isCurrentMonth: true });
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
  }

  return days;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toDateTimeLocal(date: Date, hour = 8) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(hour).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:00`;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function apptToForm(a: Agendamento): FormData {
  const d = new Date(a.dataHora);
  const p = (n: number) => String(n).padStart(2, "0");
  return {
    familiaId: a.familiaId,
    tecnicoId: a.tecnicoId,
    tipo: a.tipo,
    titulo: a.titulo ?? "",
    observacoes: a.observacoes ?? "",
    dataHora: `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`,
    duracaoMinutos: a.duracaoMinutos ?? 60,
    status: a.status,
    compareceu: a.compareceu ?? false,
  };
}

function loadNota(dateKey: string) {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(`cras-nota-${dateKey}`) ?? "";
}

function saveNota(dateKey: string, value: string) {
  if (typeof window === "undefined") return;
  if (value) {
    localStorage.setItem(`cras-nota-${dateKey}`, value);
  } else {
    localStorage.removeItem(`cras-nota-${dateKey}`);
  }
}

export default function AgendamentosPage() {
  const today = useMemo(() => new Date(), []);

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<Date | null>(today);

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioSimples[]>([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(initialForm);
  const [salvando, setSalvando] = useState(false);

  const [nota, setNota] = useState("");

  const calendarDays = useMemo(
    () => buildCalendarGrid(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const agendamentosByDay = useMemo(() => {
    const map: Record<string, Agendamento[]> = {};
    for (const a of agendamentos) {
      const key = toDateKey(new Date(a.dataHora));
      if (!map[key]) map[key] = [];
      map[key].push(a);
    }
    return map;
  }, [agendamentos]);

  const selectedDayAgendamentos = useMemo(() => {
    if (!selectedDay) return [];
    return (agendamentosByDay[toDateKey(selectedDay)] ?? []).sort(
      (a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
    );
  }, [selectedDay, agendamentosByDay]);

  const agendamentosByHour = useMemo(() => {
    const map: Record<number, Agendamento[]> = {};
    for (const a of selectedDayAgendamentos) {
      const h = new Date(a.dataHora).getHours();
      if (!map[h]) map[h] = [];
      map[h].push(a);
    }
    return map;
  }, [selectedDayAgendamentos]);

  const carregarMes = useCallback(async (year: number, month: number) => {
    const dataInicio = new Date(year, month, 1).toISOString();
    const dataFim = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
    const data = await listarAgendamentos({ dataInicio, dataFim });
    setAgendamentos(data);
  }, []);

  useEffect(() => {
    carregarMes(currentYear, currentMonth);
  }, [currentYear, currentMonth, carregarMes]);

  useEffect(() => {
    Promise.all([
      listarFamilias(),
      api.get<UsuarioSimples[]>("/usuarios"),
    ]).then(([familiaData, resUsu]) => {
      setFamilias(familiaData);
      setUsuarios(resUsu.data.filter((u) => u.status === "ATIVO"));
    });
  }, []);

  useEffect(() => {
    if (selectedDay) setNota(loadNota(toDateKey(selectedDay)));
  }, [selectedDay]);

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(null);
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null);
  }

  function handleDayClick(date: Date) {
    setSelectedDay(date);
  }

  function abrirNovo(day?: Date) {
    setEditandoId(null);
    setForm({ ...initialForm, dataHora: day ? toDateTimeLocal(day) : "" });
    setModalAberto(true);
  }

  function abrirEdicao(a: Agendamento) {
    setEditandoId(a.id);
    setForm(apptToForm(a));
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setEditandoId(null);
    setForm(initialForm);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked
        : name === "duracaoMinutos" ? Number(value)
        : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      const payload = {
        ...form,
        dataHora: new Date(form.dataHora).toISOString(),
        titulo: form.titulo || undefined,
        observacoes: form.observacoes || undefined,
        compareceu: form.compareceu || undefined,
      };
      if (editandoId) {
        await atualizarAgendamento(editandoId, payload);
      } else {
        await criarAgendamento(payload);
      }
      fecharModal();
      carregarMes(currentYear, currentMonth);
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id: string) {
    if (!confirm("Deseja excluir este agendamento?")) return;
    await excluirAgendamento(id);
    carregarMes(currentYear, currentMonth);
  }

  function handleNotaChange(value: string) {
    setNota(value);
    if (selectedDay) saveNota(toDateKey(selectedDay), value);
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.heading}>Agendamentos</h1>
          <p className={styles.sub}>Gestão de atendimentos e visitas</p>
        </div>
        <button
          className={styles.btnNovo}
          onClick={() => abrirNovo(selectedDay ?? undefined)}
        >
          + Novo agendamento
        </button>
      </div>

      <div className={`${styles.calendarLayout} ${selectedDay ? styles.withPanel : ""}`}>
        {/* ── Calendário mensal ── */}
        <div className={styles.calendarCard}>
          <div className={styles.calendarNav}>
            <button className={styles.calNavBtn} onClick={prevMonth}>‹</button>
            <span className={styles.calNavTitle}>
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <button className={styles.calNavBtn} onClick={nextMonth}>›</button>
          </div>

          <div className={styles.calendarWeekNames}>
            {WEEK_NAMES.map((n) => (
              <div key={n} className={styles.weekName}>{n}</div>
            ))}
          </div>

          <div className={styles.calendarGrid}>
            {calendarDays.map(({ date, isCurrentMonth }, idx) => {
              const key = toDateKey(date);
              const dayAppts = agendamentosByDay[key] ?? [];
              const isToday = isSameDay(date, today);
              const isSelected = selectedDay ? isSameDay(date, selectedDay) : false;

              return (
                <button
                  key={idx}
                  className={[
                    styles.calDay,
                    !isCurrentMonth ? styles.calDayOther : "",
                    isToday ? styles.calDayToday : "",
                    isSelected ? styles.calDaySelected : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleDayClick(date)}
                >
                  <span className={styles.calDayNum}>{date.getDate()}</span>
                  {dayAppts.length > 0 && (
                    <div className={styles.calDayDots}>
                      {dayAppts.slice(0, 3).map((a) => (
                        <span
                          key={a.id}
                          className={styles.calDot}
                          style={{ background: statusColor[a.status] }}
                        />
                      ))}
                      {dayAppts.length > 3 && (
                        <span className={styles.calDotMore}>
                          +{dayAppts.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Painel diário ── */}
        {selectedDay && (
          <div className={styles.dailyPanel}>
            <div className={styles.dailyHeader}>
              <div>
                <p className={styles.dailyWeekDay}>
                  {DAY_NAMES_FULL[selectedDay.getDay()]}
                </p>
                <h2 className={styles.dailyDate}>
                  {selectedDay.getDate()} de {MONTH_NAMES[selectedDay.getMonth()]}
                </h2>
              </div>
              <div className={styles.dailyHeaderActions}>
                <button
                  className={styles.btnNovoSmall}
                  onClick={() => abrirNovo(selectedDay)}
                >
                  + Novo
                </button>
                <button
                  className={styles.btnClose}
                  onClick={() => setSelectedDay(null)}
                  title="Fechar painel"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className={styles.timeGrid}>
              {HOURS.map((hour) => {
                const appts = agendamentosByHour[hour] ?? [];
                return (
                  <div key={hour} className={styles.timeRow}>
                    <span className={styles.timeLabel}>
                      {String(hour).padStart(2, "0")}:00
                    </span>
                    <div className={styles.timeSlot}>
                      {appts.length === 0 ? (
                        <div className={styles.timeSlotEmpty} />
                      ) : (
                        appts.map((a) => (
                          <button
                            key={a.id}
                            className={styles.timeAppt}
                            style={{ borderLeftColor: statusColor[a.status] }}
                            onClick={() => abrirEdicao(a)}
                          >
                            <span className={styles.timeApptHora}>
                              {formatTime(a.dataHora)}
                              {a.duracaoMinutos ? ` · ${a.duracaoMinutos} min` : ""}
                            </span>
                            <span className={styles.timeApptTitulo}>
                              {a.titulo || tipoLabel[a.tipo]}
                            </span>
                            <span className={styles.timeApptFamilia}>
                              {a.familia.responsavelNome}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.notasSection}>
              <p className={styles.notasLabel}>Anotações do dia</p>
              <textarea
                value={nota}
                onChange={(e) => handleNotaChange(e.target.value)}
                placeholder="Registre observações, lembretes ou anotações para este dia…"
                className={styles.notasTextarea}
                rows={4}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Modal de agendamento ── */}
      {modalAberto && (
        <div className={styles.overlay} onClick={fecharModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editandoId ? "Editar agendamento" : "Novo agendamento"}</h2>
              <button className={styles.btnClose} onClick={fecharModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <label className={styles.label}>
                  Família *
                  <select
                    name="familiaId"
                    value={form.familiaId}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  >
                    <option value="">Selecione a família...</option>
                    {familias.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.responsavelNome}
                        {f.codigoFamiliar ? ` (${f.codigoFamiliar})` : ""}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.label}>
                  Técnico responsável *
                  <select
                    name="tecnicoId"
                    value={form.tecnicoId}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  >
                    <option value="">Selecione o técnico...</option>
                    {usuarios.map((u) => (
                      <option key={u.id} value={u.id}>{u.nome}</option>
                    ))}
                  </select>
                </label>

                <label className={styles.label}>
                  Tipo de atendimento *
                  <select
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  >
                    {(Object.entries(tipoLabel) as [TipoAtendimento, string][]).map(
                      ([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      )
                    )}
                  </select>
                </label>

                <label className={styles.label}>
                  Status
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={styles.input}
                  >
                    {(Object.entries(statusLabel) as [StatusAgendamento, string][]).map(
                      ([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      )
                    )}
                  </select>
                </label>

                <label className={styles.label}>
                  Data e hora *
                  <input
                    type="datetime-local"
                    name="dataHora"
                    value={form.dataHora}
                    onChange={handleChange}
                    required
                    className={styles.input}
                  />
                </label>

                <label className={styles.label}>
                  Duração (minutos)
                  <input
                    type="number"
                    name="duracaoMinutos"
                    value={form.duracaoMinutos}
                    onChange={handleChange}
                    min={15}
                    step={15}
                    className={styles.input}
                  />
                </label>

                <label className={`${styles.label} ${styles.full}`}>
                  Título
                  <input
                    type="text"
                    name="titulo"
                    value={form.titulo}
                    onChange={handleChange}
                    placeholder="Opcional"
                    className={styles.input}
                  />
                </label>

                <label className={`${styles.label} ${styles.full}`}>
                  Observações
                  <textarea
                    name="observacoes"
                    value={form.observacoes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Opcional"
                    className={styles.textarea}
                  />
                </label>

                {editandoId && (
                  <label className={`${styles.checkLabel} ${styles.full}`}>
                    <input
                      type="checkbox"
                      name="compareceu"
                      checked={form.compareceu}
                      onChange={handleChange}
                    />
                    Família compareceu ao atendimento
                  </label>
                )}
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={fecharModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.btnSalvar}
                  disabled={salvando}
                >
                  {salvando ? "Salvando…" : editandoId ? "Atualizar" : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
