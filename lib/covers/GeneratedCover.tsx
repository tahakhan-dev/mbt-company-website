import { coverPalette, hashSeed } from "./palette";

/**
 * Deterministic aurora-field cover art (pure SVG, server-rendered, zero
 * network). Used wherever a project/service has no uploaded image, so the
 * site never shows a broken or stock-looking cover.
 */
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
  const W = 1200;
  const H = 800;

  const nodes = Array.from({ length: 14 }, (_, i) => {
    const n = hashSeed(`${seed}:${i}`);
    return {
      x: 80 + (n % (W - 160)),
      y: 80 + ((n >> 7) % (H - 160)),
      r: 1.2 + ((n >> 13) % 22) / 10,
      o: 0.25 + ((n >> 17) % 45) / 100,
    };
  });
  const links = nodes.slice(0, 9).map((n, i) => {
    const m = nodes[(i + 3) % nodes.length]!;
    return { x1: n.x, y1: n.y, x2: m.x, y2: m.y };
  });

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
          <stop offset="0%" stopColor={p.orbA} stopOpacity="0.55" />
          <stop offset="100%" stopColor={p.orbA} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-b`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={p.orbB} stopOpacity="0.5" />
          <stop offset="100%" stopColor={p.orbB} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-l`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.orbA} stopOpacity="0.9" />
          <stop offset="100%" stopColor={p.orbB} stopOpacity="0.4" />
        </linearGradient>
        <filter id={`${uid}-n`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.05" />
          </feComponentTransfer>
          <feComposite operator="over" in2="SourceGraphic" />
        </filter>
      </defs>

      <rect width={W} height={H} fill={p.base} />

      <g transform={`rotate(${p.angle} ${W / 2} ${H / 2})`}>
        <ellipse cx={p.ax * W} cy={p.ay * H} rx={W * 0.42} ry={H * 0.38} fill={`url(#${uid}-a)`} />
        <ellipse cx={p.bx * W} cy={p.by * H} rx={W * 0.46} ry={H * 0.4} fill={`url(#${uid}-b)`} />
      </g>

      {p.motif === "arc" && (
        <g fill="none" stroke={`url(#${uid}-l)`} strokeOpacity="0.5">
          <circle cx={W * 0.78} cy={H * 0.24} r={200} strokeWidth="1" strokeDasharray="2 7" />
          <circle cx={W * 0.78} cy={H * 0.24} r={130} strokeWidth="1" />
        </g>
      )}
      {p.motif === "grid" && (
        <g stroke={p.line} strokeOpacity="0.14" strokeWidth="1">
          {Array.from({ length: 7 }, (_, i) => (
            <line key={i} x1={W * 0.55 + i * 42} y1={H * 0.1} x2={W * 0.4 + i * 42} y2={H * 0.95} />
          ))}
        </g>
      )}
      {p.motif === "wave" && (
        <path
          d={`M0 ${H * 0.72} C ${W * 0.25} ${H * 0.58}, ${W * 0.4} ${H * 0.9}, ${W * 0.62} ${H * 0.7} S ${W * 0.9} ${H * 0.5}, ${W} ${H * 0.62}`}
          fill="none"
          stroke={`url(#${uid}-l)`}
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
      )}

      <g>
        {links.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={p.line}
            strokeOpacity="0.16"
            strokeWidth="1"
          />
        ))}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={p.orbA} fillOpacity={n.o} />
        ))}
      </g>

      <rect width={W} height={H} filter={`url(#${uid}-n)`} opacity="0.5" />
      <rect
        width={W}
        height={H}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.06"
        strokeWidth="1.5"
      />
    </svg>
  );
}
