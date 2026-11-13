import { useState } from 'react';
import { useInteract } from './DemoFrame';
import { sfx } from '../lib/sound';
import { MdInline } from '../components/Md';

export interface Scenario {
  prompt: string;
  detail?: string;
  options: string[];
  answer: number;
  explain: string;
}

/** A quick-fire card game: read a scenario, pick an answer, get instant feedback. */
export function ScenarioGame({ scenarios, title = 'Score' }: { scenarios: Scenario[]; title?: string }) {
  const interact = useInteract();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = i >= scenarios.length;
  const s = scenarios[i];

  const choose = (k: number) => {
    if (picked !== null) return;
    interact();
    setPicked(k);
    if (k === s.answer) {
      setScore((x) => x + 1);
      sfx.correct();
    } else sfx.wrong();
  };

  if (done)
    return (
      <div className="animate-pop py-6 text-center">
        <div className="text-5xl">{score === scenarios.length ? '🏆' : score >= scenarios.length / 2 ? '🎉' : '💪'}</div>
        <p className="mt-2 text-xl font-bold">
          {title}: {score} / {scenarios.length}
        </p>
        <button
          className="btn-ghost mt-4"
          onClick={() => {
            setI(0);
            setScore(0);
            setPicked(null);
          }}
        >
          ↻ Play again
        </button>
      </div>
    );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
        <span>
          Card {i + 1} of {scenarios.length}
        </span>
        <span className="font-semibold text-brand-600 dark:text-brand-400">
          {title}: {score}
        </span>
      </div>
      <div key={i} className="animate-slide-in rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">
          <MdInline text={s.prompt} />
        </p>
        {s.detail && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{s.detail}</p>}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {s.options.map((o, k) => {
          const state = picked === null ? 'idle' : k === s.answer ? 'right' : k === picked ? 'wrong' : 'dim';
          return (
            <button
              key={k}
              onClick={() => choose(k)}
              className={`rounded-xl border-2 px-4 py-3 text-left font-medium transition ${
                state === 'idle'
                  ? 'border-slate-200 hover:border-brand-400 hover:bg-brand-50 dark:border-slate-700 dark:hover:bg-brand-950/40'
                  : state === 'right'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : state === 'wrong'
                      ? 'border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                      : 'border-slate-200 opacity-50 dark:border-slate-700'
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="mt-3 animate-slide-in rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700">
          <span className="font-bold">{picked === s.answer ? '✅ Correct! ' : '❌ Not quite. '}</span>
          <MdInline text={s.explain} />
          <div className="mt-3 text-right">
            <button
              className="btn-primary"
              onClick={() => {
                setI((x) => x + 1);
                setPicked(null);
              }}
            >
              {i + 1 < scenarios.length ? 'Next →' : 'See score'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
