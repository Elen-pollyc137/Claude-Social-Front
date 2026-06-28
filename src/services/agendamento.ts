import { api } from "./api";
import type { Agendamento, StatusAgendamento, TipoAtendimento } from "@/src/types/agendamento.type";

export type AgendamentoBody = {
  familiaId: string;
  tecnicoId: string;
  tipo: TipoAtendimento;
  titulo?: string;
  observacoes?: string;
  dataHora: string;
  duracaoMinutos?: number;
  status?: StatusAgendamento;
  compareceu?: boolean;
  atendimentoId?: string;
};

export type AgendamentoFiltros = {
  familiaId?: string;
  tecnicoId?: string;
  status?: StatusAgendamento;
  dataInicio?: string;
  dataFim?: string;
};

export async function listarAgendamentos(filtros?: AgendamentoFiltros): Promise<Agendamento[]> {
  const response = await api.get<Agendamento[]>("/agendamentos", { params: filtros });
  return response.data;
}

export async function buscarAgendamento(id: string): Promise<Agendamento> {
  const response = await api.get<Agendamento>(`/agendamentos/${id}`);
  return response.data;
}

export async function criarAgendamento(dados: AgendamentoBody): Promise<Agendamento> {
  const response = await api.post<Agendamento>("/agendamentos", dados);
  return response.data;
}

export async function atualizarAgendamento(
  id: string,
  dados: Partial<AgendamentoBody>
): Promise<Agendamento> {
  const response = await api.put<Agendamento>(`/agendamentos/${id}`, dados);
  return response.data;
}

export async function excluirAgendamento(id: string): Promise<void> {
  await api.delete(`/agendamentos/${id}`);
}
