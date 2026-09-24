import { api } from "./api";
import type {
  AlterarSenhaRequest,
  AtualizarMeRequest,
  LoginRequest,
  LoginResponse,
  MeResponse,
} from "@/src/types/auth.type";

export async function login(dados: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/login", dados);
  localStorage.setItem("access_token", response.data.token);
  return response.data;
}

export async function getMe(): Promise<MeResponse> {
  const response = await api.get<MeResponse>("/me");
  return response.data;
}

export function logout() {
  localStorage.removeItem("access_token");
  window.location.href = "/login";
}

export const USUARIO_ATUALIZADO_EVENT = "usuario-atualizado";

export async function atualizarMe(dados: AtualizarMeRequest): Promise<MeResponse> {
  const response = await api.put<MeResponse>("/me", dados);
  window.dispatchEvent(new CustomEvent(USUARIO_ATUALIZADO_EVENT, { detail: response.data.usuario }));
  return response.data;
}

export async function alterarSenha(dados: AlterarSenhaRequest): Promise<void> {
  await api.patch("/me/senha", dados);
}
