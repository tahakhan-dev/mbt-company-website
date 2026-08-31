import { coverPalette, hashSeed } from "./palette";

/**
 * Deterministic cover art (pure SVG, server-rendered, zero network) — V2
 * "product artifact" edition (T26): instead of abstract vapor, each cover
 * composes a designed dark product window — dashboard, assistant thread,
 * automation flow, or kanban board — inside the aurora atmosphere. The
 * artifact stays obsidian in both themes (a product screenshot reads
 * correctly on porcelain and on void), keyed per seed for palette, layout
 * and artifact type. Used wherever a project has no uploaded image.
 */

const W = 1200;
const H = 800;

type Palette = ReturnType<typeof coverPalette>;

const SURFACE = "#0d1119";
const SURFACE_2 = "#131a29";
const INK_DIM = "rgba(238,242,248,0.32)";
const INK_FAINT = "rgba(154,166,184,0.35)";
const HAIR = "rgba(255,255,255,0.09)";

function rnd(seed: string, i: number, mod: number, min = 0): number {
  return min + (hashSeed(`${seed}:${i}`) % mod);
}

/** Rows of abstract text bars. */
function TextBars({
  seed,
  x,
  y,
  rows,
  width,
  gap = 22,
  h = 9,
}: {
  seed: string;
  x: number;
  y: number;
  rows: number;
  width: number;
  gap?: number;
  h?: number;
}) {
  return (
    <g>
      {Array.from({ length: rows }, (_, i) => (
        <rect
          key={i}
          x={x}
          y={y + i * gap}
          width={width * (0.45 + rnd(seed, i + 40, 50) / 100)}
          height={h}
          rx={h / 2}
          fill={INK_FAINT}
        />
      ))}
    </g>
  );
}

function Dashboard({ seed, p, x, y, w }: { seed: string; p: Palette; x: number; y: number; w: number; h: number }) {
  const pad = 26;
  const tileW = (w - pad * 2 - 32) / 3;
  const sparkY = y + 210;
  const points = Array.from({ length: 12 }, (_, i) => {
    const px = x + pad + (i * (w - pad * 2)) / 11;
    const py = sparkY + 120 - (30 + rnd(seed, i + 60, 80));
    return `${px},${py}`;
  });
  return (
    <g>
      {Array.from({ length: 3 }, (_, i) => (
        <g key={i}>
          <rect x={x + pad + i * (tileW + 16)} y={y + 24} width={tileW} height={130} rx={14} fill={SURFACE_2} stroke={HAIR} />
          <rect x={x + pad + i * (tileW + 16) + 18} y={y + 46} width={tileW * 0.5} height={8} rx={4} fill={INK_FAINT} />
          <rect
            x={x + pad + i * (tileW + 16) + 18}
            y={y + 74}
            width={tileW * (0.3 + rnd(seed, i + 12, 35) / 100)}
            height={26}
            rx={6}
            fill={i === 0 ? p.orbA : INK_DIM}
            fillOpacity={i === 0 ? 0.9 : 1}
          />
        </g>
      ))}
      <polyline points={points.join(" ")} fill="none" stroke={p.orbA} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      <polyline
        points={`${x + 26},${sparkY + 140} ${points.join(" ")} ${x + w - 26},${sparkY + 140}`}
        fill={p.orbA}
        fillOpacity={0.08}
        stroke="none"
      />
      {Array.from({ length: 3 }, (_, i) => (
        <g key={`r${i}`}>
          <rect x={x + pad} y={sparkY + 170 + i * 44} width={w - pad * 2} height={32} rx={9} fill={SURFACE_2} stroke={HAIR} />
          <circle cx={x + pad + 20} cy={sparkY + 186 + i * 44} r={4} fill={p.orbB} />
          <rect x={x + pad + 38} y={sparkY + 181 + i * 44} width={(w - pad * 2) * (0.3 + rnd(seed, i + 25, 25) / 100)} height={10} rx={5} fill={INK_FAINT} />
          <rect x={x + w - pad - 74} y={sparkY + 181 + i * 44} width={54} height={10} rx={5} fill={p.orbA} fillOpacity={0.55} />
        </g>
      ))}
    </g>
  );
}

