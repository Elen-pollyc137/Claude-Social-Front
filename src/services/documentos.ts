import { api } from "./api";
import type { Documento, TipoDocumento } from "@/src/types/documento.type";

export type DocumentoFiltros = {
  familiaId?: string;
  tipoDocumentoId?: string;
};

export type UploadDocumentoBody = {
  familiaId: string;
  arquivo: File;
  tipoDocumentoId?: string;
  descricao?: string;
};

export async function listarDocumentos(filtros?: DocumentoFiltros): Promise<Documento[]> {
  const response = await api.get<Documento[]>("/documentos", { params: filtros });
  return response.data;
}

export async function uploadDocumento(dados: UploadDocumentoBody): Promise<Documento> {
  const formData = new FormData();
  formData.append("familiaId", dados.familiaId);
  formData.append("arquivo", dados.arquivo);
  if (dados.tipoDocumentoId) formData.append("tipoDocumentoId", dados.tipoDocumentoId);
  if (dados.descricao) formData.append("descricao", dados.descricao);

  const response = await api.post<Documento>("/documentos/upload", formData);
  return response.data;
}

export async function excluirDocumento(id: string): Promise<void> {
  await api.delete(`/documentos/${id}`);
}

export async function listarTiposDocumentos(): Promise<TipoDocumento[]> {
  const response = await api.get<TipoDocumento[]>("/tipos-documentos");
  return response.data;
}

export async function baixarDocumento(id: string, nomeArquivo: string): Promise<void> {
  const response = await api.get(`/documentos/${id}/arquivo`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function visualizarDocumento(id: string, tipoMime?: string): Promise<string> {
  const response = await api.get(`/documentos/${id}/arquivo`, { responseType: "blob" });
  const blob = tipoMime ? new Blob([response.data], { type: tipoMime }) : new Blob([response.data]);
  return window.URL.createObjectURL(blob);
}
