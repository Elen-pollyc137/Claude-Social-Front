"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutGrid,
  Users,
  CalendarDays,
  UserRound,
  FileText,
  BarChart3,
  Inbox,
  Send,
  Building2,
  Network,
} from "lucide-react";
import { contarNaoLidos, ENVIOS_ATUALIZADOS_EVENT } from "@/src/services/envios";
import { useUsuarioLogado } from "@/src/hooks/useUsuarioLogado";
import { podeAcessarRota } from "@/src/utils/permissoes";
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
    label: "Pareceres",
    links: [
      { href: "/caixa-entrada", label: "Caixa de entrada", icon: Inbox },
      { href: "/enviados", label: "Enviados", icon: Send },
    ],
  },
  {
    label: "Gestão",
    links: [
      { href: "/usuarios", label: "Usuários", icon: UserRound },
      { href: "/unidades", label: "Unidades", icon: Building2 },
      { href: "/vinculos", label: "Vínculos", icon: Network },
      { href: "/relatorios", label: "Relatórios", icon: FileText },
      { href: "/prontuarios", label: "Indicadores", icon: BarChart3 },
    ],
  },
];

const INTERVALO_NAO_LIDOS_MS = 60 * 1000;

export default function Sidebar() {
  const pathname = usePathname();
  const [naoLidos, setNaoLidos] = useState(0);
  const { usuario } = useUsuarioLogado();

  // Mostra só os links que o perfil pode acessar; grupos vazios somem.
  const gruposVisiveis = usuario
    ? navItems
        .map((group) => ({
          ...group,
          links: group.links.filter((link) => podeAcessarRota(usuario.perfil, link.href)),
        }))
        .filter((group) => group.links.length > 0)
    : [];

  // Contador da caixa de entrada: atualiza periodicamente, ao navegar e quando um envio muda.
  useEffect(() => {
    const atualizar = () => contarNaoLidos().then(setNaoLidos).catch(() => {});
    atualizar();
    const intervalo = window.setInterval(atualizar, INTERVALO_NAO_LIDOS_MS);
    window.addEventListener(ENVIOS_ATUALIZADOS_EVENT, atualizar);
    return () => {
      window.clearInterval(intervalo);
      window.removeEventListener(ENVIOS_ATUALIZADOS_EVENT, atualizar);
    };
  }, [pathname]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Image src="/logo.png" alt="" width={56} height={32} className={styles.logoImg} priority />
        <div>
          <h2>CRAS</h2>
          <span>Gestão Socioassistencial</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {gruposVisiveis.map((group) => (
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
                  {link.href === "/caixa-entrada" && naoLidos > 0 && (
                    <span className={styles.contador} aria-label={`${naoLidos} não lidos`}>
                      {naoLidos}
                    </span>
                  )}
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
