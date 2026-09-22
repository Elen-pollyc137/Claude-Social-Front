export function formatarData(data?: string): string {
  if (!data) return "";
  return new Date(data).toLocaleDateString("pt-BR");
}

export function formatarMoeda(valor?: number): string {
  if (valor === undefined || valor === null) return "";
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function calcularIdade(dataNascimento?: string): string {
  if (!dataNascimento) return "—";
  const nascimento = new Date(dataNascimento);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
  if (aindaNaoFezAniversario) idade--;
  return `${idade} anos`;
}
