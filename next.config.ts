import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // URL da API embutida no build. Localmente o .env.local aponta para http://localhost:3333;
  // na Vercel, sem a variável configurada, usa a API publicada.
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://claude-social-indol.vercel.app",
  },
  // Permite acessar o dev server (HMR) pelo IP da rede local
  allowedDevOrigins: ["192.168.1.107", "192.168.1.*"],
};

export default nextConfig;
