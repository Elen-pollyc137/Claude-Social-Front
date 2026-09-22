import type {
  AnoSerie,
  CertidaoRegistrada,
  CursoFrequenta,
  CursoFrequentou,
  EstadoCadastralPessoa,
  FaixaEtaria,
  FrequenciaContato,
  FrequentaEscola,
  FuncaoTrabalho,
  GrauInstrucao,
  IdentidadeGenero,
  IdentidadeTrans,
  LocalNascimento,
  OpcaoFormulario,
  ParentescoResponsavel,
  SimNao,
  TempoPeriodo,
  TeveEmpregoCarteiraAssinada,
  TipoCertidao,
} from "./cadunico.type";

export type Sexo = "MASCULINO" | "FEMININO" | "OUTRO" | "NAO_INFORMADO";

export type MembroFamiliar = {
  id: string;
  familiaId: string;
  nome: string;
  cpf?: string;
  nis?: string;
  dataNascimento?: string;
  sexo: Sexo;
  parentesco?: ParentescoResponsavel;
  escolaridade?: string;
  profissao?: string;
  renda?: number;
  possuiDeficiencia: boolean;
  observacoes?: string;

  estadoCadastral?: EstadoCadastralPessoa;
  trabalhoInfantil?: SimNao;
  apelido?: string;
  nomeMae?: string;
  nomePai?: string;
  localNascimento?: LocalNascimento;
  ufNascimento?: string;
  nomeMunicipioNascimento?: string;
  codigoIbgeMunicipioNascimento?: string;
  nomePaisNascimento?: string;
  codigoPaisNascimento?: string;
  certidaoRegistrada?: CertidaoRegistrada;
  faixaEtaria?: FaixaEtaria;
  recebePbf?: SimNao;
  desejaInformarGenero?: SimNao;
  identidadeTrans?: IdentidadeTrans;
  identidadeGenero?: IdentidadeGenero;
  tipoCertidao?: TipoCertidao;
  numeroLivroCertidao?: string;
  numeroFolhaCertidao?: string;
  numeroTermoCertidao?: string;
  municipioRegistroCertidao?: string;
  codigoIbgeMunicipioCertidao?: string;
  codigoCartorioCertidao?: string;
  numeroRg?: string;
  complementoRg?: string;
  dataEmissaoRg?: string;
  ufEmissorRg?: string;
  orgaoEmissorRg?: string;
  numeroCtps?: string;
  serieCtps?: string;
  dataEmissaoCtps?: string;
  ufEmissorCtps?: string;
  numeroTituloEleitor?: string;
  zonaTituloEleitor?: string;
  secaoTituloEleitor?: string;

  deficienciaCegueira?: OpcaoFormulario;
  deficienciaBaixaVisao?: OpcaoFormulario;
  deficienciaSurdezProfunda?: OpcaoFormulario;
  deficienciaSurdezLeve?: OpcaoFormulario;
  deficienciaFisica?: OpcaoFormulario;
  deficienciaMental?: OpcaoFormulario;
  deficienciaSindromeDown?: OpcaoFormulario;
  deficienciaTranstornoMental?: OpcaoFormulario;

  ajudaNenhuma?: OpcaoFormulario;
  ajudaFamilia?: OpcaoFormulario;
  ajudaCuidadorEspecializado?: OpcaoFormulario;
  ajudaVizinho?: OpcaoFormulario;
  ajudaInstituicao?: OpcaoFormulario;
  ajudaOutra?: OpcaoFormulario;

  sabeLerEscrever?: SimNao;
  frequentaEscola?: FrequentaEscola;
  nomeEscola?: string;
  escolaNoMunicipio?: SimNao;
  ufEscola?: string;
  municipioEscola?: string;
  codigoIbgeMunicipioEscola?: string;
  codigoInepEscola?: string;
  cursoQueFrequenta?: CursoFrequenta;
  anoSerieQueFrequenta?: AnoSerie;
  cursoMaisElevadoQueFrequentou?: CursoFrequentou;
  ultimoAnoSerieQueFrequentou?: AnoSerie;
  concluiuCurso?: SimNao;
  grauInstrucao?: GrauInstrucao;

  trabalhouSemanaPassada?: SimNao;
  afastadoTrabalhoSemanaPassada?: SimNao;
  atividadeExtrativista?: SimNao;
  funcaoPrincipalTrabalho?: FuncaoTrabalho;
  trabalhoRemunerado12Meses?: SimNao;
  quantidadeMesesTrabalhados12Meses?: number;
  faixaRendaTrabalhoPrincipal?: string;
  faixaRendaBruta12Meses?: string;
  faixaValorDoacao?: string;
  faixaValorAposentadoria?: string;
  faixaValorSeguroDesemprego?: string;
  faixaValorPensaoAlimenticia?: string;
  faixaValorOutrasFontes?: string;

  situacaoDeRua?: SimNao;
  dormeNaRua?: SimNao;
  frequenciaSemanalDormeNaRua?: number;
  dormeEmAlbergue?: SimNao;
  frequenciaSemanalDormeEmAlbergue?: number;
  dormeEmDomicilioParticular?: SimNao;
  frequenciaSemanalDormeEmDomicilioParticular?: number;
  dormeDeOutraForma?: SimNao;
  frequenciaSemanalDormeDeOutraForma?: number;
  tempoNaRua?: TempoPeriodo;
  motivoRuaPerdaMoradia?: SimNao;
  motivoRuaAmeaca?: SimNao;
  motivoRuaProblemasFamiliares?: SimNao;
  motivoRuaAlcoolismo?: SimNao;
  motivoRuaDesemprego?: SimNao;
  motivoRuaTrabalho?: SimNao;
  motivoRuaTratamentoSaude?: SimNao;
  motivoRuaPreferencia?: SimNao;
  motivoRuaOutro?: SimNao;
  motivoRuaNaoSabe?: SimNao;
  motivoRuaNaoRespondeu?: SimNao;
  tempoNaCidade?: TempoPeriodo;
  viveComFamiliaNaRua?: SimNao;
  contatoComParente?: FrequenciaContato;

  atividadeComunitariaEscola?: SimNao;
  atividadeComunitariaCooperativa?: SimNao;
  atividadeComunitariaMovimentoSocial?: SimNao;
  atividadeComunitariaNaoSabe?: SimNao;
  atividadeComunitariaNaoRespondeu?: SimNao;

  atendidoPorCras?: SimNao;
  atendidoPorCreas?: SimNao;
  atendidoPorCentroRefPopRua?: SimNao;
  atendidoPorInstituicaoGovernamental?: SimNao;
  atendidoPorInstituicaoNaoGovernamental?: SimNao;
  atendidoPorHospitalGeral?: SimNao;
  naoAtendidoPorNenhumLocal?: SimNao;

  teveEmpregoCarteiraAssinada?: TeveEmpregoCarteiraAssinada;
  ganhaDinheiroConstrucaoCivil?: SimNao;
  ganhaDinheiroGuardadorDeCarro?: SimNao;
  ganhaDinheiroCarregador?: SimNao;
  ganhaDinheiroCatador?: SimNao;
  ganhaDinheiroServicosGerais?: SimNao;
  ganhaDinheiroPedinte?: SimNao;
  ganhaDinheiroVendas?: SimNao;
  ganhaDinheiroOutraForma?: SimNao;
  ganhaDinheiroNaoRespondeu?: SimNao;

  criadoEm: string;
  atualizadoEm: string;
};
