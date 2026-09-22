"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { criarMembro, MembroFamiliarBody } from "@/src/services/membros";
import { Sexo } from "@/src/types/membro.type";
import {
  certidaoRegistradaLabel,
  estadoCadastralPessoaLabel,
  frequentaEscolaLabel,
  funcaoTrabalhoLabel,
  grauInstrucaoLabel,
  parentescoResponsavelLabel,
  simNaoLabel,
  teveEmpregoCarteiraAssinadaLabel,
  type CertidaoRegistrada,
  type EstadoCadastralPessoa,
  type FrequentaEscola,
  type FuncaoTrabalho,
  type GrauInstrucao,
  type ParentescoResponsavel,
  type SimNao,
  type TeveEmpregoCarteiraAssinada,
} from "@/src/types/cadunico.type";
import styles from "../../../familias.module.scss";

type FormData = {
  nome: string;
  apelido: string;
  cpf: string;
  nis: string;
  dataNascimento: string;
  sexo: Sexo;
  parentesco: ParentescoResponsavel | "";
  nomeMae: string;
  nomePai: string;

  numeroRg: string;
  orgaoEmissorRg: string;
  ufEmissorRg: string;
  certidaoRegistrada: CertidaoRegistrada | "";
  estadoCadastral: EstadoCadastralPessoa | "";

  escolaridade: string;
  grauInstrucao: GrauInstrucao | "";
  frequentaEscola: FrequentaEscola | "";
  sabeLerEscrever: SimNao | "";

  profissao: string;
  renda: string;
  funcaoPrincipalTrabalho: FuncaoTrabalho | "";
  trabalhouSemanaPassada: SimNao | "";
  teveEmpregoCarteiraAssinada: TeveEmpregoCarteiraAssinada | "";
  recebePbf: SimNao | "";

  possuiDeficiencia: boolean;
  situacaoDeRua: SimNao | "";

  observacoes: string;
};

const initialForm: FormData = {
  nome: "",
  apelido: "",
  cpf: "",
  nis: "",
  dataNascimento: "",
  sexo: "NAO_INFORMADO",
  parentesco: "",
  nomeMae: "",
  nomePai: "",

  numeroRg: "",
  orgaoEmissorRg: "",
  ufEmissorRg: "",
  certidaoRegistrada: "",
  estadoCadastral: "",

  escolaridade: "",
  grauInstrucao: "",
  frequentaEscola: "",
  sabeLerEscrever: "",

  profissao: "",
  renda: "",
  funcaoPrincipalTrabalho: "",
  trabalhouSemanaPassada: "",
  teveEmpregoCarteiraAssinada: "",
  recebePbf: "",

  possuiDeficiencia: false,
  situacaoDeRua: "",

  observacoes: "",
};

