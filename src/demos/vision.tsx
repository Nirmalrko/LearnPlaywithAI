import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { useInteract } from './DemoFrame';
import { convolve } from '../lib/ml';

// ---------------- Pixels ----------------
const N = 16;

function smiley(): number[] {
  const g = new Array(N * N).fill(0);
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      const d = Math.hypot(x - 7.5, y - 7.5);
      if (d < 7.2 && d > 5.9) g[y * N + x] = 255;
      if ((x === 5 || x === 10) && (y === 5 || y === 6)) g[y * N + x] = 255;
      if (y === 10 && x >= 5 && x <= 10) g[y * N + x] = 220;
      if (y === 9 && (x === 4 || x === 11)) g[y * N + x] = 220;
    }
  return g;
}

export function Pixels() {
  const interact = useInteract();
  const [grid, setGrid] = useState<number[]>(smiley);
  const [showNums, setShowNums] = useState(false);
  const [brush, setBrush] = useState(255);
  const drawing = useRef(false);

  const paint = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(((e.clientX - r.left) / r.width) * N);
    const y = Math.floor(((e.clientY - r.top) / r.height) * N);
    if (x < 0 || y < 0 || x >= N || y >= N) return;
    setGrid((g) => {
      if (g[y * N + x] === brush) return g;
      const n = [...g];
      n[y * N + x] = brush;
      return n;
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
      <div
        className="demo-canvas grid aspect-square cursor-crosshair select-none overflow-hidden"
        style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}
        onPointerDown={(e) => {
          interact();
          drawing.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          paint(e);
        }}
        onPointerMove={(e) => drawing.current && paint(e)}
        onPointerUp={() => (drawing.current = false)}
        role="img"
        aria-label="16 by 16 pixel drawing grid"
      >
        {grid.map((v, i) => (
          <div
            key={i}
            className="flex items-center justify-center border-[0.5px] border-slate-500/10 font-mono text-[7px] sm:text-[9px]"
            style={{ background: `rgb(${v},${v},${v})`, color: v > 128 ? '#000' : '#fff' }}
          >
            {showNums ? v : ''}
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <div className="label">Brush</div>
        <div className="flex gap-2">
          {[
            [255, 'White (255)'],
            [128, 'Grey (128)'],
            [0, 'Black (0)'],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setBrush(v as number)}
              className={`flex-1 rounded-lg border-2 px-2 py-2 text-xs font-semibold ${brush === v ? 'border-brand-500' : 'border-transparent'}`}
              style={{ background: `rgb(${v},${v},${v})`, color: (v as number) > 128 ? '#000' : '#fff' }}
            >
              {l}
            </button>
          ))}
        </div>
        <button className="btn-primary w-full" onClick={() => (interact(), setShowNums((s) => !s))}>
          {showNums ? '🙈 Hide numbers' : '🔢 See what the computer sees'}
        </button>
        <div className="flex gap-2">
          <button className="btn-ghost flex-1" onClick={() => setGrid(new Array(N * N).fill(0))}>
            Clear
          </button>
          <button className="btn-ghost flex-1" onClick={() => setGrid(smiley())}>
            Smiley
          </button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This tiny image is <b>{N}×{N} = {N * N}</b> numbers. A phone photo is about <b>36 million</b> (12 MP × 3 colours).
        </p>
      </div>
    </div>
  );
}

// ---------------- Convolution ----------------
const S = 96;
const KERNELS: Record<string, { k: number[]; desc: string }> = {
  Original: { k: [0, 0, 0, 0, 1, 0, 0, 0, 0], desc: 'Identity: each pixel stays itself.' },
  Blur: { k: [1, 2, 1, 2, 4, 2, 1, 2, 1].map((v) => v / 16), desc: 'Averages neighbours — smooths noise.' },
  Sharpen: { k: [0, -1, 0, -1, 5, -1, 0, -1, 0], desc: 'Boosts a pixel against its neighbours.' },
  'Vertical edges': { k: [-1, 0, 1, -2, 0, 2, -1, 0, 1], desc: 'Sobel-X: lights up left↔right changes.' },
  'Horizontal edges': { k: [-1, -2, -1, 0, 0, 0, 1, 2, 1], desc: 'Sobel-Y: lights up top↔bottom changes.' },
  Outline: { k: [-1, -1, -1, -1, 8, -1, -1, -1, -1], desc: 'Detects edges in every direction.' },
};

function sceneImage(): number[] {
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#87a8c8';
  ctx.fillRect(0, 0, S, S);
  ctx.fillStyle = '#f5d76e';
  ctx.beginPath();
  ctx.arc(74, 20, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#4a7c3a';
  ctx.fillRect(0, 70, S, 26);
  ctx.fillStyle = '#c9b38a';
  ctx.fillRect(18, 44, 40, 30);
  ctx.fillStyle = '#8b3a3a';
  ctx.beginPath();
  ctx.moveTo(12, 46);
  ctx.lineTo(38, 24);
  ctx.lineTo(64, 46);
  ctx.fill();
  ctx.fillStyle = '#3d2b1f';
  ctx.fillRect(32, 56, 10, 18);
  ctx.fillStyle = '#e8f1f8';
  ctx.fillRect(22, 50, 7, 7);
  ctx.fillRect(47, 50, 7, 7);
  const d = ctx.getImageData(0, 0, S, S).data;
  const out: number[] = [];
  for (let i = 0; i < S * S; i++) out.push(0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]);
  return out;
}

export function Convolution() {
  const interact = useInteract();
  const [name, setName] = useState('Outline');
  const src = useMemo(() => (typeof document === 'undefined' ? [] : sceneImage()), []);
  const inRef = useRef<HTMLCanvasElement>(null);
  const outRef = useRef<HTMLCanvasElement>(null);
  const kernel = KERNELS[name];

  useEffect(() => {
    const paint = (c: HTMLCanvasElement | null, px: number[], abs: boolean) => {
      if (!c) return;
      const ctx = c.getContext('2d')!;
      const img = ctx.createImageData(S, S);
      for (let i = 0; i < S * S; i++) {
        const v = Math.max(0, Math.min(255, abs ? Math.abs(px[i]) : px[i]));
        img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
        img.data[i * 4 + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    };
    paint(inRef.current, src, false);
    const isEdge = kernel.k.reduce((a, b) => a + b, 0) === 0;
    paint(outRef.current, convolve(src, S, S, kernel.k), isEdge);
  }, [src, kernel]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {Object.keys(KERNELS).map((k) => (
          <button
            key={k}
            onClick={() => (interact(), setName(k))}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${name === k ? 'bg-brand-600 text-white' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800'}`}
          >
            {k}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        <figure>
          <canvas ref={inRef} width={S} height={S} className="demo-canvas aspect-square [image-rendering:pixelated]" />
          <figcaption className="mt-1 text-center text-xs text-slate-500">Input image</figcaption>
        </figure>
        <div className="text-center">
          <div className="grid grid-cols-3 gap-0.5 rounded-lg bg-brand-100 p-1 dark:bg-brand-900/50">
            {kernel.k.map((v, i) => (
              <div key={i} className="grid h-7 w-7 place-items-center rounded bg-white font-mono text-[10px] font-bold sm:h-9 sm:w-9 sm:text-xs dark:bg-slate-900">
                {Number.isInteger(v) ? v : v.toFixed(2).replace(/^0/, '')}
              </div>
            ))}
          </div>
          <div className="mt-1 text-xs font-semibold text-brand-600">3×3 kernel</div>
        </div>
        <figure>
          <canvas ref={outRef} width={S} height={S} className="demo-canvas aspect-square [image-rendering:pixelated]" />
          <figcaption className="mt-1 text-center text-xs text-slate-500">Feature map</figcaption>
        </figure>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
        <b>{name}:</b> {kernel.desc} The kernel slides over every pixel: multiply the 9 neighbours by the 9 numbers, add them up.
      </p>
    </div>
  );
}
