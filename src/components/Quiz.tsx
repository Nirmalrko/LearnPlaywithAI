import { useMemo, useState } from 'react';
import type { Question } from '../data/types';
import { scoreOrder } from '../lib/game';
import { sfx } from '../lib/sound';
import { celebrate } from '../lib/store';
import { MdInline } from './Md';

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffledDifferent(items: string[]) {
  if (items.length < 2) return items;
  let s = shuffle(items);
  for (let tries = 0; tries < 10 && scoreOrder(s, items); tries++) s = shuffle(items);
  return s;
}

interface Props {
  questions: Question[];
  onFinish: (correct: number, total: number) => number | void; // returns XP gained (optional)
  passMark?: number; // 0..1, only for messaging
  title?: string;
}

export function Quiz({ questions, onFinish, passMark, title = 'Knowledge Check' }: Props) {
  const [run, setRun] = useState(0);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [checked, setChecked] = useState(false);
  const [choice, setChoice] = useState<number | boolean | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  const [gained, setGained] = useState<number | null>(null);
  const q = questions[idx];
  // a fresh shuffle for each question and run
  const pool = useMemo(() => (q && q.kind === 'order' ? shuffledDifferent(q.items) : []), [q, run]);
  const finished = idx >= questions.length;
  const correctCount = answers.filter(Boolean).length;

  const isCorrect = (): boolean => {
    if (q.kind === 'mcq') return choice === q.answer;
    if (q.kind === 'tf') return choice === q.answer;
    return scoreOrder(order, q.items);
  };
  const canCheck = q && (q.kind === 'order' ? order.length === q.items.length : choice !== null);

  const check = () => {
    const ok = isCorrect();
    setChecked(true);
    setAnswers((a) => [...a, ok]);
    if (ok) sfx.correct();
    else sfx.wrong();
  };

  const next = () => {
    const nextIdx = idx + 1;
    setChecked(false);
    setChoice(null);
    setOrder([]);
    setIdx(nextIdx);
    if (nextIdx >= questions.length) {
      const c = answers.filter(Boolean).length;
      const g = onFinish(c, questions.length);
      setGained(typeof g === 'number' ? g : null);
      if (c === questions.length) celebrate();
    }
  };

  const restart = () => {
    setRun((r) => r + 1);
    setIdx(0);
    setAnswers([]);
    setChecked(false);
    setChoice(null);
    setOrder([]);
    setGained(null);
  };

  if (finished) {
    const pct = correctCount / questions.length;
    const passed = passMark === undefined || pct >= passMark;
    return (
      <div className="card animate-pop p-6 text-center sm:p-10">
        <div className="text-6xl">{pct === 1 ? '🏆' : pct >= 0.75 ? '🎉' : pct >= 0.5 ? '👍' : '📚'}</div>
        <h3 className="mt-3 text-2xl font-extrabold">
          {correctCount} / {questions.length} correct
        </h3>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          {pct === 1
            ? 'Perfect score! You nailed it.'
            : passMark !== undefined
              ? passed
                ? pct >= 0.75
                  ? 'Great work — you passed! 🎉'
                  : 'You passed! Retry anytime to improve your score.'
                : `You need ${Math.ceil(passMark * questions.length)} to pass. Review and try again!`
              : pct >= 0.75
                ? 'Great work — you’ve got this topic.'
                : 'Review the lesson and try again — every attempt helps it stick.'}
        </p>
        {gained !== null && gained > 0 && <p className="mt-2 font-bold text-brand-600 dark:text-brand-400">+{gained} XP earned</p>}
        <div className="mx-auto mt-4 flex max-w-xs justify-center gap-1.5">
          {answers.map((a, i) => (
            <span key={i} className={`h-2.5 flex-1 rounded-full ${a ? 'bg-emerald-500' : 'bg-rose-400'}`} />
          ))}
        </div>
        <button className="btn-ghost mt-6" onClick={restart}>
          ↻ Retry quiz
        </button>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-slate-800">
        <span className="font-bold">🧠 {title}</span>
        <span className="text-sm text-slate-500">
          {idx + 1} / {questions.length}
        </span>
      </div>
      <div className="h-1 bg-slate-100 dark:bg-slate-800">
        <div className="h-full bg-brand-500 transition-all" style={{ width: `${(idx / questions.length) * 100}%` }} />
      </div>
      <div key={`${run}-${idx}`} className="animate-slide-in p-5 sm:p-6">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">
          <MdInline text={q.q} />
        </p>

        {q.kind === 'mcq' && (
          <div className="mt-4 grid gap-2">
            {q.options.map((o, i) => {
              const state = !checked ? (choice === i ? 'sel' : 'idle') : i === q.answer ? 'right' : choice === i ? 'wrong' : 'dim';
              return (
                <OptionButton key={i} state={state} onClick={() => !checked && setChoice(i)} letter={String.fromCharCode(65 + i)}>
                  <MdInline text={o} />
                </OptionButton>
              );
            })}
          </div>
        )}

        {q.kind === 'tf' && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[true, false].map((v) => {
              const state = !checked ? (choice === v ? 'sel' : 'idle') : v === q.answer ? 'right' : choice === v ? 'wrong' : 'dim';
              return (
                <OptionButton key={String(v)} state={state} onClick={() => !checked && setChoice(v)}>
                  {v ? '👍 True' : '👎 False'}
                </OptionButton>
              );
            })}
          </div>
        )}

        {q.kind === 'order' && (
          <div className="mt-4">
            <p className="mb-2 text-sm text-slate-500">Tap the items in the correct order. Tap a placed item to remove it.</p>
            <ol className="min-h-12 space-y-1.5 rounded-xl border-2 border-dashed border-slate-200 p-2 dark:border-slate-700">
              {order.map((it, i) => {
                const ok = checked && q.items[i] === it;
                return (
                  <li key={it}>
                    <button
                      disabled={checked}
                      onClick={() => setOrder((o) => o.filter((x) => x !== it))}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium ${
                        checked ? (ok ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-rose-100 dark:bg-rose-900/40') : 'bg-brand-50 dark:bg-brand-900/40'
                      }`}
                    >
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-xs text-white">{i + 1}</span>
                      {it}
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {pool
                .filter((it) => !order.includes(it))
                .map((it) => (
                  <button key={it} disabled={checked} onClick={() => setOrder((o) => [...o, it])} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:border-brand-400 dark:border-slate-700 dark:bg-slate-900">
                    {it}
                  </button>
                ))}
            </div>
            {checked && !scoreOrder(order, q.items) && (
              <p className="mt-2 text-sm">
                <b>Correct order:</b> {q.items.join(' → ')}
              </p>
            )}
          </div>
        )}

        {checked && (
          <div className={`mt-4 animate-slide-in rounded-xl p-4 text-sm ${answers[answers.length - 1] ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200' : 'bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200'}`}>
            <b>{answers[answers.length - 1] ? '✅ Correct! ' : '❌ Not quite. '}</b>
            <MdInline text={q.explain} />
          </div>
        )}

        <div className="mt-5 flex justify-end">
          {!checked ? (
            <button className="btn-primary" disabled={!canCheck} onClick={check}>
              Check answer
            </button>
          ) : (
            <button className="btn-primary" onClick={next}>
              {idx + 1 < questions.length ? 'Next question →' : 'See results'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function OptionButton({ state, onClick, letter, children }: { state: string; onClick: () => void; letter?: string; children: React.ReactNode }) {
  const cls =
    state === 'sel'
      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50'
      : state === 'right'
        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
        : state === 'wrong'
          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40'
          : state === 'dim'
            ? 'border-slate-200 opacity-50 dark:border-slate-700'
            : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800';
  return (
    <button onClick={onClick} className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left font-medium transition ${cls}`}>
      {letter && <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold dark:bg-slate-800">{letter}</span>}
      <span>{children}</span>
    </button>
  );
}
