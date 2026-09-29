function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function pathFromSeries(series: number[], w: number, h: number, pad = 10) {
  const n = series.length;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;

  const step = (w - pad * 2) / (n - 1);

  const pts = series.map((v, i) => {
    const x = pad + i * step;
    const t = (v - min) / span; // 0..1
    const y = pad + (1 - t) * (h - pad * 2);
    return { x, y };
  });

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) d += ` L ${pts[i].x} ${pts[i].y}`;
  return { d, pts };
}

function areaFromLine(pts: Array<{ x: number; y: number }>, w: number, h: number, pad = 10) {
  const first = pts[0];
  const last = pts[pts.length - 1];
  return `M ${first.x} ${h - pad} L ${first.x} ${first.y} ${pts
    .slice(1)
    .map((p) => `L ${p.x} ${p.y}`)
    .join(" ")} L ${last.x} ${h - pad} Z`;
}

export function AreaChartSvg({ months, a, b }: { months: string[]; a: number[]; b: number[] }) {
  const w = 880;
  const h = 260;

  const A = pathFromSeries(a, w, h, 16);
  const B = pathFromSeries(b, w, h, 16);

  const areaA = areaFromLine(A.pts, w, h, 16);
  const areaB = areaFromLine(B.pts, w, h, 16);

  // ticks
  const tickCount = 5;
  const ticks = Array.from({ length: tickCount }, (_, i) => i + 1);

  return (
    <div className="w-full overflow-x-auto">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
        <defs>
          <linearGradient id="gradA" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(244,63,94,0.25)" />
            <stop offset="100%" stopColor="rgba(244,63,94,0.00)" />
          </linearGradient>
          <linearGradient id="gradB" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(251,113,133,0.18)" />
            <stop offset="100%" stopColor="rgba(251,113,133,0.00)" />
          </linearGradient>
        </defs>

        {/* grid */}
        {ticks.map((t) => {
          const y = (h / (tickCount + 1)) * t;
          return <line key={t} x1="0" y1={y} x2={w} y2={y} stroke="rgba(15,23,42,0.08)" />;
        })}

        {/* areas */}
        <path d={areaB} fill="url(#gradB)" />
        <path d={areaA} fill="url(#gradA)" />

        {/* lines */}
        <path d={B.d} fill="none" stroke="rgba(251,113,133,0.9)" strokeWidth="2" />
        <path d={A.d} fill="none" stroke="rgba(244,63,94,0.95)" strokeWidth="2" />

        {/* highlight point */}
        {A.pts[3] ? (
          <>
            <circle cx={A.pts[3].x} cy={A.pts[3].y} r="6" fill="white" stroke="rgba(244,63,94,0.95)" strokeWidth="2" />
          </>
        ) : null}
      </svg>

      <div className="mt-2 flex justify-between px-1 text-xs font-semibold text-neutral-500">
        {months.slice(0, clamp(months.length, 1, 12)).map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}