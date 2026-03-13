import type { Exoplanet } from "@/types/exoplanet";

export function parseCSV(raw: string): Record<string, string>[] {
  const lines = raw.split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = splitCSVLine(lines[0]);
  const results: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = splitCSVLine(line);
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j].trim()] = (values[j] ?? "").trim();
    }
    results.push(row);
  }

  return results;
}

function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

export function rowToExoplanet(row: Record<string, string>): Exoplanet {
  return {
    pl_name: row["pl_name"] ?? "",
    disc_facility: row["disc_facility"] ?? "",
    hostname: row["hostname"] ?? "",
    disc_year: parseNum(row["disc_year"]),
    pl_rade: parseNum(row["pl_rade"]),
    pl_orbper: parseNum(row["pl_orbper"]),
    pl_masse: parseNum(row["pl_masse"]),
    sy_pnum: parseNum(row["sy_pnum"]),
    sy_snum: parseNum(row["sy_snum"]),
  };
}

function parseNum(val: string | undefined): number | null {
  if (!val || val.trim() === "") return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
}
