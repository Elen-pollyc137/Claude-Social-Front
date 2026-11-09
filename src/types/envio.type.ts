import type { BadgeTone } from "@/src/components/ui/Badge";
import type { ResultadoParecer } from "./atendimento.type";
import type { PerfilUsuario } from "./usuario.type";
import type { TipoUnidade } from "./unidade.type";

export type StatusEnvio = "ENVIADO" | "VISUALIZADO" | "RESPONDIDO" | "CONCLUIDO" | "CANCELADO";

export const statusEnvioLabel: Record<StatusEnvio, string> = {
  ENVIADO: "Enviado",
  VISUALIZADO: "Visualizado",
  RESPONDIDO: "Respondido",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
};

export const statusEnvioTone: Record<StatusEnvio, BadgeTone> = {
  ENVIADO: "warning",
  VISUALIZADO: "neutral",
  RESPONDIDO: "success",
  CONCLUIDO: "success",
  CANCELADO: "danger",
};

// Como cada ação aparece no histórico do envio.
export const acaoHistoricoLabel: Record<StatusEnvio, string> = {
  ENVIADO: "enviou o parecer",
  VISUALIZADO: "abriu o parecer",
  RESPONDIDO: "respondeu",
  CONCLUIDO: "concluiu",
  CANCELADO: "cancelou o envio",
};

type UsuarioEnvio = { id: string; nome: string; perfil: PerfilUsuario };
type UnidadeEnvio = { id: string; nome: string; tipo: TipoUnidade };

export type EnvioResumo = {
  id: string;
  parecerId: string | null;
  versao: number;
  remetenteId: string;
  destinatarioId: string;
  remetente: UsuarioEnvio;
  destinatario: UsuarioEnvio;
  unidadeOrigem: UnidadeEnvio | null;
  unidadeDestino: UnidadeEnvio;
  finalidade: string;
  mensagem: string | null;
  status: StatusEnvio;
  enviadoEm: string;
  visualizadoEm: string | null;
  respondidoEm: string | null;
  concluidoEm: string | null;
  canceladoEm: string | null;
  parecerTitulo: string;
  familiaNome: string;
};

// Cópia do parecer guardada no momento do envio.
export type CopiaParecer = {
  titulo: string;
  conteudo: string | null;
  dataParecer: string;
  sigiloso: boolean;
  motivoSolicitacao: string | null;
  situacaoSocioeconomica: string | null;
  situacaoMoradia: string | null;
  situacaoSaude: string | null;
  analiseTecnica: string | null;
  conclusao: string | null;
  resultado: ResultadoParecer | null;
  familia: {
    responsavelNome: string;
    responsavelCpf: string | null;
    responsavelNis: string | null;
    codigoFamiliar: string | null;
    endereco: string | null;
    numero: string | null;
    bairro: string | null;
    cidade: string | null;
    estado: string | null;
  };
  tecnico: { nome: string };
};

export type HistoricoEnvio = {
  id: string;
  acao: StatusEnvio;
  texto: string | null;
  criadoEm: string;
  usuario: UsuarioEnvio;
};

export type EnvioDetalhado = Omit<EnvioResumo, "parecerTitulo" | "familiaNome"> & {
  conteudo: CopiaParecer;
  historico: HistoricoEnvio[];
};
