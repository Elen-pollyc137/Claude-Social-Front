"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  buscarUsuario,
  excluirUsuario,
  alterarStatusUsuario,
} from "@/src/services/usuarios";
import {
  PerfilUsuario,
  StatusUsuario,
  UsuarioDetalhado,
} from "@/src/types/usuario.type";
import styles from "../usuarios.module.scss";

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

type MovimentacaoItem = {
  id: string;
  tipo: string;
  titulo: string;
  data: string;
};

function montarMovimentacao(usuario: UsuarioDetalhado): MovimentacaoItem[] {
  const itens: MovimentacaoItem[] = [
    ...usuario.agendamentos.map((a) => ({
      id: `agendamento-${a.id}`,
      tipo: "Agendamento",
      titulo: a.titulo || `Agendamento (${a.tipo})`,
      data: a.dataHora,
    })),
    ...usuario.atendimentos.map((a) => ({
      id: `atendimento-${a.id}`,
      tipo: "Atendimento",
      titulo: a.titulo || a.descricao,
      data: a.dataAtendimento,
    })),
    ...usuario.visitas.map((v) => ({
      id: `visita-${v.id}`,
      tipo: "Visita domiciliar",
      titulo: v.objetivo,
      data: v.dataVisita,
    })),
    ...usuario.encaminhamentos.map((e) => ({
      id: `encaminhamento-${e.id}`,
      tipo: "Encaminhamento",
      titulo: `${e.orgaoDestino} — ${e.motivo}`,
      data: e.dataEncaminhamento,
    })),
    ...usuario.pareceres.map((p) => ({
      id: `parecer-${p.id}`,
      tipo: "Parecer",
      titulo: p.titulo,
      data: p.dataParecer,
    })),
    ...usuario.prontuariosCriados.map((p) => ({
      id: `prontuario-${p.id}`,
      tipo: "Prontuário criado",
      titulo: "Prontuário de família",
      data: p.criadoEm,
    })),
  ];

  return itens.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}

function infoItem(label: string, value?: string | null) {
  return (
    <div className={styles.infoItem}>
      <span>{label}</span>
      <span>{value || "—"}</span>
    </div>
  );
}

export default function UsuarioDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioDetalhado | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    buscarUsuario(id)
      .then(setUsuario)
      .catch(() => router.push("/usuarios"))
      .finally(() => setCarregando(false));
  }, [id, router]);

  async function handleExcluir() {
    if (!confirm("Deseja excluir este usuário?")) return;
    await excluirUsuario(id);
    router.push("/usuarios");
  }

  async function handleAlternarStatus() {
    if (!usuario) return;
    setProcessando(true);
    try {
      const novoStatus: StatusUsuario = usuario.status === "ATIVO" ? "INATIVO" : "ATIVO";
      const atualizado = await alterarStatusUsuario(id, novoStatus);
      setUsuario({ ...usuario, status: atualizado.status });
    } finally {
      setProcessando(false);
    }
  }

  if (carregando) {
    return (
      <main className={styles.detailPage}>
        <p className={styles.empty}>Carregando…</p>
      </main>
    );
  }

  if (!usuario) return null;

  const movimentacao = montarMovimentacao(usuario);

  return (
    <main className={styles.detailPage}>
      <div className={styles.detailHeader}>
        <div>
          <Link href="/usuarios" className={styles.btnBack}>
            ← Usuários
          </Link>
          <h1>{usuario.nome}</h1>
          <span style={{ fontSize: "0.875rem", color: "#64748b" }}>{usuario.email}</span>
        </div>
        <div className={styles.detailActions}>
          <span
            className={`${styles.badge} ${
              styles[`badge_${usuario.status}` as keyof typeof styles]
            }`}
          >
            {statusLabel[usuario.status]}
          </span>
          <button
            className={styles.btnEdit}
            onClick={handleAlternarStatus}
            disabled={processando}
          >
            {usuario.status === "ATIVO" ? "Inativar" : "Ativar"}
          </button>
          <button className={styles.btnDelete} onClick={handleExcluir}>
            Excluir
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.sectionTitle}>Dados do usuário</p>
        <div className={styles.infoGrid}>
          {infoItem("Perfil", perfilLabel[usuario.perfil] ?? usuario.perfil)}
          {infoItem("Status", statusLabel[usuario.status])}
          {infoItem("Cadastrado em", new Date(usuario.criadoEm).toLocaleDateString("pt-BR"))}
          {infoItem(
            "Atualizado em",
            new Date(usuario.atualizadoEm).toLocaleDateString("pt-BR")
          )}
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.sectionTitle}>Movimentação ({movimentacao.length})</p>
        {movimentacao.length === 0 ? (
          <p className={styles.empty}>Nenhuma movimentação registrada.</p>
        ) : (
          <ul className={styles.timeline}>
            {movimentacao.map((item) => (
              <li key={item.id} className={styles.timelineItem}>
                <span className={styles.timelineTag}>{item.tipo}</span>
                <span className={styles.timelineTitle}>{item.titulo}</span>
                <span className={styles.timelineDate}>
                  {new Date(item.data).toLocaleDateString("pt-BR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
