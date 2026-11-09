import { api } from "./api";
import type {
  TipoUnidade,
  TipoVinculoFamiliaUnidade,
  Unidade,
  VinculoFamiliaUnidade,
  VinculoProfissional,
} from "@/src/types/unidade.type";

export type UnidadeBody = {
  nome: string;
  tipo: TipoUnidade;
  codigo?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  telefone?: string;
  email?: string;
  ativa?: boolean;
};

export async function listarUnidades(filtros?: { tipo?: TipoUnidade; ativa?: boolean }): Promise<Unidade[]> {
  const response = await api.get<Unidade[]>("/unidades", { params: filtros });
  return response.data;
}

export async function criarUnidade(dados: UnidadeBody): Promise<Unidade> {
  const response = await api.post<Unidade>("/unidades", dados);
  return response.data;
}

export async function atualizarUnidade(id: string, dados: Partial<UnidadeBody>): Promise<Unidade> {
  const response = await api.put<Unidade>(`/unidades/${id}`, dados);
  return response.data;
}

export async function listarVinculosProfissionais(filtros?: {
  unidadeId?: string;
  usuarioId?: string;
  ativo?: boolean;
}): Promise<VinculoProfissional[]> {
  const response = await api.get<VinculoProfissional[]>("/vinculos-profissionais", { params: filtros });
  return response.data;
}

export async function minhasUnidades(): Promise<VinculoProfissional[]> {
  const response = await api.get<VinculoProfissional[]>("/me/unidades");
  return response.data;
}

export async function criarVinculoProfissional(dados: {
  usuarioId: string;
  unidadeId: string;
  funcao: string;
}): Promise<VinculoProfissional> {
  const response = await api.post<VinculoProfissional>("/vinculos-profissionais", dados);
  return response.data;
}

export async function atualizarVinculoProfissional(
  id: string,
  dados: { funcao?: string; ativo?: boolean }
): Promise<VinculoProfissional> {
  const response = await api.put<VinculoProfissional>(`/vinculos-profissionais/${id}`, dados);
  return response.data;
}

export async function excluirVinculoProfissional(id: string): Promise<void> {
  await api.delete(`/vinculos-profissionais/${id}`);
}

export async function listarUnidadesDaFamilia(familiaId: string): Promise<VinculoFamiliaUnidade[]> {
  const response = await api.get<VinculoFamiliaUnidade[]>(`/familias/${familiaId}/unidades`);
  return response.data;
}

export async function vincularFamiliaUnidade(
  familiaId: string,
  dados: { unidadeId: string; tipo: TipoVinculoFamiliaUnidade; dataInicio?: string; observacoes?: string }
): Promise<VinculoFamiliaUnidade> {
  const response = await api.post<VinculoFamiliaUnidade>(`/familias/${familiaId}/unidades`, dados);
  return response.data;
}

export async function encerrarVinculoFamilia(id: string): Promise<VinculoFamiliaUnidade> {
  const response = await api.patch<VinculoFamiliaUnidade>(`/familias-unidades/${id}/encerrar`, {});
  return response.data;
}
