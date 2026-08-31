import type { Capabilities, Tier } from "./types";

/** Pure classifier — unit-tested; detectCapabilities() feeds it real probes. */
export function classifyTier(input: {
  webgl2: boolean;
  webgl1: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  deviceMemoryGb: number | undefined;
}): Tier {
  if (input.reducedMotion || input.saveData) return "C";
  if (!input.webgl2 && !input.webgl1) return "C";
  if (!input.webgl2) return "B";
  if (input.deviceMemoryGb !== undefined && input.deviceMemoryGb < 4) return "B";
  return "A";
}

export function detectCapabilities(): Capabilities {
  const probe = document.createElement("canvas");
  let webgl2 = false;
  let webgl1 = false;
  try {
    webgl2 = probe.getContext("webgl2") !== null;
    webgl1 = webgl2 || probe.getContext("webgl") !== null;
  } catch {
    // Blocked context (e.g. fingerprinting protection) → Tier C.
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  const tier = classifyTier({
    webgl2,
    webgl1,
    reducedMotion,
    saveData: nav.connection?.saveData === true,
    deviceMemoryGb: nav.deviceMemory,
  });

  return {
    tier,
    webgl2,
    reducedMotion,
    coarsePointer,
    dprCap: tier === "A" ? 1.5 : 1,
  };
}
