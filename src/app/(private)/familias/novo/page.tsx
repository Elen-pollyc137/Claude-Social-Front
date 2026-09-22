"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { criarFamilia, FamiliaBody } from "@/src/services/familias";
import { StatusFamilia } from "@/src/types/familia.type";
import {
  abastecimentoAguaLabel,
  calcamentoLabel,
  destinoLixoLabel,
  escoamentoSanitarioLabel,
  especieDomicilioLabel,
  grupoPopulacionalTradicionalLabel,
  materialParedesLabel,
  materialPisoLabel,
  simNaoLabel,
  situacaoDomicilioLabel,
  tipoIluminacaoLabel,
  type AbastecimentoAgua,
  type Calcamento,
  type DestinoLixo,
  type EscoamentoSanitario,
  type EspecieDomicilio,
  type GrupoPopulacionalTradicional,
  type MaterialParedes,
  type MaterialPiso,
  type SimNao,
  type SituacaoDomicilio,
  type TipoIluminacao,
} from "@/src/types/cadunico.type";
import styles from "../familias.module.scss";

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

  rendaTotalFamiliar: string;
  rendaMediaPerCapita: string;
  recebePbf: SimNao | "";
  riscoInsegurancaAlimentar: SimNao | "";

  situacaoDomicilio: SituacaoDomicilio | "";
  especieDomicilio: EspecieDomicilio | "";
  quantidadeComodos: string;
  quantidadeComodosDormitorio: string;
  materialPiso: MaterialPiso | "";
  materialParedes: MaterialParedes | "";
  aguaCanalizada: SimNao | "";
  abastecimentoAgua: AbastecimentoAgua | "";
  existeBanheiro: SimNao | "";
  escoamentoSanitario: EscoamentoSanitario | "";
  destinoLixo: DestinoLixo | "";
  tipoIluminacao: TipoIluminacao | "";
  calcamento: Calcamento | "";
  quantidadePessoasDomicilio: string;
  quantidadeFamiliasDomicilio: string;

  familiaIndigena: SimNao | "";
  familiaQuilombola: SimNao | "";
  grupoPopulacionalTradicional: GrupoPopulacionalTradicional | "";
  riscoViolacaoDireitos: string;

  nomeCrasCreasReferencia: string;
  nomeEstabelecimentoSaude: string;
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
  cep: "",
  endereco: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
  complemento: "",

  rendaTotalFamiliar: "",
  rendaMediaPerCapita: "",
  recebePbf: "",
  riscoInsegurancaAlimentar: "",

  situacaoDomicilio: "",
  especieDomicilio: "",
  quantidadeComodos: "",
  quantidadeComodosDormitorio: "",
  materialPiso: "",
  materialParedes: "",
  aguaCanalizada: "",
  abastecimentoAgua: "",
  existeBanheiro: "",
  escoamentoSanitario: "",
  destinoLixo: "",
  tipoIluminacao: "",
  calcamento: "",
  quantidadePessoasDomicilio: "",
  quantidadeFamiliasDomicilio: "",

  familiaIndigena: "",
  familiaQuilombola: "",
  grupoPopulacionalTradicional: "",
  riscoViolacaoDireitos: "",

  nomeCrasCreasReferencia: "",
  nomeEstabelecimentoSaude: "",
};

