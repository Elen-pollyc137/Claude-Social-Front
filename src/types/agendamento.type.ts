export type TipoAtendimento =
  | "INDIVIDUAL"
  | "VISITA_DOMICILIAR"
  | "ENCAMINHAMENTO"
  | "ACOMPANHAMENTO_FAMILIAR";

export type StatusAgendamento =
  | "AGENDADO"
  | "CONFIRMADO"
  | "EM_ATENDIMENTO"
  | "CONCLUIDO"
  | "CANCELADO"
  | "FALTOU"
  | "REAGENDADO";

export type Agendamento = {
  id: string;
  familiaId: string;
  familia: {
    id: string;
    responsavelNome: string;
    codigoFamiliar?: string;
  };
  tecnicoId: string;
  tecnico: {
    id: string;
    nome: string;
    email: string;
    perfil: string;
  };
  tipo: TipoAtendimento;
  titulo?: string;
  observacoes?: string;
  dataHora: string;
  duracaoMinutos?: number;
  status: StatusAgendamento;
  compareceu?: boolean;
  atendimentoId?: string;
  criadoEm: string;
  atualizadoEm: string;
};
