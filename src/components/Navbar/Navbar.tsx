"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { getMe, logout, USUARIO_ATUALIZADO_EVENT } from "@/src/services/auth";
import { Usuario } from "@/src/types/auth.type";
import DropdownMenu from "@/src/components/ui/DropdownMenu";
import NotificacoesAgenda from "./NotificacoesAgenda";
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

    function handleAtualizado(e: Event) {
      setUsuario((e as CustomEvent<Usuario>).detail);
    }
    window.addEventListener(USUARIO_ATUALIZADO_EVENT, handleAtualizado);
    return () => window.removeEventListener(USUARIO_ATUALIZADO_EVENT, handleAtualizado);
  }, []);

  return (
    <header className={styles.navbar}>
      <div />

      <div className={styles.right}>
        {usuario && <NotificacoesAgenda tecnicoId={usuario.id} />}

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
            <DropdownMenu.Item href="/perfil">Minha conta</DropdownMenu.Item>
            <DropdownMenu.Item href="/configuracoes">Configurações</DropdownMenu.Item>
            <DropdownMenu.Divider />
            <DropdownMenu.Item onClick={logout}>Sair</DropdownMenu.Item>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
