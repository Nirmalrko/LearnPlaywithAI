import { createContext, useCallback, useContext, useRef, type ReactNode } from 'react';
import { useProgress } from '../lib/store';
import type { DemoId } from '../data/types';

const InteractCtx = createContext<() => void>(() => {});

/** Demos call this on their first meaningful interaction to award XP once. */
export function useInteract() {
  return useContext(InteractCtx);
}

export function DemoFrame({ id, title, caption, children }: { id: DemoId; title: string; caption?: string; children: ReactNode }) {
  const { progress, markDemo } = useProgress();
  const tried = progress.demosTried.includes(id);
  const fired = useRef(false);
  const onInteract = useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    markDemo(id);
  }, [id, markDemo]);

  return (
    <section className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-brand-200 bg-white dark:border-brand-900 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-2 border-b border-brand-100 bg-gradient-to-r from-brand-50 to-cyan-50 px-4 py-3 dark:border-brand-900 dark:from-brand-950/60 dark:to-cyan-950/40">
        <span className="chip bg-brand-600 text-white">▶ Interactive</span>
        <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
        <span className={`chip ml-auto ${tried ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'}`}>
          {tried ? '✓ Explored' : '+15 XP'}
        </span>
      </div>
      {caption && <p className="px-4 pt-3 text-sm text-slate-600 dark:text-slate-400">{caption}</p>}
      <div className="p-4">
        <InteractCtx.Provider value={onInteract}>{children}</InteractCtx.Provider>
      </div>
    </section>
  );
}
