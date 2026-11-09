import { api } from "./api";
import type { EnvioDetalhado, EnvioResumo, StatusEnvio } from "@/src/types/envio.type";

// Disparado quando algo muda na caixa de entrada, para o contador do menu se atualizar.
export const ENVIOS_ATUALIZADOS_EVENT = "envios-atualizados";

function avisarAtualizacao() {
  window.dispatchEvent(new Event(ENVIOS_ATUALIZADOS_EVENT));
}

export type EnvioBody = {
  destinatarioId: string;
  unidadeDestinoId: string;
  unidadeOrigemId?: string;
  finalidade: string;
  mensagem?: string;
};

function paramsStatus(status?: StatusEnvio[]) {
  return status?.length ? { status: status.join(",") } : undefined;
}

export async function enviarParecer(parecerId: string, dados: EnvioBody): Promise<EnvioResumo> {
  const response = await api.post<EnvioResumo>(`/pareceres/${parecerId}/envios`, dados);
  return response.data;
}

export async function listarEnviosDoParecer(parecerId: string): Promise<EnvioResumo[]> {
  const response = await api.get<EnvioResumo[]>(`/pareceres/${parecerId}/envios`);
  return response.data;
}

export async function listarRecebidos(status?: StatusEnvio[]): Promise<EnvioResumo[]> {
  const response = await api.get<EnvioResumo[]>("/envios-pareceres/recebidos", { params: paramsStatus(status) });
  return response.data;
}

export async function listarEnviados(status?: StatusEnvio[]): Promise<EnvioResumo[]> {
  const response = await api.get<EnvioResumo[]>("/envios-pareceres/enviados", { params: paramsStatus(status) });
  return response.data;
}

export async function listarTodosEnvios(status?: StatusEnvio[]): Promise<EnvioResumo[]> {
  const response = await api.get<EnvioResumo[]>("/envios-pareceres", { params: paramsStatus(status) });
  return response.data;
}

export async function contarNaoLidos(): Promise<number> {
  const response = await api.get<{ total: number }>("/envios-pareceres/nao-lidos");
  return response.data.total;
}

// Abrir como destinatário marca o envio como visualizado.
export async function buscarEnvio(id: string): Promise<EnvioDetalhado> {
  const response = await api.get<EnvioDetalhado>(`/envios-pareceres/${id}`);
  avisarAtualizacao();
  return response.data;
}

export async function acaoEnvio(
  id: string,
  acao: "responder" | "concluir" | "cancelar",
  texto?: string
): Promise<EnvioResumo> {
  const response = await api.post<EnvioResumo>(`/envios-pareceres/${id}/${acao}`, { texto });
  avisarAtualizacao();
  return response.data;
}

// Retorna uma URL local (blob) do PDF; quem chama deve liberar com URL.revokeObjectURL.
export async function obterPdfEnvio(id: string): Promise<string> {
  const response = await api.get(`/envios-pareceres/${id}/pdf`, { responseType: "blob" });
  return window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
}
