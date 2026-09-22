import { Familia } from "@/src/types/familia.type";
import Card from "@/src/components/ui/Card";
import InfoItem from "../InfoItem";
import styles from "./styles.module.scss";

export default function FamilyDataCard({ familia }: { familia: Familia }) {
  const enderecoLinha =
    [familia.endereco, familia.numero].filter(Boolean).join(", ") +
    (familia.complemento ? ` - ${familia.complemento}` : "");
  const cidadeUf = [familia.cidade, familia.estado].filter(Boolean).join(" - ");

  const temEndereco = Boolean(enderecoLinha || familia.bairro || cidadeUf);

  return (
    <Card title="Dados da família">
      <div className={styles.fields}>
        <InfoItem label="CPF" value={familia.responsavelCpf} />
        <InfoItem label="NIS" value={familia.responsavelNis} />
        <InfoItem label="Telefone" value={familia.telefone} />
        <InfoItem label="E-mail" value={familia.email} />
        {familia.territorio && <InfoItem label="Território" value={familia.territorio} />}

        <div className={styles.addressItem}>
          <span className={styles.label}>Endereço</span>
          {temEndereco ? (
            <div className={styles.addressLines}>
              {enderecoLinha && <span>{enderecoLinha}</span>}
              {familia.bairro && <span>{familia.bairro}</span>}
              {cidadeUf && <span>{cidadeUf}</span>}
            </div>
          ) : (
            <span className={styles.emptyValue}>Não informado</span>
          )}
        </div>
      </div>
    </Card>
  );
}
