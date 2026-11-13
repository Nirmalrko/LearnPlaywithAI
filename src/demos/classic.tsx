import { useMemo, useRef, useState, type PointerEvent } from 'react';
import { useInteract } from './DemoFrame';
import { fitLine, inertia, kmeansAssign, kmeansUpdate, knnPredict, mse, rng, gaussian, type Pt } from '../lib/ml';
import { sfx } from '../lib/sound';

const W = 400;
const H = 300;
export const CLASS_COLORS = ['#7c3aed', '#f59e0b', '#06b6d4'];

/** Convert a pointer event on an SVG with viewBox 0 0 W H into viewBox coords. */
export function svgPoint(e: PointerEvent<SVGSVGElement>, w = W, h = H) {
  const r = e.currentTarget.getBoundingClientRect();
  return { x: ((e.clientX - r.left) / r.width) * w, y: ((e.clientY - r.top) / r.height) * h };
}

// ---------------- Linear regression ----------------
const START: Pt[] = [
  { x: 0.1, y: 0.18 },
  { x: 0.25, y: 0.3 },
  { x: 0.4, y: 0.37 },
  { x: 0.55, y: 0.58 },
  { x: 0.7, y: 0.62 },
  { x: 0.85, y: 0.8 },
];

export function Regression() {
  const interact = useInteract();
  const [pts, setPts] = useState<Pt[]>(START);
  const [w, setW] = useState(0.2);
  const [b, setB] = useState(0.4);
  const [showBest, setShowBest] = useState(false);
  const best = useMemo(() => fitLine(pts), [pts]);
  const yourLoss = mse(pts, w, b);
  const bestLoss = mse(pts, best.w, best.b);
  const toX = (x: number) => x * W;
  const toY = (y: number) => H - y * H;
  const win = showBest && yourLoss <= bestLoss * 1.15 + 0.0005;

  return (
    <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="demo-canvas cursor-crosshair"
        onPointerDown={(e) => {
          interact();
          const p = svgPoint(e);
          setPts((ps) => [...ps, { x: p.x / W, y: 1 - p.y / H }]);
        }}
        role="img"
        aria-label="Scatter plot: click to add data points"
      >
        {[0.25, 0.5, 0.75].map((g) => (
          <g key={g} className="stroke-slate-200 dark:stroke-slate-800">
            <line x1={toX(g)} x2={toX(g)} y1={0} y2={H} />
            <line y1={toY(g)} y2={toY(g)} x1={0} x2={W} />
          </g>
        ))}
        {pts.map((p, i) => (
          <line key={'r' + i} x1={toX(p.x)} x2={toX(p.x)} y1={toY(p.y)} y2={toY(w * p.x + b)} stroke="#f43f5e" strokeDasharray="3 3" opacity={0.6} />
        ))}
        <line x1={0} y1={toY(b)} x2={W} y2={toY(w + b)} stroke="#7c3aed" strokeWidth={3} />
        {showBest && <line x1={0} y1={toY(best.b)} x2={W} y2={toY(best.w + best.b)} stroke="#10b981" strokeWidth={3} strokeDasharray="8 5" />}
        {pts.map((p, i) => (
          <circle key={i} cx={toX(p.x)} cy={toY(p.y)} r={6} fill="#0ea5e9" stroke="white" strokeWidth={2} />
        ))}
        <text x={8} y={18} className="fill-slate-400 text-[11px]">
          size →
        </text>
      </svg>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm font-semibold">
            <span>Slope (w)</span>
            <span className="font-mono">{w.toFixed(2)}</span>
          </div>
          <input type="range" min={-1} max={2} step={0.01} value={w} onChange={(e) => (interact(), setW(+e.target.value))} />
        </div>
        <div>
          <div className="flex justify-between text-sm font-semibold">
            <span>Intercept (b)</span>
            <span className="font-mono">{b.toFixed(2)}</span>
          </div>
          <input type="range" min={-0.5} max={1} step={0.01} value={b} onChange={(e) => (interact(), setB(+e.target.value))} />
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
          <div className="flex justify-between">
            <span>
              <span className="mr-1 inline-block h-2 w-4 rounded bg-brand-600" />
              Your loss (MSE)
            </span>
            <b className="font-mono">{(yourLoss * 1000).toFixed(1)}</b>
          </div>
          {showBest && (
            <div className="mt-1 flex justify-between">
              <span>
                <span className="mr-1 inline-block h-2 w-4 rounded bg-emerald-500" />
                Computer’s best
              </span>
              <b className="font-mono">{(bestLoss * 1000).toFixed(1)}</b>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary flex-1" onClick={() => (interact(), setShowBest(true), sfx.coin())}>
            Show best fit
          </button>
          <button className="btn-ghost" onClick={() => setPts([])}>
            Clear
          </button>
          <button className="btn-ghost" onClick={() => setPts(START)}>
            Reset
          </button>
        </div>
        {win && <p className="animate-pop text-sm font-semibold text-emerald-600">🎯 You’re within 15% of the optimal line — nice fitting!</p>}
        <p className="text-xs text-slate-500">Red dashes are the errors (residuals). Training minimises the sum of their squares.</p>
      </div>
    </div>
  );
}

// ---------------- k-NN ----------------
const KNN_DATA = (() => {
  const r = rng(5);
  const centers = [
    { x: -0.45, y: 0.4 },
    { x: 0.45, y: 0.35 },
    { x: 0, y: -0.45 },
  ];
  return Array.from({ length: 60 }, (_, i) => {
    const c = i % 3;
    return { x: centers[c].x + gaussian(r) * 0.25, y: centers[c].y + gaussian(r) * 0.25, c };
  });
})();

const toPx = (v: number, size: number) => ((v + 1) / 2) * size;
const fromPx = (v: number, size: number) => (v / size) * 2 - 1;

export function Knn() {
  const interact = useInteract();
  const [k, setK] = useState(5);
  const [q, setQ] = useState<Pt>({ x: 0.05, y: 0.1 });
  const res = knnPredict(KNN_DATA, q, k);
  const grid = useMemo(() => {
    const cells: { x: number; y: number; c: number }[] = [];
    const n = 24;
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const x = -1 + (2 * (i + 0.5)) / n;
        const y = -1 + (2 * (j + 0.5)) / n;
        cells.push({ x, y, c: knnPredict(KNN_DATA, { x, y }, k).c });
      }
    return { cells, n };
  }, [k]);
  const move = (e: PointerEvent<SVGSVGElement>) => {
    const p = svgPoint(e, W, W);
    setQ({ x: fromPx(p.x, W), y: -fromPx(p.y, W) });
  };

  return (
    <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
      <svg
        viewBox={`0 0 ${W} ${W}`}
        className="demo-canvas aspect-square cursor-none"
        onPointerMove={move}
        onPointerDown={(e) => (interact(), move(e))}
        role="img"
        aria-label="k-NN classification plane"
      >
        {grid.cells.map((c, i) => (
          <rect key={i} x={toPx(c.x, W) - W / grid.n / 2} y={toPx(-c.y, W) - W / grid.n / 2} width={W / grid.n + 0.5} height={W / grid.n + 0.5} fill={CLASS_COLORS[c.c]} opacity={0.12} />
        ))}
        {res.neighbors.map((n, i) => (
          <line key={i} x1={toPx(q.x, W)} y1={toPx(-q.y, W)} x2={toPx(n.x, W)} y2={toPx(-n.y, W)} stroke={CLASS_COLORS[n.c]} strokeWidth={1.5} opacity={0.7} />
        ))}
        {KNN_DATA.map((p, i) => (
          <circle key={i} cx={toPx(p.x, W)} cy={toPx(-p.y, W)} r={5} fill={CLASS_COLORS[p.c]} stroke="white" strokeWidth={1.5} />
        ))}
        <circle cx={toPx(q.x, W)} cy={toPx(-q.y, W)} r={11} fill={CLASS_COLORS[res.c]} stroke="#0f172a" strokeWidth={3} />
        <text x={toPx(q.x, W)} y={toPx(-q.y, W) + 4} textAnchor="middle" className="fill-white text-[11px] font-bold">
          ?
        </text>
      </svg>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm font-semibold">
            <span>k (neighbours)</span>
            <span className="font-mono">{k}</span>
          </div>
          <input type="range" min={1} max={25} value={k} onChange={(e) => (interact(), setK(+e.target.value))} />
        </div>
        <div className="space-y-2">
          <div className="label">Votes</div>
          {['Purple', 'Amber', 'Cyan'].map((name, c) => (
            <div key={c} className="flex items-center gap-2 text-sm">
              <span className="w-14">{name}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full transition-all" style={{ width: `${(res.votes[c] / k) * 100}%`, background: CLASS_COLORS[c] }} />
              </div>
              <span className="w-6 text-right font-mono">{res.votes[c]}</span>
            </div>
          ))}
        </div>
        <p className="text-sm">
          Prediction: <b style={{ color: CLASS_COLORS[res.c] }}>{['Purple', 'Amber', 'Cyan'][res.c]}</b>
        </p>
        <p className="text-xs text-slate-500">The shaded background shows the decision regions. Notice how k=1 makes jagged islands while k=25 smooths everything.</p>
      </div>
    </div>
  );
}

// ---------------- k-means ----------------
function kmeansData(seed: number) {
  const r = rng(seed);
  const centers = Array.from({ length: 3 }, () => ({ x: r() * 1.4 - 0.7, y: r() * 1.4 - 0.7 }));
  return Array.from({ length: 90 }, (_, i) => {
    const c = centers[i % 3];
    return { x: c.x + gaussian(r) * 0.18, y: c.y + gaussian(r) * 0.18 };
  });
}

export function KMeans() {
  const interact = useInteract();
  const [seed, setSeed] = useState(3);
  const [k, setK] = useState(3);
  const pts = useMemo(() => kmeansData(seed), [seed]);
  const init = (kk: number, s: number) => {
    const r = rng(s * 13 + kk);
    return Array.from({ length: kk }, () => ({ x: r() * 1.6 - 0.8, y: r() * 1.6 - 0.8 }));
  };
  const [cents, setCents] = useState<Pt[]>(() => init(3, 3));
  const [assign, setAssign] = useState<number[] | null>(null);
  const [phase, setPhase] = useState<'assign' | 'update'>('assign');
  const [iter, setIter] = useState(0);
  const colors = ['#7c3aed', '#f59e0b', '#06b6d4', '#ef4444', '#10b981'];

  const restart = (kk = k, s = seed) => {
    setCents(init(kk, s));
    setAssign(null);
    setPhase('assign');
    setIter(0);
  };
  const step = () => {
    interact();
    if (phase === 'assign') {
      setAssign(kmeansAssign(pts, cents));
      setPhase('update');
    } else if (assign) {
      setCents(kmeansUpdate(pts, assign, cents));
      setPhase('assign');
      setIter((i) => i + 1);
    }
  };
  const converged = assign && phase === 'assign' && kmeansAssign(pts, cents).every((a, i) => a === assign[i]);

  return (
    <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
      <svg viewBox={`0 0 ${W} ${W}`} className="demo-canvas aspect-square" role="img" aria-label="k-means clustering plot">
        {assign &&
          pts.map((p, i) => (
            <line key={'l' + i} x1={toPx(p.x, W)} y1={toPx(-p.y, W)} x2={toPx(cents[assign[i]].x, W)} y2={toPx(-cents[assign[i]].y, W)} stroke={colors[assign[i]]} opacity={0.15} />
          ))}
        {pts.map((p, i) => (
          <circle key={i} cx={toPx(p.x, W)} cy={toPx(-p.y, W)} r={5} fill={assign ? colors[assign[i]] : '#94a3b8'} className="transition-all duration-500" />
        ))}
        {cents.map((c, i) => (
          <g key={i} style={{ transform: `translate(${toPx(c.x, W)}px, ${toPx(-c.y, W)}px)`, transition: 'transform 0.6s ease' }}>
            <circle r={13} fill={colors[i]} stroke="white" strokeWidth={3} />
            <text y={5} textAnchor="middle" className="fill-white text-[14px] font-bold">
              ★
            </text>
          </g>
        ))}
      </svg>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm font-semibold">
            <span>k (clusters)</span>
            <span className="font-mono">{k}</span>
          </div>
          <input type="range" min={2} max={5} value={k} onChange={(e) => (setK(+e.target.value), restart(+e.target.value))} />
        </div>
        <button className="btn-primary w-full" onClick={step} disabled={!!converged}>
          {converged ? '✓ Converged!' : phase === 'assign' ? 'Step: assign points →' : 'Step: move centroids →'}
        </button>
        <div className="flex gap-2">
          <button className="btn-ghost flex-1" onClick={() => restart()}>
            ↻ New start
          </button>
          <button className="btn-ghost flex-1" onClick={() => (setSeed((s) => s + 1), restart(k, seed + 1))}>
            🎲 New data
          </button>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
          <div>
            Iteration: <b>{iter}</b>
          </div>
          {assign && (
            <div>
              Total distance (inertia): <b className="font-mono">{inertia(pts, assign, cents).toFixed(2)}</b>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500">Each ★ is a centroid. Watch them glide to the centre of their group.</p>
      </div>
    </div>
  );
}

// ---------------- Decision tree ----------------
type Node = { q: string; yes: Node | string; no: Node | string };
const TREE: Node = {
  q: 'Is the outlook sunny?',
  yes: { q: 'Is humidity above 70%?', yes: '❌ Don’t play — too sticky', no: '✅ Play tennis!' },
  no: {
    q: 'Is it raining?',
    yes: { q: 'Is it windy?', yes: '❌ Don’t play — stormy', no: '✅ Play (light rain is fine)' },
    no: '✅ Play tennis! (overcast is perfect)',
  },
};

export function DecisionTree() {
  const interact = useInteract();
  const [path, setPath] = useState<boolean[]>([]);
  const nodes: (Node | string)[] = [TREE];
  for (const step of path) {
    const n = nodes[nodes.length - 1] as Node;
    nodes.push(step ? n.yes : n.no);
  }
  const cur = nodes[nodes.length - 1];
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={rootRef}>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {nodes.slice(0, -1).map((n, i) => (
          <span key={i} className="chip bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {(n as Node).q.replace('?', '')} → <b>{path[i] ? 'Yes' : 'No'}</b>
          </span>
        ))}
      </div>
      <div key={path.length} className="mt-3 animate-pop rounded-xl bg-gradient-to-br from-emerald-50 to-cyan-50 p-6 text-center dark:from-emerald-950/40 dark:to-cyan-950/30">
        {typeof cur === 'string' ? (
          <>
            <div className="label">Leaf (prediction)</div>
            <p className="mt-2 text-2xl font-bold">{cur}</p>
            <button className="btn-ghost mt-4" onClick={() => setPath([])}>
              ↻ Start again from the root
            </button>
          </>
        ) : (
          <>
            <div className="label">Decision node · depth {path.length}</div>
            <p className="mt-2 text-xl font-bold">{cur.q}</p>
            <div className="mt-4 flex justify-center gap-3">
              <button className="btn-primary min-w-24" onClick={() => (interact(), setPath((p) => [...p, true]))}>
                Yes
              </button>
              <button className="btn-ghost min-w-24" onClick={() => (interact(), setPath((p) => [...p, false]))}>
                No
              </button>
            </div>
          </>
        )}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        A real tree learns <i>which</i> question to ask first by choosing the split that best separates the labels (measured by “Gini impurity” or “information gain”).
      </p>
    </div>
  );
}

