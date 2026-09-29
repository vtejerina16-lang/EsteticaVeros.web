function pathFromSeries(series: number[], w: number, h: number, pad = 10) {
  const n = series.length;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const step = (w - pad * 2) / (n - 1);

  const pts = series.map((v, i) => {
    const x = pad + i * step;
    const t = (v - min) / span;
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

export function MiniChartSvg({ series }: { series: number[] }) {
  const w = 320;
  const h = 140;
  const S = pathFromSeries(series, w, h, 12);
  const area = areaFromLine(S.pts, w, h, 12);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block w-full">
      <defs>
        <linearGradient id="miniGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(244,63,94,0.22)" />
          <stop offset="100%" stopColor="rgba(244,63,94,0.00)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#miniGrad)" />
      <path d={S.d} fill="none" stroke="rgba(244,63,94,0.95)" strokeWidth="2" />
    </svg>
  );
}