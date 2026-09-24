"use client";

import { useEffect, useState } from "react";
import {
  AtendimentoBody,
  criarAtendimento,
  excluirAtendimento,
  listarAtendimentos,
  obterPdfDocumento,
} from "@/src/services/atendimentos";
import { listarUsuarios } from "@/src/services/usuarios";
import { listarMembros } from "@/src/services/membros";
import { getMe } from "@/src/services/auth";
import {
  Atendimento,
  DocumentoAtendimento,
  ResultadoParecer,
  TipoBeneficioEventual,
  TipoEncaminhamento,
  documentoLabel,
  documentoPorTipo,
  resultadoParecerLabel,
  tipoAtendimentoLabel,
  tipoBeneficioEventualLabel,
  tipoEncaminhamentoLabel,
} from "@/src/types/atendimento.type";
import type { TipoAtendimento } from "@/src/types/agendamento.type";
import type { MembroFamiliar } from "@/src/types/membro.type";
import { Usuario } from "@/src/types/usuario.type";
import PdfPreviewModal from "@/src/components/ui/PdfPreviewModal";
import styles from "../familias.module.scss";

type FormData = {
  tecnicoId: string;
  tipo: TipoAtendimento;
  titulo: string;
  descricao: string;
  dataAtendimento: string;
  localAtendimento: string;
  sigiloso: boolean;
};

type ParecerForm = {
  motivoSolicitacao: string;
  situacaoSocioeconomica: string;
  situacaoMoradia: string;
  situacaoSaude: string;
  analiseTecnica: string;
  conclusao: string;
  resultado: ResultadoParecer | "";
};

type EncaminhamentoForm = {
  tipo: TipoEncaminhamento;
  membroId: string;
  orgaoDestino: string;
  motivo: string;
};

type BeneficioForm = {
  tipo: TipoBeneficioEventual;
  membroId: string;
  motivo: string;
  quantidade: string;
  valor: string;
  origem: string;
  destino: string;
  dataIda: string;
  dataVolta: string;
  acompanhanteNome: string;
  acompanhanteCpf: string;
};

type PdfAberto = { documento: DocumentoAtendimento; id: string };

function agoraLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

const initialForm = (): FormData => ({
  tecnicoId: "",
  tipo: "INDIVIDUAL",
  titulo: "",
  descricao: "",
  dataAtendimento: agoraLocal(),
  localAtendimento: "",
  sigiloso: false,
});

const initialParecer: ParecerForm = {
  motivoSolicitacao: "",
  situacaoSocioeconomica: "",
  situacaoMoradia: "",
  situacaoSaude: "",
  analiseTecnica: "",
  conclusao: "",
  resultado: "",
};

const initialEncaminhamento: EncaminhamentoForm = {
  tipo: "OUTRO",
  membroId: "",
  orgaoDestino: "",
  motivo: "",
};

const initialBeneficio: BeneficioForm = {
  tipo: "CESTA_BASICA",
  membroId: "",
  motivo: "",
  quantidade: "",
  valor: "",
  origem: "",
  destino: "",
  dataIda: "",
  dataVolta: "",
  acompanhanteNome: "",
  acompanhanteCpf: "",
};

const descricaoLabel: Partial<Record<TipoAtendimento, string>> = {
  PARECER_SOCIAL: "Relato / conteúdo do parecer",
  ENCAMINHAMENTO: "Descrição do encaminhamento",
  BENEFICIO_EVENTUAL: "Relato do atendimento",
};

