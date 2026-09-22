import styles from "./styles.module.scss";

export default function InfoItem({ label, value }: { label: string; value?: string | null }) {
  const preenchido = Boolean(value) && value !== "—";

  return (
    <div className={styles.infoItem}>
      <span className={styles.label}>{label}</span>
      {preenchido ? (
        <span className={styles.value}>{value}</span>
      ) : (
        <span className={styles.emptyValue}>Não informado</span>
      )}
    </div>
  );
}
