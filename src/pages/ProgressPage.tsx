import { Link } from 'react-router-dom';
import { ALL_LESSONS, WORLDS } from '../data/worlds';
import { LEVELS, levelFor, worldProgress } from '../lib/game';
import { useProgress } from '../lib/store';
import { DEMOS } from '../demos';

export function ProgressPage() {
  const { progress } = useProgress();
  const lvl = levelFor(progress.xp);
  const quizEntries = ALL_LESSONS.filter((x) => progress.quiz[x.lesson.id]);
  const totalCorrect = quizEntries.reduce((s, x) => s + progress.quiz[x.lesson.id].best, 0);
  const totalQs = quizEntries.reduce((s, x) => s + progress.quiz[x.lesson.id].total, 0);
  const weak = quizEntries.filter((x) => {
    const r = progress.quiz[x.lesson.id];
    return r.best / r.total < 0.75;
  });
  const overall = progress.completedLessons.length / ALL_LESSONS.length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Your progress</h1>

      <section className="card grid gap-6 p-6 md:grid-cols-[auto_1fr]">
        <div className="grid h-28 w-28 place-items-center rounded-3xl bg-gradient-to-br from-brand-500 to-cyan-400 text-6xl shadow-lg">{lvl.emoji}</div>
        <div>
          <div className="label">Level {lvl.index}</div>
          <div className="text-2xl font-extrabold">{lvl.title}</div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-400 transition-all duration-700" style={{ width: `${lvl.pct * 100}%` }} />
          </div>
          <div className="mt-1 text-sm text-slate-500">
            {progress.xp} XP{lvl.next ? ` · ${lvl.next.min - progress.xp} XP to ${lvl.next.title} ${lvl.next.emoji}` : ' · Max level reached!'}
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {LEVELS.map((l, i) => (
              <span key={l.title} title={`${l.title} (${l.min} XP)`} className={`chip ${i < lvl.index ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                {l.emoji} {l.title}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['Course complete', `${Math.round(overall * 100)}%`],
          ['Quiz accuracy', totalQs ? `${Math.round((totalCorrect / totalQs) * 100)}%` : '—'],
          ['Demos explored', `${progress.demosTried.length}/${Object.keys(DEMOS).length}`],
          ['Final exam', progress.finalExam?.passed ? '✅ Passed' : progress.finalExam ? `${progress.finalExam.best}/${progress.finalExam.total}` : 'Not taken'],
        ].map(([l, v]) => (
          <div key={l} className="card p-4">
            <div className="text-2xl font-extrabold">{v}</div>
            <div className="text-xs text-slate-500">{l}</div>
          </div>
        ))}
      </section>

      <section className="card p-6">
        <h2 className="mb-4 text-lg font-bold">Worlds</h2>
        <div className="space-y-3">
          {WORLDS.map((w, i) => {
            const wp = worldProgress(progress, w);
            return (
              <Link key={w.id} to={`/world/${w.id}`} className="flex items-center gap-3 rounded-lg p-1 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <span className="w-8 text-2xl">{w.emoji}</span>
                <span className="w-40 shrink-0 truncate text-sm font-semibold sm:w-56">
                  {i + 1}. {w.title}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${wp.pct * 100}%`, background: w.color }} />
                </div>
                <span className="w-10 text-right text-xs font-semibold text-slate-500">
                  {wp.done}/{wp.total}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-bold">📌 Recommended review</h2>
        {weak.length ? (
          <ul className="mt-3 space-y-2">
            {weak.map((x) => {
              const r = progress.quiz[x.lesson.id];
              return (
                <li key={x.lesson.id}>
                  <Link to={`/lesson/${x.lesson.id}`} className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-2 text-sm hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-950/50">
                    <span>
                      {x.world.emoji} {x.lesson.title}
                    </span>
                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                      {r.best}/{r.total} → retry
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">{quizEntries.length ? 'Nothing to review — all your quiz scores are 75%+. 💪' : 'Take some quizzes and we’ll suggest topics to review here.'}</p>
        )}
      </section>
    </div>
  );
}
