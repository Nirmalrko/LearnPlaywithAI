import { Link, useParams } from 'react-router-dom';
import { WORLDS } from '../data/worlds';
import { isWorldUnlocked, worldProgress } from '../lib/game';
import { useProgress } from '../lib/store';
import { Ring } from '../components/Ring';
import { NotFound } from './NotFound';

export function WorldPage() {
  const { worldId } = useParams();
  const { progress } = useProgress();
  const wi = WORLDS.findIndex((w) => w.id === worldId);
  if (wi < 0) return <NotFound />;
  const world = WORLDS[wi];
  const unlocked = isWorldUnlocked(progress, WORLDS, wi);
  const wp = worldProgress(progress, world);

  return (
    <div className="space-y-6">
      <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-brand-600">
        ← All worlds
      </Link>
      <header className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center" style={{ borderTop: `5px solid ${world.color}` }}>
        <span className="text-6xl">{world.emoji}</span>
        <div className="flex-1">
          <div className="text-xs font-bold tracking-wider uppercase" style={{ color: world.color }}>
            World {wi + 1} of {WORLDS.length}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">{world.title}</h1>
          <p className="text-slate-500">{world.tagline}</p>
        </div>
        <Ring pct={wp.pct} color={world.color} size={72} stroke={7} />
      </header>

      {!unlocked ? (
        <div className="card p-8 text-center">
          <div className="text-5xl">🔒</div>
          <p className="mt-3 font-semibold">Complete at least half of World {wi} ({WORLDS[wi - 1].title}) to unlock this world.</p>
          <p className="mt-1 text-sm text-slate-500">Or turn on Explorer Mode in Settings to unlock everything.</p>
          <Link to={`/world/${WORLDS[wi - 1].id}`} className="btn-primary mt-4">
            Go to World {wi}
          </Link>
        </div>
      ) : (
        <ol className="space-y-3">
          {world.lessons.map((l, i) => {
            const done = progress.completedLessons.includes(l.id);
            const q = progress.quiz[l.id];
            const demos = l.blocks.filter((b) => b.type === 'demo').length;
            return (
              <li key={l.id}>
                <Link to={`/lesson/${l.id}`} className="card group flex items-center gap-4 p-4 transition hover:border-brand-300 hover:shadow-md sm:p-5">
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg font-bold ${done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}
                  >
                    {done ? '✓' : i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold group-hover:text-brand-600">{l.title}</h3>
                    <p className="truncate text-sm text-slate-500">{l.summary}</p>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span>⏱ {l.minutes} min</span>
                      {demos > 0 && <span>🕹️ {demos} interactive</span>}
                      <span>❓ {l.quiz.length} questions</span>
                      {q && (
                        <span className={`font-semibold ${q.best === q.total ? 'text-emerald-600' : 'text-amber-600'}`}>
                          Best: {q.best}/{q.total}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-brand-500">→</span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
