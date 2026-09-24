"use client";

import { useEffect, useState } from "react";
import { getMe, atualizarMe } from "@/src/services/auth";
import type { MeResponse } from "@/src/types/auth.type";
import {
  StatusUsuario,
  perfilUsuarioLabel,
  statusUsuarioLabel,
  statusUsuarioTone,
} from "@/src/types/usuario.type";
import Badge from "@/src/components/ui/Badge";
import Button from "@/src/components/ui/Button";
import styles from "@/src/styles/conta.module.scss";

type UsuarioMe = MeResponse["usuario"];

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function mensagemErro(error: unknown, padrao: string) {
  return (
    (error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message ?? padrao
  );
}

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<UsuarioMe | null>(null);
  const [form, setForm] = useState({ nome: "", email: "" });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    getMe()
      .then(({ usuario }) => {
        setUsuario(usuario);
        setForm({ nome: usuario.nome, email: usuario.email });
      })
      .finally(() => setCarregando(false));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSucesso("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!form.nome.trim()) {
      setErro("Informe seu nome.");
      return;
    }
    if (!form.email.trim()) {
      setErro("Informe seu e-mail.");
      return;
    }

    setSalvando(true);
    try {
      const { usuario: atualizado } = await atualizarMe(form);
      setUsuario(atualizado);
      setForm({ nome: atualizado.nome, email: atualizado.email });
      setSucesso("Dados atualizados com sucesso.");
    } catch (error) {
      setErro(mensagemErro(error, "Erro ao atualizar seus dados."));
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <main className={styles.page}>
        <p className={styles.empty}>Carregando…</p>
      </main>
    );
  }

  if (!usuario) {
    return (
      <main className={styles.page}>
        <p className={styles.empty}>Não foi possível carregar seus dados.</p>
      </main>
    );
  }

  const status = usuario.status as StatusUsuario;
  const alterado =
    form.nome.trim() !== usuario.nome || form.email.trim().toLowerCase() !== usuario.email;

  return (
    <main className={styles.page}>
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>{iniciais(usuario.nome)}</div>
        <div className={styles.profileInfo}>
          <h1>{usuario.nome}</h1>
          <div className={styles.profileMeta}>
            <span>{usuario.email}</span>
            <Badge tone={statusUsuarioTone[status] ?? "neutral"} dot>
              {statusUsuarioLabel[status] ?? usuario.status}
            </Badge>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.card}>
        <p className={styles.sectionTitle}>Dados pessoais</p>
        <div className={styles.formGrid}>
          <label className={`${styles.label} ${styles.full}`}>
            Nome *
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </label>

          <label className={`${styles.label} ${styles.full}`}>
            E-mail *
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </label>
        </div>

        <div className={styles.formFooter}>
          {erro && <span className={`${styles.feedback} ${styles.erro}`}>{erro}</span>}
          {sucesso && <span className={`${styles.feedback} ${styles.sucesso}`}>{sucesso}</span>}
          <Button type="submit" disabled={salvando || !alterado}>
            {salvando ? "Salvando…" : "Salvar alterações"}
          </Button>
        </div>
      </form>

      <div className={styles.card}>
        <p className={styles.sectionTitle}>Informações da conta</p>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span>Perfil de acesso</span>
            <span>{perfilUsuarioLabel[usuario.perfil] ?? usuario.perfil}</span>
          </div>
          <div className={styles.infoItem}>
            <span>Status</span>
            <span>{statusUsuarioLabel[status] ?? usuario.status}</span>
          </div>
          <div className={styles.infoItem}>
            <span>Cadastrado em</span>
            <span>{new Date(usuario.criadoEm).toLocaleDateString("pt-BR")}</span>
          </div>
          <div className={styles.infoItem}>
            <span>Atualizado em</span>
            <span>{new Date(usuario.atualizadoEm).toLocaleDateString("pt-BR")}</span>
          </div>
        </div>
        <p className={styles.footnote}>
          Perfil e status só podem ser alterados por um administrador.
        </p>
      </div>
    </main>
  );
}
