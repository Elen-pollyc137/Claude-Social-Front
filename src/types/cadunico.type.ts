// Enums e rótulos compartilhados dos dados do Cadastro Único (CadÚnico)
// usados nos modelos Familia e MembroFamiliar.

export type SimNao = "SIM" | "NAO";
export const simNaoLabel: Record<SimNao, string> = {
  SIM: "Sim",
  NAO: "Não",
};

export type OpcaoFormulario = "NAO_MARCADA" | "MARCADA";
export const opcaoFormularioLabel: Record<OpcaoFormulario, string> = {
  NAO_MARCADA: "Não marcada",
  MARCADA: "Marcada",
};

export type EstadoCadastralFamilia = "SEM_REGISTRO_CIVIL" | "CADASTRADO";
export const estadoCadastralFamiliaLabel: Record<EstadoCadastralFamilia, string> = {
  SEM_REGISTRO_CIVIL: "Sem registro civil",
  CADASTRADO: "Cadastrado",
};

export type FormaColeta =
  | "INFORMACAO_MIGRADA_INEXISTENTE"
  | "SEM_VISITA_DOMICILIAR"
  | "COM_VISITA_DOMICILIAR";
export const formaColetaLabel: Record<FormaColeta, string> = {
  INFORMACAO_MIGRADA_INEXISTENTE: "Informação migrada/inexistente",
  SEM_VISITA_DOMICILIAR: "Sem visita domiciliar",
  COM_VISITA_DOMICILIAR: "Com visita domiciliar",
};

export type FaixaRendaPerCapita =
  | "ATE_89"
  | "ENTRE_89_E_178"
  | "ENTRE_178_E_MEIO_SM"
  | "ACIMA_MEIO_SM";
export const faixaRendaPerCapitaLabel: Record<FaixaRendaPerCapita, string> = {
  ATE_89: "Até R$ 89,00",
  ENTRE_89_E_178: "Entre R$ 89,01 e R$ 178,00",
  ENTRE_178_E_MEIO_SM: "Entre R$ 178,01 e meio salário mínimo",
  ACIMA_MEIO_SM: "Acima de meio salário mínimo",
};

export type FaixaMesesDesatualizacao =
  | "ATE_12_MESES"
  | "DE_13_A_18_MESES"
  | "DE_19_A_24_MESES"
  | "DE_25_A_36_MESES"
  | "DE_37_A_48_MESES"
  | "ACIMA_DE_48_MESES";
export const faixaMesesDesatualizacaoLabel: Record<FaixaMesesDesatualizacao, string> = {
  ATE_12_MESES: "Até 12 meses",
  DE_13_A_18_MESES: "De 13 a 18 meses",
  DE_19_A_24_MESES: "De 19 a 24 meses",
  DE_25_A_36_MESES: "De 25 a 36 meses",
  DE_37_A_48_MESES: "De 37 a 48 meses",
  ACIMA_DE_48_MESES: "Acima de 48 meses",
};

export type SituacaoDomicilio = "URBANA" | "RURAL";
export const situacaoDomicilioLabel: Record<SituacaoDomicilio, string> = {
  URBANA: "Urbana",
  RURAL: "Rural",
};

export type EspecieDomicilio = "PARTICULAR_PERMANENTE" | "PARTICULAR_IMPROVISADO" | "COLETIVO";
export const especieDomicilioLabel: Record<EspecieDomicilio, string> = {
  PARTICULAR_PERMANENTE: "Particular permanente",
  PARTICULAR_IMPROVISADO: "Particular improvisado",
  COLETIVO: "Coletivo",
};

export type MaterialPiso =
  | "TERRA"
  | "CIMENTO"
  | "MADEIRA_APROVEITADA"
  | "MADEIRA_APARELHADA"
  | "CERAMICA_LAJOTA_OU_PEDRA"
  | "CARPETE"
  | "OUTRO_MATERIAL";
