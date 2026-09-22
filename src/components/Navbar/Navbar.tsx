"use client";

import { useEffect, useState } from "react";
import { Bell, ChevronDown } from "lucide-react";
import { getMe, logout } from "@/src/services/auth";
import { Usuario } from "@/src/types/auth.type";
import DropdownMenu from "@/src/components/ui/DropdownMenu";
import styles from "./Navbar.module.scss";

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
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    getMe()
      .then((res) => setUsuario(res.usuario))
      .catch(() => {});
  }, []);

  return (
    <header className={styles.navbar}>
      <div />

      <div className={styles.right}>
        <button type="button" className={styles.iconBtn} title="Notificações">
          <Bell size={18} strokeWidth={2} />
        </button>

        {usuario && (
          <DropdownMenu
            trigger={({ onClick }) => (
              <button type="button" className={styles.userTrigger} onClick={onClick}>
                <div className={styles.avatar}>{iniciais(usuario.nome)}</div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{usuario.nome}</span>
                  <span className={styles.userPerfil}>
                    {perfilLabel[usuario.perfil] ?? usuario.perfil}
                  </span>
                </div>
                <ChevronDown size={16} className={styles.chevron} />
              </button>
            )}
          >
            <DropdownMenu.Item disabled>Minha conta</DropdownMenu.Item>
            <DropdownMenu.Item disabled>Configurações</DropdownMenu.Item>
            <DropdownMenu.Divider />
            <DropdownMenu.Item onClick={logout}>Sair</DropdownMenu.Item>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
