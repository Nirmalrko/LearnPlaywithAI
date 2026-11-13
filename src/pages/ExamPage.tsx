import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ALL_LESSONS, WORLDS } from '../data/worlds';
import { useProgress } from '../lib/store';
import { Quiz, shuffle } from '../components/Quiz';
import { Logo } from '../components/Logo';
import type { Question } from '../data/types';

const EXAM_SIZE = 24; // 3 per world
const UNLOCK = 0.6;
const PASS = 0.7;

function buildExam(): Question[] {
  return WORLDS.flatMap((w) => shuffle(w.lessons.flatMap((l) => l.quiz)).slice(0, EXAM_SIZE / WORLDS.length));
}

export function ExamPage() {
  const { progress, submitFinal, setName } = useProgress();
  const [exam, setExam] = useState<Question[] | null>(null);
  const [nameDraft, setNameDraft] = useState(progress.finalExam?.name ?? '');
  const pct = progress.completedLessons.length / ALL_LESSONS.length;
  const unlocked = pct >= UNLOCK || progress.settings.explorer;
  const passed = !!progress.finalExam?.passed;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="no-print">
        <h1 className="text-3xl font-extrabold tracking-tight">🎓 Final Exam</h1>
        <p className="text-slate-500">
          {EXAM_SIZE} questions drawn from all 8 worlds. Score {Math.round(PASS * 100)}% or more to earn your <b>AI Master certificate</b> and +300 XP.
        </p>
      </div>

      {!unlocked ? (
        <div className="card no-print p-8 text-center">
          <div className="text-5xl">🔒</div>
          <p className="mt-3 font-semibold">Complete {Math.round(UNLOCK * 100)}% of lessons to unlock the exam.</p>
          <div className="mx-auto mt-3 h-3 max-w-sm overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full bg-brand-500" style={{ width: `${(pct / UNLOCK) * 100}%` }} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {progress.completedLessons.length} / {Math.ceil(UNLOCK * ALL_LESSONS.length)} lessons
          </p>
          <Link to="/" className="btn-primary mt-4">
            Keep learning
          </Link>
        </div>
      ) : exam ? (
        <div className="no-print">
          <Quiz key={exam.map((q) => q.q).join('|')} title="Final Exam" questions={exam} passMark={PASS} onFinish={(c, t) => (submitFinal(c, t), undefined)} />
          <div className="mt-3 text-center">
            <button className="btn-ghost" onClick={() => setExam(null)}>
              Back
            </button>
          </div>
        </div>
      ) : (
        <div className="card no-print p-8 text-center">
          {progress.finalExam && (
            <p className="mb-3 text-sm text-slate-500">
              Best score: <b>{progress.finalExam.best}/{progress.finalExam.total}</b> {passed && '· ✅ Passed'}
            </p>
          )}
          <button className="btn-primary px-8 py-3 text-base" onClick={() => setExam(buildExam())}>
            {progress.finalExam ? 'Retake exam' : 'Start exam'}
          </button>
        </div>
      )}

      {passed && (
        <section className="space-y-3">
          <div className="no-print card flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
            <label htmlFor="cert-name" className="text-sm font-semibold">
              Name on certificate
            </label>
            <input
              id="cert-name"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={() => setName(nameDraft.trim())}
              maxLength={60}
              placeholder="Your full name"
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950"
            />
            <button className="btn-primary" onClick={() => (setName(nameDraft.trim()), setTimeout(() => window.print(), 50))}>
              🖨️ Print / Save PDF
            </button>
          </div>
          <Certificate name={nameDraft.trim() || 'AI Learner'} date={progress.finalExam?.date} score={`${progress.finalExam?.best}/${progress.finalExam?.total}`} />
        </section>
      )}
    </div>
  );
}

function Certificate({ name, date, score }: { name: string; date?: string; score: string }) {
  const d = date ? new Date(date) : new Date();
  return (
    <div className="print-area relative overflow-hidden rounded-2xl border-8 border-double border-brand-300 bg-white p-8 text-center text-slate-800 shadow-xl sm:p-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ede9fe,transparent_50%),radial-gradient(circle_at_bottom_left,#cffafe,transparent_50%)]" />
      <div className="relative">
        <Logo className="mx-auto h-14 w-14" />
        <div className="mt-3 text-xs font-bold tracking-[0.3em] text-brand-600 uppercase">LearnPlay AI</div>
        <h2 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">Certificate of Achievement</h2>
        <p className="mt-6 text-slate-500">This certifies that</p>
        <p className="mt-2 font-serif text-3xl font-bold text-brand-700 sm:text-4xl">{name}</p>
        <p className="mx-auto mt-4 max-w-md text-slate-600">
          has completed the <b>AI A-to-Z</b> learning path — covering machine learning, neural networks, computer vision, large language models, generative AI and responsible AI —
          and passed the final exam.
        </p>
        <div className="mt-8 flex flex-wrap items-end justify-center gap-10 text-sm">
          <div>
            <div className="font-semibold">{d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="mt-1 border-t border-slate-300 pt-1 text-xs text-slate-500">Date</div>
          </div>
          <div className="text-5xl">🎓</div>
          <div>
            <div className="font-semibold">{score}</div>
            <div className="mt-1 border-t border-slate-300 pt-1 text-xs text-slate-500">Exam score</div>
          </div>
        </div>
      </div>
    </div>
  );
}
