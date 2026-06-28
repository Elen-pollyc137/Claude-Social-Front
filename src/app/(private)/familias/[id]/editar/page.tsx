"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buscarFamilia, atualizarFamilia } from "@/src/services/familias";
import { Familia, StatusFamilia } from "@/src/types/familia.type";
import styles from "../../familias.module.scss";

type FormData = {
  responsavelNome: string;
  codigoFamiliar: string;
  responsavelCpf: string;
  responsavelNis: string;
  telefone: string;
  email: string;
  territorio: string;
  status: StatusFamilia;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento: string;
};

function familiaToForm(f: Familia): FormData {
  return {
    responsavelNome: f.responsavelNome ?? "",
    codigoFamiliar: f.codigoFamiliar ?? "",
    responsavelCpf: f.responsavelCpf ?? "",
    responsavelNis: f.responsavelNis ?? "",
    telefone: f.telefone ?? "",
    email: f.email ?? "",
    territorio: f.territorio ?? "",
    status: f.status,
    cep: f.cep ?? "",
    endereco: f.endereco ?? "",
    numero: f.numero ?? "",
    bairro: f.bairro ?? "",
    cidade: f.cidade ?? "",
    estado: f.estado ?? "",
    complemento: f.complemento ?? "",
  };
}

export default function EditarFamiliaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState<FormData | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarFamilia(id)
      .then((data) => setForm(familiaToForm(data)))
      .catch(() => router.push("/familias"))
      .finally(() => setCarregando(false));
  }, [id, router]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setErro("");

    if (!form.responsavelNome.trim()) {
      setErro("Informe o nome do responsável.");
      return;
    }

    setSalvando(true);
    try {
      await atualizarFamilia(id, form);
      router.push(`/familias/${id}`);
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Erro ao atualizar família.";
      setErro(msg);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando || !form) {
    return (
      <main className={styles.formPage}>
        <p className={styles.empty}>Carregando…</p>
      </main>
    );
  }

  return (
    <main className={styles.formPage}>
      <div className={styles.formPageHeader}>
        <Link href={`/familias/${id}`} className={styles.btnBack}>
          ← Voltar
        </Link>
        <h1>Editar família</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.card}>
          <p className={styles.sectionTitle}>Dados do responsável</p>
          <div className={styles.formGrid}>
            <label className={`${styles.label} ${styles.full}`}>
              Nome do responsável *
              <input
                name="responsavelNome"
                value={form.responsavelNome}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Código familiar
              <input
                name="codigoFamiliar"
                value={form.codigoFamiliar}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              CPF
              <input
                name="responsavelCpf"
                value={form.responsavelCpf}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              NIS
              <input
                name="responsavelNis"
                value={form.responsavelNis}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Telefone
              <input
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              E-mail
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Território
              <input
                name="territorio"
                value={form.territorio}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Status
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="ATIVA">Ativa</option>
                <option value="INATIVA">Inativa</option>
                <option value="EM_ACOMPANHAMENTO">Em acompanhamento</option>
              </select>
            </label>
          </div>
        </div>

        <div className={styles.card}>
          <p className={styles.sectionTitle}>Endereço</p>
          <div className={styles.formGrid}>
            <label className={styles.label}>
              CEP
              <input
                name="cep"
                value={form.cep}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={`${styles.label} ${styles.full}`}>
              Endereço
              <input
                name="endereco"
                value={form.endereco}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Número
              <input
                name="numero"
                value={form.numero}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Complemento
              <input
                name="complemento"
                value={form.complemento}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Bairro
              <input
                name="bairro"
                value={form.bairro}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Cidade
              <input
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Estado
              <input
                name="estado"
                value={form.estado}
                onChange={handleChange}
                maxLength={2}
                className={styles.input}
              />
            </label>
          </div>
        </div>

        {erro && <p style={{ color: "#b91c1c", marginBottom: "1rem" }}>{erro}</p>}

        <div className={styles.formFooter}>
          <Link href={`/familias/${id}`} className={styles.btnCancel}>
            Cancelar
          </Link>
          <button type="submit" className={styles.btnSalvar} disabled={salvando}>
            {salvando ? "Salvando…" : "Atualizar"}
          </button>
        </div>
      </form>
    </main>
  );
}
