"use client";

import { useEffect, useState } from "react";
import { Download, Eye, FileText } from "lucide-react";
import { listarUsuarios } from "@/src/services/usuarios";
import { obterPdfRelatorio, type FiltrosRelatorio } from "@/src/services/relatorios";
import type { Usuario } from "@/src/types/usuario.type";
import PageHeader from "@/src/components/ui/PageHeader";
import Card from "@/src/components/ui/Card";
import Button from "@/src/components/ui/Button";
import PdfPreviewModal from "@/src/components/ui/PdfPreviewModal";
import styles from "./relatorios.module.scss";

type Opcao = { valor: string; label: string };

type Relatorio = {
  id: string;
  titulo: string;
  descricao: string;
  periodo?: boolean;
  tecnico?: boolean;
  status?: { label: string; opcoes: Opcao[] };
  mes?: boolean;
  meses?: boolean;
};

const relatorios: Relatorio[] = [
  {
    id: "resumo-mensal",
    titulo: "Resumo mensal de gestão",
    descricao: "Indicadores do mês comparados com o mês anterior e pendências.",
    tecnico: true,
    mes: true,
  },
  {
    id: "atendimentos",
    titulo: "Atendimentos por período",
    descricao: "Total e famílias distintas, por tipo e por profissional.",
    periodo: true,
    tecnico: true,
    status: {
      label: "Tipo de atendimento",
      opcoes: [
        { valor: "INDIVIDUAL", label: "Individual" },
        { valor: "VISITA_DOMICILIAR", label: "Visita domiciliar" },
        { valor: "ENCAMINHAMENTO", label: "Encaminhamento" },
        { valor: "ACOMPANHAMENTO_FAMILIAR", label: "Acompanhamento familiar" },
        { valor: "PARECER_SOCIAL", label: "Parecer social" },
        { valor: "BENEFICIO_EVENTUAL", label: "Benefício eventual" },
      ],
    },
  },
  {
    id: "familias",
    titulo: "Famílias cadastradas",
    descricao: "Lista de famílias com contagem por situação.",
    status: {
      label: "Situação",
      opcoes: [
        { valor: "ATIVA", label: "Ativa" },
        { valor: "EM_ACOMPANHAMENTO", label: "Em acompanhamento" },
        { valor: "INATIVA", label: "Inativa" },
      ],
    },
  },
  {
    id: "acompanhamentos",
    titulo: "Famílias em acompanhamento",
    descricao: "Inclusões, encerramentos e tempo médio de acompanhamento.",
    periodo: true,
  },
  {
    id: "visitas",
    titulo: "Visitas domiciliares",
    descricao: "Visitas do período, com objetivo e realização.",
    periodo: true,
    tecnico: true,
  },
  {
    id: "encaminhamentos",
    titulo: "Encaminhamentos",
    descricao: "Encaminhamentos do período e pendências com dias em aberto.",
    periodo: true,
    tecnico: true,
    status: {
      label: "Situação",
      opcoes: [
        { valor: "ABERTO", label: "Aberto" },
        { valor: "EM_ANDAMENTO", label: "Em andamento" },
        { valor: "CONCLUIDO", label: "Concluído" },
        { valor: "CANCELADO", label: "Cancelado" },
      ],
    },
  },
  {
    id: "beneficios-eventuais",
    titulo: "Benefícios eventuais",
    descricao: "Solicitados, deferidos, indeferidos, entregues e valores.",
    periodo: true,
    tecnico: true,
    status: {
      label: "Situação",
      opcoes: [
        { valor: "SOLICITADO", label: "Solicitado" },
        { valor: "DEFERIDO", label: "Deferido" },
        { valor: "INDEFERIDO", label: "Indeferido" },
        { valor: "ENTREGUE", label: "Entregue" },
        { valor: "CANCELADO", label: "Cancelado" },
      ],
    },
  },
  {
    id: "perfil-socioeconomico",
    titulo: "Perfil socioeconômico e territorial",
    descricao: "Distribuição das famílias por bairro, território e perfil.",
  },
  {
    id: "cadastros-desatualizados",
    titulo: "Cadastros a atualizar",
    descricao: "Famílias sem atualização cadastral recente ou sem data registrada.",
    meses: true,
  },
  {
    id: "agendamentos",
    titulo: "Agendamentos e comparecimento",
    descricao: "Agendamentos, faltas e comparecimento por profissional.",
    periodo: true,
    tecnico: true,
  },
  {
    id: "producao-equipe",
    titulo: "Produção da equipe",
    descricao: "Atendimentos, visitas, encaminhamentos e pareceres por profissional.",
    periodo: true,
    tecnico: true,
  },
];

