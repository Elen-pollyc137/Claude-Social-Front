import "./globals.scss";
import AuthGuard from "./auth-guard";

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
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}