function Chat({ seed, p, x, y, w, h }: { seed: string; p: Palette; x: number; y: number; w: number; h: number }) {
  const pad = 26;
  const bubbles = [
    { mine: false, wpct: 0.52, lines: 2 },
    { mine: true, wpct: 0.44, lines: 1 },
    { mine: false, wpct: 0.6, lines: 3 },
    { mine: true, wpct: 0.38, lines: 1 },
  ];
  let cy = y + 28;
  return (
    <g>
      {bubbles.map((b, i) => {
        const bh = 26 + b.lines * 18;
        const bw = w * b.wpct;
        const bx = b.mine ? x + w - pad - bw : x + pad;
        const g = (
          <g key={i}>
            <rect x={bx} y={cy} width={bw} height={bh} rx={14} fill={b.mine ? SURFACE_2 : "rgba(255,255,255,0.045)"} stroke={HAIR} />
            {!b.mine && <rect x={bx} y={cy} width={3.5} height={bh} rx={1.75} fill={p.orbA} fillOpacity={0.85} />}
            <TextBars seed={`${seed}:b${i}`} x={bx + 18} y={cy + 14} rows={b.lines} width={bw - 40} gap={17} h={8} />
          </g>
        );
        cy += bh + 18;
        return g;
      })}
      {/* citation chip + typing dots */}
      <rect x={x + pad} y={cy + 2} width={150} height={26} rx={13} fill="none" stroke={p.orbA} strokeOpacity={0.5} />
      <circle cx={x + pad + 18} cy={cy + 15} r={3.5} fill={p.orbA} />
      <rect x={x + pad + 30} y={cy + 11} width={100} height={8} rx={4} fill={INK_FAINT} />
      {Array.from({ length: 3 }, (_, i) => (
        <circle key={i} cx={x + pad + 190 + i * 14} cy={cy + 15} r={3.5} fill={INK_DIM} />
      ))}
      <rect x={x + pad} y={y + h - 64} width={w - pad * 2} height={40} rx={12} fill={SURFACE_2} stroke={HAIR} />
      <rect x={x + pad + 16} y={y + h - 49} width={120} height={9} rx={4.5} fill={INK_FAINT} />
      <circle cx={x + w - pad - 22} cy={y + h - 44} r={12} fill={p.orbA} fillOpacity={0.85} />
    </g>
  );
}

function Flow({ seed, p, x, y, w, h }: { seed: string; p: Palette; x: number; y: number; w: number; h: number }) {
  const nodeW = w * 0.24;
  const nodeH = 62;
  const nodes = [
    { nx: x + 24, ny: y + 40 },
    { nx: x + w / 2 - nodeW / 2, ny: y + 40 },
    { nx: x + w - nodeW - 24, ny: y + 40 },
    { nx: x + w / 2 - nodeW / 2, ny: y + 40 + 130 },
    { nx: x + w - nodeW - 24, ny: y + 40 + 260 },
    { nx: x + 24, ny: y + 40 + 260 },
  ];
  const edge = (a: number, b: number) => {
    const A = nodes[a]!, B = nodes[b]!;
    const ax = A.nx + nodeW / 2, ay = A.ny + nodeH;
    const bx = B.nx + nodeW / 2, by = B.ny;
    if (Math.abs(A.ny - B.ny) < 4) {
      return `M ${A.nx + nodeW} ${A.ny + nodeH / 2} L ${B.nx} ${B.ny + nodeH / 2}`;
    }
    const midY = (ay + by) / 2;
    return `M ${ax} ${ay} L ${ax} ${midY} L ${bx} ${midY} L ${bx} ${by}`;
  };
  return (
    <g>
      {[edge(0, 1), edge(1, 2), edge(1, 3), edge(3, 4), edge(3, 5)].map((d, i) => (
        <path key={i} d={d} fill="none" stroke={p.orbA} strokeOpacity={0.45} strokeWidth={1.6} strokeDasharray={i === 2 ? "4 6" : undefined} />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <rect x={n.nx} y={n.ny} width={nodeW} height={nodeH} rx={12} fill={i === 1 || i === 3 ? SURFACE_2 : "rgba(255,255,255,0.045)"} stroke={HAIR} />
          <circle cx={n.nx + 18} cy={n.ny + nodeH / 2} r={4.5} fill={i === 4 ? p.orbB : p.orbA} />
          <rect x={n.nx + 32} y={n.ny + nodeH / 2 - 9} width={nodeW * (0.4 + rnd(seed, i + 31, 25) / 100)} height={8} rx={4} fill={INK_FAINT} />
          <rect x={n.nx + 32} y={n.ny + nodeH / 2 + 4} width={nodeW * 0.3} height={6} rx={3} fill="rgba(154,166,184,0.22)" />
        </g>
      ))}
      <rect x={x + 24} y={y + h - 58} width={w - 48} height={34} rx={10} fill={SURFACE_2} stroke={HAIR} />
      <circle cx={x + 42} cy={y + h - 41} r={4} fill={p.orbB} />
      <rect x={x + 58} y={y + h - 46} width={(w - 48) * 0.42} height={9} rx={4.5} fill={INK_FAINT} />
      <rect x={x + w - 24 - 90} y={y + h - 46} width={70} height={9} rx={4.5} fill={p.orbA} fillOpacity={0.55} />
    </g>
  );
}

