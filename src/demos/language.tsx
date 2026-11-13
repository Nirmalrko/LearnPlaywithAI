import { useMemo, useState } from 'react';
import { useInteract } from './DemoFrame';
import { Bigram, cosine, tokenId, tokenize } from '../lib/ml';

const TOKEN_COLORS = ['bg-violet-200 dark:bg-violet-800/60', 'bg-cyan-200 dark:bg-cyan-800/60', 'bg-amber-200 dark:bg-amber-800/60', 'bg-emerald-200 dark:bg-emerald-800/60', 'bg-rose-200 dark:bg-rose-800/60'];

// ---------------- Tokenizer ----------------
export function Tokenizer() {
  const interact = useInteract();
  const [text, setText] = useState('Unbelievably, transformers learn tokenization surprisingly well!');
  const [showIds, setShowIds] = useState(false);
  const toks = useMemo(() => tokenize(text), [text]);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => (interact(), setText(e.target.value))}
        rows={2}
        className="w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-sm outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950"
        aria-label="Text to tokenize"
        maxLength={400}
      />
      <div className="mt-3 flex flex-wrap gap-y-1.5 rounded-xl bg-slate-50 p-3 font-mono text-sm dark:bg-slate-800/60">
        {toks.map((t, i) => (
          <span key={i} className={`rounded px-0.5 whitespace-pre ${TOKEN_COLORS[i % TOKEN_COLORS.length]}`} title={`id ${tokenId(t)}`}>
            {showIds ? tokenId(t) : t}
          </span>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span className="chip bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">{toks.length} tokens</span>
        <span className="chip bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{words} words</span>
        <span className="chip bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{text.length} characters</span>
        <button className="btn-ghost ml-auto py-1.5" onClick={() => setShowIds((s) => !s)}>
          {showIds ? 'Show text' : 'Show token IDs'}
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {['The cat sat on the mat.', 'Antidisestablishmentarianism', 'I love learning AI 🤖 in 2026!', 'internationalization'].map((s) => (
          <button key={s} className="rounded-lg bg-slate-100 px-2 py-1 text-xs hover:bg-slate-200 dark:bg-slate-800" onClick={() => (interact(), setText(s))}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------- Embeddings ----------------
// Hand-crafted 6-d vectors: [royalty, maleness, animal, food, young, tech]. Positions are a 2-D layout for display.
const EMB: Record<string, { v: number[]; x: number; y: number }> = {
  king: { v: [0.95, 0.9, 0, 0, 0.1, 0], x: 70, y: 40 },
  queen: { v: [0.95, -0.9, 0, 0, 0.1, 0], x: 150, y: 40 },
  prince: { v: [0.85, 0.9, 0, 0, 0.8, 0], x: 60, y: 85 },
  princess: { v: [0.85, -0.9, 0, 0, 0.8, 0], x: 160, y: 85 },
  man: { v: [0.05, 0.9, 0, 0, 0.1, 0], x: 75, y: 140 },
  woman: { v: [0.05, -0.9, 0, 0, 0.1, 0], x: 145, y: 140 },
  boy: { v: [0, 0.9, 0, 0, 0.9, 0], x: 65, y: 180 },
  girl: { v: [0, -0.9, 0, 0, 0.9, 0], x: 155, y: 180 },
  dog: { v: [0, 0.1, 0.95, 0, 0.1, 0], x: 290, y: 50 },
  puppy: { v: [0, 0.1, 0.95, 0, 0.9, 0], x: 330, y: 80 },
  cat: { v: [0, -0.1, 0.95, 0, 0.1, 0], x: 270, y: 95 },
  kitten: { v: [0, -0.1, 0.95, 0, 0.9, 0], x: 320, y: 125 },
  pizza: { v: [0, 0, 0, 0.95, 0, 0.05], x: 280, y: 200 },
  burger: { v: [0, 0.05, 0.05, 0.95, 0, 0], x: 330, y: 220 },
  apple: { v: [0, 0, 0, 0.8, 0, 0.5], x: 300, y: 250 },
  laptop: { v: [0, 0, 0, 0, 0, 0.95], x: 180, y: 260 },
  robot: { v: [0, 0.2, 0.1, 0, 0, 0.9], x: 140, y: 240 },
};

function nearest(v: number[], exclude: string[]) {
  return Object.entries(EMB)
    .filter(([w]) => !exclude.includes(w))
    .map(([w, e]) => ({ w, s: cosine(v, e.v) }))
    .sort((a, b) => b.s - a.s)[0];
}

export function Embeddings() {
  const interact = useInteract();
  const [sel, setSel] = useState<string[]>(['king', 'queen']);
  const [analogy, setAnalogy] = useState<string | null>(null);
  const click = (w: string) => {
    interact();
    setAnalogy(null);
    setSel((s) => (s.includes(w) ? s.filter((x) => x !== w) : [...s.slice(-1), w]));
  };
  const sim = sel.length === 2 ? cosine(EMB[sel[0]].v, EMB[sel[1]].v) : null;
  const runAnalogy = () => {
    interact();
    const v = EMB.king.v.map((x, i) => x - EMB.man.v[i] + EMB.woman.v[i]);
    const n = nearest(v, ['king', 'man', 'woman']);
    setAnalogy(n.w);
    setSel(['king', n.w]);
  };

  return (
    <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
      <svg viewBox="0 0 400 290" className="demo-canvas" role="img" aria-label="2D map of word embeddings">
        {sel.length === 2 && (
          <line x1={EMB[sel[0]].x} y1={EMB[sel[0]].y} x2={EMB[sel[1]].x} y2={EMB[sel[1]].y} stroke="#7c3aed" strokeWidth={2} strokeDasharray="5 4" />
        )}
        {Object.entries(EMB).map(([w, e]) => {
          const on = sel.includes(w);
          return (
            <g key={w} onClick={() => click(w)} className="cursor-pointer">
              <circle cx={e.x} cy={e.y} r={on ? 8 : 5} fill={on ? '#7c3aed' : '#94a3b8'} />
              <text x={e.x + 10} y={e.y + 4} className={`text-[12px] ${on ? 'fill-brand-600 font-bold' : 'fill-slate-500 dark:fill-slate-400'}`}>
                {w}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="space-y-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">Click any two words.</p>
        {sim !== null && (
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
            <div className="text-sm">
              <b>{sel[0]}</b> ↔ <b>{sel[1]}</b>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 transition-all" style={{ width: `${Math.max(0, sim) * 100}%` }} />
              </div>
              <span className="font-mono text-sm font-bold">{sim.toFixed(2)}</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">{sim > 0.8 ? 'Very similar meaning' : sim > 0.4 ? 'Somewhat related' : 'Unrelated'}</div>
          </div>
        )}
        <button className="btn-primary w-full" onClick={runAnalogy}>
          🧮 king − man + woman = ?
        </button>
        {analogy && (
          <p className="animate-pop text-center text-lg">
            ≈ <b className="text-brand-600 dark:text-brand-400">{analogy}</b> 👑
          </p>
        )}
        <p className="text-xs text-slate-500">Real models learn these vectors (with hundreds of dimensions) purely from how words are used in text.</p>
      </div>
    </div>
  );
}

// ---------------- Next word (bigram LM) ----------------
const CORPUS = `the robot learns to play a game . the robot learns from data . the model learns patterns from data .
the cat sat on the mat . the cat chased the robot . a neural network learns from examples .
the model predicts the next word . the next word is chosen by probability . ai can write a story .
the story is about a robot and a cat . the robot likes the cat . data is the fuel of ai .
a good model needs good data . the game is fun . learning ai is fun . the cat likes data .`;
const LM = new Bigram(CORPUS);

export function NextWord() {
  const interact = useInteract();
  const [words, setWords] = useState<string[]>(['the']);
  const [temp, setTemp] = useState(0.8);
  const last = words[words.length - 1];
  const dist = LM.next(last, temp).slice(0, 6);

  const add = (w: string) => {
    interact();
    setWords((ws) => [...ws, w]);
  };
  const generate = () => {
    interact();
    const out = [...words];
    for (let i = 0; i < 10; i++) {
      const n = LM.sample(out[out.length - 1], temp);
      if (!n) break;
      out.push(n);
      if (n === '.') break;
    }
    setWords(out);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <div className="min-h-24 rounded-xl bg-slate-50 p-4 text-lg leading-relaxed dark:bg-slate-800/60">
          {words.map((w, i) => (
            <span key={i} className={i === words.length - 1 ? 'rounded bg-brand-100 px-1 font-semibold dark:bg-brand-900/60' : ''}>
              {w}{' '}
            </span>
          ))}
          <span className="animate-pulse">▍</span>
        </div>
        <div>
          <div className="flex justify-between text-sm font-semibold">
            <span>Temperature</span>
            <span className="font-mono">{temp.toFixed(1)}</span>
          </div>
          <input type="range" min={0.1} max={2} step={0.1} value={temp} onChange={(e) => setTemp(+e.target.value)} />
          <div className="flex justify-between text-xs text-slate-500">
            <span>focused</span>
            <span>creative / chaotic</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary flex-1" onClick={generate}>
            ✨ Auto-generate
          </button>
          <button className="btn-ghost" onClick={() => setWords(['the'])}>
            Reset
          </button>
          <button className="btn-ghost" onClick={() => setWords((w) => (w.length > 1 ? w.slice(0, -1) : w))}>
            ⌫
          </button>
        </div>
      </div>
      <div>
        <div className="label mb-2">Next-word probabilities after “{last}”</div>
        {dist.length ? (
          <div className="space-y-1.5">
            {dist.map((d) => (
              <button key={d.word} onClick={() => add(d.word)} className="flex w-full items-center gap-2 rounded-lg p-1 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                <span className="w-20 truncate font-mono font-semibold">{d.word}</span>
                <div className="h-4 flex-1 overflow-hidden rounded bg-slate-200 dark:bg-slate-700">
                  <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${d.p * 100}%` }} />
                </div>
                <span className="w-10 text-right font-mono text-xs">{(d.p * 100).toFixed(0)}%</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">This model has never seen a word after “{last}”. Reset to continue.</p>
        )}
        <p className="mt-3 text-xs text-slate-500">
          Click a word to choose it yourself. This model learned from just 20 sentences by counting word pairs. GPT-style models do the same job with a Transformer trained on trillions of words.
        </p>
      </div>
    </div>
  );
}

// ---------------- Attention ----------------
const SENT = ['The', 'animal', 'didn’t', 'cross', 'the', 'street', 'because', 'it', 'was', 'too', 'tired'];
function attentionFor(i: number, ending: 'tired' | 'wide'): number[] {
  const w = SENT.map(() => 0.03);
  const set = (k: number, v: number) => (w[k] = v);
  const word = i === 10 ? ending : SENT[i];
  if (word === 'it') {
    if (ending === 'tired') {
      set(1, 0.62);
      set(5, 0.1);
    } else {
      set(5, 0.62);
      set(1, 0.1);
    }
    set(10, 0.15);
  } else if (word === 'tired') {
    set(7, 0.4);
    set(1, 0.35);
  } else if (word === 'wide') {
    set(7, 0.4);
    set(5, 0.35);
  } else if (word === 'cross') {
    set(1, 0.35);
    set(5, 0.4);
  } else if (word === 'street') {
    set(3, 0.4);
    set(4, 0.3);
  } else if (word === 'animal') {
    set(0, 0.4);
    set(3, 0.25);
  } else if (word === 'because') {
    set(3, 0.3);
    set(10, 0.3);
  } else {
    set(Math.min(SENT.length - 1, i + 1), 0.3);
    set(Math.max(0, i - 1), 0.3);
  }
  set(i, Math.max(w[i], 0.12));
  const s = w.reduce((a, b) => a + b, 0);
  return w.map((x) => x / s);
}

export function Attention() {
  const interact = useInteract();
  const [focus, setFocus] = useState(7);
  const [ending, setEnding] = useState<'tired' | 'wide'>('tired');
  const att = attentionFor(focus, ending);
  const words = SENT.map((w, i) => (i === 10 ? ending : w));
  const max = Math.max(...att);
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-50 p-4 text-lg dark:bg-slate-800/60">
        {words.map((w, i) => (
          <button
            key={i}
            onClick={() => (interact(), setFocus(i))}
            className={`rounded-lg px-2 py-1 transition ${i === focus ? 'ring-2 ring-slate-900 dark:ring-white' : ''}`}
            style={{ background: `rgba(124, 58, 237, ${(att[i] / max) * 0.85})`, color: att[i] / max > 0.5 ? 'white' : undefined }}
          >
            {w}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span>Change the last word:</span>
        {(['tired', 'wide'] as const).map((e) => (
          <button key={e} onClick={() => (interact(), setEnding(e), setFocus(7))} className={`rounded-lg px-3 py-1 font-semibold ${ending === e ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
            “{e}”
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
        Darker = more attention. When the sentence ends with <b>tired</b>, “it” attends to <b>animal</b>. Change it to <b>wide</b> and “it” now attends to <b>street</b>. The model resolves meaning from context — that is attention. (Weights here are illustrative.)
      </p>
    </div>
  );
}
