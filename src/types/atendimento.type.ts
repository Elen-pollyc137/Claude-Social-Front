import type { Familia } from "./familia.type";
import type { TipoAtendimento } from "./agendamento.type";

export const tipoAtendimentoLabel: Record<TipoAtendimento, string> = {
  INDIVIDUAL: "Individual",
  VISITA_DOMICILIAR: "Visita domiciliar",
  ENCAMINHAMENTO: "Encaminhamento",
  ACOMPANHAMENTO_FAMILIAR: "Acompanhamento familiar",
  PARECER_SOCIAL: "Parecer social",
  BENEFICIO_EVENTUAL: "Benefício eventual",
};

export type ResultadoParecer = "FAVORAVEL" | "DESFAVORAVEL";

export const resultadoParecerLabel: Record<ResultadoParecer, string> = {
  FAVORAVEL: "Favorável",
  DESFAVORAVEL: "Desfavorável",
};

export type TipoEncaminhamento =
  | "DOCUMENTACAO"
  | "SAUDE"
  | "CREAS"
  | "CAPACITACAO"
  | "EMPREGO"
  | "OUTRO";

export const tipoEncaminhamentoLabel: Record<TipoEncaminhamento, string> = {
  DOCUMENTACAO: "Documentação",
  SAUDE: "Saúde",
  CREAS: "CREAS",
  CAPACITACAO: "Capacitação",
  EMPREGO: "Emprego",
  OUTRO: "Outro",
};

export type TipoBeneficioEventual =
  | "AUXILIO_VIAGEM"
  | "CESTA_BASICA"
  | "AUXILIO_NATALIDADE"
  | "AUXILIO_FUNERAL"
  | "OUTRO";

export const tipoBeneficioEventualLabel: Record<TipoBeneficioEventual, string> = {
  AUXILIO_VIAGEM: "Auxílio viagem",
  CESTA_BASICA: "Cesta básica",
  AUXILIO_NATALIDADE: "Auxílio natalidade",
  AUXILIO_FUNERAL: "Auxílio funeral",
  OUTRO: "Outro",
};

// Documento imprimível gerado junto com o atendimento, conforme o tipo.
export type DocumentoAtendimento = "parecer" | "encaminhamento" | "beneficioEventual";

export const documentoPorTipo: Partial<Record<TipoAtendimento, DocumentoAtendimento>> = {
  PARECER_SOCIAL: "parecer",
  ENCAMINHAMENTO: "encaminhamento",
  BENEFICIO_EVENTUAL: "beneficioEventual",
};

export const documentoLabel: Record<DocumentoAtendimento, string> = {
  parecer: "Parecer social",
  encaminhamento: "Encaminhamento",
  beneficioEventual: "Benefício eventual",
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
  parecer?: { id: string } | null;
  encaminhamento?: { id: string } | null;
  beneficioEventual?: { id: string } | null;
  criadoEm: string;
  atualizadoEm: string;
};
