export type TipoDocumento = {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
};

export type Documento = {
  id: string;
  familiaId: string;
  tipoDocumentoId?: string;
  tipoDocumento?: TipoDocumento;
  nomeArquivo: string;
  caminhoArquivo: string;
  tipoMime?: string;
  tamanho?: number;
  descricao?: string;
  criadoEm: string;
};

export function formatarTamanhoArquivo(bytes?: number): string {
  if (!bytes) return "—";
  const unidades = ["B", "KB", "MB", "GB"];
  let valor = bytes;
  let i = 0;
  while (valor >= 1024 && i < unidades.length - 1) {
    valor /= 1024;
    i++;
  }
  return `${valor.toFixed(valor < 10 && i > 0 ? 1 : 0)} ${unidades[i]}`;
}
