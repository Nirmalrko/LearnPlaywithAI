import { Link } from 'react-router-dom';
import { ALL_LESSONS, WORLDS } from '../data/worlds';
import { earnedBadges, isWorldUnlocked, levelFor, worldProgress } from '../lib/game';
import { useProgress } from '../lib/store';
import { Ring } from '../components/Ring';
import { HeroArt } from '../components/HeroArt';

export function Home() {
  const { progress } = useProgress();
  const lvl = levelFor(progress.xp);
  const nextUp = ALL_LESSONS.find((x) => !progress.completedLessons.includes(x.lesson.id));
  const started = progress.completedLessons.length > 0 || progress.xp > 0;
  const totalLessons = ALL_LESSONS.length;
  const totalDemos = new Set(ALL_LESSONS.flatMap((x) => x.lesson.blocks.filter((b) => b.type === 'demo').map((b) => (b as { id: string }).id))).size;

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-cyan-500 p-6 text-white shadow-xl shadow-brand-600/20 sm:p-10">
        <div className="relative z-10 grid items-center gap-6 md:grid-cols-[1.3fr_1fr]">
          <div>
            {started ? (
              <>
                <p className="font-semibold text-brand-100">Welcome back, {lvl.title} {lvl.emoji}</p>
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Keep your streak alive 🔥</h1>
                <p className="mt-3 max-w-lg text-brand-50">
                  You’ve completed <b>{progress.completedLessons.length}</b> of {totalLessons} lessons and earned <b>{progress.xp} XP</b>.
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-brand-100">Free · No sign-up · Learn by playing</p>
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-5xl">Master AI from A to Z.</h1>
                <p className="mt-3 max-w-lg text-lg text-brand-50">
                  {totalLessons} bite-sized lessons, {totalDemos} hands-on AI demos running right in your browser, quizzes, XP, badges — and a certificate at the end.
                </p>
              </>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              {nextUp ? (
                <Link to={`/lesson/${nextUp.lesson.id}`} className="btn bg-white px-6 py-3 text-base text-brand-700 shadow-lg hover:bg-brand-50">
                  {started ? 'Continue' : 'Start learning'} → <span className="hidden font-normal sm:inline">{nextUp.lesson.title}</span>
                </Link>
              ) : (
                <Link to="/exam" className="btn bg-white px-6 py-3 text-base text-brand-700 shadow-lg hover:bg-brand-50">
                  🎓 Take the Final Exam
                </Link>
              )}
              <a href="#worlds" className="btn border border-white/40 px-6 py-3 text-base text-white hover:bg-white/10">
                Explore worlds
              </a>
            </div>
          </div>
          <HeroArt className="mx-auto hidden w-full max-w-xs animate-float md:block" />
        </div>
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['⭐', 'XP', progress.xp],
          ['📚', 'Lessons', `${progress.completedLessons.length}/${totalLessons}`],
          ['🔥', 'Day streak', progress.streak],
          ['🏅', 'Badges', earnedBadges(progress, WORLDS).length],
        ].map(([e, l, v]) => (
          <div key={l as string} className="card flex items-center gap-3 p-4">
            <span className="text-2xl">{e}</span>
            <div>
              <div className="text-xl font-extrabold">{v}</div>
              <div className="text-xs text-slate-500">{l}</div>
            </div>
          </div>
        ))}
      </section>

      {/* World map */}
      <section id="worlds" className="scroll-mt-24">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Your learning path</h2>
            <p className="text-slate-500">8 worlds. Complete half of a world to unlock the next.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WORLDS.map((w, i) => {
            const wp = worldProgress(progress, w);
            const unlocked = isWorldUnlocked(progress, WORLDS, i);
            const inner = (
              <div
                className={`card group relative h-full overflow-hidden p-5 transition ${unlocked ? 'hover:-translate-y-1 hover:shadow-lg' : 'opacity-60 grayscale'}`}
                style={{ borderTop: `4px solid ${w.color}` }}
              >
                <div className="flex items-start justify-between">
                  <span className="text-4xl transition group-hover:scale-110">{unlocked ? w.emoji : '🔒'}</span>
                  <Ring pct={wp.pct} color={w.color} size={44} />
                </div>
                <div className="mt-3 text-xs font-bold tracking-wider uppercase" style={{ color: w.color }}>
                  World {i + 1}
                </div>
                <h3 className="text-lg font-bold">{w.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{w.tagline}</p>
                <p className="mt-3 text-xs font-semibold text-slate-500">
                  {unlocked ? `${wp.done}/${wp.total} lessons` : `Finish half of World ${i} to unlock`}
                </p>
              </div>
            );
            return unlocked ? (
              <Link key={w.id} to={`/world/${w.id}`} className="block">
                {inner}
              </Link>
            ) : (
              <div key={w.id} aria-disabled>
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['📖', 'Learn', 'Short, clear lessons with real-world examples from companies you know.'],
          ['🕹️', 'Play', 'Train real models in your browser: neural nets, k-means, tokenizers, RAG and more.'],
          ['🏆', 'Prove it', 'Quizzes after every lesson, XP, streaks, badges and a final certificate.'],
        ].map(([e, t, d]) => (
          <div key={t} className="card p-5">
            <div className="text-3xl">{e}</div>
            <h3 className="mt-2 font-bold">{t}</h3>
            <p className="mt-1 text-sm text-slate-500">{d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
