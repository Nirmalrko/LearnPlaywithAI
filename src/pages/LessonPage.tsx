import { Link, useParams } from 'react-router-dom';
import { findLesson, WORLDS } from '../data/worlds';
import { isWorldUnlocked } from '../lib/game';
import { useProgress } from '../lib/store';
import type { Block } from '../data/types';
import { Md } from '../components/Md';
import { Quiz } from '../components/Quiz';
import { Demo } from '../demos';
import { Diagram } from '../diagrams';
import { NotFound } from './NotFound';

const PASS_LESSON = 0.5;

const CALLOUT = {
  info: ['ℹ️', 'border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/40'],
  tip: ['💡', 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40'],
  warn: ['⚠️', 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40'],
} as const;

function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case 'text':
      return <Md text={b.md} className="text-[17px] text-slate-700 dark:text-slate-300" />;
    case 'callout': {
      const [icon, cls] = CALLOUT[b.tone];
      return (
        <div className={`flex gap-3 rounded-xl border-l-4 p-4 ${cls}`}>
          <span className="text-xl">{icon}</span>
          <Md text={b.md} className="text-slate-700 dark:text-slate-300" />
        </div>
      );
    }
    case 'example':
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300">🌍 Real-world example</span>
            {b.company && <span className="text-xs font-semibold text-slate-500">{b.company}</span>}
          </div>
          <h4 className="mt-2 font-bold text-slate-900 dark:text-white">{b.title}</h4>
          <Md text={b.md} className="mt-1 text-slate-700 dark:text-slate-300" />
        </div>
      );
    case 'keypoints':
      return (
        <ul className="space-y-2 rounded-xl bg-brand-50/60 p-5 dark:bg-brand-950/30">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
              <Md text={it} className="text-slate-700 dark:text-slate-300" />
            </li>
          ))}
        </ul>
      );
    case 'code':
      return (
        <div className="overflow-hidden rounded-xl bg-slate-900 dark:ring-1 dark:ring-slate-800">
          <div className="border-b border-slate-700 px-4 py-1.5 font-mono text-xs text-slate-400">{b.lang}</div>
          <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-slate-100">
            <code>{b.code}</code>
          </pre>
        </div>
      );
    case 'demo':
      return <Demo id={b.id} caption={b.caption} />;
    case 'diagram':
      return <Diagram id={b.id} caption={b.caption} />;
  }
}

export function LessonPage() {
  const { lessonId = '' } = useParams();
  const { progress, finishLesson, submitQuiz } = useProgress();
  const found = findLesson(lessonId);
  if (!found) return <NotFound />;
  const { world, lesson, prev, next } = found;
  const wi = WORLDS.indexOf(world);
  const unlocked = isWorldUnlocked(progress, WORLDS, wi);
  const done = progress.completedLessons.includes(lesson.id);
  const li = world.lessons.indexOf(lesson);

  if (!unlocked)
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <div className="text-5xl">🔒</div>
        <p className="mt-3 font-semibold">This lesson is in a locked world.</p>
        <Link to={`/world/${world.id}`} className="btn-primary mt-4">
          See how to unlock
        </Link>
      </div>
    );

  return (
    <article className="mx-auto max-w-3xl">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-brand-600">
          Worlds
        </Link>
        <span>/</span>
        <Link to={`/world/${world.id}`} className="font-semibold hover:text-brand-600" style={{ color: world.color }}>
          {world.emoji} {world.title}
        </Link>
      </nav>

      <header className="mt-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span>
            Lesson {li + 1} of {world.lessons.length}
          </span>
          <span>·</span>
          <span>⏱ {lesson.minutes} min</span>
          {done && <span className="chip bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">✓ Completed</span>}
        </div>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">{lesson.title}</h1>
        <p className="mt-2 text-lg text-slate-500">{lesson.summary}</p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full rounded-full" style={{ width: `${((li + (done ? 1 : 0)) / world.lessons.length) * 100}%`, background: world.color }} />
        </div>
      </header>

      <div className="mt-8 space-y-6">
        {lesson.blocks.map((b, i) => (
          <BlockView key={i} b={b} />
        ))}
      </div>

      <section className="mt-12" id="quiz">
        <h2 className="mb-3 text-2xl font-extrabold tracking-tight">Check your knowledge</h2>
        <p className="mb-4 text-sm text-slate-500">
          Score {Math.ceil(PASS_LESSON * lesson.quiz.length)}/{lesson.quiz.length} or more to complete the lesson. Every new correct answer earns XP, and a perfect score earns a bonus!
        </p>
        <Quiz
          key={lesson.id}
          questions={lesson.quiz}
          passMark={PASS_LESSON}
          onFinish={(c, t) => {
            // Both actions read the latest state via a ref, so calling them in sequence is safe.
            const gained = submitQuiz(lesson.id, c, t);
            return c / t >= PASS_LESSON ? gained + finishLesson(lesson.id) : gained;
          }}
        />
      </section>

      <nav className="mt-10 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link to={`/lesson/${prev.lesson.id}`} className="card p-4 hover:border-brand-300">
            <div className="text-xs text-slate-500">← Previous</div>
            <div className="font-semibold">{prev.lesson.title}</div>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/lesson/${next.lesson.id}`} className="card p-4 text-right hover:border-brand-300">
            <div className="text-xs text-slate-500">Next →</div>
            <div className="font-semibold">{next.lesson.title}</div>
          </Link>
        )}
      </nav>
    </article>
  );
}
