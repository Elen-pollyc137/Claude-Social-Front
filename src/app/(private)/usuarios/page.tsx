"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, MoreHorizontal, Trash2, UserRound } from "lucide-react";
import { listarUsuarios, excluirUsuario } from "@/src/services/usuarios";
import { Usuario, perfilUsuarioLabel, statusUsuarioLabel, statusUsuarioTone } from "@/src/types/usuario.type";
import PageHeader from "@/src/components/ui/PageHeader";
import Button from "@/src/components/ui/Button";
import Badge from "@/src/components/ui/Badge";
import EmptyState from "@/src/components/ui/EmptyState";
import DropdownMenu from "@/src/components/ui/DropdownMenu";
import styles from "./usuarios.module.scss";

export default function UsuariosPage() {
  const router = useRouter();
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
      <PageHeader
        title="Usuários"
        description="Gerencie usuários e permissões de acesso"
        action={<Button href="/usuarios/novo">+ Novo usuário</Button>}
      />

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className={styles.inputBusca}
        />
      </div>

      {!carregando && (
        <p className={styles.resultCount}>
          {usuariosFiltrados.length} {usuariosFiltrados.length === 1 ? "usuário" : "usuários"}
        </p>
      )}

      <div className={styles.tableWrap}>
        {carregando ? (
          <p className={styles.empty}>Carregando…</p>
        ) : usuariosFiltrados.length === 0 ? (
          <EmptyState icon={<UserRound size={26} />} title="Nenhum usuário encontrado" />
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <tr
                  key={usuario.id}
                  className={styles.clickableRow}
                  onClick={() => router.push(`/usuarios/${usuario.id}`)}
                >
                  <td>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td>{perfilUsuarioLabel[usuario.perfil] ?? usuario.perfil}</td>
                  <td>
                    <Badge tone={statusUsuarioTone[usuario.status]} dot>
                      {statusUsuarioLabel[usuario.status] ?? usuario.status}
                    </Badge>
                  </td>
                  <td className={styles.actionsCell} onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu
                      trigger={({ onClick }) => (
                        <button type="button" className={styles.rowMenuTrigger} onClick={onClick}>
                          <MoreHorizontal size={16} />
                        </button>
                      )}
                    >
                      <DropdownMenu.Item href={`/usuarios/${usuario.id}`}>
                        <Eye size={15} /> Visualizar
                      </DropdownMenu.Item>
                      <DropdownMenu.Divider />
                      <DropdownMenu.Item danger onClick={() => handleExcluir(usuario.id)}>
                        <Trash2 size={15} /> Excluir
                      </DropdownMenu.Item>
                    </DropdownMenu>
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
