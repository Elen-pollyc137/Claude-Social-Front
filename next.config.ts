import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite acessar o dev server (HMR) pelo IP da rede local
  allowedDevOrigins: ["192.168.1.107", "192.168.1.*"],
};

export default nextConfig;
