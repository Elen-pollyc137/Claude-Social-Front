import { api } from "./api";
import type { DashboardResumo } from "@/src/types/dashboard.type";

export async function buscarResumoDashboard(): Promise<DashboardResumo> {
  const response = await api.get<DashboardResumo>("/dashboard/resumo");
  return response.data;
}
