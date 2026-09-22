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
} from "./cadunico.type";

export type StatusFamilia = "ATIVA" | "INATIVA" | "EM_ACOMPANHAMENTO";

export const statusFamiliaLabel: Record<StatusFamilia, string> = {
  ATIVA: "Ativa",
  INATIVA: "Inativa",
  EM_ACOMPANHAMENTO: "Em acompanhamento",
};

export const statusFamiliaTone: Record<StatusFamilia, "success" | "neutral" | "warning"> = {
  ATIVA: "success",
  INATIVA: "neutral",
  EM_ACOMPANHAMENTO: "warning",
};

export type Familia = {
  id: string;
  codigoFamiliar?: string;
  numeroPasta?: string;
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

  // Cadastro / coleta
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

  // Renda
  rendaMediaPerCapita?: number;
  faixaRendaPerCapita?: FaixaRendaPerCapita;
  rendaTotalFamiliar?: number;
  recebePbf?: SimNao;
  faixaMesesDesatualizacao?: FaixaMesesDesatualizacao;

  // Domicílio / moradia
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

  // Grupos populacionais / vulnerabilidade
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

  // Ocupação do domicílio
  quantidadePessoasDomicilio?: number;
  quantidadeFamiliasDomicilio?: number;
  quantidadeInternados0a17?: number;
  quantidadeInternados18a64?: number;
  quantidadeInternados65Mais?: number;

  // Despesas
  despesaEnergia?: number;
  despesaAguaEsgoto?: number;
  despesaGas?: number;
  despesaAlimentacao?: number;
  despesaTransporte?: number;
  despesaAluguel?: number;
  despesaMedicamentos?: number;

  // Referência de atendimento
  nomeEstabelecimentoSaude?: string;
  codigoEstabelecimentoSaude?: string;
  nomeCrasCreasReferencia?: string;
  codigoCrasCreasReferencia?: string;

  // Contatos
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

  criadoEm: string;
  atualizadoEm: string;
};
