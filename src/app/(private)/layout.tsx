import { Inter } from "next/font/google";
import "./globals.scss";
import AuthGuard from "./auth-guard";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Claude Social",
  description: "Sistema de gestão socioassistencial",
};

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}