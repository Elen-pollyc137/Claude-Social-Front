import { api } from "./api";
import type { Atendimento } from "@/src/types/atendimento.type";
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
