import type { PerfilUsuario, StatusUsuario } from "./usuario.type";

export type TipoUnidade = "CRAS" | "CREAS";
export type TipoVinculoFamiliaUnidade = "REFERENCIA" | "ATENDIMENTO_ARTICULADO";

export const tipoVinculoFamiliaLabel: Record<TipoVinculoFamiliaUnidade, string> = {
  REFERENCIA: "Unidade de referência",
  ATENDIMENTO_ARTICULADO: "Atendimento articulado",
};

export const sugestoesFuncao = [
  "Assistente social",
  "Psicólogo(a)",
  "Coordenador(a)",
  "Orientador(a) social",
  "Técnico(a) de nível médio",
  "Advogado(a)",
];

export type UnidadeResumo = {
  id: string;
  nome: string;
  tipo: TipoUnidade;
  ativa: boolean;
};

export type Unidade = UnidadeResumo & {
  codigo: string | null;
  endereco: string | null;
  bairro: string | null;
  cidade: string | null;
  telefone: string | null;
  email: string | null;
  criadoEm: string;
  atualizadoEm: string;
  _count?: { profissionais: number };
};

export type VinculoProfissional = {
  id: string;
  usuarioId: string;
  unidadeId: string;
  funcao: string;
  ativo: boolean;
  usuario: { id: string; nome: string; email: string; perfil: PerfilUsuario; status: StatusUsuario };
  unidade: UnidadeResumo;
};

export type VinculoFamiliaUnidade = {
  id: string;
  familiaId: string;
  unidadeId: string;
  tipo: TipoVinculoFamiliaUnidade;
  dataInicio: string;
  dataFim: string | null;
  observacoes: string | null;
  unidade: UnidadeResumo;
};