export const materialPisoLabel: Record<MaterialPiso, string> = {
  TERRA: "Terra",
  CIMENTO: "Cimento",
  MADEIRA_APROVEITADA: "Madeira aproveitada",
  MADEIRA_APARELHADA: "Madeira aparelhada",
  CERAMICA_LAJOTA_OU_PEDRA: "Cerâmica, lajota ou pedra",
  CARPETE: "Carpete",
  OUTRO_MATERIAL: "Outro material",
};

export type MaterialParedes =
  | "ALVENARIA_COM_REVESTIMENTO"
  | "ALVENARIA_SEM_REVESTIMENTO"
  | "MADEIRA_APARELHADA"
  | "TAIPA_REVESTIDA"
  | "TAIPA_NAO_REVESTIDA"
  | "MADEIRA_APROVEITADA"
  | "PALHA"
  | "OUTRO_MATERIAL";
export const materialParedesLabel: Record<MaterialParedes, string> = {
  ALVENARIA_COM_REVESTIMENTO: "Alvenaria/tijolo com revestimento",
  ALVENARIA_SEM_REVESTIMENTO: "Alvenaria/tijolo sem revestimento",
  MADEIRA_APARELHADA: "Madeira aparelhada",
  TAIPA_REVESTIDA: "Taipa revestida",
  TAIPA_NAO_REVESTIDA: "Taipa não revestida",
  MADEIRA_APROVEITADA: "Madeira aproveitada",
  PALHA: "Palha",
  OUTRO_MATERIAL: "Outro material",
};

export type AbastecimentoAgua =
  | "REDE_GERAL_DISTRIBUICAO"
  | "POCO_OU_NASCENTE"
  | "CISTERNA"
  | "OUTRA_FORMA";
export const abastecimentoAguaLabel: Record<AbastecimentoAgua, string> = {
  REDE_GERAL_DISTRIBUICAO: "Rede geral de distribuição",
  POCO_OU_NASCENTE: "Poço ou nascente",
  CISTERNA: "Cisterna",
  OUTRA_FORMA: "Outra forma",
};

export type EscoamentoSanitario =
  | "REDE_COLETORA_ESGOTO_PLUVIAL"
  | "FOSSA_SEPTICA"
  | "FOSSA_RUDIMENTAR"
  | "VALA_A_CEU_ABERTO"
  | "DIRETO_RIO_LAGO_MAR"
  | "OUTRA_FORMA";
export const escoamentoSanitarioLabel: Record<EscoamentoSanitario, string> = {
  REDE_COLETORA_ESGOTO_PLUVIAL: "Rede coletora de esgoto ou pluvial",
  FOSSA_SEPTICA: "Fossa séptica",
  FOSSA_RUDIMENTAR: "Fossa rudimentar",
  VALA_A_CEU_ABERTO: "Vala a céu aberto",
  DIRETO_RIO_LAGO_MAR: "Direto para rio, lago ou mar",
  OUTRA_FORMA: "Outra forma",
};

export type DestinoLixo =
  | "COLETADO_DIRETAMENTE"
  | "COLETADO_INDIRETAMENTE"
  | "QUEIMADO_OU_ENTERRADO"
  | "JOGADO_TERRENO_BALDIO"
  | "JOGADO_RIO_OU_MAR"
  | "OUTRO_DESTINO";
export const destinoLixoLabel: Record<DestinoLixo, string> = {
  COLETADO_DIRETAMENTE: "Coletado diretamente",
  COLETADO_INDIRETAMENTE: "Coletado indiretamente",
  QUEIMADO_OU_ENTERRADO: "Queimado ou enterrado (na propriedade)",
  JOGADO_TERRENO_BALDIO: "Jogado em terreno baldio ou logradouro",
  JOGADO_RIO_OU_MAR: "Jogado em rio ou mar",
  OUTRO_DESTINO: "Outro destino",
};

