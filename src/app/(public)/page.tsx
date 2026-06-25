import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: 32 }}>
      <h1>Prontuário SUAS</h1>
      <p>Sistema de gestão familiar e atendimentos socioassistenciais.</p>
      <br />
      <Link href="/login">Entrar</Link>
    </main>
  );
}
