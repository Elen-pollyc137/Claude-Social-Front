export type PerfilUsuario = "ADMINISTRADOR" | "COORDENADOR" | "TECNICO" | "CONSULTA";
export type StatusUsuario = "ATIVO" | "INATIVO";

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  status: StatusUsuario;
  criadoEm: string;
  atualizadoEm: string;
};

export type AtendimentoResumo = {
  id: string;
  familiaId: string;
  tipo: string;
  titulo?: string;
  descricao: string;
  dataAtendimento: string;
};

export type ParecerResumo = {
  id: string;
  familiaId: string;
  titulo: string;
  conteudo: string;
  dataParecer: string;
};

export type VisitaDomiciliarResumo = {
  id: string;
  familiaId: string;
  dataVisita: string;
  objetivo: string;
  realizada: boolean;
};

export type EncaminhamentoResumo = {
  id: string;
  familiaId: string;
  orgaoDestino: string;
  motivo: string;
  status: string;
  dataEncaminhamento: string;
};

export type ProntuarioResumo = {
  id: string;
  familiaId: string;
  criadoEm: string;
};

export type AgendamentoResumo = {
  id: string;
  familiaId: string;
  tipo: string;
  titulo?: string;
  dataHora: string;
  status: string;
};

export type UsuarioDetalhado = Usuario & {
  atendimentos: AtendimentoResumo[];
  pareceres: ParecerResumo[];
  visitas: VisitaDomiciliarResumo[];
  encaminhamentos: EncaminhamentoResumo[];
  prontuariosCriados: ProntuarioResumo[];
  agendamentos: AgendamentoResumo[];
};