export type TipoIluminacao =
  | "ELETRICA_MEDIDOR_PROPRIO"
  | "ELETRICA_MEDIDOR_COMUNITARIO"
  | "ELETRICA_SEM_MEDIDOR"
  | "OLEO_QUEROSENE_OU_GAS"
  | "VELA"
  | "OUTRA_FORMA";
export const tipoIluminacaoLabel: Record<TipoIluminacao, string> = {
  ELETRICA_MEDIDOR_PROPRIO: "Elétrica com medidor próprio",
  ELETRICA_MEDIDOR_COMUNITARIO: "Elétrica com medidor comunitário",
  ELETRICA_SEM_MEDIDOR: "Elétrica sem medidor",
  OLEO_QUEROSENE_OU_GAS: "Óleo, querosene ou gás",
  VELA: "Vela",
  OUTRA_FORMA: "Outra forma",
};

export type Calcamento = "TOTAL" | "PARCIAL" | "NAO_EXISTE";
export const calcamentoLabel: Record<Calcamento, string> = {
  TOTAL: "Total",
  PARCIAL: "Parcial",
  NAO_EXISTE: "Não existe",
};

export type TipoContato =
  | "CELULAR"
  | "TRABALHO"
  | "RESIDENCIAL"
  | "RECADO"
  | "NAO_TEM"
  | "NAO_DECLARADO"
  | "SEM_COLETA_DE_DADOS";
export const tipoContatoLabel: Record<TipoContato, string> = {
  CELULAR: "Celular",
  TRABALHO: "Trabalho",
  RESIDENCIAL: "Residencial",
  RECADO: "Recado",
  NAO_TEM: "Não tem",
  NAO_DECLARADO: "Não declarado",
  SEM_COLETA_DE_DADOS: "Sem coleta de dados",
};

export type GrupoPopulacionalTradicional =
  | "CIGANA"
  | "EXTRATIVISTA"
  | "PESCADORES_ARTESANAIS"
  | "COMUNIDADE_TERREIRO"
  | "RIBEIRINHA"
  | "AGRICULTORES_FAMILIARES"
  | "ASSENTADA_REFORMA_AGRARIA"
  | "BENEFICIARIA_CREDITO_FUNDIARIO"
  | "ACAMPADA"
  | "ATINGIDA_EMPREENDIMENTOS_INFRAESTRUTURA"
  | "PRESO_SISTEMA_CARCERARIO"
  | "CATADORES_MATERIAL_RECICLAVEL"
  | "NENHUMA";
export const grupoPopulacionalTradicionalLabel: Record<GrupoPopulacionalTradicional, string> = {
  CIGANA: "Comunidade cigana",
  EXTRATIVISTA: "Extrativista",
  PESCADORES_ARTESANAIS: "Pescadores artesanais",
  COMUNIDADE_TERREIRO: "Comunidade de terreiro",
  RIBEIRINHA: "Ribeirinha",
  AGRICULTORES_FAMILIARES: "Agricultores familiares",
  ASSENTADA_REFORMA_AGRARIA: "Assentada da reforma agrária",
  BENEFICIARIA_CREDITO_FUNDIARIO: "Beneficiária de crédito fundiário",
  ACAMPADA: "Acampada",
  ATINGIDA_EMPREENDIMENTOS_INFRAESTRUTURA: "Atingida por empreendimentos de infraestrutura",
  PRESO_SISTEMA_CARCERARIO: "Preso do sistema carcerário",
  CATADORES_MATERIAL_RECICLAVEL: "Catadores de material reciclável",
  NENHUMA: "Nenhuma",
};

// ── Enums de MembroFamiliar ──────────────────────────────────────

export type EstadoCadastralPessoa =
  | "SEM_REGISTRO_CIVIL"
  | "CADASTRADO"
  | "AGUARDANDO_NIS"
  | "VALIDANDO_NIS";
