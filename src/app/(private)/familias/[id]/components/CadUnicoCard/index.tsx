import { Familia } from "@/src/types/familia.type";
import {
  abastecimentoAguaLabel,
  calcamentoLabel,
  destinoLixoLabel,
  escoamentoSanitarioLabel,
  especieDomicilioLabel,
  estadoCadastralFamiliaLabel,
  faixaMesesDesatualizacaoLabel,
  faixaRendaPerCapitaLabel,
  formaColetaLabel,
  grupoPopulacionalTradicionalLabel,
  labelOf,
  materialParedesLabel,
  materialPisoLabel,
  simNaoLabel,
  situacaoDomicilioLabel,
  tipoContatoLabel,
  tipoIluminacaoLabel,
} from "@/src/types/cadunico.type";
import Card from "@/src/components/ui/Card";
import InfoItem from "../InfoItem";
import { formatarData, formatarMoeda } from "../format";
import styles from "./styles.module.scss";

export default function CadUnicoCard({ familia }: { familia: Familia }) {
  const secoes = [
    {
      titulo: "Renda e benefícios",
      subtitulo: "Informações financeiras",
      campos: [
        { label: "Renda total familiar", value: formatarMoeda(familia.rendaTotalFamiliar) },
        { label: "Renda per capita", value: formatarMoeda(familia.rendaMediaPerCapita) },
        {
          label: "Faixa de renda per capita",
          value: labelOf(faixaRendaPerCapitaLabel, familia.faixaRendaPerCapita),
        },
        { label: "Recebe Bolsa Família", value: labelOf(simNaoLabel, familia.recebePbf) },
        {
          label: "Risco de insegurança alimentar",
          value: labelOf(simNaoLabel, familia.riscoInsegurancaAlimentar),
        },
        {
          label: "Meses desde a última atualização",
          value: labelOf(faixaMesesDesatualizacaoLabel, familia.faixaMesesDesatualizacao),
        },
        { label: "Despesa com energia", value: formatarMoeda(familia.despesaEnergia) },
        { label: "Despesa com água/esgoto", value: formatarMoeda(familia.despesaAguaEsgoto) },
        { label: "Despesa com gás", value: formatarMoeda(familia.despesaGas) },
        { label: "Despesa com alimentação", value: formatarMoeda(familia.despesaAlimentacao) },
        { label: "Despesa com transporte", value: formatarMoeda(familia.despesaTransporte) },
        { label: "Despesa com aluguel", value: formatarMoeda(familia.despesaAluguel) },
        {
          label: "Despesa com medicamentos",
          value: formatarMoeda(familia.despesaMedicamentos),
        },
      ],
    },
    {
      titulo: "Domicílio e moradia",
      subtitulo: "Características do domicílio",
      campos: [
        {
          label: "Situação do domicílio",
          value: labelOf(situacaoDomicilioLabel, familia.situacaoDomicilio),
        },
        {
          label: "Espécie do domicílio",
          value: labelOf(especieDomicilioLabel, familia.especieDomicilio),
        },
        { label: "Qtde. de cômodos", value: familia.quantidadeComodos?.toString() },
        {
          label: "Qtde. de dormitórios",
          value: familia.quantidadeComodosDormitorio?.toString(),
        },
        { label: "Material do piso", value: labelOf(materialPisoLabel, familia.materialPiso) },
        {
          label: "Material das paredes",
          value: labelOf(materialParedesLabel, familia.materialParedes),
        },
        { label: "Água canalizada", value: labelOf(simNaoLabel, familia.aguaCanalizada) },
        {
          label: "Abastecimento de água",
          value: labelOf(abastecimentoAguaLabel, familia.abastecimentoAgua),
        },
        { label: "Existe banheiro", value: labelOf(simNaoLabel, familia.existeBanheiro) },
        {
          label: "Escoamento sanitário",
          value: labelOf(escoamentoSanitarioLabel, familia.escoamentoSanitario),
        },
        { label: "Destino do lixo", value: labelOf(destinoLixoLabel, familia.destinoLixo) },
        { label: "Iluminação", value: labelOf(tipoIluminacaoLabel, familia.tipoIluminacao) },
        { label: "Calçamento", value: labelOf(calcamentoLabel, familia.calcamento) },
        {
          label: "Pessoas no domicílio",
          value: familia.quantidadePessoasDomicilio?.toString(),
        },
        {
          label: "Famílias no domicílio",
          value: familia.quantidadeFamiliasDomicilio?.toString(),
        },
        {
          label: "Internados 0-17 anos",
          value: familia.quantidadeInternados0a17?.toString(),
        },
        {
          label: "Internados 18-64 anos",
          value: familia.quantidadeInternados18a64?.toString(),
        },
        {
          label: "Internados 65+ anos",
          value: familia.quantidadeInternados65Mais?.toString(),
        },
      ],
    },
    {
      titulo: "Grupos populacionais e vulnerabilidades",
      subtitulo: "Grupos populacionais e risco",
      campos: [
        { label: "Família indígena", value: labelOf(simNaoLabel, familia.familiaIndigena) },
        { label: "Povo indígena", value: familia.nomePovoIndigena },
        {
          label: "Reside em reserva indígena",
          value: labelOf(simNaoLabel, familia.resideReservaIndigena),
        },
        { label: "Reserva indígena", value: familia.nomeReservaIndigena },
        { label: "Família quilombola", value: labelOf(simNaoLabel, familia.familiaQuilombola) },
        { label: "Comunidade quilombola", value: familia.nomeComunidadeQuilombola },
        {
          label: "Grupo populacional tradicional",
          value: labelOf(grupoPopulacionalTradicionalLabel, familia.grupoPopulacionalTradicional),
        },
        { label: "Risco de violação de direitos", value: familia.riscoViolacaoDireitos },
      ],
    },
    {
      titulo: "Referência de atendimento",
      subtitulo: "Estabelecimentos e contatos",
      campos: [
        { label: "CRAS/CREAS de referência", value: familia.nomeCrasCreasReferencia },
        { label: "Estabelecimento de saúde", value: familia.nomeEstabelecimentoSaude },
        {
          label: "Contato 1",
          value: familia.telefoneContato1
            ? `(${familia.dddContato1 ?? "—"}) ${familia.telefoneContato1} — ${labelOf(
                tipoContatoLabel,
                familia.tipoContato1
              )}`
            : undefined,
        },
        {
          label: "Contato 2",
          value: familia.telefoneContato2
            ? `(${familia.dddContato2 ?? "—"}) ${familia.telefoneContato2} — ${labelOf(
                tipoContatoLabel,
                familia.tipoContato2
              )}`
            : undefined,
        },
      ],
    },
    {
      titulo: "Informações do CadÚnico",
      subtitulo: "Cadastro e coleta",
      campos: [
        {
          label: "Estado cadastral",
          value: labelOf(estadoCadastralFamiliaLabel, familia.estadoCadastral),
        },
        { label: "Forma de coleta", value: labelOf(formaColetaLabel, familia.formaColeta) },
        { label: "Data de cadastramento", value: formatarData(familia.dataCadastramento) },
        {
          label: "Última atualização cadastral",
          value: formatarData(familia.dataUltimaAtualizacaoCadastral),
        },
        { label: "Data da entrevista", value: formatarData(familia.dataEntrevista) },
        { label: "Entrevistador", value: familia.nomeEntrevistador },
        { label: "Referência Cadastro Único", value: familia.referenciaCadastroUnico },
        {
          label: "Referência Programa Bolsa Família",
          value: familia.referenciaProgramaBolsaFamilia,
        },
      ],
    },
  ];

  return (
    <Card title="Cadastro Único">
      <div className={styles.list}>
        {secoes.map((secao) => (
          <details key={secao.titulo} className={styles.item}>
            <summary className={styles.summary}>
              <span>
                <strong>{secao.titulo}</strong>
                <span className={styles.subtitulo}>{secao.subtitulo}</span>
              </span>
            </summary>
            <div className={styles.grid}>
              {secao.campos.map((campo) => (
                <InfoItem key={campo.label} label={campo.label} value={campo.value} />
              ))}
            </div>
          </details>
        ))}
      </div>
    </Card>
  );
}
