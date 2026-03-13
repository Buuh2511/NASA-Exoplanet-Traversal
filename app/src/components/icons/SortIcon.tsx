import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import type { ColumnKey } from "@/types/exoplanet";
import type { useTableSort } from "@/hooks/useTableSort";

interface Props {
  colKey: ColumnKey;
  sort: ReturnType<typeof useTableSort>["sort"];
}

export default function SortIcon({ colKey, sort }: Props) {
  if (sort.key !== colKey)
    return <ChevronsUpDown size={13} style={{ color: "var(--color-primary-300)" }} />;
  return sort.dir === "asc" ? (
    <ChevronUp size={13} style={{ color: "#fff" }} />
  ) : (
    <ChevronDown size={13} style={{ color: "#fff" }} />
  );
}
