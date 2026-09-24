import { api } from "./api";
import type {
  Atendimento,
  DocumentoAtendimento,
  ResultadoParecer,
  TipoBeneficioEventual,
  TipoEncaminhamento,
} from "@/src/types/atendimento.type";
import type { TipoAtendimento } from "@/src/types/agendamento.type";

export type AtendimentoFiltros = {
  familiaId?: string;
  tecnicoId?: string;
  tipo?: TipoAtendimento;
};

export type AtendimentoBody = {
  familiaId: string;
  tecnicoId: string;
  tipo: TipoAtendimento;
  titulo?: string;
  descricao: string;
  dataAtendimento?: string;
  localAtendimento?: string;
  sigiloso?: boolean;
  parecer?: ParecerDoAtendimento;
  encaminhamento?: EncaminhamentoDoAtendimento;
  beneficioEventual?: BeneficioEventualDoAtendimento;
};

export type ParecerDoAtendimento = {
  motivoSolicitacao?: string;
  situacaoSocioeconomica?: string;
  situacaoMoradia?: string;
  situacaoSaude?: string;
  analiseTecnica?: string;
  conclusao?: string;
  resultado?: ResultadoParecer;
};

export type EncaminhamentoDoAtendimento = {
  tipo?: TipoEncaminhamento;
  membroId?: string;
  orgaoDestino: string;
  motivo: string;
};

export type BeneficioEventualDoAtendimento = {
  tipo: TipoBeneficioEventual;
  membroId?: string;
  motivo: string;
  descricao?: string;
  quantidade?: number;
  valor?: number;
  origem?: string;
  destino?: string;
  dataIda?: string;
  dataVolta?: string;
  acompanhanteNome?: string;
  acompanhanteCpf?: string;
};

export async function listarAtendimentos(
  filtros?: AtendimentoFiltros
): Promise<Atendimento[]> {
  const response = await api.get<Atendimento[]>("/atendimentos", { params: filtros });
  return response.data;
}

export async function buscarAtendimento(id: string): Promise<Atendimento> {
  const response = await api.get<Atendimento>(`/atendimentos/${id}`);
  return response.data;
}

export async function criarAtendimento(dados: AtendimentoBody): Promise<Atendimento> {
  const response = await api.post<Atendimento>("/atendimentos", dados);
  return response.data;
}

export async function atualizarAtendimento(
  id: string,
  dados: Partial<AtendimentoBody>
): Promise<Atendimento> {
  const response = await api.put<Atendimento>(`/atendimentos/${id}`, dados);
  return response.data;
}

export async function excluirAtendimento(id: string): Promise<void> {
  await api.delete(`/atendimentos/${id}`);
}

const rotaPdf: Record<DocumentoAtendimento, string> = {
  parecer: "pareceres",
  encaminhamento: "encaminhamentos",
  beneficioEventual: "beneficios-eventuais",
};

// Retorna uma URL local (blob) do PDF; quem chama deve liberar com URL.revokeObjectURL.
export async function obterPdfDocumento(documento: DocumentoAtendimento, id: string): Promise<string> {
  const response = await api.get(`/${rotaPdf[documento]}/${id}/pdf`, { responseType: "blob" });
  return window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
}