function numOrUndefined(v: string): number | undefined {
  if (v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function strOrUndefined<T extends string>(v: T | ""): T | undefined {
  return v === "" ? undefined : v;
}

function formToBody(form: FormData): FamiliaBody {
  return {
    responsavelNome: form.responsavelNome,
    codigoFamiliar: form.codigoFamiliar || undefined,
    responsavelCpf: form.responsavelCpf || undefined,
    responsavelNis: form.responsavelNis || undefined,
    telefone: form.telefone || undefined,
    email: form.email || undefined,
    territorio: form.territorio || undefined,
    status: form.status,
    cep: form.cep || undefined,
    endereco: form.endereco || undefined,
    numero: form.numero || undefined,
    bairro: form.bairro || undefined,
    cidade: form.cidade || undefined,
    estado: form.estado || undefined,
    complemento: form.complemento || undefined,

    rendaTotalFamiliar: numOrUndefined(form.rendaTotalFamiliar),
    rendaMediaPerCapita: numOrUndefined(form.rendaMediaPerCapita),
    recebePbf: strOrUndefined(form.recebePbf),
    riscoInsegurancaAlimentar: strOrUndefined(form.riscoInsegurancaAlimentar),

    situacaoDomicilio: strOrUndefined(form.situacaoDomicilio),
    especieDomicilio: strOrUndefined(form.especieDomicilio),
    quantidadeComodos: numOrUndefined(form.quantidadeComodos),
    quantidadeComodosDormitorio: numOrUndefined(form.quantidadeComodosDormitorio),
    materialPiso: strOrUndefined(form.materialPiso),
    materialParedes: strOrUndefined(form.materialParedes),
    aguaCanalizada: strOrUndefined(form.aguaCanalizada),
    abastecimentoAgua: strOrUndefined(form.abastecimentoAgua),
    existeBanheiro: strOrUndefined(form.existeBanheiro),
    escoamentoSanitario: strOrUndefined(form.escoamentoSanitario),
    destinoLixo: strOrUndefined(form.destinoLixo),
    tipoIluminacao: strOrUndefined(form.tipoIluminacao),
    calcamento: strOrUndefined(form.calcamento),
    quantidadePessoasDomicilio: numOrUndefined(form.quantidadePessoasDomicilio),
    quantidadeFamiliasDomicilio: numOrUndefined(form.quantidadeFamiliasDomicilio),

    familiaIndigena: strOrUndefined(form.familiaIndigena),
    familiaQuilombola: strOrUndefined(form.familiaQuilombola),
    grupoPopulacionalTradicional: strOrUndefined(form.grupoPopulacionalTradicional),
    riscoViolacaoDireitos: form.riscoViolacaoDireitos || undefined,

    nomeCrasCreasReferencia: form.nomeCrasCreasReferencia || undefined,
    nomeEstabelecimentoSaude: form.nomeEstabelecimentoSaude || undefined,
  };
}

export default function NovaFamiliaPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!form.responsavelNome.trim()) {
      setErro("Informe o nome do responsável.");
      return;
    }

    setSalvando(true);
    try {
      await criarFamilia(formToBody(form));
      router.push("/familias");
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Erro ao cadastrar família.";
      setErro(msg);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className={styles.formPage}>
      <div className={styles.formPageHeader}>
        <Link href="/familias" className={styles.btnBack}>
          ← Voltar
        </Link>
        <h1>Nova família</h1>
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

        <div className={styles.card}>
          <p className={styles.sectionTitle}>Renda e benefícios (CadÚnico)</p>
          <div className={styles.formGrid}>
            <label className={styles.label}>
              Renda total familiar (R$)
              <input
                type="number"
                step="0.01"
                min="0"
                name="rendaTotalFamiliar"
                value={form.rendaTotalFamiliar}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Renda per capita (R$)
              <input
                type="number"
                step="0.01"
                min="0"
                name="rendaMediaPerCapita"
                value={form.rendaMediaPerCapita}
                onChange={handleChange}
                className={styles.input}
              />
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
                {(Object.entries(simNaoLabel) as [SimNao, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className={styles.label}>
              Risco de insegurança alimentar
              <select
                name="riscoInsegurancaAlimentar"
                value={form.riscoInsegurancaAlimentar}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(simNaoLabel) as [SimNao, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>
          </div>
        </div>

        <div className={styles.card}>
          <p className={styles.sectionTitle}>Domicílio e moradia (CadÚnico)</p>
          <div className={styles.formGrid}>
            <label className={styles.label}>
              Situação do domicílio
              <select
                name="situacaoDomicilio"
                value={form.situacaoDomicilio}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(situacaoDomicilioLabel) as [SituacaoDomicilio, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className={styles.label}>
              Espécie do domicílio
              <select
                name="especieDomicilio"
                value={form.especieDomicilio}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(especieDomicilioLabel) as [EspecieDomicilio, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className={styles.label}>
              Qtde. de cômodos
              <input
                type="number"
                min="0"
                name="quantidadeComodos"
                value={form.quantidadeComodos}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Qtde. de dormitórios
              <input
                type="number"
                min="0"
                name="quantidadeComodosDormitorio"
                value={form.quantidadeComodosDormitorio}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Material do piso
              <select
                name="materialPiso"
                value={form.materialPiso}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(materialPisoLabel) as [MaterialPiso, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className={styles.label}>
              Material das paredes
              <select
                name="materialParedes"
                value={form.materialParedes}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(materialParedesLabel) as [MaterialParedes, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className={styles.label}>
              Água canalizada
              <select
                name="aguaCanalizada"
                value={form.aguaCanalizada}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(simNaoLabel) as [SimNao, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className={styles.label}>
              Abastecimento de água
              <select
                name="abastecimentoAgua"
                value={form.abastecimentoAgua}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(abastecimentoAguaLabel) as [AbastecimentoAgua, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className={styles.label}>
              Existe banheiro
              <select
                name="existeBanheiro"
                value={form.existeBanheiro}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(simNaoLabel) as [SimNao, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className={styles.label}>
              Escoamento sanitário
              <select
                name="escoamentoSanitario"
                value={form.escoamentoSanitario}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(escoamentoSanitarioLabel) as [EscoamentoSanitario, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className={styles.label}>
              Destino do lixo
              <select
                name="destinoLixo"
                value={form.destinoLixo}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(destinoLixoLabel) as [DestinoLixo, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className={styles.label}>
              Iluminação
              <select
                name="tipoIluminacao"
                value={form.tipoIluminacao}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(tipoIluminacaoLabel) as [TipoIluminacao, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className={styles.label}>
              Calçamento
              <select
                name="calcamento"
                value={form.calcamento}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(calcamentoLabel) as [Calcamento, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className={styles.label}>
              Pessoas no domicílio
              <input
                type="number"
                min="0"
                name="quantidadePessoasDomicilio"
                value={form.quantidadePessoasDomicilio}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Famílias no domicílio
              <input
                type="number"
                min="0"
                name="quantidadeFamiliasDomicilio"
                value={form.quantidadeFamiliasDomicilio}
                onChange={handleChange}
                className={styles.input}
              />
            </label>
          </div>
        </div>

        <div className={styles.card}>
          <p className={styles.sectionTitle}>Grupos populacionais e vulnerabilidade</p>
          <div className={styles.formGrid}>
            <label className={styles.label}>
              Família indígena
              <select
                name="familiaIndigena"
                value={form.familiaIndigena}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(simNaoLabel) as [SimNao, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className={styles.label}>
              Família quilombola
              <select
                name="familiaQuilombola"
                value={form.familiaQuilombola}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(Object.entries(simNaoLabel) as [SimNao, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className={`${styles.label} ${styles.full}`}>
              Grupo populacional tradicional
              <select
                name="grupoPopulacionalTradicional"
                value={form.grupoPopulacionalTradicional}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">Não informado</option>
                {(
                  Object.entries(grupoPopulacionalTradicionalLabel) as [
                    GrupoPopulacionalTradicional,
                    string
                  ][]
                ).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className={`${styles.label} ${styles.full}`}>
              Risco de violação de direitos
              <textarea
                name="riscoViolacaoDireitos"
                value={form.riscoViolacaoDireitos}
                onChange={handleChange}
                className={styles.textarea}
                rows={2}
              />
            </label>
          </div>
        </div>

        <div className={styles.card}>
          <p className={styles.sectionTitle}>Referência de atendimento</p>
          <div className={styles.formGrid}>
            <label className={styles.label}>
              CRAS/CREAS de referência
              <input
                name="nomeCrasCreasReferencia"
                value={form.nomeCrasCreasReferencia}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Estabelecimento de saúde
              <input
                name="nomeEstabelecimentoSaude"
                value={form.nomeEstabelecimentoSaude}
                onChange={handleChange}
                className={styles.input}
              />
            </label>
          </div>
        </div>

        {erro && <p style={{ color: "#b91c1c", marginBottom: "1rem" }}>{erro}</p>}

        <div className={styles.formFooter}>
          <Link href="/familias" className={styles.btnCancel}>
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
