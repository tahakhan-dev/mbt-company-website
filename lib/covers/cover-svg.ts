import { coverPalette, hashSeed } from "./palette";

/**
 * String builder for the deterministic "product artifact" cover art (T26).
 * Emits a complete SVG document; GeneratedCover serves it as an <img> data
 * URI so the browser rasterizes it on the decode path instead of the main
 * thread (inline-SVG first-raster measured 50-90ms per cover at 4× CPU —
 * the act-5 entry jank cluster in Gate S).
 */

const W = 1200;
const H = 800;

type Palette = ReturnType<typeof coverPalette>;

const SURFACE = "#0d1119";
const SURFACE_2 = "#131a29";
const INK_DIM = "rgba(238,242,248,0.32)";
const INK_FAINT = "rgba(154,166,184,0.35)";
const INK_GHOST = "rgba(154,166,184,0.22)";
const HAIR = "rgba(255,255,255,0.09)";

function rnd(seed: string, i: number, mod: number, min = 0): number {
  return min + (hashSeed(`${seed}:${i}`) % mod);
}

const rect = (
  x: number,
  y: number,
  w: number,
  h: number,
  rx: number,
  fill: string,
  extra = "",
) => `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${rx}" fill="${fill}" ${extra}/>`;

const circle = (cx: number, cy: number, r: number, fill: string, extra = "") =>
  `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="${fill}" ${extra}/>`;

function textBars(
  seed: string,
  x: number,
  y: number,
  rows: number,
  width: number,
  gap = 22,
  h = 9,
): string {
  let out = "";
  for (let i = 0; i < rows; i++) {
    out += rect(x, y + i * gap, width * (0.45 + rnd(seed, i + 40, 50) / 100), h, h / 2, INK_FAINT);
  }
  return out;
}

