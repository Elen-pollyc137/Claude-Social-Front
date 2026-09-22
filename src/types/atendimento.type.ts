import type { Familia } from "./familia.type";
import type { TipoAtendimento } from "./agendamento.type";

export const tipoAtendimentoLabel: Record<TipoAtendimento, string> = {
  INDIVIDUAL: "Individual",
  VISITA_DOMICILIAR: "Visita domiciliar",
  ENCAMINHAMENTO: "Encaminhamento",
  ACOMPANHAMENTO_FAMILIAR: "Acompanhamento familiar",
};

export type Atendimento = {
  id: string;
  familiaId: string;
  familia: Familia;
  tecnicoId: string;
  tecnico: {
    id: string;
    nome: string;
    email: string;
    perfil: string;
  };
  tipo: TipoAtendimento;
  titulo?: string;
  descricao: string;
  dataAtendimento: string;
  localAtendimento?: string;
  sigiloso: boolean;
  criadoEm: string;
  atualizadoEm: string;
};
