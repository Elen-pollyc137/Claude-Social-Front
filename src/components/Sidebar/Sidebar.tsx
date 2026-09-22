"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, CalendarDays, UserRound, FileText } from "lucide-react";
import styles from "./Sidebar.module.scss";

const navItems = [
  {
    label: "Principal",
    links: [
      { href: "/dashboard", label: "Visão geral", icon: LayoutGrid },
      { href: "/familias", label: "Famílias", icon: Users },
      { href: "/agendamentos", label: "Agendamentos", icon: CalendarDays },
    ],
  },
  {
    label: "Gestão",
    links: [
      { href: "/usuarios", label: "Usuários", icon: UserRound },
      { href: "/prontuarios", label: "Relatórios", icon: FileText },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>CRAS</h2>
        <span>Gestão Socioassistencial</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((group) => (
          <div key={group.label}>
            <p className={styles.navGroup}>{group.label}</p>
            {group.links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.menuItem} ${active ? styles.menuItemActive : ""}`}
                >
                  <Icon className={styles.icon} size={18} strokeWidth={2} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className={styles.footer}>v1.0 · SUAS</div>
    </aside>
  );
}
