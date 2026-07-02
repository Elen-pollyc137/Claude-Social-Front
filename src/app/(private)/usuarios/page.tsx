"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listarUsuarios, excluirUsuario } from "@/src/services/usuarios";
import { PerfilUsuario, StatusUsuario, Usuario } from "@/src/types/usuario.type";
import styles from "./usuarios.module.scss";

const perfilLabel: Record<PerfilUsuario, string> = {
  ADMINISTRADOR: "Administrador",
  COORDENADOR: "Coordenador",
  TECNICO: "Técnico",
  CONSULTA: "Consulta",
};

const statusLabel: Record<StatusUsuario, string> = {
  ATIVO: "Ativo",
  INATIVO: "Inativo",
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    setCarregando(true);
    try {
      const data = await listarUsuarios();
      setUsuarios(data);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleExcluir(id: string) {
    if (!confirm("Deseja excluir este usuário?")) return;
    await excluirUsuario(id);
    carregar();
  }

  const termo = busca.trim().toLowerCase();
  const usuariosFiltrados = termo
    ? usuarios.filter((u) => `${u.nome} ${u.email}`.toLowerCase().includes(termo))
    : usuarios;

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Usuários</h1>
        <Link href="/usuarios/novo" className={styles.btnNovo}>
          + Novo usuário
        </Link>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className={styles.inputBusca}
        />
      </div>

      <div className={styles.tableWrap}>
        {carregando ? (
          <p className={styles.empty}>Carregando…</p>
        ) : usuariosFiltrados.length === 0 ? (
          <p className={styles.empty}>Nenhum usuário encontrado.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td>{perfilLabel[usuario.perfil] ?? usuario.perfil}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        styles[`badge_${usuario.status}` as keyof typeof styles]
                      }`}
                    >
                      {statusLabel[usuario.status] ?? usuario.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/usuarios/${usuario.id}`} className={styles.view}>
                        Ver
                      </Link>
                      <button
                        className={styles.delete}
                        onClick={() => handleExcluir(usuario.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
