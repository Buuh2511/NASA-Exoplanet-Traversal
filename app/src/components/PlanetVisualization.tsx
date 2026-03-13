"use client";

import type { Exoplanet } from "@/types/exoplanet";

interface Props {
  planets: Exoplanet[];
}

const PALETTE = [
  "#60A5FA",
  "#38BDF8",
  "#4ADE80",
  "#818CF8",
  "#F472B6",
  "#FB923C",
  "#A78BFA",
  "#34D399",
  "#FBBF24",
  "#E879F9",
];

const MIN_R = 18;
const MAX_R = 72;

function scale(value: number, min: number, max: number): number {
  if (max === min) return (MIN_R + MAX_R) / 2;
  return MIN_R + ((value - min) / (max - min)) * (MAX_R - MIN_R);
}

export default function PlanetVisualization({ planets }: Props) {
  const masses = planets.map((p) => p.pl_masse ?? 0);
  const minM = Math.min(...masses);
  const maxM = Math.max(...masses);

  return (
    <div className="card flex flex-col gap-4 p-5" style={{ minHeight: "220px" }}>
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: "var(--color-accent-400)" }}
        />
        <span className="text-sm font-semibold" style={{ color: "var(--color-surface-700)" }}>
          Mass Comparison
        </span>
        <span className="badge badge-accent ml-auto">{planets.length} planets</span>
      </div>

      <div
        className="flex flex-wrap items-end gap-3 rounded-xl px-2 py-4"
        style={{
          background:
            "linear-gradient(135deg, var(--color-surface-900) 0%, var(--color-primary-900) 100%)",
          minHeight: "160px",
        }}
      >
        {planets.map((p, i) => {
          const mass = p.pl_masse ?? 0;
          const radius = scale(mass, minM, maxM);
          const color = PALETTE[i % PALETTE.length];

          return (
            <div
              key={`${p.pl_name}-${i}`}
              className="group flex flex-col items-center gap-1.5"
              title={`${p.pl_name}\nMass: ${mass > 0 ? mass.toFixed(2) + " M⊕" : "unknown"}`}
            >
              <div
                className="cursor-default rounded-full transition-transform group-hover:scale-110"
                style={{
                  width: `${radius}px`,
                  height: `${radius}px`,
                  background: `radial-gradient(circle at 35% 35%, ${color}dd, ${color}55)`,
                  boxShadow: `0 0 ${radius / 2}px ${color}66, inset 0 -4px 8px rgba(0,0,0,0.3)`,
                  flexShrink: 0,
                }}
              />
              <span
                className="text-center font-medium opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  fontSize: "10px",
                  color: "#fff",
                  maxWidth: `${MAX_R}px`,
                  lineHeight: "1.2",
                  wordBreak: "break-all",
                }}
              >
                {p.pl_name}
              </span>
            </div>
          );
        })}
      </div>

      <div
        className="flex items-center justify-between text-xs"
        style={{ color: "var(--color-surface-400)" }}
      >
        <span>Sphere size ∝ planet mass (M⊕)</span>
        <span>Hover for details</span>
      </div>
    </div>
  );
}
