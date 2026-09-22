import styles from "./styles.module.scss";

export type FamilyTab = "visao-geral" | "membros" | "atendimentos" | "documentos";

const tabs: { value: FamilyTab; label: string }[] = [
  { value: "visao-geral", label: "Visão geral" },
  { value: "membros", label: "Membros" },
  { value: "atendimentos", label: "Atendimentos" },
  { value: "documentos", label: "Documentos" },
];

export default function FamilyTabs({
  active,
  onChange,
}: {
  active: FamilyTab;
  onChange: (tab: FamilyTab) => void;
}) {
  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={`${styles.tab} ${active === tab.value ? styles.active : ""}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
