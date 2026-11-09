"use client";

import { createContext, createElement, useContext, useEffect, useState } from "react";
import { getMe, USUARIO_ATUALIZADO_EVENT } from "@/src/services/auth";
import type { Usuario } from "@/src/types/auth.type";
import { ehGestao, podeEditar, podeGerenciarUsuarios } from "@/src/utils/permissoes";

type UsuarioLogadoContexto = {
  usuario: Usuario | null;
  carregando: boolean;
};

const Contexto = createContext<UsuarioLogadoContexto>({ usuario: null, carregando: true });

/** Busca o usuário logado uma vez e compartilha com toda a área privada. */
export function UsuarioLogadoProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    getMe()
      .then(({ usuario }) => setUsuario(usuario))
      .catch(() => {})
      .finally(() => setCarregando(false));

    function handleAtualizado(e: Event) {
      const atualizado = (e as CustomEvent<Partial<Usuario>>).detail;
      setUsuario((atual) => (atual ? { ...atual, ...atualizado } : atual));
    }
    window.addEventListener(USUARIO_ATUALIZADO_EVENT, handleAtualizado);
    return () => window.removeEventListener(USUARIO_ATUALIZADO_EVENT, handleAtualizado);
  }, []);

  return createElement(Contexto.Provider, { value: { usuario, carregando } }, children);
}

export function useUsuarioLogado() {
  const { usuario, carregando } = useContext(Contexto);
  const perfil = usuario?.perfil;

  return {
    usuario,
    carregando,
    ehGestao: ehGestao(perfil),
    podeEditar: podeEditar(perfil),
    podeGerenciarUsuarios: podeGerenciarUsuarios(perfil),
  };
}
