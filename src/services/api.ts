import axios from "axios";

export const api = axios.create({
  // Em desenvolvimento o .env.local aponta para http://localhost:3333;
  // sem a variável (ex.: deploy na Vercel), usa a API publicada.
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://claude-social-indol.vercel.app",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);