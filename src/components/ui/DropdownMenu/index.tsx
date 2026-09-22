"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./styles.module.scss";

const DropdownContext = createContext<{ close: () => void } | null>(null);

export default function DropdownMenu({
  trigger,
  align = "end",
  children,
}: {
  trigger: (props: { onClick: () => void }) => React.ReactNode;
  align?: "start" | "end";
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickFora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  return (
    <div className={styles.wrap} ref={ref}>
      {trigger({ onClick: () => setOpen((v) => !v) })}
      {open && (
        <DropdownContext.Provider value={{ close: () => setOpen(false) }}>
          <div className={`${styles.menu} ${align === "start" ? styles.alignStart : styles.alignEnd}`}>
            {children}
          </div>
        </DropdownContext.Provider>
      )}
    </div>
  );
}

function Item({
  children,
  onClick,
  href,
  danger,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
  disabled?: boolean;
}) {
  const ctx = useContext(DropdownContext);
  const cls = `${styles.item} ${danger ? styles.itemDanger : ""}`;

  function handleClick() {
    onClick?.();
    ctx?.close();
  }

  if (href) {
    return (
      <Link href={href} className={cls} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={cls} onClick={handleClick} disabled={disabled}>
      {children}
    </button>
  );
}

function Divider() {
  return <div className={styles.divider} />;
}

DropdownMenu.Item = Item;
DropdownMenu.Divider = Divider;
