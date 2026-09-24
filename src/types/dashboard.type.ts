import type { StatusAgendamento, TipoAtendimento } from "./agendamento.type";
import type { StatusFamilia } from "./familia.type";

export type AgendamentoDoDia = {
  id: string;
  dataHora: string;
  tipo: TipoAtendimento;
  titulo: string | null;
  status: StatusAgendamento;
  familia: { id: string; responsavelNome: string };
  tecnico: { id: string; nome: string };
};

export type DashboardResumo = {
  familias: {
    total: number;
    porStatus: Record<StatusFamilia, number>;
  };
  agendamentosHoje: {
    total: number;
    confirmados: number;
    pendentes: number;
    porStatus: Record<StatusAgendamento, number>;
    lista: AgendamentoDoDia[];
  };
  atendimentosMes: number;
  encaminhamentosAbertos: number;
  beneficiosAguardandoDecisao: number;
};
