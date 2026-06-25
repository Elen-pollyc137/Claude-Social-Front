"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/src/services/api"
import { Familia, StatusFamilia } from "@/src/types/familia.type";
import styles from "./familias.module.scss";

type FormData = {
  responsavelNome: string;
  codigoFamiliar: string;
  responsavelCpf: string;
  responsavelNis: string;
  telefone: string;
  email: string;
  territorio: string;
  status: StatusFamilia;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
};

const initialForm: FormData = {
  responsavelNome: "",
  codigoFamiliar: "",
  responsavelCpf: "",
  responsavelNis: "",
  telefone: "",
  email: "",
  territorio: "",
  status: "ATIVA",
  endereco: "",
  bairro: "",
  cidade: "",
  estado: "",
};

export default function FamiliasPage() {
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [form, setForm] = useState<FormData>(initialForm);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  async function carregarFamilias() {
    const response = await api.get("/familias");
    setFamilias(response.data);
  }

  useEffect(() => {
    carregarFamilias();
  }, []);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!form.responsavelNome) {
      alert("Informe o nome do responsável.");
      return;
    }

    if (editandoId) {
      await api.put(`/familias/${editandoId}`, form);
      setEditandoId(null);
    } else {
      await api.post("/familias", form);
    }

    setForm(initialForm);
    carregarFamilias();
  }

  function editarFamilia(familia: Familia) {
    setEditandoId(familia.id);

    setForm({
      responsavelNome: familia.responsavelNome ?? "",
      codigoFamiliar: familia.codigoFamiliar ?? "",
      responsavelCpf: familia.responsavelCpf ?? "",
      responsavelNis: familia.responsavelNis ?? "",
      telefone: familia.telefone ?? "",
      email: familia.email ?? "",
      territorio: familia.territorio ?? "",
      status: familia.status,
      endereco: familia.endereco ?? "",
      bairro: familia.bairro ?? "",
      cidade: familia.cidade ?? "",
      estado: familia.estado ?? "",
    });
  }

  async function excluirFamilia(id: string) {
    const confirmar = confirm("Deseja excluir esta família?");

    if (!confirmar) return;

    await api.delete(`/familias/${id}`);
    carregarFamilias();
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Famílias</h1>
      </div>

      <section className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            name="responsavelNome"
            placeholder="Responsável"
            value={form.responsavelNome}
            onChange={handleChange}
          />

          <input
            name="codigoFamiliar"
            placeholder="Código familiar"
            value={form.codigoFamiliar}
            onChange={handleChange}
          />

          <input
            name="responsavelCpf"
            placeholder="CPF"
            value={form.responsavelCpf}
            onChange={handleChange}
          />

          <input
            name="responsavelNis"
            placeholder="NIS"
            value={form.responsavelNis}
            onChange={handleChange}
          />

          <input
            name="telefone"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="territorio"
            placeholder="Território"
            value={form.territorio}
            onChange={handleChange}
          />

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="ATIVA">Ativa</option>
            <option value="INATIVA">Inativa</option>
            <option value="EM_ACOMPANHAMENTO">Em acompanhamento</option>
          </select>

          <input
            name="endereco"
            placeholder="Endereço"
            value={form.endereco}
            onChange={handleChange}
          />

          <input
            name="bairro"
            placeholder="Bairro"
            value={form.bairro}
            onChange={handleChange}
          />

          <input
            name="cidade"
            placeholder="Cidade"
            value={form.cidade}
            onChange={handleChange}
          />

          <input
            name="estado"
            placeholder="Estado"
            value={form.estado}
            onChange={handleChange}
          />

          <button type="submit">
            {editandoId ? "Atualizar" : "Cadastrar"}
          </button>
        </form>
      </section>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Responsável</th>
            <th>CPF</th>
            <th>NIS</th>
            <th>Telefone</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {familias.map((familia) => (
            <tr key={familia.id}>
              <td>{familia.responsavelNome}</td>
              <td>{familia.responsavelCpf || "-"}</td>
              <td>{familia.responsavelNis || "-"}</td>
              <td>{familia.telefone || "-"}</td>
              <td>{familia.status}</td>
              <td>
                <div className={styles.actions}>
                  <button
                    className={styles.edit}
                    onClick={() => editarFamilia(familia)}
                  >
                    Editar
                  </button>

                  <button
                    className={styles.delete}
                    onClick={() => excluirFamilia(familia.id)}
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}