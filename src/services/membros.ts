import { api } from "./api";
import type { MembroFamiliar, Sexo } from "@/src/types/membro.type";
import type {
  CertidaoRegistrada,
  EstadoCadastralPessoa,
  FrequentaEscola,
  FuncaoTrabalho,
  GrauInstrucao,
  ParentescoResponsavel,
  SimNao,
  TeveEmpregoCarteiraAssinada,
} from "@/src/types/cadunico.type";

export type MembroFamiliarBody = {
  familiaId: string;
  nome: string;
  cpf?: string;
  nis?: string;
  dataNascimento?: string;
  sexo?: Sexo;
  parentesco?: ParentescoResponsavel;
  escolaridade?: string;
  profissao?: string;
  renda?: number;
  possuiDeficiencia?: boolean;
  observacoes?: string;

  apelido?: string;
  nomeMae?: string;
  nomePai?: string;
  estadoCadastral?: EstadoCadastralPessoa;
  certidaoRegistrada?: CertidaoRegistrada;
  numeroRg?: string;
  orgaoEmissorRg?: string;
  ufEmissorRg?: string;

  sabeLerEscrever?: SimNao;
  frequentaEscola?: FrequentaEscola;
  grauInstrucao?: GrauInstrucao;

  recebePbf?: SimNao;
  trabalhouSemanaPassada?: SimNao;
  funcaoPrincipalTrabalho?: FuncaoTrabalho;
  teveEmpregoCarteiraAssinada?: TeveEmpregoCarteiraAssinada;

  situacaoDeRua?: SimNao;
};

export type MembroFamiliarFiltros = {
  familiaId?: string;
  busca?: string;
};

export async function listarMembros(
  filtros?: MembroFamiliarFiltros
): Promise<MembroFamiliar[]> {
  const response = await api.get<MembroFamiliar[]>("/membros-familiares", {
    params: filtros,
  });
  return response.data;
}

export async function buscarMembro(id: string): Promise<MembroFamiliar> {
  const response = await api.get<MembroFamiliar>(`/membros-familiares/${id}`);
  return response.data;
}

export async function criarMembro(
  dados: MembroFamiliarBody
): Promise<MembroFamiliar> {
  const response = await api.post<MembroFamiliar>("/membros-familiares", dados);
  return response.data;
}

export async function atualizarMembro(
  id: string,
  dados: Partial<MembroFamiliarBody>
): Promise<MembroFamiliar> {
  const response = await api.put<MembroFamiliar>(`/membros-familiares/${id}`, dados);
  return response.data;
}

export async function excluirMembro(id: string): Promise<void> {
  await api.delete(`/membros-familiares/${id}`);
}
