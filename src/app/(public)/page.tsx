import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.scss";

const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const features = [
  {
    title: "Gestão de Famílias",
    description:
      "Cadastro completo de famílias e membros, com histórico socioeconômico centralizado e sempre atualizado.",
    destaque: true,
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
    description: "Agenda clara para atendimentos e visitas, sem conflitos nem esquecimentos.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
      </svg>
    ),
  },
  {
    title: "Prontuário SUAS",
    description: "Atendimentos, pareceres e encaminhamentos registrados no histórico de cada família.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8zm0-4h8v2H8z" />
      </svg>
    ),
  },
  {
    title: "Relatórios",
    description: "Relatórios socioassistenciais precisos para embasar decisões e prestação de contas.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" />
      </svg>
    ),
  },
  {
    title: "Controle de Acesso",
    description: "Perfis e permissões para que cada equipe veja exatamente o que precisa.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
      </svg>
    ),
  },
];

const passos = [
  { numero: "01", titulo: "Cadastre a família", texto: "Registre os membros, a renda e a situação socioeconômica." },
  { numero: "02", titulo: "Acompanhe o atendimento", texto: "Agende, registre visitas, pareceres e encaminhamentos." },
  { numero: "03", titulo: "Gere relatórios", texto: "Tenha os indicadores do CRAS prontos em poucos cliques." },
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.brand}>
            <Image src="/logo-cras.png" alt="" width={44} height={33} priority />
            <span className={styles.brandText}>
              <strong>CRAS Digital</strong>
              <small>Gestão Socioassistencial</small>
            </span>
          </Link>

          <nav className={styles.navLinks}>
            <a href="#recursos">Recursos</a>
            <a href="#como-funciona">Como funciona</a>
          </nav>

          <Link href="/login" className={styles.navCta}>
            Entrar
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden />

        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <span className={styles.badge}>Sistema Único de Assistência Social</span>

            <h1 className={styles.title}>
              Cuidar de cada família,
              <span className={styles.highlight}> conectando toda a rede.</span>
            </h1>

            <p className={styles.subtitle}>
              Cadastro de famílias, prontuário SUAS, agendamentos e relatórios do CRAS
              em um só lugar, feito para o dia a dia das equipes técnicas.
            </p>

            <div className={styles.actions}>
              <Link href="/login" className={styles.primaryBtn}>
                Acessar o sistema <Arrow />
              </Link>
              <a href="#recursos" className={styles.secondaryBtn}>
                Conhecer recursos
              </a>
            </div>

            <ul className={styles.checks}>
              <li>100% digital</li>
              <li>Acesso seguro por perfil</li>
              <li>Disponível 24/7</li>
            </ul>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.visualCard}>
              <Image
                src="/logo-cras.png"
                alt="Logo CRAS Digital"
                width={493}
                height={372}
                className={styles.visualLogo}
                priority
              />
            </div>

            <div className={`${styles.floatCard} ${styles.floatTop}`}>
              <span className={styles.floatIcon}>✓</span>
              <div>
                <strong>Família cadastrada</strong>
                <small>Prontuário criado agora</small>
              </div>
            </div>

            <div className={`${styles.floatCard} ${styles.floatBottom}`}>
              <span className={`${styles.floatIcon} ${styles.floatIconAlt}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                </svg>
              </span>
              <div>
                <strong>Visita domiciliar</strong>
                <small>Amanhã · 09:30</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="recursos">
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>Recursos</span>
          <h2>Tudo o que o CRAS precisa em um só sistema</h2>
          <p>Ferramentas pensadas para agilizar o trabalho das equipes e melhorar o acompanhamento das famílias.</p>
        </div>

        <div className={styles.bento}>
          {features.map((feature) => (
            <article
              key={feature.title}
              className={`${styles.card} ${feature.destaque ? styles.cardFeatured : ""}`}
            >
              <div className={styles.cardIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.steps}`} id="como-funciona">
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>Como funciona</span>
          <h2>Do cadastro ao relatório em três passos</h2>
        </div>

        <ol className={styles.stepList}>
          {passos.map((passo) => (
            <li key={passo.numero} className={styles.step}>
              <span className={styles.stepNum}>{passo.numero}</span>
              <h3>{passo.titulo}</h3>
              <p>{passo.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.ctaWrap}>
        <div className={styles.ctaBanner}>
          <div className={styles.ctaText}>
            <h2>Pronto para começar?</h2>
            <p>Acesse sua conta e continue o acompanhamento das famílias do seu município.</p>
          </div>
          <Link href="/login" className={styles.ctaBtn}>
            Entrar no sistema <Arrow />
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <Image src="/logo-cras.png" alt="" width={32} height={24} />
          <span>© 2026 CRAS Digital · Prontuário SUAS</span>
        </div>
        <span>Sistema de gestão familiar e atendimentos socioassistenciais</span>
      </footer>
    </main>
  );
}
