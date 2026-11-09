"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { criarUsuario } from "@/src/services/usuarios";
import { listarUnidades } from "@/src/services/unidades";
import { PerfilUsuario, StatusUsuario } from "@/src/types/usuario.type";
import { sugestoesFuncao, type Unidade } from "@/src/types/unidade.type";
import styles from "../usuarios.module.scss";

type LotacaoForm = { unidadeId: string; funcao: string };

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
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [lotacoes, setLotacoes] = useState<LotacaoForm[]>([{ unidadeId: "", funcao: "" }]);

  useEffect(() => {
    listarUnidades({ ativa: true }).then(setUnidades).catch(() => {});
  }, []);

  function alterarLotacao(indice: number, campo: keyof LotacaoForm, valor: string) {
    setLotacoes((prev) => prev.map((l, i) => (i === indice ? { ...l, [campo]: valor } : l)));
  }

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
    if (lotacoes.some((l) => !l.unidadeId || !l.funcao.trim())) {
      setErro("Informe a unidade e a função de cada vínculo.");
      return;
    }
    if (new Set(lotacoes.map((l) => l.unidadeId)).size !== lotacoes.length) {
      setErro("A mesma unidade foi informada mais de uma vez.");
      return;
    }

    setSalvando(true);
    try {
      await criarUsuario({
        ...form,
        unidades: lotacoes.map((l) => ({ unidadeId: l.unidadeId, funcao: l.funcao.trim() })),
      });
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

        <div className={styles.card}>
          <p className={styles.sectionTitle}>Unidades de atuação *</p>
          {unidades.length === 0 ? (
            <p className={styles.empty}>
              Nenhuma unidade ativa cadastrada. <Link href="/unidades">Cadastre uma unidade</Link> antes
              de criar usuários.
            </p>
          ) : (
            <>
              {lotacoes.map((lotacao, indice) => (
                <div key={indice} className={styles.lotacaoRow}>
                  <label className={styles.label}>
                    Unidade
                    <select
                      value={lotacao.unidadeId}
                      onChange={(e) => alterarLotacao(indice, "unidadeId", e.target.value)}
                      required
                      className={styles.input}
                    >
                      <option value="">Selecione…</option>
                      {unidades.map((u) => (
                        <option
                          key={u.id}
                          value={u.id}
                          disabled={lotacoes.some((l, i) => i !== indice && l.unidadeId === u.id)}
                        >
                          {u.nome} ({u.tipo})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.label}>
                    Função
                    <input
                      list="sugestoes-funcao"
                      value={lotacao.funcao}
                      onChange={(e) => alterarLotacao(indice, "funcao", e.target.value)}
                      required
                      className={styles.input}
                    />
                  </label>
                  {lotacoes.length > 1 && (
                    <button
                      type="button"
                      className={styles.btnCancel}
                      onClick={() => setLotacoes((prev) => prev.filter((_, i) => i !== indice))}
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))}
              <datalist id="sugestoes-funcao">
                {sugestoesFuncao.map((f) => (
                  <option key={f} value={f} />
                ))}
              </datalist>
              {lotacoes.length < unidades.length && (
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={() => setLotacoes((prev) => [...prev, { unidadeId: "", funcao: "" }])}
                >
                  + Adicionar unidade
                </button>
              )}
            </>
          )}
        </div>

        {erro && <p style={{ color: "var(--color-danger)", marginBottom: "1rem" }}>{erro}</p>}

        <div className={styles.formFooter}>
          <Link href="/usuarios" className={styles.btnCancel}>
            Cancelar
          </Link>
          <button
            type="submit"
            className={styles.btnSalvar}
            disabled={salvando || unidades.length === 0}
          >
            {salvando ? "Salvando…" : "Cadastrar"}
          </button>
        </div>
      </form>
    </main>
  );
}