export const estadoCadastralPessoaLabel: Record<EstadoCadastralPessoa, string> = {
  SEM_REGISTRO_CIVIL: "Sem registro civil",
  CADASTRADO: "Cadastrado",
  AGUARDANDO_NIS: "Aguardando NIS",
  VALIDANDO_NIS: "Validando NIS",
};

export type ParentescoResponsavel =
  | "RESPONSAVEL_UNIDADE_FAMILIAR"
  | "CONJUGE_OU_COMPANHEIRO"
  | "FILHO"
  | "ENTEADO"
  | "NETO_OU_BISNETO"
  | "PAI_OU_MAE"
  | "SOGRO"
  | "IRMAO_OU_IRMA"
  | "GENRO_OU_NORA"
  | "OUTRO_PARENTE"
  | "NAO_PARENTE";
export const parentescoResponsavelLabel: Record<ParentescoResponsavel, string> = {
  RESPONSAVEL_UNIDADE_FAMILIAR: "Responsável pela unidade familiar",
  CONJUGE_OU_COMPANHEIRO: "Cônjuge ou companheiro(a)",
  FILHO: "Filho(a)",
  ENTEADO: "Enteado(a)",
  NETO_OU_BISNETO: "Neto(a) ou bisneto(a)",
  PAI_OU_MAE: "Pai ou mãe",
  SOGRO: "Sogro(a)",
  IRMAO_OU_IRMA: "Irmão ou irmã",
  GENRO_OU_NORA: "Genro ou nora",
  OUTRO_PARENTE: "Outro parente",
  NAO_PARENTE: "Não parente",
};

export type LocalNascimento = "NESTE_MUNICIPIO" | "EM_OUTRO_MUNICIPIO" | "EM_OUTRO_PAIS";
export const localNascimentoLabel: Record<LocalNascimento, string> = {
  NESTE_MUNICIPIO: "Neste município",
  EM_OUTRO_MUNICIPIO: "Em outro município",
  EM_OUTRO_PAIS: "Em outro país",
};

export type CertidaoRegistrada = "SIM_COM_CERTIDAO" | "SIM_SEM_CERTIDAO" | "NAO" | "NAO_SABE";
export const certidaoRegistradaLabel: Record<CertidaoRegistrada, string> = {
  SIM_COM_CERTIDAO: "Sim, com certidão em mãos",
  SIM_SEM_CERTIDAO: "Sim, sem certidão em mãos",
  NAO: "Não",
  NAO_SABE: "Não sabe",
};

export type FaixaEtaria =
  | "DE_0_A_4"
  | "DE_5_A_6"
  | "DE_7_A_15"
  | "DE_16_A_17"
  | "DE_18_A_24"
  | "DE_25_A_34"
  | "DE_35_A_39"
  | "DE_40_A_44"
  | "DE_45_A_49"
  | "DE_50_A_54"
  | "DE_55_A_59"
  | "DE_60_A_64"
  | "MAIOR_QUE_65";
export const faixaEtariaLabel: Record<FaixaEtaria, string> = {
  DE_0_A_4: "0 a 4 anos",
  DE_5_A_6: "5 a 6 anos",
  DE_7_A_15: "7 a 15 anos",
  DE_16_A_17: "16 a 17 anos",
  DE_18_A_24: "18 a 24 anos",
  DE_25_A_34: "25 a 34 anos",
  DE_35_A_39: "35 a 39 anos",
  DE_40_A_44: "40 a 44 anos",
  DE_45_A_49: "45 a 49 anos",
  DE_50_A_54: "50 a 54 anos",
  DE_55_A_59: "55 a 59 anos",
  DE_60_A_64: "60 a 64 anos",
  MAIOR_QUE_65: "65 anos ou mais",
};

export type IdentidadeTrans = "TRANS" | "TRAVESTI" | "NAO";
export const identidadeTransLabel: Record<IdentidadeTrans, string> = {
  TRANS: "Trans",
  TRAVESTI: "Travesti",
  NAO: "Não",
};