function dashboard(seed: string, p: Palette, x: number, y: number, w: number, _h: number): string {
  const pad = 26;
  const tileW = (w - pad * 2 - 32) / 3;
  const sparkY = y + 210;
  let out = "";
  for (let i = 0; i < 3; i++) {
    const tx = x + pad + i * (tileW + 16);
    out += rect(tx, y + 24, tileW, 130, 14, SURFACE_2, `stroke="${HAIR}"`);
    out += rect(tx + 18, y + 46, tileW * 0.5, 8, 4, INK_FAINT);
    out += rect(
      tx + 18,
      y + 74,
      tileW * (0.3 + rnd(seed, i + 12, 35) / 100),
      26,
      6,
      i === 0 ? p.orbA : INK_DIM,
      i === 0 ? 'fill-opacity="0.9"' : "",
    );
  }
  const pts: string[] = [];
  for (let i = 0; i < 12; i++) {
    const px = x + pad + (i * (w - pad * 2)) / 11;
    const py = sparkY + 120 - (30 + rnd(seed, i + 60, 80));
    pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  out += `<polyline points="${pts.join(" ")}" fill="none" stroke="${p.orbA}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  out += `<polyline points="${x + 26},${sparkY + 140} ${pts.join(" ")} ${x + w - 26},${sparkY + 140}" fill="${p.orbA}" fill-opacity="0.08" stroke="none"/>`;
  for (let i = 0; i < 3; i++) {
    const ry = sparkY + 170 + i * 44;
    out += rect(x + pad, ry, w - pad * 2, 32, 9, SURFACE_2, `stroke="${HAIR}"`);
    out += circle(x + pad + 20, ry + 16, 4, p.orbB);
    out += rect(x + pad + 38, ry + 11, (w - pad * 2) * (0.3 + rnd(seed, i + 25, 25) / 100), 10, 5, INK_FAINT);
    out += rect(x + w - pad - 74, ry + 11, 54, 10, 5, p.orbA, 'fill-opacity="0.55"');
  }
  return out;
}

function chat(seed: string, p: Palette, x: number, y: number, w: number, h: number): string {
  const pad = 26;
  const bubbles = [
    { mine: false, wpct: 0.52, lines: 2 },
    { mine: true, wpct: 0.44, lines: 1 },
    { mine: false, wpct: 0.6, lines: 3 },
    { mine: true, wpct: 0.38, lines: 1 },
  ];
  let out = "";
  let cy = y + 28;
  bubbles.forEach((b, i) => {
    const bh = 26 + b.lines * 18;
    const bw = w * b.wpct;
    const bx = b.mine ? x + w - pad - bw : x + pad;
    out += rect(bx, cy, bw, bh, 14, b.mine ? SURFACE_2 : "rgba(255,255,255,0.045)", `stroke="${HAIR}"`);
    if (!b.mine) out += rect(bx, cy, 3.5, bh, 1.75, p.orbA, 'fill-opacity="0.85"');
    out += textBars(`${seed}:b${i}`, bx + 18, cy + 14, b.lines, bw - 40, 17, 8);
    cy += bh + 18;
  });
  out += `<rect x="${x + pad}" y="${cy + 2}" width="150" height="26" rx="13" fill="none" stroke="${p.orbA}" stroke-opacity="0.5"/>`;
  out += circle(x + pad + 18, cy + 15, 3.5, p.orbA);
  out += rect(x + pad + 30, cy + 11, 100, 8, 4, INK_FAINT);
  for (let i = 0; i < 3; i++) out += circle(x + pad + 190 + i * 14, cy + 15, 3.5, INK_DIM);
  out += rect(x + pad, y + h - 64, w - pad * 2, 40, 12, SURFACE_2, `stroke="${HAIR}"`);
  out += rect(x + pad + 16, y + h - 49, 120, 9, 4.5, INK_FAINT);
  out += circle(x + w - pad - 22, y + h - 44, 12, p.orbA, 'fill-opacity="0.85"');
  return out;
}

function flow(seed: string, p: Palette, x: number, y: number, w: number, h: number): string {
  const nodeW = w * 0.24;
  const nodeH = 62;
  const nodes = [
    { nx: x + 24, ny: y + 40 },
    { nx: x + w / 2 - nodeW / 2, ny: y + 40 },
    { nx: x + w - nodeW - 24, ny: y + 40 },
    { nx: x + w / 2 - nodeW / 2, ny: y + 170 },
    { nx: x + w - nodeW - 24, ny: y + 300 },
    { nx: x + 24, ny: y + 300 },
  ];
  const edge = (a: number, b: number): string => {
    const A = nodes[a]!;
    const B = nodes[b]!;
    if (Math.abs(A.ny - B.ny) < 4) {
      return `M ${A.nx + nodeW} ${A.ny + nodeH / 2} L ${B.nx} ${B.ny + nodeH / 2}`;
    }
    const ax = A.nx + nodeW / 2;
    const ay = A.ny + nodeH;
    const bx = B.nx + nodeW / 2;
    const by = B.ny;
    const midY = (ay + by) / 2;
    return `M ${ax} ${ay} L ${ax} ${midY} L ${bx} ${midY} L ${bx} ${by}`;
  };
  let out = "";
  [edge(0, 1), edge(1, 2), edge(1, 3), edge(3, 4), edge(3, 5)].forEach((d, i) => {
    out += `<path d="${d}" fill="none" stroke="${p.orbA}" stroke-opacity="0.45" stroke-width="1.6"${i === 2 ? ' stroke-dasharray="4 6"' : ""}/>`;
  });
  nodes.forEach((n, i) => {
    out += rect(n.nx, n.ny, nodeW, nodeH, 12, i === 1 || i === 3 ? SURFACE_2 : "rgba(255,255,255,0.045)", `stroke="${HAIR}"`);
    out += circle(n.nx + 18, n.ny + nodeH / 2, 4.5, i === 4 ? p.orbB : p.orbA);
    out += rect(n.nx + 32, n.ny + nodeH / 2 - 9, nodeW * (0.4 + rnd(seed, i + 31, 25) / 100), 8, 4, INK_FAINT);
    out += rect(n.nx + 32, n.ny + nodeH / 2 + 4, nodeW * 0.3, 6, 3, INK_GHOST);
  });
  out += rect(x + 24, y + h - 58, w - 48, 34, 10, SURFACE_2, `stroke="${HAIR}"`);
  out += circle(x + 42, y + h - 41, 4, p.orbB);
  out += rect(x + 58, y + h - 46, (w - 48) * 0.42, 9, 4.5, INK_FAINT);
  out += rect(x + w - 24 - 90, y + h - 46, 70, 9, 4.5, p.orbA, 'fill-opacity="0.55"');
  return out;
}

function board(seed: string, p: Palette, x: number, y: number, w: number, _h: number): string {
  const pad = 24;
  const colW = (w - pad * 2 - 32) / 3;
  let out = "";
  for (let c = 0; c < 3; c++) {
    const cx = x + pad + c * (colW + 16);
    out += rect(cx, y + 22, colW * 0.55, 9, 4.5, INK_DIM);
    const cards = 2 + rnd(seed, c + 7, 2);
    let cy = y + 48;
    for (let i = 0; i < cards; i++) {
      const chH = 74 + rnd(seed, c * 10 + i, 26);
      out += rect(cx, cy, colW, chH, 12, c === 1 && i === 0 ? SURFACE_2 : "rgba(255,255,255,0.045)", `stroke="${HAIR}"`);
      out += rect(cx + 14, cy + 16, colW * 0.42, 8, 4, INK_FAINT);
      out += rect(cx + 14, cy + 34, colW * 0.7, 7, 3.5, INK_GHOST);
      out += rect(cx + 14, cy + chH - 22, 46, 12, 6, c === 1 && i === 0 ? p.orbA : p.orbB, 'fill-opacity="0.35"');
      cy += chH + 14;
    }
  }
  return out;
}

/** Artifact choice follows the story in the seed slug, falling back to hash. */
function pickArtifact(seed: string, h: number) {
  const s = seed.toLowerCase();
  if (/cash|automation|pipeline|ops-|devops|cloud/.test(s)) return flow;
  if (/copilot|chatbot|chat|whatsapp|support|concierge|assistant/.test(s)) return chat;
  if (/storefront|shopify|ecommerce|cms|wordpress|newsroom|saas|procurement|product/.test(s)) return board;
  if (/lakehouse|forecast|data|analytics|wallet|fintech|rag|knowledge|platform/.test(s)) return dashboard;
  const all = [dashboard, chat, flow, board] as const;
  return all[h % all.length]!;
}

export function coverSvgString(seed: string): string {
  const p = coverPalette(seed);
  const h = hashSeed(seed);
  const uid = `c${h.toString(36)}`;
  const artifact = pickArtifact(seed, h);

  const winW = W * 0.68;
  const winH = H * 0.68;
  const winX = W * (0.13 + ((h >>> 5) % 8) / 100);
  const winY = H * (0.15 + ((h >>> 9) % 6) / 100);
  const headerH = 46;

  let dots = "";
  for (let i = 0; i < 60; i++) {
    dots += circle((i % 10) * (W / 9), Math.floor(i / 10) * (H / 5), 1.5, p.line, 'fill-opacity="0.18"');
  }

  let header = rect(winX, winY, winW, headerH, 0, SURFACE_2);
  header += `<line x1="${winX}" y1="${winY + headerH}" x2="${winX + winW}" y2="${winY + headerH}" stroke="${HAIR}"/>`;
  for (let i = 0; i < 3; i++) header += circle(winX + 24 + i * 18, winY + headerH / 2, 4.5, INK_DIM);
  header += rect(winX + 84, winY + headerH / 2 - 5, winW * 0.22, 10, 5, INK_FAINT);
  header += circle(winX + winW - 28, winY + headerH / 2, 4.5, p.orbA);

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">` +
    `<defs>` +
    `<radialGradient id="${uid}-a" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${p.orbA}" stop-opacity="0.4"/><stop offset="100%" stop-color="${p.orbA}" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${uid}-b" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${p.orbB}" stop-opacity="0.35"/><stop offset="100%" stop-color="${p.orbB}" stop-opacity="0"/></radialGradient>` +
    `<filter id="${uid}-n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.05"/></feComponentTransfer><feComposite operator="over" in2="SourceGraphic"/></filter>` +
    `<clipPath id="${uid}-w"><rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" rx="20"/></clipPath>` +
    `</defs>` +
    `<rect width="${W}" height="${H}" fill="${p.base}"/>` +
    `<g transform="rotate(${p.angle} ${W / 2} ${H / 2})">` +
    `<ellipse cx="${p.ax * W}" cy="${p.ay * H}" rx="${W * 0.45}" ry="${H * 0.4}" fill="url(#${uid}-a)"/>` +
    `<ellipse cx="${p.bx * W}" cy="${p.by * H}" rx="${W * 0.48}" ry="${H * 0.42}" fill="url(#${uid}-b)"/>` +
    `</g>` +
    dots +
    rect(winX, winY, winW, winH, 20, SURFACE, `stroke="${HAIR}" stroke-width="1.5"`) +
    `<g clip-path="url(#${uid}-w)">` +
    header +
    artifact(seed, p, winX, winY + headerH, winW, winH - headerH) +
    `</g>` +
    `<rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" rx="20" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="3"/>` +
    `<rect width="${W}" height="${H}" filter="url(#${uid}-n)" opacity="0.5"/>` +
    `<rect width="${W}" height="${H}" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1.5"/>` +
    `</svg>`
  );
}
