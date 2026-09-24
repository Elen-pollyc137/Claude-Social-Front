"use client";

import { useState } from "react";
import { alterarSenha, logout } from "@/src/services/auth";
import Button from "@/src/components/ui/Button";
import styles from "@/src/styles/conta.module.scss";

const initialForm = {
  senhaAtual: "",
  novaSenha: "",
  confirmarSenha: "",
};

function mensagemErro(error: unknown, padrao: string) {
  return (
    (error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message ?? padrao
  );
}

export default function ConfiguracoesPage() {
  const [form, setForm] = useState(initialForm);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSucesso("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!form.senhaAtual) {
      setErro("Informe sua senha atual.");
      return;
    }
    if (form.novaSenha.length < 6) {
      setErro("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (form.novaSenha !== form.confirmarSenha) {
      setErro("A confirmação não confere com a nova senha.");
      return;
    }
    if (form.novaSenha === form.senhaAtual) {
      setErro("A nova senha deve ser diferente da atual.");
      return;
    }

    setSalvando(true);
    try {
      await alterarSenha({ senhaAtual: form.senhaAtual, novaSenha: form.novaSenha });
      setForm(initialForm);
      setSucesso("Senha alterada com sucesso.");
    } catch (error) {
      setErro(mensagemErro(error, "Erro ao alterar a senha."));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Configurações</h1>
        <p>Gerencie a segurança e a sessão da sua conta.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.card}>
        <p className={styles.sectionTitle}>Alterar senha</p>
        <p className={styles.sectionHint}>
          Use pelo menos 6 caracteres. Você continuará conectado após a alteração.
        </p>
        <div className={styles.formGrid}>
          <label className={`${styles.label} ${styles.full}`}>
            Senha atual *
            <input
              type="password"
              name="senhaAtual"
              value={form.senhaAtual}
              onChange={handleChange}
              autoComplete="current-password"
              required
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Nova senha *
            <input
              type="password"
              name="novaSenha"
              value={form.novaSenha}
              onChange={handleChange}
              autoComplete="new-password"
              required
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Confirmar nova senha *
            <input
              type="password"
              name="confirmarSenha"
              value={form.confirmarSenha}
              onChange={handleChange}
              autoComplete="new-password"
              required
              className={styles.input}
            />
          </label>
        </div>

        <div className={styles.formFooter}>
          {erro && <span className={`${styles.feedback} ${styles.erro}`}>{erro}</span>}
          {sucesso && <span className={`${styles.feedback} ${styles.sucesso}`}>{sucesso}</span>}
          <Button type="submit" disabled={salvando}>
            {salvando ? "Salvando…" : "Alterar senha"}
          </Button>
        </div>
      </form>

      <div className={styles.card}>
        <p className={styles.sectionTitle}>Sessão</p>
        <div className={styles.row}>
          <div>
            <strong>Encerrar sessão</strong>
            <span>Sai do sistema neste navegador.</span>
          </div>
          <Button variant="danger" onClick={logout}>
            Sair
          </Button>
        </div>
      </div>
    </main>
  );
}
