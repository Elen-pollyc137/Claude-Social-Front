"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import Sidebar from "@/src/components/Sidebar/Sidebar";
import Navbar from "@/src/components/Navbar/Navbar";
import EmptyState from "@/src/components/ui/EmptyState";
import Button from "@/src/components/ui/Button";
import { UsuarioLogadoProvider, useUsuarioLogado } from "@/src/hooks/useUsuarioLogado";
import { podeAcessarRota } from "@/src/utils/permissoes";
import styles from "./shell.module.scss";

function ConteudoProtegido({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { usuario, carregando } = useUsuarioLogado();

  if (carregando || !usuario) return null;

  if (!podeAcessarRota(usuario.perfil, pathname)) {
    return (
      <EmptyState
        icon={<ShieldAlert size={26} />}
        title="Acesso não permitido"
        description="Seu perfil não tem permissão para acessar esta página."
        action={<Button href="/dashboard">Voltar para a visão geral</Button>}
      />
    );
  }

  return <>{children}</>;
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      router.replace("/login");
    } else {
      setAutorizado(true);
    }
  }, [router]);

  if (!autorizado) return null;

  return (
    <UsuarioLogadoProvider>
      <div className={styles.shell}>
        <Sidebar />
        <div className={styles.right}>
          <Navbar />
          <main className={styles.content}>
            <div className={styles.contentInner}>
              <ConteudoProtegido>{children}</ConteudoProtegido>
            </div>
          </main>
        </div>
      </div>
    </UsuarioLogadoProvider>
  );
}
