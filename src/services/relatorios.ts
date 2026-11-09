import { api } from "./api";

export type FiltrosRelatorio = Partial<{
  inicio: string;
  fim: string;
  mes: string;
  meses: string;
  bairro: string;
  territorio: string;
  tecnicoId: string;
  status: string;
}>;

function limparFiltros(filtros: FiltrosRelatorio) {
  return Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor?.trim()));
}

// O backend responde 400 com { message } em JSON, mas como a requisição pede blob, é preciso ler o texto.
async function mensagemDeErro(error: unknown): Promise<string> {
  const response = (error as { response?: { status?: number; data?: unknown } })?.response;
  if (response?.data instanceof Blob) {
    try {
      const corpo = JSON.parse(await response.data.text());
      if (corpo?.message) return corpo.message;
    } catch {
      // corpo não é JSON
    }
  }
  if (response?.status === 403) return "Você não tem permissão para gerar este relatório.";
  return "Não foi possível gerar o relatório.";
}

// Retorna uma URL local (blob) do PDF; quem chama deve liberar com URL.revokeObjectURL.
export async function obterPdfRelatorio(id: string, filtros: FiltrosRelatorio): Promise<string> {
  try {
    const response = await api.get(`/relatorios/${id}/pdf`, {
      params: limparFiltros(filtros),
      responseType: "blob",
    });
    return window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  } catch (error) {
    throw new Error(await mensagemDeErro(error));
  }
}
