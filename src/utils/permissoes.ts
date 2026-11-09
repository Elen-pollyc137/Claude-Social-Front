import type { PerfilUsuario } from "@/src/types/auth.type";

/**
 * Regras de acesso por perfil (apenas front-end: esconde telas e botões).
 * A proteção real precisa existir também na API.
 *
 * - ADMINISTRADOR: tudo.
 * - COORDENADOR: tudo, exceto criar/editar/inativar/excluir usuários.
 * - TECNICO: seções Principal e Pareceres; registra atendimentos, pareceres e agendamentos.
 * - CONSULTA: vê Principal e Pareceres, sem criar/editar/excluir nada.
 */

const PERFIS_GESTAO: PerfilUsuario[] = ["ADMINISTRADOR", "COORDENADOR"];

export function ehGestao(perfil?: PerfilUsuario | null): boolean {
  return !!perfil && PERFIS_GESTAO.includes(perfil);
}

export function podeEditar(perfil?: PerfilUsuario | null): boolean {
  return !!perfil && perfil !== "CONSULTA";
}

export function podeGerenciarUsuarios(perfil?: PerfilUsuario | null): boolean {
  return perfil === "ADMINISTRADOR";
}

/** Rotas da seção "Gestão": só Administrador e Coordenador. */
export const ROTAS_GESTAO = ["/usuarios", "/unidades", "/vinculos", "/relatorios", "/prontuarios"];

function comecaCom(pathname: string, rota: string) {
  return pathname === rota || pathname.startsWith(`${rota}/`);
}

/** Rotas de formulário de criação/edição (bloqueadas para Consulta). */
const ROTAS_ESCRITA = [
  /^\/familias\/novo\/?$/,
  /^\/familias\/[^/]+\/editar\/?$/,
  /^\/familias\/[^/]+\/membros\/novo\/?$/,
  /^\/familias\/[^/]+\/membros\/[^/]+\/editar\/?$/,
];

export function podeAcessarRota(perfil: PerfilUsuario, pathname: string): boolean {
  if (comecaCom(pathname, "/usuarios/novo")) return podeGerenciarUsuarios(perfil);
  if (ROTAS_GESTAO.some((rota) => comecaCom(pathname, rota))) return ehGestao(perfil);
  if (ROTAS_ESCRITA.some((re) => re.test(pathname))) return podeEditar(perfil);
  return true;
}
