import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.scss";

const features = [
  {
    title: "Gestão de Famílias",
    description:
      "Cadastro completo de famílias e membros, com histórico socioeconômico centralizado e sempre atualizado.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="7" r="3" />
        <circle cx="17" cy="8" r="2.5" />
        <path d="M2 20c0-3.87 3.13-7 7-7s7 3.13 7 7H2z" />
        <path d="M17 13c2.76 0 5 2.24 5 5h-6.17A8.96 8.96 0 0 0 14 13.4C14.9 13.14 15.93 13 17 13z" />
      </svg>
    ),
  },
  {
    title: "Agendamentos",
    description:
      "Organize atendimentos e visitas com uma agenda clara, evitando conflitos e esquecimentos.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
      </svg>
    ),
  },
  {
    title: "Relatórios",
    description:
      "Gere relatórios socioassistenciais precisos para embasar decisões e prestação de contas.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8zm0-4h8v2H8z" />
      </svg>
    ),
  },
  {
    title: "Controle de Usuários",
    description:
      "Perfis de acesso e permissões para que cada equipe veja exatamente o que precisa.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4.42 3.58-8 8-8s8 3.58 8 8H4z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.brand}>
          <Image src="/logo.png" alt="" width={56} height={32} className={styles.brandLogo} priority />
          <div className={styles.brandText}>
            <strong>CRAS Digital</strong>
            <span>Gestão Socioassistencial</span>
          </div>
        </div>
        <Link href="/login" className={styles.navCta}>
          Entrar
        </Link>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <span className={styles.badge}>Sistema Único de Assistência Social</span>

          <h1 className={styles.title}>
            Gestão socioassistencial
            <br />
            <span className={styles.highlight}>simples, rápida e humana</span>
          </h1>

          <p className={styles.subtitle}>
            Centralize o cadastro de famílias, agendamentos e relatórios do CRAS
            em um único lugar, feito para o dia a dia das equipes técnicas.
          </p>

          <div className={styles.actions}>
            <Link href="/login" className={styles.primaryBtn}>
              Acessar o sistema
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a href="#recursos" className={styles.secondaryBtn}>
              Conhecer recursos
            </a>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong>+100</strong>
              <span>Famílias atendidas</span>
            </div>
            <div className={styles.stat}>
              <strong>100%</strong>
              <span>Digital e centralizado</span>
            </div>
            <div className={styles.stat}>
              <strong>24/7</strong>
              <span>Acesso disponível</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features} id="recursos">
        <div className={styles.sectionHead}>
          <h2>Tudo o que o CRAS precisa em um só sistema</h2>
          <p>
            Ferramentas pensadas para agilizar o trabalho das equipes técnicas
            e melhorar o acompanhamento das famílias.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature) => (
            <div className={styles.card} key={feature.title}>
              <div className={styles.cardIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ctaBanner}>
        <div className={styles.ctaText}>
          <h2>Pronto para começar?</h2>
          <p>Acesse sua conta e continue o acompanhamento das famílias do seu município.</p>
        </div>
        <Link href="/login" className={styles.primaryBtn}>
          Entrar no sistema
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>

      <footer className={styles.footer}>
        <span>© 2026 CRAS Digital · Prontuário SUAS</span>
        <span>Sistema de gestão familiar e atendimentos socioassistenciais</span>
      </footer>
    </main>
  );
}
