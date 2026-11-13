import { useEffect, useMemo, useRef, useState } from 'react';
import { useInteract } from './DemoFrame';
import { cosine, rng, gaussian } from '../lib/ml';
import { sfx } from '../lib/sound';

// ---------------- Prompt lab ----------------
const CHECKS: { id: string; label: string; tip: string; pts: number; test: (p: string) => boolean }[] = [
  { id: 'role', label: 'Gives a role or context', tip: 'Start with “You are a…” or describe who it’s for.', pts: 15, test: (p) => /\b(you are|act as|as an? |imagine you)/i.test(p) },
  { id: 'task', label: 'Clear task verb', tip: 'Use a direct verb: write, summarise, explain, list, compare…', pts: 15, test: (p) => /\b(write|summari[sz]e|explain|list|compare|create|draft|translate|classify|generate|analy[sz]e|suggest|plan)\b/i.test(p) },
  { id: 'audience', label: 'Defines the audience', tip: 'Who will read it? e.g. “for beginners”, “for a CEO”.', pts: 15, test: (p) => /\b(for (a |an |the )?(beginner|kid|child|student|ceo|manager|customer|developer|team|non-?technical|expert|teen|reader|audience)s?|audience|reader)/i.test(p) },
  { id: 'format', label: 'Specifies output format', tip: 'Ask for bullets, a table, JSON, steps, headings…', pts: 15, test: (p) => /\b(bullet|table|json|list|steps|numbered|headings?|markdown|paragraphs?|format)\b/i.test(p) },
  { id: 'length', label: 'Sets length', tip: 'Add a limit: “in 3 bullet points”, “under 100 words”.', pts: 10, test: (p) => /\b\d+\s*(words?|sentences?|bullets?|bullet points|points|paragraphs?|lines?|items?|steps?)\b|\b(short|brief|concise|one[- ]page)\b/i.test(p) },
  { id: 'tone', label: 'Sets tone / style', tip: 'Friendly? formal? playful? Say so.', pts: 10, test: (p) => /\b(tone|friendly|formal|casual|playful|professional|simple|warm|upbeat|style|humou?r)\b/i.test(p) },
  { id: 'example', label: 'Includes an example or constraint', tip: 'Show an example or say what to avoid: “e.g.”, “avoid jargon”.', pts: 10, test: (p) => /\b(example|e\.g\.|for instance|such as|avoid|don'?t|do not|must|only)\b/i.test(p) },
  { id: 'detail', label: 'Enough detail (25+ words)', tip: 'Short prompts leave the model guessing.', pts: 10, test: (p) => p.trim().split(/\s+/).length >= 25 },
];

export function PromptLab() {
  const interact = useInteract();
  const [p, setP] = useState('Write about AI.');
  const results = CHECKS.map((c) => ({ ...c, ok: c.test(p) }));
  const score = results.reduce((s, r) => s + (r.ok ? r.pts : 0), 0);
  const prev = useRef(score);
  useEffect(() => {
    if (score === 100 && prev.current < 100) sfx.levelUp();
    prev.current = score;
  }, [score]);
  const grade = score >= 90 ? ['A+', 'text-emerald-600'] : score >= 70 ? ['B', 'text-lime-600'] : score >= 45 ? ['C', 'text-amber-600'] : ['D', 'text-rose-600'];

  return (
    <div className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
      <div>
        <textarea
          value={p}
          onChange={(e) => (interact(), setP(e.target.value))}
          rows={7}
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950"
          aria-label="Your prompt"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          <button className="rounded-lg bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800" onClick={() => setP('Write about AI.')}>
            Weak example
          </button>
          <button
            className="rounded-lg bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800"
            onClick={() => (
              interact(),
              setP(
                'You are a friendly science teacher. Explain what machine learning is for a non-technical audience of 12-year-old students. Use one everyday example, such as a spam filter. Format the answer as 3 short bullet points, under 80 words in total, in a warm and playful tone. Avoid jargon.',
              )
            )}
          >
            Strong example
          </button>
        </div>
      </div>
      <div>
        <div className="flex items-end justify-between">
          <div>
            <div className="label">Prompt score</div>
            <div className="text-4xl font-black">{score}</div>
          </div>
          <div className={`text-5xl font-black ${grade[1]}`}>{grade[0]}</div>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div className="h-full bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-500 transition-all duration-500" style={{ width: `${score}%` }} />
        </div>
        <ul className="mt-3 space-y-1.5 text-sm">
          {results.map((r) => (
            <li key={r.id} className="flex gap-2">
              <span>{r.ok ? '✅' : '⬜'}</span>
              <span>
                <span className={r.ok ? 'font-semibold' : ''}>{r.label}</span>
                {!r.ok && <span className="block text-xs text-slate-500">{r.tip}</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ---------------- RAG ----------------
const DOCS = [
  { id: 'Leave policy §1', text: 'Full-time employees receive 25 days of paid vacation per year. Unused vacation days can carry over up to 5 days into the next year.' },
  { id: 'Leave policy §2', text: 'Sick leave is unlimited with manager approval. A doctor note is required after 3 consecutive sick days.' },
  { id: 'Remote work §1', text: 'Employees may work remotely up to 3 days per week. Fully remote arrangements require director approval.' },
  { id: 'Expenses §4', text: 'Travel expenses are reimbursed within 14 days. Submit receipts in the expense app. Meals are covered up to $60 per day.' },
  { id: 'Equipment §2', text: 'New employees receive a laptop and a $500 home office budget for a desk, chair or monitor.' },
  { id: 'Benefits §3', text: 'The company matches retirement contributions up to 4 percent of salary. Health insurance starts on the first day of employment.' },
];
const STOP = new Set('a an the is are of to in on for and or how many much do does i my can what when who be per up with into get we our it'.split(' '));
const stem = (w: string) => w.replace(/(ing|ed|es|s)$/, '');
const SYN: Record<string, string> = { holiday: 'vacation', holidays: 'vacation', pto: 'vacation', home: 'remote', wfh: 'remote', computer: 'laptop', ill: 'sick', sickness: 'sick', pension: 'retirement', food: 'meals', reimburse: 'reimbursed' };
function terms(t: string) {
  return t
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w))
    .map((w) => stem(SYN[w] ?? w));
}
const VOCAB = [...new Set(DOCS.flatMap((d) => terms(d.text)))];
const vec = (t: string) => {
  const ts = terms(t);
  return VOCAB.map((v) => ts.filter((x) => x === v).length);
};
const DOC_VECS = DOCS.map((d) => vec(d.text));

export function RagDemo() {
  const interact = useInteract();
  const [q, setQ] = useState('How many holiday days do I get?');
  const [step, setStep] = useState(0);
  const ranked = useMemo(
    () =>
      DOCS.map((d, i) => ({ ...d, s: cosine(vec(q), DOC_VECS[i]) }))
        .sort((a, b) => b.s - a.s),
    [q],
  );
  const top = ranked.slice(0, 2).filter((r) => r.s > 0);
  const steps = ['1. Embed question', '2. Retrieve', '3. Augment prompt', '4. Generate'];

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={q}
          onChange={(e) => (setQ(e.target.value), setStep(0))}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950"
          aria-label="Question"
        />
        <button className="btn-primary" onClick={() => (interact(), setStep((s) => Math.min(4, s + 1)))} disabled={step >= 4}>
          {step === 0 ? '▶ Start' : step < 4 ? 'Next step →' : 'Done ✓'}
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {['How many holiday days do I get?', 'Can I work from home?', 'What is the meal allowance?', 'Do I get a pension match?', 'Can I bring my dog to work?'].map((s) => (
          <button key={s} className="rounded-lg bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800" onClick={() => (setQ(s), setStep(0))}>
            {s}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-4 gap-1">
        {steps.map((s, i) => (
          <div key={s} className={`rounded-lg px-1 py-1.5 text-center text-[11px] font-semibold sm:text-xs ${step > i ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
            {s}
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-3 text-sm">
        {step >= 1 && (
          <div className="animate-slide-in rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
            <b>Question vector</b> (key terms): <span className="font-mono text-brand-600 dark:text-brand-400">[{terms(q).join(', ')}]</span>
          </div>
        )}
        {step >= 2 && (
          <div className="animate-slide-in space-y-1">
            <b>Similarity to every chunk in the vector DB:</b>
            {ranked.map((r) => (
              <div key={r.id} className={`flex items-center gap-2 rounded-lg p-1.5 ${top.includes(r) ? 'bg-emerald-50 dark:bg-emerald-950/40' : ''}`}>
                <span className="w-28 shrink-0 text-xs font-semibold">{r.id}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="h-full bg-emerald-500" style={{ width: `${r.s * 100}%` }} />
                </div>
                <span className="w-10 text-right font-mono text-xs">{r.s.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
        {step >= 3 && (
          <pre className="animate-slide-in overflow-x-auto rounded-xl bg-slate-900 p-3 font-mono text-xs whitespace-pre-wrap text-slate-100">
            {`SYSTEM: Answer ONLY using the context. Cite the source. If the answer is not in the context, say "I don't know".\n\nCONTEXT:\n${
              top.length ? top.map((t) => `[${t.id}] ${t.text}`).join('\n') : '(no relevant chunks found)'
            }\n\nQUESTION: ${q}`}
          </pre>
        )}
        {step >= 4 && (
          <div className="animate-pop rounded-xl border-2 border-emerald-400 p-3">
            <b>🤖 Answer:</b>{' '}
            {top.length ? (
              <>
                {top[0].text} <span className="chip bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">source: {top[0].id}</span>
              </>
            ) : (
              <>I don’t know — the handbook doesn’t cover that. Please ask HR. (This is RAG avoiding a hallucination!)</>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- Diffusion ----------------
const DS = 64;
const SCENES: Record<string, (x: number, y: number) => [number, number, number]> = {
  'a sunset over the sea': (x, y) => {
    if (y > 40) {
      const t = (y - 40) / 24;
      const glint = Math.abs(x - 32) < 10 - t * 6 && (y % 4 < 2) ? 80 : 0;
      return [20 + glint + 40 * (1 - t), 50 + glint * 0.6, 110 - t * 40];
    }
    const d = Math.hypot(x - 32, y - 38);
    if (d < 11) return [255, 200, 80];
    const t = y / 40;
    return [255 - t * 30, 120 + t * 60, 90 + (1 - t) * 90];
  },
  'a green alien face': (x, y) => {
    const d = Math.hypot((x - 32) / 1.0, (y - 34) / 1.25);
    if (d < 24) {
      if (Math.hypot(x - 23, y - 30) < 6 || Math.hypot(x - 41, y - 30) < 6) return [15, 15, 25];
      if (y > 45 && y < 48 && Math.abs(x - 32) < 7) return [30, 60, 30];
      return [120, 210, 90];
    }
    return [30, 20, 70];
  },
  'a red heart on pink': (x, y) => {
    const X = (x - 32) / 18;
    const Y = -(y - 30) / 18;
    const v = (X * X + Y * Y - 1) ** 3 - X * X * Y * Y * Y;
    return v < 0 ? [225, 30, 60] : [250, 200, 215];
  },
};

export function Diffusion() {
  const interact = useInteract();
  const [prompt, setPrompt] = useState(Object.keys(SCENES)[0]);
  const [t, setT] = useState(50); // 50 = pure noise, 0 = clean
  const [playing, setPlaying] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const noise = useMemo(() => {
    const r = rng(9);
    return Array.from({ length: DS * DS * 3 }, () => gaussian(r));
  }, []);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    const img = ctx.createImageData(DS, DS);
    const f = SCENES[prompt];
    const alpha = Math.cos(((t / 50) * Math.PI) / 2) ** 2; // cosine noise schedule
    const a = Math.sqrt(alpha);
    const b = Math.sqrt(1 - alpha);
    for (let y = 0; y < DS; y++)
      for (let x = 0; x < DS; x++) {
        const px = f(x, y);
        const i = y * DS + x;
        for (let ch = 0; ch < 3; ch++) {
          const clean = px[ch] / 127.5 - 1;
          const v = a * clean + b * noise[i * 3 + ch];
          img.data[i * 4 + ch] = Math.max(0, Math.min(255, (v + 1) * 127.5));
        }
        img.data[i * 4 + 3] = 255;
      }
    ctx.putImageData(img, 0, 0);
  }, [t, prompt, noise]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setT((v) => {
        if (v <= 0) {
          setPlaying(false);
          return 0;
        }
        return v - 1;
      });
    }, 70);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <canvas ref={canvas} width={DS} height={DS} className="demo-canvas aspect-square [image-rendering:pixelated]" aria-label="Diffusion output" />
      <div className="space-y-3">
        <div>
          <div className="label mb-1.5">Prompt</div>
          <div className="space-y-1.5">
            {Object.keys(SCENES).map((p) => (
              <button
                key={p}
                onClick={() => (setPrompt(p), setT(50), setPlaying(false))}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium ${prompt === p ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
              >
                “{p}”
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm font-semibold">
            <span>Denoising step</span>
            <span className="font-mono">{50 - t} / 50</span>
          </div>
          <input type="range" min={0} max={50} value={50 - t} onChange={(e) => (interact(), setT(50 - +e.target.value))} />
        </div>
        <div className="flex gap-2">
          <button className="btn-primary flex-1" onClick={() => (interact(), t === 0 && setT(50), setPlaying(true))}>
            ✨ Generate
          </button>
          <button className="btn-ghost" onClick={() => (setPlaying(false), setT(50))}>
            ↻ Noise
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Here we blend a known image with noise to show the process. A real diffusion model <i>predicts</i> the noise to remove at each step, guided by your prompt — the image never existed before.
        </p>
      </div>
    </div>
  );
}
