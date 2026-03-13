import { NextResponse } from "next/server";
import { parseCSV, rowToExoplanet } from "@/lib/csvParser";

const NASA_TAP_URL =
  "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?" +
  new URLSearchParams({
    query:
      "select pl_name,disc_year,disc_facility,pl_rade,pl_orbper,pl_masse,hostname,sy_pnum,sy_snum " +
      "from pscomppars " +
      "where disc_year is not null",
    format: "csv",
  }).toString();

export const revalidate = 86400;

export async function GET() {
  try {
    const res = await fetch(NASA_TAP_URL, {
      next: { revalidate: 86400 },
      headers: { Accept: "text/csv" },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `NASA API returned ${res.status}` }, { status: 502 });
    }

    const csv = await res.text();
    const rows = parseCSV(csv);
    const planets = rows.map(rowToExoplanet).filter((p) => p.pl_name !== "");

    return NextResponse.json(planets, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    });
  } catch (err) {
    console.error("[/api/exoplanets]", err);
    return NextResponse.json({ error: "Failed to fetch exoplanet data" }, { status: 500 });
  }
}