function numOrUndefined(v: string): number | undefined {
  if (v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function strOrUndefined<T extends string>(v: T | ""): T | undefined {
  return v === "" ? undefined : v;
}

function formToBody(familiaId: string, form: FormData): MembroFamiliarBody {
  return {
    familiaId,
    nome: form.nome,
    apelido: form.apelido || undefined,
    cpf: form.cpf || undefined,
    nis: form.nis || undefined,
    dataNascimento: form.dataNascimento || undefined,
    sexo: form.sexo,
    parentesco: strOrUndefined(form.parentesco),
    nomeMae: form.nomeMae || undefined,
    nomePai: form.nomePai || undefined,

    numeroRg: form.numeroRg || undefined,
    orgaoEmissorRg: form.orgaoEmissorRg || undefined,
    ufEmissorRg: form.ufEmissorRg || undefined,
    certidaoRegistrada: strOrUndefined(form.certidaoRegistrada),
    estadoCadastral: strOrUndefined(form.estadoCadastral),

    escolaridade: form.escolaridade || undefined,
    grauInstrucao: strOrUndefined(form.grauInstrucao),
    frequentaEscola: strOrUndefined(form.frequentaEscola),
    sabeLerEscrever: strOrUndefined(form.sabeLerEscrever),

    profissao: form.profissao || undefined,
    renda: numOrUndefined(form.renda),
    funcaoPrincipalTrabalho: strOrUndefined(form.funcaoPrincipalTrabalho),
    trabalhouSemanaPassada: strOrUndefined(form.trabalhouSemanaPassada),
    teveEmpregoCarteiraAssinada: strOrUndefined(form.teveEmpregoCarteiraAssinada),
    recebePbf: strOrUndefined(form.recebePbf),

    possuiDeficiencia: form.possuiDeficiencia,
    situacaoDeRua: strOrUndefined(form.situacaoDeRua),

    observacoes: form.observacoes || undefined,
  };
}

export default function NovoMembroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!form.nome.trim()) {
      setErro("Informe o nome do membro.");
      return;
    }

    setSalvando(true);
    try {
      await criarMembro(formToBody(id, form));
      router.push(`/familias/${id}`);
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Erro ao cadastrar membro.";
      setErro(msg);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className={styles.formPage}>
      <div className={styles.formPageHeader}>
        <Link href={`/familias/${id}`} className={styles.btnBack}>
          ← Voltar
        </Link>
        <h1>Novo membro</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.card}>
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

            <label className={styles.label}>
              Apelido/nome social
              <input
                name="apelido"
                value={form.apelido}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              CPF
              <input name="cpf" value={form.cpf} onChange={handleChange} className={styles.input} />
            </label>

            <label className={styles.label}>
              NIS
              <input name="nis" value={form.nis} onChange={handleChange} className={styles.input} />
            </label>

            <label className={styles.label}>
              Data de nascimento
              <input
                type="date"
                name="dataNascimento"
                value={form.dataNascimento}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Sexo
              <select name="sexo" value={form.sexo} onChange={handleChange} className={styles.input}>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMININO">Feminino</option>
                <option value="OUTRO">Outro</option>
                <option value="NAO_INFORMADO">Não informado</option>
              </select>
            </label>

            <label className={styles.label}>
              Parentesco
              <select
                name="parentesco"
                value={form.parentesco}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(
                  Object.entries(parentescoResponsavelLabel) as [ParentescoResponsavel, string][]
                ).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Nome da mãe
              <input
                name="nomeMae"
                value={form.nomeMae}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Nome do pai
              <input
                name="nomePai"
                value={form.nomePai}
                onChange={handleChange}
                className={styles.input}
              />
            </label>
          </div>
        </div>

        <div className={styles.card}>
          <p className={styles.sectionTitle}>Documentação</p>
          <div className={styles.formGrid}>
            <label className={styles.label}>
              Estado cadastral
              <select
                name="estadoCadastral"
                value={form.estadoCadastral}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(
                  Object.entries(estadoCadastralPessoaLabel) as [EstadoCadastralPessoa, string][]
                ).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Certidão registrada
              <select
                name="certidaoRegistrada"
                value={form.certidaoRegistrada}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(certidaoRegistradaLabel) as [CertidaoRegistrada, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className={styles.label}>
              Número do RG
              <input
                name="numeroRg"
                value={form.numeroRg}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Órgão emissor
              <input
                name="orgaoEmissorRg"
                value={form.orgaoEmissorRg}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              UF emissora
              <input
                name="ufEmissorRg"
                value={form.ufEmissorRg}
                onChange={handleChange}
                maxLength={2}
                className={styles.input}
              />
            </label>
          </div>
        </div>

        <div className={styles.card}>
          <p className={styles.sectionTitle}>Educação</p>
          <div className={styles.formGrid}>
            <label className={styles.label}>
              Escolaridade
              <input
                name="escolaridade"
                value={form.escolaridade}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Grau de instrução
              <select
                name="grauInstrucao"
                value={form.grauInstrucao}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(grauInstrucaoLabel) as [GrauInstrucao, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className={styles.label}>
              Frequenta escola
              <select
                name="frequentaEscola"
                value={form.frequentaEscola}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(frequentaEscolaLabel) as [FrequentaEscola, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className={styles.label}>
              Sabe ler e escrever
              <select
                name="sabeLerEscrever"
                value={form.sabeLerEscrever}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(simNaoLabel) as [SimNao, string][]).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className={styles.card}>
          <p className={styles.sectionTitle}>Trabalho e renda</p>
          <div className={styles.formGrid}>
            <label className={styles.label}>
              Profissão
              <input
                name="profissao"
                value={form.profissao}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Renda (R$)
              <input
                type="number"
                step="0.01"
                min="0"
                name="renda"
                value={form.renda}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Função principal
              <select
                name="funcaoPrincipalTrabalho"
                value={form.funcaoPrincipalTrabalho}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(funcaoTrabalhoLabel) as [FuncaoTrabalho, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className={styles.label}>
              Trabalhou na semana passada
              <select
                name="trabalhouSemanaPassada"
                value={form.trabalhouSemanaPassada}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(simNaoLabel) as [SimNao, string][]).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Teve emprego com carteira assinada
              <select
                name="teveEmpregoCarteiraAssinada"
                value={form.teveEmpregoCarteiraAssinada}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(
                  Object.entries(teveEmpregoCarteiraAssinadaLabel) as [
                    TeveEmpregoCarteiraAssinada,
                    string
                  ][]
                ).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Recebe Bolsa Família
              <select
                name="recebePbf"
                value={form.recebePbf}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(simNaoLabel) as [SimNao, string][]).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className={styles.card}>
          <p className={styles.sectionTitle}>Vulnerabilidade</p>
          <div className={styles.formGrid}>
            <label className={`${styles.label} ${styles.checkboxLabel}`}>
              <input
                type="checkbox"
                name="possuiDeficiencia"
                checked={form.possuiDeficiencia}
                onChange={handleChange}
              />
              Possui deficiência
            </label>

            <label className={styles.label}>
              Situação de rua
              <select
                name="situacaoDeRua"
                value={form.situacaoDeRua}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(simNaoLabel) as [SimNao, string][]).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className={`${styles.label} ${styles.full}`}>
              Observações
              <textarea
                name="observacoes"
                value={form.observacoes}
                onChange={handleChange}
                className={styles.textarea}
                rows={3}
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
            {salvando ? "Salvando…" : "Cadastrar"}
          </button>
        </div>
      </form>
    </main>
  );
}
