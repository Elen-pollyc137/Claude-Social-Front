import { api } from "./api";
import type { Atendimento } from "@/src/types/atendimento.type";
import type { TipoAtendimento } from "@/src/types/agendamento.type";

export type AtendimentoFiltros = {
  familiaId?: string;
  tecnicoId?: string;
  tipo?: TipoAtendimento;
};

export async function listarAtendimentos(
  filtros?: AtendimentoFiltros
): Promise<Atendimento[]> {
  const response = await api.get<Atendimento[]>("/atendimentos", { params: filtros });
  return response.data;
}
