import { api } from "./api";
import type { Familia, StatusFamilia } from "@/src/types/familia.type";

export type FamiliaBody = {
  responsavelNome: string;
  codigoFamiliar?: string;
  responsavelCpf?: string;
  responsavelNis?: string;
  telefone?: string;
  email?: string;
  territorio?: string;
  status?: StatusFamilia;
  cep?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  complemento?: string;
};

export type FamiliaFiltros = {
  busca?: string;
  status?: StatusFamilia;
};

export async function listarFamilias(filtros?: FamiliaFiltros): Promise<Familia[]> {
  const response = await api.get<Familia[]>("/familias", { params: filtros });
  return response.data;
}

export async function buscarFamilia(id: string): Promise<Familia> {
  const response = await api.get<Familia>(`/familias/${id}`);
  return response.data;
}

export async function criarFamilia(dados: FamiliaBody): Promise<Familia> {
  const response = await api.post<Familia>("/familias", dados);
  return response.data;
}

export async function atualizarFamilia(
  id: string,
  dados: Partial<FamiliaBody>
): Promise<Familia> {
  const response = await api.put<Familia>(`/familias/${id}`, dados);
  return response.data;
}

export async function excluirFamilia(id: string): Promise<void> {
  await api.delete(`/familias/${id}`);
}
