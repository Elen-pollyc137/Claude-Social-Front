import { api } from "./api";
import type {
  PerfilUsuario,
  StatusUsuario,
  Usuario,
  UsuarioDetalhado,
} from "@/src/types/usuario.type";

export type UsuarioBody = {
  nome: string;
  email: string;
  senha: string;
  perfil: PerfilUsuario;
  status?: StatusUsuario;
};

export async function listarUsuarios(): Promise<Usuario[]> {
  const response = await api.get<Usuario[]>("/usuarios");
  return response.data;
}

export async function buscarUsuario(id: string): Promise<UsuarioDetalhado> {
  const response = await api.get<UsuarioDetalhado>(`/usuarios/${id}`);
  return response.data;
}

export async function criarUsuario(dados: UsuarioBody): Promise<Usuario> {
  const response = await api.post<Usuario>("/usuarios", dados);
  return response.data;
}

export async function atualizarUsuario(
  id: string,
  dados: Partial<UsuarioBody>
): Promise<Usuario> {
  const response = await api.put<Usuario>(`/usuarios/${id}`, dados);
  return response.data;
}

export async function alterarStatusUsuario(
  id: string,
  status: StatusUsuario
): Promise<Usuario> {
  const response = await api.patch<Usuario>(`/usuarios/${id}/status`, { status });
  return response.data;
}

export async function excluirUsuario(id: string): Promise<void> {
  await api.delete(`/usuarios/${id}`);
}