export type IdentidadeGenero = "FEMININA" | "MASCULINA" | "NAO_BINARIO";
export const identidadeGeneroLabel: Record<IdentidadeGenero, string> = {
  FEMININA: "Feminina",
  MASCULINA: "Masculina",
  NAO_BINARIO: "Não binário",
};

export type TipoCertidao = "NASCIMENTO" | "CASAMENTO" | "RANI";
export const tipoCertidaoLabel: Record<TipoCertidao, string> = {
  NASCIMENTO: "Nascimento",
  CASAMENTO: "Casamento",
  RANI: "RANI",
};

export type FrequentaEscola =
  | "SIM_REDE_PUBLICA"
  | "SIM_REDE_PARTICULAR"
  | "NAO_JA_FREQUENTOU"
  | "NUNCA_FREQUENTOU";
export const frequentaEscolaLabel: Record<FrequentaEscola, string> = {
  SIM_REDE_PUBLICA: "Sim, rede pública",
  SIM_REDE_PARTICULAR: "Sim, rede particular",
  NAO_JA_FREQUENTOU: "Não, mas já frequentou",
  NUNCA_FREQUENTOU: "Nunca frequentou",
};

export type CursoFrequenta =
  | "CRECHE"
  | "PRE_ESCOLA_EXCETO_CA"
  | "CLASSE_DE_ALFABETIZACAO_CA"
  | "ENSINO_FUNDAMENTAL_REGULAR_8_ANOS"
  | "ENSINO_FUNDAMENTAL_REGULAR_9_ANOS"
  | "ENSINO_FUNDAMENTAL_ESPECIAL"
  | "ENSINO_MEDIO_REGULAR"
  | "ENSINO_MEDIO_ESPECIAL"
  | "ENSINO_FUNDAMENTAL_EJA_SERIES_INICIAIS"
  | "ENSINO_FUNDAMENTAL_EJA_SERIES_FINAIS"
  | "ENSINO_MEDIO_EJA"
  | "ALFABETIZACAO_PARA_ADULTOS"
  | "SUPERIOR_APERFEICOAMENTO_ESPECIALIZACAO_MESTRADO_DOUTORADO"
  | "PRE_VESTIBULAR";
export const cursoFrequentaLabel: Record<CursoFrequenta, string> = {
  CRECHE: "Creche",
  PRE_ESCOLA_EXCETO_CA: "Pré-escola (exceto classe de alfabetização)",
  CLASSE_DE_ALFABETIZACAO_CA: "Classe de alfabetização (CA)",
  ENSINO_FUNDAMENTAL_REGULAR_8_ANOS: "Ensino fundamental regular (8 anos)",
  ENSINO_FUNDAMENTAL_REGULAR_9_ANOS: "Ensino fundamental regular (9 anos)",
  ENSINO_FUNDAMENTAL_ESPECIAL: "Ensino fundamental especial",
  ENSINO_MEDIO_REGULAR: "Ensino médio regular",
  ENSINO_MEDIO_ESPECIAL: "Ensino médio especial",
  ENSINO_FUNDAMENTAL_EJA_SERIES_INICIAIS: "EJA fundamental (séries iniciais)",
  ENSINO_FUNDAMENTAL_EJA_SERIES_FINAIS: "EJA fundamental (séries finais)",
  ENSINO_MEDIO_EJA: "EJA médio",
  ALFABETIZACAO_PARA_ADULTOS: "Alfabetização para adultos",
  SUPERIOR_APERFEICOAMENTO_ESPECIALIZACAO_MESTRADO_DOUTORADO:
    "Superior/aperfeiçoamento/especialização/mestrado/doutorado",
  PRE_VESTIBULAR: "Pré-vestibular",
};

