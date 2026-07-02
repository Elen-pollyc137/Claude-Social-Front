"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { criarUsuario } from "@/src/services/usuarios";
import { PerfilUsuario, StatusUsuario } from "@/src/types/usuario.type";
import styles from "../usuarios.module.scss";

type FormData = {
  nome: string;
  email: string;
  senha: string;
  perfil: PerfilUsuario;
  status: StatusUsuario;
};

const initialForm: FormData = {
  nome: "",
  email: "",
  senha: "",
  perfil: "TECNICO",
  status: "ATIVO",
};

export default function NovoUsuarioPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!form.nome.trim()) {
      setErro("Informe o nome do usuário.");
      return;
    }
    if (!form.email.trim()) {
      setErro("Informe o e-mail do usuário.");
      return;
    }
    if (!form.senha || form.senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setSalvando(true);
    try {
      await criarUsuario(form);
      router.push("/usuarios");
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Erro ao cadastrar usuário.";
      setErro(msg);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className={styles.formPage}>
      <div className={styles.formPageHeader}>
        <Link href="/usuarios" className={styles.btnBack}>
          ← Voltar
        </Link>
        <h1>Novo usuário</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.card}>
          <p className={styles.sectionTitle}>Dados de acesso</p>
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

            <label className={styles.label}>
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

            <label className={styles.label}>
              Senha *
              <input
                type="password"
                name="senha"
                value={form.senha}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Perfil
              <select
                name="perfil"
                value={form.perfil}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="ADMINISTRADOR">Administrador</option>
                <option value="COORDENADOR">Coordenador</option>
                <option value="TECNICO">Técnico</option>
                <option value="CONSULTA">Consulta</option>
              </select>
            </label>

            <label className={styles.label}>
              Status
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
              </select>
            </label>
          </div>
        </div>

        {erro && <p style={{ color: "#b91c1c", marginBottom: "1rem" }}>{erro}</p>}

        <div className={styles.formFooter}>
          <Link href="/usuarios" className={styles.btnCancel}>
            Cancelar
          </Link>
          <button type="submit" className={styles.btnSalvar} disabled={salvando}>
            {salvando ? "Salvando…" : "Cadastrar"}
          </button>
        </div>
      </form>
    </main>
  );
}
