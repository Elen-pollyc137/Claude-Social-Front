import { api } from "./api";
import type { Familia, StatusFamilia } from "@/src/types/familia.type";
import type {
  AbastecimentoAgua,
  Calcamento,
  DestinoLixo,
  EscoamentoSanitario,
  EspecieDomicilio,
  EstadoCadastralFamilia,
  FaixaMesesDesatualizacao,
  FaixaRendaPerCapita,
  FormaColeta,
  GrupoPopulacionalTradicional,
  MaterialParedes,
  MaterialPiso,
  SimNao,
  SituacaoDomicilio,
  TipoContato,
  TipoIluminacao,
} from "@/src/types/cadunico.type";

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

  uf?: string;
  codigoIbgeMunicipio?: string;
  dataCadastramento?: string;
  dataUltimaAtualizacaoCadastral?: string;
  estadoCadastral?: EstadoCadastralFamilia;
  formaColeta?: FormaColeta;
  dataEntrevista?: string;
  nomeLocalidade?: string;
  tipoLogradouro?: string;
  tituloLogradouro?: string;
  nomeLogradouro?: string;
  complementoAdicional?: string;
  codigoUnidadeTerritorial?: string;
  nomeUnidadeTerritorial?: string;
  referenciaLocalizacao?: string;
  nomeEntrevistador?: string;
  cpfEntrevistador?: string;

  rendaMediaPerCapita?: number;
  faixaRendaPerCapita?: FaixaRendaPerCapita;
  rendaTotalFamiliar?: number;
  recebePbf?: SimNao;
  faixaMesesDesatualizacao?: FaixaMesesDesatualizacao;

  situacaoDomicilio?: SituacaoDomicilio;
  especieDomicilio?: EspecieDomicilio;
  quantidadeComodos?: number;
  quantidadeComodosDormitorio?: number;
  materialPiso?: MaterialPiso;
  materialParedes?: MaterialParedes;
  aguaCanalizada?: SimNao;
  abastecimentoAgua?: AbastecimentoAgua;
  existeBanheiro?: SimNao;
  escoamentoSanitario?: EscoamentoSanitario;
  destinoLixo?: DestinoLixo;
  tipoIluminacao?: TipoIluminacao;
  calcamento?: Calcamento;

  familiaIndigena?: SimNao;
  codigoPovoIndigena?: string;
  nomePovoIndigena?: string;
  resideReservaIndigena?: SimNao;
  codigoReservaIndigena?: string;
  nomeReservaIndigena?: string;
  familiaQuilombola?: SimNao;
  codigoComunidadeQuilombola?: string;
  nomeComunidadeQuilombola?: string;
  grupoPopulacionalTradicional?: GrupoPopulacionalTradicional;
  riscoViolacaoDireitos?: string;
  riscoInsegurancaAlimentar?: SimNao;

  quantidadePessoasDomicilio?: number;
  quantidadeFamiliasDomicilio?: number;
  quantidadeInternados0a17?: number;
  quantidadeInternados18a64?: number;
  quantidadeInternados65Mais?: number;

  despesaEnergia?: number;
  despesaAguaEsgoto?: number;
  despesaGas?: number;
  despesaAlimentacao?: number;
  despesaTransporte?: number;
  despesaAluguel?: number;
  despesaMedicamentos?: number;

  nomeEstabelecimentoSaude?: string;
  codigoEstabelecimentoSaude?: string;
  nomeCrasCreasReferencia?: string;
  codigoCrasCreasReferencia?: string;

  dddContato1?: string;
  telefoneContato1?: string;
  tipoContato1?: TipoContato;
  autorizaSmsContato1?: SimNao;
  telefoneContato2?: string;
  dddContato2?: string;
  tipoContato2?: TipoContato;
  autorizaSmsContato2?: SimNao;

  codigoUnidadeConsumidoraEnergia?: string;
  referenciaCadastroUnico?: string;
  referenciaProgramaBolsaFamilia?: string;
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

// Retorna uma URL local (blob) do PDF do prontuário; quem chama deve liberar com URL.revokeObjectURL.
export async function obterPdfProntuario(familiaId: string): Promise<string> {
  const response = await api.get(`/familias/${familiaId}/prontuario/pdf`, { responseType: "blob" });
  return window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
}
