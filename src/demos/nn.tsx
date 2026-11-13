import { useCallback, useEffect, useRef, useState } from 'react';
import { useInteract } from './DemoFrame';
import { makeDataset, MLP, type DatasetKind, type LabeledPt } from '../lib/ml';

// ---------------- Single neuron ----------------
const INPUTS = [
  { key: 'sun', label: '☀️ Sunny', min: 0, max: 1, step: 1, fmt: (v: number) => (v ? 'yes' : 'no') },
  { key: 'temp', label: '🌡️ Temperature (°C)', min: 5, max: 40, step: 1, fmt: (v: number) => `${v}°` },
  { key: 'work', label: '💼 Work deadline', min: 0, max: 1, step: 1, fmt: (v: number) => (v ? 'yes' : 'no') },
] as const;

export function NeuronDemo() {
  const interact = useInteract();
  const [x, setX] = useState({ sun: 1, temp: 28, work: 0 });
  const [w, setW] = useState({ sun: 2, temp: 0.15, work: -4 });
  const [bias, setBias] = useState(-4);
  const xs = { sun: x.sun, temp: x.temp, work: x.work };
  const z = w.sun * xs.sun + w.temp * xs.temp + w.work * xs.work + bias;
  const out = 1 / (1 + Math.exp(-z));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <div className="label">Inputs (today’s situation)</div>
        {INPUTS.map((inp) => (
          <div key={inp.key}>
            <div className="flex justify-between text-sm font-semibold">
              <span>{inp.label}</span>
              <span>{inp.fmt(x[inp.key])}</span>
            </div>
            <input type="range" min={inp.min} max={inp.max} step={inp.step} value={x[inp.key]} onChange={(e) => (interact(), setX((s) => ({ ...s, [inp.key]: +e.target.value })))} />
          </div>
        ))}
        <div className="label pt-2">Weights (what the neuron learned)</div>
        {INPUTS.map((inp) => (
          <div key={inp.key} className="flex items-center gap-2 text-sm">
            <span className="w-28 shrink-0">w · {inp.label.split(' ')[0]}</span>
            <input
              type="range"
              min={inp.key === 'temp' ? -0.5 : -6}
              max={inp.key === 'temp' ? 0.5 : 6}
              step={inp.key === 'temp' ? 0.01 : 0.1}
              value={w[inp.key]}
              onChange={(e) => (interact(), setW((s) => ({ ...s, [inp.key]: +e.target.value })))}
            />
            <span className="w-12 text-right font-mono">{w[inp.key].toFixed(2)}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 text-sm">
          <span className="w-28 shrink-0">bias</span>
          <input type="range" min={-10} max={5} step={0.1} value={bias} onChange={(e) => (interact(), setBias(+e.target.value))} />
          <span className="w-12 text-right font-mono">{bias.toFixed(1)}</span>
        </div>
      </div>
      <div className="flex flex-col justify-center rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
        <div className="font-mono text-xs leading-6 text-slate-600 dark:text-slate-400">
          z = {w.sun.toFixed(1)}×{xs.sun} + {w.temp.toFixed(2)}×{xs.temp} + ({w.work.toFixed(1)})×{xs.work} + ({bias.toFixed(1)})
          <br />z = <b className="text-slate-900 dark:text-white">{z.toFixed(2)}</b>
          <br />
          sigmoid(z) = <b className="text-slate-900 dark:text-white">{out.toFixed(2)}</b>
        </div>
        <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div className="h-full bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-500 transition-all duration-300" style={{ width: `${out * 100}%` }} />
        </div>
        <div className="mt-4 text-center text-3xl font-bold">{out > 0.5 ? '🏖️ Go to the beach!' : '🏠 Stay home'}</div>
        <p className="mt-2 text-center text-xs text-slate-500">Try making “work deadline” matter less by moving its weight toward 0.</p>
      </div>
    </div>
  );
}

// ---------------- Gradient descent ----------------
const loss = (w: number) => 0.6 * (w - 1.2) ** 2 + 0.35 * Math.sin(2.6 * w) + 0.8;
const grad = (w: number) => 1.2 * (w - 1.2) + 0.91 * Math.cos(2.6 * w);

export function GradientDescent() {
  const interact = useInteract();
  const [lr, setLr] = useState(0.2);
  const [w, setW] = useState(-2.6);
  const wRef = useRef(-2.6);
  const [trail, setTrail] = useState<number[]>([-2.6]);
  const [running, setRunning] = useState(false);
  const Wd = 400;
  const Hd = 240;
  const toX = (v: number) => ((v + 3) / 7) * Wd;
  const toY = (l: number) => Hd - 16 - (l / 12) * (Hd - 30);
  const path = Array.from({ length: 141 }, (_, i) => -3 + (i / 140) * 7)
    .map((v, i) => `${i ? 'L' : 'M'}${toX(v).toFixed(1)},${toY(loss(v)).toFixed(1)}`)
    .join(' ');

  const step = useCallback(() => {
    const cur = wRef.current;
    const nw = Math.max(-3, Math.min(4, cur - lr * grad(cur)));
    wRef.current = nw;
    setW(nw);
    setTrail((t) => [...t.slice(-40), nw]);
  }, [lr]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(step, 280);
    const stop = setTimeout(() => setRunning(false), 280 * 30);
    return () => {
      clearInterval(id);
      clearTimeout(stop);
    };
  }, [running, step]);

  const reset = (start = -2.6) => {
    setRunning(false);
    wRef.current = start;
    setW(start);
    setTrail([start]);
  };

  return (
    <div>
      <svg viewBox={`0 0 ${Wd} ${Hd}`} className="demo-canvas" role="img" aria-label="Loss curve with a ball descending">
        <path d={path} fill="none" stroke="#7c3aed" strokeWidth={3} />
        {trail.map((t, i) => (
          <circle key={i} cx={toX(t)} cy={toY(loss(t))} r={3} fill="#f59e0b" opacity={0.25 + (0.6 * i) / trail.length} />
        ))}
        <circle cx={toX(w)} cy={toY(loss(w)) - 9} r={9} fill="#f59e0b" stroke="white" strokeWidth={2} className="transition-all duration-200" />
        <text x={8} y={16} className="fill-slate-400 text-[11px]">
          loss ↑
        </text>
        <text x={Wd - 8} y={Hd - 4} textAnchor="end" className="fill-slate-400 text-[11px]">
          weight →
        </text>
      </svg>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <div className="flex justify-between text-sm font-semibold">
            <span>Learning rate</span>
            <span className="font-mono">{lr.toFixed(2)}</span>
          </div>
          <input type="range" min={0.01} max={1.6} step={0.01} value={lr} onChange={(e) => setLr(+e.target.value)} />
          <div className="mt-1 flex gap-3 text-xs text-slate-500">
            <span>
              weight = <b className="font-mono">{w.toFixed(2)}</b>
            </span>
            <span>
              loss = <b className="font-mono">{loss(w).toFixed(3)}</b>
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <button className="btn-ghost" onClick={() => (interact(), step())}>
            1 step
          </button>
          <button className="btn-primary" onClick={() => (interact(), setRunning((r) => !r))}>
            {running ? '⏸ Pause' : '▶ Run'}
          </button>
          <button className="btn-ghost" onClick={() => reset()}>
            ↻
          </button>
          <button className="btn-ghost" onClick={() => reset(3.6)} title="Start on the right side">
            Start right
          </button>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Try 0.05 (slow but steady), 0.4 (fast), and 1.5 (chaos!). Starting on the left, a small step size may get stuck in the <b>local minimum</b>.
      </p>
    </div>
  );
}

// ---------------- Neural network trainer ----------------
const RES = 50;

export function NeuralNetTrainer() {
  const interact = useInteract();
  const [kind, setKind] = useState<DatasetKind>('circle');
  const [hidden, setHidden] = useState(2);
  const [neurons, setNeurons] = useState(8);
  const [lr, setLr] = useState(0.03);
  const [running, setRunning] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [losses, setLosses] = useState<number[]>([]);
  const [acc, setAcc] = useState(0);
  const data = useRef<LabeledPt[]>(makeDataset('circle'));
  const net = useRef<MLP>(new MLP([2, 8, 8, 1]));
  const canvas = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const size = c.width;
    const cell = size / RES;
    for (let i = 0; i < RES; i++)
      for (let j = 0; j < RES; j++) {
        const x = -1 + (2 * (i + 0.5)) / RES;
        const y = 1 - (2 * (j + 0.5)) / RES;
        const p = net.current.predict(x, y);
        // purple (0) → white → amber (1)
        const t = p;
        const r = Math.round(124 + (245 - 124) * t);
        const g = Math.round(58 + (158 - 58) * t);
        const b = Math.round(237 + (11 - 237) * t);
        const a = 0.15 + Math.abs(p - 0.5) * 0.7;
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.clearRect(i * cell, j * cell, cell + 1, cell + 1);
        ctx.fillRect(i * cell, j * cell, cell + 1, cell + 1);
      }
    for (const p of data.current) {
      ctx.beginPath();
      ctx.arc(((p.x + 1) / 2) * size, ((1 - p.y) / 2) * size, size / 90, 0, Math.PI * 2);
      ctx.fillStyle = p.c ? '#f59e0b' : '#7c3aed';
      ctx.fill();
      ctx.lineWidth = size / 300;
      ctx.strokeStyle = 'white';
      ctx.stroke();
    }
  }, []);

  const rebuild = useCallback(
    (k: DatasetKind = kind, h = hidden, n = neurons) => {
      setRunning(false);
      data.current = makeDataset(k);
      net.current = new MLP([2, ...Array(h).fill(n), 1], Math.floor(Math.random() * 1000));
      setEpoch(0);
      setLosses([]);
      setAcc(net.current.accuracy(data.current));
      requestAnimationFrame(draw);
    },
    [kind, hidden, neurons, draw],
  );

  useEffect(() => {
    rebuild();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      let l = 0;
      for (let s = 0; s < 5; s++) l = net.current.trainEpoch(data.current, lr);
      setEpoch((e) => e + 5);
      setLosses((ls) => [...ls.slice(-119), l]);
      setAcc(net.current.accuracy(data.current));
      draw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, lr, draw]);

  const maxL = Math.max(0.7, ...losses);
  const spark = losses.map((l, i) => `${i ? 'L' : 'M'}${(i / 119) * 200},${60 - (l / maxL) * 56}`).join(' ');

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div>
        <canvas ref={canvas} width={500} height={500} className="demo-canvas aspect-square" aria-label="Decision boundary of the neural network" />
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>
            <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-brand-600" /> class 0
          </span>
          <span>Background = what the network predicts</span>
          <span>
            <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-amber-500" /> class 1
          </span>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <div className="label mb-1.5">Dataset</div>
          <div className="grid grid-cols-4 gap-1.5">
            {(['blobs', 'circle', 'xor', 'spiral'] as DatasetKind[]).map((k) => (
              <button
                key={k}
                onClick={() => (setKind(k), rebuild(k))}
                className={`rounded-lg px-2 py-2 text-xs font-semibold capitalize ${kind === k ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-sm font-semibold">
              <span>Hidden layers</span>
              <span>{hidden}</span>
            </div>
            <input type="range" min={0} max={4} value={hidden} onChange={(e) => (setHidden(+e.target.value), rebuild(kind, +e.target.value))} />
          </div>
          <div>
            <div className="flex justify-between text-sm font-semibold">
              <span>Neurons / layer</span>
              <span>{neurons}</span>
            </div>
            <input type="range" min={2} max={16} value={neurons} onChange={(e) => (setNeurons(+e.target.value), rebuild(kind, hidden, +e.target.value))} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm font-semibold">
            <span>Learning rate</span>
            <span className="font-mono">{lr}</span>
          </div>
          <input type="range" min={0} max={4} step={1} value={[0.003, 0.01, 0.03, 0.1, 0.3].indexOf(lr)} onChange={(e) => setLr([0.003, 0.01, 0.03, 0.1, 0.3][+e.target.value])} />
        </div>
        <div className="flex gap-2">
          <button className="btn-primary flex-1" onClick={() => (interact(), setRunning((r) => !r))}>
            {running ? '⏸ Pause' : epoch ? '▶ Resume' : '▶ Train'}
          </button>
          <button className="btn-ghost" onClick={() => rebuild()}>
            ↻ Reset
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800/60">
            <div className="label">Epoch</div>
            <div className="font-mono text-lg font-bold">{epoch}</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800/60">
            <div className="label">Loss</div>
            <div className="font-mono text-lg font-bold">{losses.length ? losses[losses.length - 1].toFixed(3) : '—'}</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800/60">
            <div className="label">Accuracy</div>
            <div className={`font-mono text-lg font-bold ${acc > 0.95 ? 'text-emerald-600' : ''}`}>{(acc * 100).toFixed(0)}%</div>
          </div>
        </div>
        <svg viewBox="0 0 200 62" className="h-16 w-full rounded-lg bg-slate-50 dark:bg-slate-800/60" aria-label="Loss over time">
          <path d={spark} fill="none" stroke="#7c3aed" strokeWidth={2} />
        </svg>
        <p className="text-xs text-slate-500">
          Challenge: solve <b>spiral</b> above 95%. Hint: you need depth. With 0 hidden layers it can only draw a straight line!
        </p>
      </div>
    </div>
  );
}
