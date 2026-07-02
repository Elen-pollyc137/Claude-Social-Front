"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getMe, logout } from "@/src/services/auth";
import { Usuario } from "@/src/types/auth.type";
import styles from "./Navbar.module.scss";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/familias": "Famílias",
  "/agendamentos": "Agendamentos",
  "/usuarios": "Usuários",
  "/prontuarios": "Relatórios",
};

const perfilLabel: Record<string, string> = {
  ADMINISTRADOR: "Administrador",
  COORDENADOR: "Coordenador",
  TECNICO: "Técnico",
  CONSULTA: "Consulta",
};

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function Navbar() {
  const pathname = usePathname();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    getMe()
      .then((res) => setUsuario(res.usuario))
      .catch(() => {});
  }, []);

  const title = pageTitles[pathname] ?? "CRAS Digital";

  return (
    <header className={styles.navbar}>
      <span className={styles.pageTitle}>{title}</span>

      <div className={styles.right}>
        {usuario && (
          <div className={styles.user}>
            <div className={styles.avatar}>{iniciais(usuario.nome)}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{usuario.nome}</span>
              <span className={styles.userPerfil}>
                {perfilLabel[usuario.perfil] ?? usuario.perfil}
              </span>
            </div>
          </div>
        )}
        <button className={styles.logoutBtn} onClick={logout}>
          Sair
        </button>
      </div>
    </header>
  );
}
