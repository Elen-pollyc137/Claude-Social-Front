import "./globals.scss";

export const metadata = {
  title: "Claude Social",
  description: "Sistema de gestão socioassistencial",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}