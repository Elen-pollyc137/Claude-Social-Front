"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/src/components/Sidebar/Sidebar";
import Navbar from "@/src/components/Navbar/Navbar";
import styles from "./shell.module.scss";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      router.replace("/login");
    } else {
      setAutorizado(true);
    }
  }, [router]);

  if (!autorizado) return null;

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.right}>
        <Navbar />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