export type AnoSerie =
  | "PRIMEIRO"
  | "SEGUNDO"
  | "TERCEIRO"
  | "QUARTO"
  | "QUINTO"
  | "SEXTO"
  | "SETIMO"
  | "OITAVO"
  | "NONO"
  | "CURSO_NAO_SERIADO";
export const anoSerieLabel: Record<AnoSerie, string> = {
  PRIMEIRO: "1º",
  SEGUNDO: "2º",
  TERCEIRO: "3º",
  QUARTO: "4º",
  QUINTO: "5º",
  SEXTO: "6º",
  SETIMO: "7º",
  OITAVO: "8º",
  NONO: "9º",
  CURSO_NAO_SERIADO: "Curso não seriado",
};

export type CursoFrequentou =
  | "CRECHE"
  | "PRE_ESCOLA_EXCETO_CA"
  | "CLASSE_DE_ALFABETIZACAO_CA"
  | "ENSINO_FUNDAMENTAL_1A_A_4A_SERIE"
  | "ENSINO_FUNDAMENTAL_5A_A_8A_SERIE"
  | "ENSINO_FUNDAMENTAL_9_ANOS"
  | "ENSINO_FUNDAMENTAL_ESPECIAL"
  | "ENSINO_MEDIO_2_GRAU"
  | "ENSINO_MEDIO_ESPECIAL"
  | "ENSINO_FUNDAMENTAL_EJA_SERIES_INICIAIS"
  | "ENSINO_FUNDAMENTAL_EJA_SERIES_FINAIS"
  | "ENSINO_MEDIO_EJA"
  | "SUPERIOR_APERFEICOAMENTO_ESPECIALIZACAO_MESTRADO_DOUTORADO"
  | "ALFABETIZACAO_PARA_ADULTOS"
  | "NENHUM";
export const cursoFrequentouLabel: Record<CursoFrequentou, string> = {
  CRECHE: "Creche",
  PRE_ESCOLA_EXCETO_CA: "Pré-escola (exceto classe de alfabetização)",
  CLASSE_DE_ALFABETIZACAO_CA: "Classe de alfabetização (CA)",
  ENSINO_FUNDAMENTAL_1A_A_4A_SERIE: "Ensino fundamental (1ª a 4ª série)",
  ENSINO_FUNDAMENTAL_5A_A_8A_SERIE: "Ensino fundamental (5ª a 8ª série)",
  ENSINO_FUNDAMENTAL_9_ANOS: "Ensino fundamental (9 anos)",
  ENSINO_FUNDAMENTAL_ESPECIAL: "Ensino fundamental especial",
  ENSINO_MEDIO_2_GRAU: "Ensino médio (2º grau)",
  ENSINO_MEDIO_ESPECIAL: "Ensino médio especial",
  ENSINO_FUNDAMENTAL_EJA_SERIES_INICIAIS: "EJA fundamental (séries iniciais)",
  ENSINO_FUNDAMENTAL_EJA_SERIES_FINAIS: "EJA fundamental (séries finais)",
  ENSINO_MEDIO_EJA: "EJA médio",
  SUPERIOR_APERFEICOAMENTO_ESPECIALIZACAO_MESTRADO_DOUTORADO:
    "Superior/aperfeiçoamento/especialização/mestrado/doutorado",
  ALFABETIZACAO_PARA_ADULTOS: "Alfabetização para adultos",
  NENHUM: "Nenhum",
};

export type GrauInstrucao =
  | "SEM_INSTRUCAO"
  | "FUNDAMENTAL_INCOMPLETO"
  | "FUNDAMENTAL_COMPLETO"
  | "MEDIO_INCOMPLETO"
  | "MEDIO_COMPLETO"
  | "SUPERIOR_INCOMPLETO_OU_MAIS";
