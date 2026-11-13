// Pure game logic: XP, levels, streaks, badges. No React here so it is easy to unit test.
import type { World } from '../data/types';

export interface QuizResult {
  best: number; // best correct count
  total: number;
  attempts: number;
}

export interface Progress {
  version: 1;
  xp: number;
  completedLessons: string[]; // lesson ids
  quiz: Record<string, QuizResult>; // lesson id -> result
  demosTried: string[]; // demo ids
  streak: number;
  lastActiveDay: string | null; // YYYY-MM-DD
  finalExam: { best: number; total: number; passed: boolean; name?: string; date?: string } | null;
  settings: { sound: boolean; explorer: boolean; theme: 'light' | 'dark' | 'system' };
}

export const XP = {
  lesson: 50,
  correct: 10,
  perfect: 30,
  demo: 15,
  finalPass: 300,
} as const;

export const LEVELS = [
  { min: 0, title: 'Curious Human', emoji: '🐣' },
  { min: 150, title: 'AI Novice', emoji: '🌱' },
  { min: 500, title: 'Data Wrangler', emoji: '🧹' },
  { min: 1000, title: 'Model Builder', emoji: '🛠️' },
  { min: 1800, title: 'Neural Ninja', emoji: '🥷' },
  { min: 2800, title: 'AI Engineer', emoji: '🚀' },
  { min: 4000, title: 'AI Master', emoji: '🧠' },
];

export function emptyProgress(): Progress {
  return {
    version: 1,
    xp: 0,
    completedLessons: [],
    quiz: {},
    demosTried: [],
    streak: 0,
    lastActiveDay: null,
    finalExam: null,
    settings: { sound: true, explorer: false, theme: 'system' },
  };
}

export function levelFor(xp: number) {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].min) idx = i;
  const cur = LEVELS[idx];
  const next = LEVELS[idx + 1];
  const pct = next ? (xp - cur.min) / (next.min - cur.min) : 1;
  return { index: idx + 1, ...cur, next, pct: Math.max(0, Math.min(1, pct)) };
}

export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Update the daily streak. Same day: unchanged. Next day: +1. Gap: reset to 1. */
export function touchStreak(p: Progress, now: Date = new Date()): Progress {
  const today = dayKey(now);
  if (p.lastActiveDay === today) return p;
  const y = new Date(now);
  y.setDate(y.getDate() - 1);
  const streak = p.lastActiveDay === dayKey(y) ? p.streak + 1 : 1;
  return { ...p, streak, lastActiveDay: today };
}

/** XP gained for a quiz attempt: only *improvements* over the previous best earn XP, so replaying can't farm points. */
export function quizXp(prev: QuizResult | undefined, correct: number, total: number): number {
  const prevBest = prev?.best ?? 0;
  const gained = Math.max(0, correct - prevBest) * XP.correct;
  const perfectBonus = correct === total && prevBest !== total ? XP.perfect : 0;
  return gained + perfectBonus;
}

export function recordQuiz(p: Progress, lessonId: string, correct: number, total: number): { next: Progress; gained: number } {
  const prev = p.quiz[lessonId];
  const gained = quizXp(prev, correct, total);
  const result: QuizResult = {
    best: Math.max(prev?.best ?? 0, correct),
    total,
    attempts: (prev?.attempts ?? 0) + 1,
  };
  return { next: { ...p, xp: p.xp + gained, quiz: { ...p.quiz, [lessonId]: result } }, gained };
}

export function completeLesson(p: Progress, lessonId: string): { next: Progress; gained: number } {
  if (p.completedLessons.includes(lessonId)) return { next: p, gained: 0 };
  return { next: { ...p, xp: p.xp + XP.lesson, completedLessons: [...p.completedLessons, lessonId] }, gained: XP.lesson };
}

export function tryDemo(p: Progress, demoId: string): { next: Progress; gained: number } {
  if (p.demosTried.includes(demoId)) return { next: p, gained: 0 };
  return { next: { ...p, xp: p.xp + XP.demo, demosTried: [...p.demosTried, demoId] }, gained: XP.demo };
}

export function worldProgress(p: Progress, world: World) {
  const done = world.lessons.filter((l) => p.completedLessons.includes(l.id)).length;
  return { done, total: world.lessons.length, pct: world.lessons.length ? done / world.lessons.length : 0 };
}