function formatarDataHora(data: string): string {
  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function mensagemErro(error: unknown, padrao: string) {
  return (
    (error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message ?? padrao
  );
}

function vazioParaUndefined(valor: string) {
  return valor.trim() ? valor.trim() : undefined;
}

// Id do documento imprimível vinculado ao atendimento, se houver.
function documentoDe(a: Atendimento): PdfAberto | null {
  if (a.parecer) return { documento: "parecer", id: a.parecer.id };
  if (a.encaminhamento) return { documento: "encaminhamento", id: a.encaminhamento.id };
  if (a.beneficioEventual) return { documento: "beneficioEventual", id: a.beneficioEventual.id };
  return null;
}

export default function AtendimentosTab({ familiaId }: { familiaId: string }) {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [tecnicos, setTecnicos] = useState<Usuario[]>([]);
  const [membros, setMembros] = useState<MembroFamiliar[]>([]);
  const [usuarioLogadoId, setUsuarioLogadoId] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState<FormData>(initialForm);
  const [parecer, setParecer] = useState<ParecerForm>(initialParecer);
  const [encaminhamento, setEncaminhamento] = useState<EncaminhamentoForm>(initialEncaminhamento);
  const [beneficio, setBeneficio] = useState<BeneficioForm>(initialBeneficio);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [pdfAberto, setPdfAberto] = useState<PdfAberto | null>(null);

  const documento = documentoPorTipo[form.tipo];

  function carregar() {
    return Promise.all([
      listarAtendimentos({ familiaId }),
      listarUsuarios(),
      listarMembros({ familiaId }),
    ])
      .then(([atendimentosData, usuariosData, membrosData]) => {
        setAtendimentos(atendimentosData);
        setTecnicos(usuariosData.filter((u) => u.status === "ATIVO"));
        setMembros(membrosData);
      })
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregar();
    getMe()
      .then(({ usuario }) => setUsuarioLogadoId(usuario.id))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familiaId]);

  function abrirForm() {
    if (mostrarForm) {
      setMostrarForm(false);
      return;
    }
    // Pré-seleciona o usuário logado como técnico responsável, se estiver ativo.
    const tecnicoPadrao = tecnicos.some((t) => t.id === usuarioLogadoId) ? usuarioLogadoId : "";
    setForm({ ...initialForm(), tecnicoId: tecnicoPadrao });
    setParecer(initialParecer);
    setEncaminhamento(initialEncaminhamento);
    setBeneficio(initialBeneficio);
    setErro("");
    setMostrarForm(true);
  }

  function handleTipo(tipo: TipoAtendimento) {
    // Parecer social é sigiloso por padrão.
    setForm({ ...form, tipo, sigiloso: tipo === "PARECER_SOCIAL" ? true : form.sigiloso });
  }

  function montarPayload(): AtendimentoBody | string {
    const payload: AtendimentoBody = {
      familiaId,
      tecnicoId: form.tecnicoId,
      tipo: form.tipo,
      titulo: vazioParaUndefined(form.titulo),
      descricao: form.descricao.trim(),
      dataAtendimento: new Date(form.dataAtendimento).toISOString(),
      localAtendimento: vazioParaUndefined(form.localAtendimento),
      sigiloso: form.sigiloso,
    };

    if (documento === "parecer") {
      payload.parecer = {
        motivoSolicitacao: vazioParaUndefined(parecer.motivoSolicitacao),
        situacaoSocioeconomica: vazioParaUndefined(parecer.situacaoSocioeconomica),
        situacaoMoradia: vazioParaUndefined(parecer.situacaoMoradia),
        situacaoSaude: vazioParaUndefined(parecer.situacaoSaude),
        analiseTecnica: vazioParaUndefined(parecer.analiseTecnica),
        conclusao: vazioParaUndefined(parecer.conclusao),
        resultado: parecer.resultado || undefined,
      };
    }

    if (documento === "encaminhamento") {
      if (!encaminhamento.orgaoDestino.trim()) return "Informe o órgão de destino.";
      if (!encaminhamento.motivo.trim()) return "Informe o motivo do encaminhamento.";
      payload.encaminhamento = {
        tipo: encaminhamento.tipo,
        membroId: encaminhamento.membroId || undefined,
        orgaoDestino: encaminhamento.orgaoDestino.trim(),
        motivo: encaminhamento.motivo.trim(),
      };
    }

    if (documento === "beneficioEventual") {
      if (!beneficio.motivo.trim()) return "Informe o motivo do benefício.";
      const viagem = beneficio.tipo === "AUXILIO_VIAGEM";
      payload.beneficioEventual = {
        tipo: beneficio.tipo,
        membroId: beneficio.membroId || undefined,
        motivo: beneficio.motivo.trim(),
        quantidade: beneficio.quantidade ? Number(beneficio.quantidade) : undefined,
        valor: beneficio.valor ? Number(beneficio.valor.replace(",", ".")) : undefined,
        ...(viagem && {
          origem: vazioParaUndefined(beneficio.origem),
          destino: vazioParaUndefined(beneficio.destino),
          dataIda: beneficio.dataIda || undefined,
          dataVolta: beneficio.dataVolta || undefined,
          acompanhanteNome: vazioParaUndefined(beneficio.acompanhanteNome),
          acompanhanteCpf: vazioParaUndefined(beneficio.acompanhanteCpf),
        }),
      };
    }

    return payload;
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (!form.tecnicoId) {
      setErro("Selecione o técnico responsável.");
      return;
    }
    if (!form.descricao.trim()) {
      setErro("A descrição é obrigatória.");
      return;
    }

    const payload = montarPayload();
    if (typeof payload === "string") {
      setErro(payload);
      return;
    }

    setSalvando(true);
    try {
      const criado = await criarAtendimento(payload);
      setMostrarForm(false);
      carregar();
      // Abre o documento gerado para conferência e impressão.
      const doc = documentoDe(criado);
      if (doc) setPdfAberto(doc);
    } catch (error) {
      setErro(mensagemErro(error, "Não foi possível registrar o atendimento."));
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(id: string) {
    if (!confirm("Deseja excluir este atendimento?")) return;
    await excluirAtendimento(id);
    carregar();
  }

  function selectMembro(valor: string, onChange: (membroId: string) => void) {
    return (
      <label className={styles.label}>
        Membro beneficiado
        <select className={styles.input} value={valor} onChange={(e) => onChange(e.target.value)}>
          <option value="">Família (responsável)</option>
          {membros.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.membrosHeader}>
        <p className={styles.sectionTitle}>Atendimentos ({atendimentos.length})</p>
        <button className={styles.btnNovo} onClick={abrirForm}>
          {mostrarForm ? "Cancelar" : "+ Novo atendimento"}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSalvar} className={styles.inlineForm}>
          {erro && <p className={styles.erro}>{erro}</p>}
          <div className={styles.formGrid}>
            <label className={styles.label}>
              Técnico responsável
              <select
                className={styles.input}
                value={form.tecnicoId}
                onChange={(e) => setForm({ ...form, tecnicoId: e.target.value })}
              >
                <option value="">Selecione…</option>
                {tecnicos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Tipo
              <select
                className={styles.input}
                value={form.tipo}
                onChange={(e) => handleTipo(e.target.value as TipoAtendimento)}
              >
                {Object.entries(tipoAtendimentoLabel).map(([valor, label]) => (
                  <option key={valor} value={valor}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Data e hora
              <input
                type="datetime-local"
                className={styles.input}
                value={form.dataAtendimento}
                onChange={(e) => setForm({ ...form, dataAtendimento: e.target.value })}
              />
            </label>

            <label className={styles.label}>
              Local
              <input
                type="text"
                className={styles.input}
                value={form.localAtendimento}
                onChange={(e) => setForm({ ...form, localAtendimento: e.target.value })}
              />
            </label>

            <label className={`${styles.label} ${styles.full}`}>
              Título
              <input
                type="text"
                className={styles.input}
                value={form.titulo}
                placeholder={documento === "parecer" ? "Parecer Social" : undefined}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              />
            </label>

            <label className={`${styles.label} ${styles.full}`}>
              {descricaoLabel[form.tipo] ?? "Descrição"}
              <textarea
                className={styles.textarea}
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />
            </label>

            {documento === "parecer" && (
              <>
                <p className={`${styles.sectionTitle} ${styles.full}`}>Parecer social</p>
                {(
                  [
                    ["motivoSolicitacao", "Motivo da solicitação"],
                    ["situacaoSocioeconomica", "Situação socioeconômica"],
                    ["situacaoMoradia", "Situação de moradia"],
                    ["situacaoSaude", "Situação de saúde"],
                    ["analiseTecnica", "Análise técnica"],
                    ["conclusao", "Conclusão"],
                  ] as [keyof Omit<ParecerForm, "resultado">, string][]
                ).map(([campo, label]) => (
                  <label key={campo} className={`${styles.label} ${styles.full}`}>
                    {label}
                    <textarea
                      className={styles.textarea}
                      value={parecer[campo]}
                      onChange={(e) => setParecer({ ...parecer, [campo]: e.target.value })}
                    />
                  </label>
                ))}
                <label className={styles.label}>
                  Resultado
                  <select
                    className={styles.input}
                    value={parecer.resultado}
                    onChange={(e) =>
                      setParecer({ ...parecer, resultado: e.target.value as ResultadoParecer | "" })
                    }
                  >
                    <option value="">Não informado</option>
                    {Object.entries(resultadoParecerLabel).map(([valor, label]) => (
                      <option key={valor} value={valor}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}

            {documento === "encaminhamento" && (
              <>
                <p className={`${styles.sectionTitle} ${styles.full}`}>Encaminhamento</p>
                <label className={styles.label}>
                  Tipo de encaminhamento
                  <select
                    className={styles.input}
                    value={encaminhamento.tipo}
                    onChange={(e) =>
                      setEncaminhamento({
                        ...encaminhamento,
                        tipo: e.target.value as TipoEncaminhamento,
                      })
                    }
                  >
                    {Object.entries(tipoEncaminhamentoLabel).map(([valor, label]) => (
                      <option key={valor} value={valor}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                {selectMembro(encaminhamento.membroId, (membroId) =>
                  setEncaminhamento({ ...encaminhamento, membroId })
                )}
                <label className={`${styles.label} ${styles.full}`}>
                  Órgão de destino *
                  <input
                    type="text"
                    className={styles.input}
                    value={encaminhamento.orgaoDestino}
                    onChange={(e) =>
                      setEncaminhamento({ ...encaminhamento, orgaoDestino: e.target.value })
                    }
                  />
                </label>
                <label className={`${styles.label} ${styles.full}`}>
                  Motivo *
                  <textarea
                    className={styles.textarea}
                    value={encaminhamento.motivo}
                    onChange={(e) =>
                      setEncaminhamento({ ...encaminhamento, motivo: e.target.value })
                    }
                  />
                </label>
              </>
            )}

            {documento === "beneficioEventual" && (
              <>
                <p className={`${styles.sectionTitle} ${styles.full}`}>Benefício eventual</p>
                <label className={styles.label}>
                  Tipo de benefício
                  <select
                    className={styles.input}
                    value={beneficio.tipo}
                    onChange={(e) =>
                      setBeneficio({ ...beneficio, tipo: e.target.value as TipoBeneficioEventual })
                    }
                  >
                    {Object.entries(tipoBeneficioEventualLabel).map(([valor, label]) => (
                      <option key={valor} value={valor}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                {selectMembro(beneficio.membroId, (membroId) =>
                  setBeneficio({ ...beneficio, membroId })
                )}
                <label className={styles.label}>
                  Quantidade
                  <input
                    type="number"
                    min={1}
                    className={styles.input}
                    value={beneficio.quantidade}
                    onChange={(e) => setBeneficio({ ...beneficio, quantidade: e.target.value })}
                  />
                </label>
                <label className={styles.label}>
                  Valor (R$)
                  <input
                    type="text"
                    inputMode="decimal"
                    className={styles.input}
                    value={beneficio.valor}
                    onChange={(e) => setBeneficio({ ...beneficio, valor: e.target.value })}
                  />
                </label>
                <label className={`${styles.label} ${styles.full}`}>
                  Motivo *
                  <textarea
                    className={styles.textarea}
                    value={beneficio.motivo}
                    onChange={(e) => setBeneficio({ ...beneficio, motivo: e.target.value })}
                  />
                </label>

                {beneficio.tipo === "AUXILIO_VIAGEM" && (
                  <>
                    {(
                      [
                        ["origem", "Origem", "text"],
                        ["destino", "Destino", "text"],
                        ["dataIda", "Data de ida", "date"],
                        ["dataVolta", "Data de volta", "date"],
                        ["acompanhanteNome", "Nome do acompanhante", "text"],
                        ["acompanhanteCpf", "CPF do acompanhante", "text"],
                      ] as [keyof BeneficioForm, string, string][]
                    ).map(([campo, label, tipo]) => (
                      <label key={campo} className={styles.label}>
                        {label}
                        <input
                          type={tipo}
                          className={styles.input}
                          value={beneficio[campo]}
                          onChange={(e) => setBeneficio({ ...beneficio, [campo]: e.target.value })}
                        />
                      </label>
                    ))}
                  </>
                )}
              </>
            )}

            <label className={`${styles.label} ${styles.checkboxLabel} ${styles.full}`}>
              <input
                type="checkbox"
                checked={form.sigiloso}
                onChange={(e) => setForm({ ...form, sigiloso: e.target.checked })}
              />
              Atendimento sigiloso
            </label>
          </div>

          <div className={styles.formFooter}>
            <button type="submit" className={styles.btnSalvar} disabled={salvando}>
              {salvando
                ? "Salvando…"
                : documento
                  ? "Registrar e gerar PDF"
                  : "Registrar atendimento"}
            </button>
          </div>
        </form>
      )}

      {carregando ? (
        <p className={styles.empty}>Carregando…</p>
      ) : atendimentos.length > 0 ? (
        <div className={styles.timeline}>
          {atendimentos.map((a) => {
            const doc = documentoDe(a);
            return (
              <div className={styles.timelineItem} key={a.id}>
                <div className={styles.timelineHeader}>
                  <div>
                    <strong>{a.titulo || tipoAtendimentoLabel[a.tipo]}</strong>
                    {a.sigiloso && <span className={styles.tagSigiloso}>Sigiloso</span>}
                  </div>
                  <div className={styles.rowActions}>
                    {doc && (
                      <button className={styles.view} onClick={() => setPdfAberto(doc)}>
                        Ver PDF
                      </button>
                    )}
                    <button className={styles.delete} onClick={() => handleExcluir(a.id)}>
                      Excluir
                    </button>
                  </div>
                </div>
                <p className={styles.timelineMeta}>
                  {tipoAtendimentoLabel[a.tipo]} · {formatarDataHora(a.dataAtendimento)} ·{" "}
                  {a.tecnico.nome}
                  {a.localAtendimento && <> · {a.localAtendimento}</>}
                </p>
                <p className={styles.timelineDescricao}>{a.descricao}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className={styles.empty}>Nenhum atendimento registrado.</p>
      )}

      {pdfAberto && (
        <PdfPreviewModal
          key={pdfAberto.id}
          titulo={documentoLabel[pdfAberto.documento]}
          nomeArquivo={`${documentoLabel[pdfAberto.documento].toLowerCase().replace(/\s+/g, "-")}-${pdfAberto.id.slice(0, 8)}.pdf`}
          carregar={() => obterPdfDocumento(pdfAberto.documento, pdfAberto.id)}
          onClose={() => setPdfAberto(null)}
        />
      )}
    </div>
  );
}