function Board({ seed, p, x, y, w }: { seed: string; p: Palette; x: number; y: number; w: number; h: number }) {
  const pad = 24;
  const colW = (w - pad * 2 - 32) / 3;
  return (
    <g>
      {Array.from({ length: 3 }, (_, c) => {
        const cards = 2 + rnd(seed, c + 7, 2);
        return (
          <g key={c}>
            <rect x={x + pad + c * (colW + 16)} y={y + 22} width={colW * 0.55} height={9} rx={4.5} fill={INK_DIM} />
            {Array.from({ length: cards }, (_, i) => {
              const chH = 74 + rnd(seed, c * 10 + i, 26);
              const cy = y + 48 + i * (chH + 14) - (i > 0 ? rnd(seed, c * 5 + i + 3, 18) : 0);
              return (
                <g key={i}>
                  <rect x={x + pad + c * (colW + 16)} y={cy} width={colW} height={chH} rx={12} fill={c === 1 && i === 0 ? SURFACE_2 : "rgba(255,255,255,0.045)"} stroke={HAIR} />
                  <rect x={x + pad + c * (colW + 16) + 14} y={cy + 16} width={colW * 0.42} height={8} rx={4} fill={INK_FAINT} />
                  <rect x={x + pad + c * (colW + 16) + 14} y={cy + 34} width={colW * 0.7} height={7} rx={3.5} fill="rgba(154,166,184,0.22)" />
                  <rect x={x + pad + c * (colW + 16) + 14} y={cy + chH - 22} width={46} height={12} rx={6} fill={c === 1 && i === 0 ? p.orbA : p.orbB} fillOpacity={0.35} />
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

const ARTIFACTS = [Dashboard, Chat, Flow, Board] as const;

/**
 * Artifact choice follows the story in the seed slug (a support copilot gets
 * a thread, an automation gets a flow), falling back to the hash.
 */
function pickArtifact(seed: string, h: number) {
  const s = seed.toLowerCase();
  if (/cash|automation|pipeline|ops-|devops|cloud/.test(s)) return Flow;
  if (/copilot|chatbot|chat|whatsapp|support|concierge|assistant/.test(s)) return Chat;
  if (/storefront|shopify|ecommerce|cms|wordpress|newsroom|saas|procurement|product/.test(s)) return Board;
  if (/lakehouse|forecast|data|analytics|wallet|fintech|rag|knowledge|platform/.test(s)) return Dashboard;
  return ARTIFACTS[h % ARTIFACTS.length]!;
}

export function GeneratedCover({
  seed,
  className,
  title,
}: {
  seed: string;
  className?: string;
  title?: string;
}) {
  const p = coverPalette(seed);
  const h = hashSeed(seed);
  const uid = `c${h.toString(36)}`;
  const artifact = pickArtifact(seed, h);

  // Window placement varies slightly per seed
  const winW = W * 0.68;
  const winH = H * 0.68;
  const winX = W * (0.13 + ((h >>> 5) % 8) / 100);
  const winY = H * (0.15 + ((h >>> 9) % 6) / 100);
  const headerH = 46;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`${uid}-a`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.orbA} stopOpacity="0.4" />
          <stop offset="100%" stopColor={p.orbA} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-b`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.orbB} stopOpacity="0.35" />
          <stop offset="100%" stopColor={p.orbB} stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-n`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.05" />
          </feComponentTransfer>
          <feComposite operator="over" in2="SourceGraphic" />
        </filter>
        <clipPath id={`${uid}-w`}>
          <rect x={winX} y={winY} width={winW} height={winH} rx={20} />
        </clipPath>
      </defs>

      {/* Atmosphere */}
      <rect width={W} height={H} fill={p.base} />
      <g transform={`rotate(${p.angle} ${W / 2} ${H / 2})`}>
        <ellipse cx={p.ax * W} cy={p.ay * H} rx={W * 0.45} ry={H * 0.4} fill={`url(#${uid}-a)`} />
        <ellipse cx={p.bx * W} cy={p.by * H} rx={W * 0.48} ry={H * 0.42} fill={`url(#${uid}-b)`} />
      </g>
      {/* Blueprint dots */}
      <g fill={p.line} fillOpacity="0.18">
        {Array.from({ length: 60 }, (_, i) => (
          <circle key={i} cx={(i % 10) * (W / 9)} cy={Math.floor(i / 10) * (H / 5)} r={1.5} />
        ))}
      </g>

      {/* The product artifact window */}
      <g>
        <rect
          x={winX}
          y={winY}
          width={winW}
          height={winH}
          rx={20}
          fill={SURFACE}
          stroke={HAIR}
          strokeWidth="1.5"
        />
        {/* header */}
        <g clipPath={`url(#${uid}-w)`}>
          <rect x={winX} y={winY} width={winW} height={headerH} fill={SURFACE_2} />
          <line x1={winX} y1={winY + headerH} x2={winX + winW} y2={winY + headerH} stroke={HAIR} />
          {Array.from({ length: 3 }, (_, i) => (
            <circle key={i} cx={winX + 24 + i * 18} cy={winY + headerH / 2} r={4.5} fill={INK_DIM} />
          ))}
          <rect x={winX + 84} y={winY + headerH / 2 - 5} width={winW * 0.22} height={10} rx={5} fill={INK_FAINT} />
          <circle cx={winX + winW - 28} cy={winY + headerH / 2} r={4.5} fill={p.orbA} />
          {artifact({ seed, p, x: winX, y: winY + headerH, w: winW, h: winH - headerH })}
        </g>
        {/* inner top highlight */}
        <rect x={winX} y={winY} width={winW} height={winH} rx={20} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
      </g>

      <rect width={W} height={H} filter={`url(#${uid}-n)`} opacity="0.5" />
      <rect width={W} height={H} fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1.5" />
    </svg>
  );
}
