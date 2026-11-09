export function formatarDataHora(data: string): string {
  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatarData(data: string): string {
  return new Date(data).toLocaleDateString("pt-BR");
}

// Mensagem enviada pela API ({ message }) ou um texto padrão.
export function mensagemErro(error: unknown, padrao: string): string {
  return (
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? padrao
  );
}
