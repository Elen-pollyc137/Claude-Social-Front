import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 32 }}>
      <h1>Prontuário SUAS</h1>

      <p>Sistema de gestão familiar e atendimentos.</p>

      <br />

      <Link href="/familias">Acessar Famílias</Link>
    </main>
  );
}