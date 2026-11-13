import { WORLDS } from '../data/worlds';
import { BADGES } from '../lib/game';
import { useProgress } from '../lib/store';

export function BadgesPage() {
  const { progress } = useProgress();
  const earned = BADGES.filter((b) => b.earned(progress, WORLDS));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Badges</h1>
        <p className="text-slate-500">
          {earned.length} of {BADGES.length} unlocked. Collect them all!
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {BADGES.map((b) => {
          const on = b.earned(progress, WORLDS);
          return (
            <div key={b.id} className={`card p-5 text-center transition ${on ? 'ring-2 ring-amber-300 dark:ring-amber-600' : 'opacity-50'}`}>
              <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full text-4xl ${on ? 'bg-gradient-to-br from-amber-200 to-amber-400 shadow-md' : 'bg-slate-100 grayscale dark:bg-slate-800'}`}>
                {on ? b.emoji : '🔒'}
              </div>
              <div className="mt-3 font-bold">{b.title}</div>
              <div className="mt-1 text-xs text-slate-500">{b.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
