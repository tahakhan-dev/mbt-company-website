/**
 * Deterministic aurora palettes for generated cover art. Everything derives
 * from a string seed so covers are stable across renders and environments.
 */
export type CoverPalette = {
  base: string;
  orbA: string;
  orbB: string;
  line: string;
  angle: number;
  /** 0..1 positions for the two orbs */
  ax: number;
  ay: number;
  bx: number;
  by: number;
  motif: "arc" | "grid" | "wave";
};

export function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const DUOS: [string, string][] = [
  ["#22d3ee", "#818cf8"], // cyan → violet
  ["#5eead4", "#22d3ee"], // teal → cyan
  ["#818cf8", "#5eead4"], // violet → teal
  ["#38bdf8", "#818cf8"], // sky → violet
  ["#2dd4bf", "#6366f1"], // teal → indigo
];

export function coverPalette(seed: string): CoverPalette {
  const h = hashSeed(seed || "mbt");
  const duo = DUOS[h % DUOS.length] ?? DUOS[0]!;
  const motifs = ["arc", "grid", "wave"] as const;
  return {
    base: "#0b0e16",
    orbA: duo[0],
    orbB: duo[1],
    line: duo[0],
    angle: (h % 70) - 35,
    ax: 0.18 + ((h >>> 3) % 40) / 100,
    ay: 0.15 + ((h >>> 6) % 35) / 100,
    bx: 0.55 + ((h >>> 9) % 35) / 100,
    by: 0.5 + ((h >>> 12) % 40) / 100,
    motif: motifs[(h >>> 15) % motifs.length] ?? "arc",
  };
}
