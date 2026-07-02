"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.scss";

const navItems = [
  {
    label: "Principal",
    links: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: (
          <svg className={styles.icon} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        ),
      },
      {
        href: "/familias",
        label: "Famílias",
        icon: (
          <svg className={styles.icon} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="7" r="3" />
            <circle cx="17" cy="8" r="2.5" />
            <path d="M2 20c0-3.87 3.13-7 7-7s7 3.13 7 7H2z" />
            <path d="M17 13c2.76 0 5 2.24 5 5h-6.17A8.96 8.96 0 0 0 14 13.4C14.9 13.14 15.93 13 17 13z" />
          </svg>
        ),
      },
      {
        href: "/agendamentos",
        label: "Agendamentos",
        icon: (
          <svg className={styles.icon} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Gestão",
    links: [
      {
        href: "/usuarios",
        label: "Usuários",
        icon: (
          <svg className={styles.icon} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4.42 3.58-8 8-8s8 3.58 8 8H4z" />
          </svg>
        ),
      },
      {
        href: "/prontuarios",
        label: "Relatórios",
        icon: (
          <svg className={styles.icon} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8zm0-4h8v2H8z" />
          </svg>
        ),
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>CRAS Digital</h2>
        <span>Gestão Socioassistencial</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((group) => (
          <div key={group.label}>
            <p className={styles.navGroup}>{group.label}</p>
            {group.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.active : ""}`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.footer}>v1.0 · SUAS</div>
    </aside>
  );
}
