import { Inter } from "next/font/google";
import "@/src/app/(private)/globals.scss";

const inter = Inter({
  subsets: ["latin"],
});

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
