import { useProgress } from '../lib/store';

export function Toasts() {
  const { toasts, dismissToast } = useProgress();
  return (
    <div className="no-print pointer-events-none fixed right-4 bottom-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismissToast(t.id)}
          className="card pointer-events-auto flex animate-slide-in items-center gap-3 p-3 text-left shadow-lg"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-2xl dark:bg-brand-900/40">{t.emoji}</span>
          <span>
            <span className="block font-bold text-slate-900 dark:text-white">{t.title}</span>
            {t.body && <span className="block text-sm text-slate-500 dark:text-slate-400">{t.body}</span>}
          </span>
        </button>
      ))}
    </div>
  );
}