export const grauInstrucaoLabel: Record<GrauInstrucao, string> = {
  SEM_INSTRUCAO: "Sem instrução",
  FUNDAMENTAL_INCOMPLETO: "Fundamental incompleto",
  FUNDAMENTAL_COMPLETO: "Fundamental completo",
  MEDIO_INCOMPLETO: "Médio incompleto",
  MEDIO_COMPLETO: "Médio completo",
  SUPERIOR_INCOMPLETO_OU_MAIS: "Superior incompleto ou mais",
};

export type FuncaoTrabalho =
  | "CONTA_PROPRIA"
  | "TRABALHADOR_TEMPORARIO_RURAL"
  | "EMPREGADO_SEM_CARTEIRA"
  | "EMPREGADO_COM_CARTEIRA"
  | "DOMESTICO_SEM_CARTEIRA"
  | "DOMESTICO_COM_CARTEIRA"
  | "TRABALHADOR_NAO_REMUNERADO"
  | "MILITAR_OU_SERVIDOR_PUBLICO"
  | "EMPREGADOR"
  | "ESTAGIARIO"
  | "APRENDIZ";
export const funcaoTrabalhoLabel: Record<FuncaoTrabalho, string> = {
  CONTA_PROPRIA: "Conta própria",
  TRABALHADOR_TEMPORARIO_RURAL: "Trabalhador temporário rural",
  EMPREGADO_SEM_CARTEIRA: "Empregado sem carteira assinada",
  EMPREGADO_COM_CARTEIRA: "Empregado com carteira assinada",
  DOMESTICO_SEM_CARTEIRA: "Doméstico sem carteira assinada",
  DOMESTICO_COM_CARTEIRA: "Doméstico com carteira assinada",
  TRABALHADOR_NAO_REMUNERADO: "Trabalhador não remunerado",
  MILITAR_OU_SERVIDOR_PUBLICO: "Militar ou servidor público",
  EMPREGADOR: "Empregador",
  ESTAGIARIO: "Estagiário",
  APRENDIZ: "Aprendiz",
};

export type TempoPeriodo =
  | "ATE_SEIS_MESES"
  | "ENTRE_SEIS_MESES_E_UM_ANO"
  | "ENTRE_UM_E_DOIS_ANOS"
  | "ENTRE_DOIS_E_CINCO_ANOS"
  | "ENTRE_CINCO_E_DEZ_ANOS"
  | "MAIS_DE_DEZ_ANOS";
export const tempoPeriodoLabel: Record<TempoPeriodo, string> = {
  ATE_SEIS_MESES: "Até 6 meses",
  ENTRE_SEIS_MESES_E_UM_ANO: "Entre 6 meses e 1 ano",
  ENTRE_UM_E_DOIS_ANOS: "Entre 1 e 2 anos",
  ENTRE_DOIS_E_CINCO_ANOS: "Entre 2 e 5 anos",
  ENTRE_CINCO_E_DEZ_ANOS: "Entre 5 e 10 anos",
  MAIS_DE_DEZ_ANOS: "Mais de 10 anos",
};

export type FrequenciaContato =
  | "TODO_DIA"
  | "TODA_SEMANA"
  | "TODO_MES"
  | "TODO_ANO"
  | "QUASE_NUNCA"
  | "NUNCA";
export const frequenciaContatoLabel: Record<FrequenciaContato, string> = {
  TODO_DIA: "Todo dia",
  TODA_SEMANA: "Toda semana",
  TODO_MES: "Todo mês",
  TODO_ANO: "Todo ano",
  QUASE_NUNCA: "Quase nunca",
  NUNCA: "Nunca",
};

export type TeveEmpregoCarteiraAssinada = "SIM" | "NAO" | "NAO_SABE";
export const teveEmpregoCarteiraAssinadaLabel: Record<TeveEmpregoCarteiraAssinada, string> = {
  SIM: "Sim",
  NAO: "Não",
  NAO_SABE: "Não sabe",
};

export function labelOf<T extends string>(
  map: Record<T, string>,
  value?: T | null
): string {
  return value ? map[value] ?? value : "—";
}