type FiltrosGerais = { inicio: string; fim: string; bairro: string; territorio: string; tecnicoId: string };
type FiltrosEspecificos = { status: string; mes: string; meses: string };

const especificosVazios: FiltrosEspecificos = { status: "", mes: "", meses: "" };

function filtrosDo(relatorio: Relatorio, gerais: FiltrosGerais, especificos: FiltrosEspecificos): FiltrosRelatorio {
  return {
    bairro: gerais.bairro,
    territorio: gerais.territorio,
    ...(relatorio.periodo && { inicio: gerais.inicio, fim: gerais.fim }),
    ...(relatorio.tecnico && { tecnicoId: gerais.tecnicoId }),
    ...(relatorio.status && { status: especificos.status }),
    ...(relatorio.mes && { mes: especificos.mes }),
    ...(relatorio.meses && { meses: especificos.meses }),
  };
}

export default function RelatoriosPage() {
  const [tecnicos, setTecnicos] = useState<Usuario[]>([]);
  const [gerais, setGerais] = useState<FiltrosGerais>({ inicio: "", fim: "", bairro: "", territorio: "", tecnicoId: "" });
  const [especificos, setEspecificos] = useState<Record<string, FiltrosEspecificos>>({});
  const [visualizando, setVisualizando] = useState<Relatorio | null>(null);
  const [baixando, setBaixando] = useState<string | null>(null);
  const [erros, setErros] = useState<Record<string, string>>({});

  useEffect(() => {
    listarUsuarios()
      .then((usuarios) => setTecnicos(usuarios.filter((u) => u.status === "ATIVO")))
      .catch(() => setTecnicos([]));
  }, []);

  const periodoInvalido = !!gerais.inicio && !!gerais.fim && gerais.inicio > gerais.fim;

  function alterarGeral(campo: keyof FiltrosGerais, valor: string) {
    setGerais((atual) => ({ ...atual, [campo]: valor }));
    setErros({});
  }

  function especificosDe(id: string) {
    return especificos[id] ?? especificosVazios;
  }

  function alterarEspecifico(id: string, campo: keyof FiltrosEspecificos, valor: string) {
    setEspecificos((atual) => ({ ...atual, [id]: { ...especificosDe(id), [campo]: valor } }));
    setErros((atual) => ({ ...atual, [id]: "" }));
  }

  function carregar(relatorio: Relatorio) {
    return obterPdfRelatorio(relatorio.id, filtrosDo(relatorio, gerais, especificosDe(relatorio.id)));
  }

  async function baixar(relatorio: Relatorio) {
    setBaixando(relatorio.id);
    setErros((atual) => ({ ...atual, [relatorio.id]: "" }));
    try {
      const url = await carregar(relatorio);
      const link = document.createElement("a");
      link.href = url;
      link.download = `relatorio-${relatorio.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setErros((atual) => ({ ...atual, [relatorio.id]: (error as Error).message }));
    } finally {
      setBaixando(null);
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Relatórios"
        description="Gere os relatórios de gestão em PDF. Sem período informado, o relatório cobre o mês atual."
      />

      <Card title="Filtros gerais">
        <div className={styles.filtros}>
          <label className={styles.label}>
            Início
            <input
              type="date"
              className={styles.input}
              value={gerais.inicio}
              onChange={(e) => alterarGeral("inicio", e.target.value)}
            />
          </label>
          <label className={styles.label}>
            Fim
            <input
              type="date"
              className={styles.input}
              value={gerais.fim}
              onChange={(e) => alterarGeral("fim", e.target.value)}
            />
          </label>
          <label className={styles.label}>
            Bairro
            <input
              className={styles.input}
              value={gerais.bairro}
              placeholder="Todos"
              onChange={(e) => alterarGeral("bairro", e.target.value)}
            />
          </label>
          <label className={styles.label}>
            Território
            <input
              className={styles.input}
              value={gerais.territorio}
              placeholder="Todos"
              onChange={(e) => alterarGeral("territorio", e.target.value)}
            />
          </label>
          <label className={styles.label}>
            Profissional
            <select
              className={styles.input}
              value={gerais.tecnicoId}
              onChange={(e) => alterarGeral("tecnicoId", e.target.value)}
            >
              <option value="">Todos</option>
              {tecnicos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </label>
        </div>
        {periodoInvalido && (
          <p className={styles.erro}>A data de início deve ser anterior ou igual à data de fim.</p>
        )}
        <p className={styles.dica}>
          Período e profissional valem apenas para os relatórios que os utilizam, indicados em cada cartão.
        </p>
      </Card>

      <div className={styles.grid}>
        {relatorios.map((relatorio) => {
          const esp = especificosDe(relatorio.id);
          const bloqueado = relatorio.periodo && periodoInvalido;
          return (
            <div key={relatorio.id} className={styles.relatorio}>
              <div className={styles.relatorioTopo}>
                <span className={styles.icone}>
                  <FileText size={18} />
                </span>
                <div>
                  <h3 className={styles.titulo}>{relatorio.titulo}</h3>
                  <p className={styles.descricao}>{relatorio.descricao}</p>
                </div>
              </div>

              <div className={styles.tags}>
                {relatorio.periodo && <span className={styles.tag}>Período</span>}
                {relatorio.tecnico && <span className={styles.tag}>Profissional</span>}
                <span className={styles.tag}>Bairro / território</span>
              </div>

              {(relatorio.status || relatorio.mes || relatorio.meses) && (
                <div className={styles.especificos}>
                  {relatorio.status && (
                    <label className={styles.label}>
                      {relatorio.status.label}
                      <select
                        className={styles.input}
                        value={esp.status}
                        onChange={(e) => alterarEspecifico(relatorio.id, "status", e.target.value)}
                      >
                        <option value="">Todos</option>
                        {relatorio.status.opcoes.map((o) => (
                          <option key={o.valor} value={o.valor}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  {relatorio.mes && (
                    <label className={styles.label}>
                      Mês de referência
                      <input
                        type="month"
                        className={styles.input}
                        value={esp.mes}
                        onChange={(e) => alterarEspecifico(relatorio.id, "mes", e.target.value)}
                      />
                    </label>
                  )}
                  {relatorio.meses && (
                    <label className={styles.label}>
                      Sem atualização há mais de (meses)
                      <input
                        type="number"
                        min={1}
                        step={1}
                        className={styles.input}
                        value={esp.meses}
                        placeholder="24"
                        onChange={(e) => alterarEspecifico(relatorio.id, "meses", e.target.value)}
                      />
                    </label>
                  )}
                </div>
              )}

              {erros[relatorio.id] && <p className={styles.erro}>{erros[relatorio.id]}</p>}

              <div className={styles.acoes}>
                <Button variant="secondary" onClick={() => setVisualizando(relatorio)} disabled={bloqueado}>
                  <Eye size={16} /> Visualizar
                </Button>
                <Button
                  onClick={() => baixar(relatorio)}
                  disabled={bloqueado || baixando === relatorio.id}
                >
                  <Download size={16} /> {baixando === relatorio.id ? "Gerando…" : "Baixar PDF"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {visualizando && (
        <PdfPreviewModal
          titulo={visualizando.titulo}
          nomeArquivo={`relatorio-${visualizando.id}.pdf`}
          carregar={() => carregar(visualizando)}
          onClose={() => setVisualizando(null)}
        />
      )}
    </div>
  );
}
