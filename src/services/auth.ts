import { api } from "./api";
import type { LoginRequest, LoginResponse, MeResponse } from "@/src/types/auth.type";

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
