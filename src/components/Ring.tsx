export function Ring({ pct, color, size = 48, stroke = 5 }: { pct: number; color: string; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90" aria-label={`${Math.round(pct * 100)}% complete`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-slate-200 dark:stroke-slate-800" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        className="transition-all duration-700"
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="rotate-90 fill-slate-600 text-[11px] font-bold dark:fill-slate-300" style={{ transformOrigin: 'center' }}>
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}
