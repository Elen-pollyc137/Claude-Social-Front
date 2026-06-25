export type StatusFamilia = "ATIVA" | "INATIVA" | "EM_ACOMPANHAMENTO";

export type Familia = {
  id: string;
  codigoFamiliar?: string;
  responsavelNome: string;
  responsavelCpf?: string;
  responsavelNis?: string;
  telefone?: string;
  email?: string;
  territorio?: string;
  status: StatusFamilia;

  cep?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  complemento?: string;

  criadoEm: string;
  atualizadoEm: string;
};