/** A world is unlocked when the previous world is at least half complete (or explorer mode is on). */
export function isWorldUnlocked(p: Progress, worlds: World[], index: number): boolean {
  if (index === 0 || p.settings.explorer) return true;
  const prev = worlds[index - 1];
  return worldProgress(p, prev).pct >= 0.5;
}

export interface Badge {
  id: string;
  title: string;
  emoji: string;
  desc: string;
  earned: (p: Progress, worlds: World[]) => boolean;
}

const worldDone = (wi: number) => (p: Progress, worlds: World[]) => !!worlds[wi] && worldProgress(p, worlds[wi]).pct === 1;
const perfectCount = (p: Progress) => Object.values(p.quiz).filter((r) => r.best === r.total).length;

export const BADGES: Badge[] = [
  { id: 'first-step', title: 'First Step', emoji: '👣', desc: 'Complete your first lesson', earned: (p) => p.completedLessons.length >= 1 },
  { id: 'tinkerer', title: 'Tinkerer', emoji: '🔧', desc: 'Try 5 interactive demos', earned: (p) => p.demosTried.length >= 5 },
  { id: 'lab-rat', title: 'Lab Explorer', emoji: '🧪', desc: 'Try 15 interactive demos', earned: (p) => p.demosTried.length >= 15 },
  { id: 'perfect', title: 'Perfectionist', emoji: '💯', desc: 'Get a perfect quiz score', earned: (p) => perfectCount(p) >= 1 },
  { id: 'perfect10', title: 'Quiz Champion', emoji: '🏆', desc: 'Get 10 perfect quiz scores', earned: (p) => perfectCount(p) >= 10 },
  { id: 'streak3', title: 'On Fire', emoji: '🔥', desc: 'Keep a 3-day streak', earned: (p) => p.streak >= 3 },
  { id: 'streak7', title: 'Unstoppable', emoji: '⚡', desc: 'Keep a 7-day streak', earned: (p) => p.streak >= 7 },
  { id: 'w1', title: 'AI Aware', emoji: '🤖', desc: 'Finish World 1: AI Basics', earned: worldDone(0) },
  { id: 'w2', title: 'Data Whisperer', emoji: '📊', desc: 'Finish World 2: Data', earned: worldDone(1) },
  { id: 'w3', title: 'Model Maker', emoji: '📈', desc: 'Finish World 3: Classic ML', earned: worldDone(2) },
  { id: 'w4', title: 'First Neuron', emoji: '🧠', desc: 'Finish World 4: Neural Networks', earned: worldDone(3) },
  { id: 'w5', title: 'Eagle Eye', emoji: '👁️', desc: 'Finish World 5: Computer Vision', earned: worldDone(4) },
  { id: 'w6', title: 'Word Wizard', emoji: '💬', desc: 'Finish World 6: Language & LLMs', earned: worldDone(5) },
  { id: 'w7', title: 'Prompt Wizard', emoji: '🪄', desc: 'Finish World 7: Generative AI', earned: worldDone(6) },
  { id: 'w8', title: 'Bias Hunter', emoji: '⚖️', desc: 'Finish World 8: Responsible AI & Shipping', earned: worldDone(7) },
  { id: 'master', title: 'Certified AI Master', emoji: '🎓', desc: 'Pass the Final Exam', earned: (p) => !!p.finalExam?.passed },
];

export function earnedBadges(p: Progress, worlds: World[]): Badge[] {
  return BADGES.filter((b) => b.earned(p, worlds));
}

export function scoreOrder(answer: string[], correct: string[]): boolean {
  return answer.length === correct.length && answer.every((x, i) => x === correct[i]);
}

/** Merge a loaded (possibly older/partial) save with defaults so new fields never crash the app. */
export function migrate(raw: unknown): Progress {
  const base = emptyProgress();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<Progress>;
  return {
    ...base,
    ...r,
    version: 1,
    completedLessons: Array.isArray(r.completedLessons) ? r.completedLessons : [],
    demosTried: Array.isArray(r.demosTried) ? r.demosTried : [],
    quiz: r.quiz && typeof r.quiz === 'object' ? r.quiz : {},
    settings: { ...base.settings, ...(r.settings ?? {}) },
  };
}
