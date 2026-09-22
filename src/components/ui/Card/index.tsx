import styles from "./styles.module.scss";

export default function Card({
  title,
  action,
  children,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.card}>
      {(title || action) && (
        <div className={styles.cardHeader}>
          {title && <h2 className={styles.cardTitle}>{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
