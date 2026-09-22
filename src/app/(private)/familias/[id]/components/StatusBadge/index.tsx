import { StatusFamilia, statusFamiliaLabel, statusFamiliaTone } from "@/src/types/familia.type";
import Badge from "@/src/components/ui/Badge";

export default function StatusBadge({ status }: { status: StatusFamilia }) {
  return (
    <Badge tone={statusFamiliaTone[status]} dot>
      {statusFamiliaLabel[status]}
    </Badge>
  );
}
