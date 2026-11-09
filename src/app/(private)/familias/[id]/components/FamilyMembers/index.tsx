"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, ChevronRight, Trash2 } from "lucide-react";
import { MembroFamiliar } from "@/src/types/membro.type";
import { parentescoResponsavelLabel, labelOf } from "@/src/types/cadunico.type";
import { calcularIdade } from "../format";
import Card from "@/src/components/ui/Card";
import EmptyState from "@/src/components/ui/EmptyState";
import Button from "@/src/components/ui/Button";
import { useUsuarioLogado } from "@/src/hooks/useUsuarioLogado";
import styles from "./styles.module.scss";

export default function FamilyMembers({
  familiaId,
  membros,
  limit,
  onVerTodos,
  onExcluir,
}: {
  familiaId: string;
  membros: MembroFamiliar[];
  limit?: number;
  onVerTodos?: () => void;
  onExcluir: (id: string) => void;
}) {
  const router = useRouter();
  const { podeEditar } = useUsuarioLogado();
  const visiveis = limit ? membros.slice(0, limit) : membros;
  const temMais = limit !== undefined && membros.length > limit;

  return (
    <Card
      title={`Membros da família (${membros.length})`}
      action={
        podeEditar ? (
          <Link href={`/familias/${familiaId}/membros/novo`} className={styles.btnAdd}>
            + Adicionar
          </Link>
        ) : undefined
      }
    >
      {membros.length === 0 ? (
        <EmptyState
          icon={<Users size={26} />}
          title="Nenhum membro cadastrado"
          description="Adicione as pessoas que fazem parte deste núcleo familiar."
          action={podeEditar ? <Button href={`/familias/${familiaId}/membros/novo`}>Adicionar membro</Button> : undefined}
        />
      ) : (
        <div className={styles.list}>
          {visiveis.map((m) => (
            <div
              key={m.id}
              className={styles.row}
              onClick={podeEditar ? () => router.push(`/familias/${familiaId}/membros/${m.id}/editar`) : undefined}
            >
              <div className={styles.rowInfo}>
                <span className={styles.rowName}>{m.nome}</span>
                <span className={styles.rowMeta}>
                  {labelOf(parentescoResponsavelLabel, m.parentesco)} ·{" "}
                  {calcularIdade(m.dataNascimento)}
                </span>
              </div>
              <div className={styles.rowRight}>
                {podeEditar && (
                <button
                  type="button"
                  className={styles.rowDelete}
                  title="Excluir membro"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExcluir(m.id);
                  }}
                >
                  <Trash2 size={15} />
                </button>
                )}
                {podeEditar && <ChevronRight size={18} className={styles.chevron} />}
              </div>
            </div>
          ))}

          {temMais && onVerTodos && (
            <button type="button" className={styles.verTodos} onClick={onVerTodos}>
              Ver todos os {membros.length} membros
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
