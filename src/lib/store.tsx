import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { WORLDS } from '../data/worlds';
import {
  BADGES,
  completeLesson,
  earnedBadges,
  emptyProgress,
  levelFor,
  migrate,
  recordQuiz,
  touchStreak,
  tryDemo,
  XP,
  type Progress,
} from './game';
import { sfx } from './sound';

const KEY = 'learnplay-ai:progress';

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? migrate(JSON.parse(raw)) : emptyProgress();
  } catch {
    return emptyProgress();
  }
}

function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage may be unavailable (private mode) — the app still works for this visit */
  }
}

export interface Toast {
  id: number;
  emoji: string;
  title: string;
  body?: string;
}

interface Store {
  progress: Progress;
  toasts: Toast[];
  finishLesson: (lessonId: string) => number;
  submitQuiz: (lessonId: string, correct: number, total: number) => number;
  markDemo: (demoId: string) => void;
  submitFinal: (correct: number, total: number) => boolean;
  setName: (name: string) => void;
  updateSettings: (s: Partial<Progress['settings']>) => void;
  reset: () => void;
  importSave: (json: string) => boolean;
  dismissToast: (id: number) => void;
}

const Ctx = createContext<Store | null>(null);

export function celebrate() {
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 }, disableForReducedMotion: true });
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(() => touchStreak(load()));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const soundOn = progress.settings.sound;

  useEffect(() => save(progress), [progress]);

  // Theme handling
  useEffect(() => {
    const apply = () => {
      const t = progress.settings.theme;
      const dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', dark);
    };
    apply();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [progress.settings.theme]);

  const pushToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = ++toastId.current;
    setToasts((ts) => [...ts, { ...t, id }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 3500);
  }, []);

  // Ref to the latest progress so actions compute synchronously (no side-effects inside state updaters).
  const latest = useRef(progress);
  latest.current = progress;

  /** Apply a change, then announce XP, level-ups and new badges. Returns XP gained. */
  const apply = useCallback(
    (fn: (p: Progress) => { next: Progress; gained: number }, label: string) => {
      const prev = latest.current;
      const { next, gained } = fn(prev);
      if (next === prev) return 0;
      latest.current = next;
      setProgress(next);
      const before = new Set(earnedBadges(prev, WORLDS).map((b) => b.id));
      const newBadges = earnedBadges(next, WORLDS).filter((b) => !before.has(b.id));
      const lvlUp = levelFor(next.xp).index > levelFor(prev.xp).index;
      if (gained > 0) pushToast({ emoji: '✨', title: `+${gained} XP`, body: label });
      for (const b of newBadges) pushToast({ emoji: b.emoji, title: `Badge unlocked: ${b.title}`, body: b.desc });
      if (lvlUp) {
        const l = levelFor(next.xp);
        pushToast({ emoji: l.emoji, title: `Level up! You're now a ${l.title}` });
      }
      if (newBadges.length || lvlUp) {
        celebrate();
        if (next.settings.sound) sfx.levelUp();
      } else if (gained > 0 && next.settings.sound) sfx.coin();
      return gained;
    },
    [pushToast],
  );

  const store = useMemo<Store>(
    () => ({
      progress,
      toasts,
      finishLesson: (id) => apply((p) => completeLesson(p, id), 'Lesson complete'),
      submitQuiz: (id, c, t) => apply((p) => recordQuiz(p, id, c, t), `Quiz: ${c}/${t} correct`),
      markDemo: (id) => apply((p) => tryDemo(p, id), 'Tried an interactive demo'),
      submitFinal: (correct, total) => {
        const passed = correct / total >= 0.7;
        apply((p) => {
          const already = !!p.finalExam?.passed;
          const best = Math.max(p.finalExam?.best ?? 0, correct);
          const gained = passed && !already ? XP.finalPass : 0;
          return {
            next: {
              ...p,
              xp: p.xp + gained,
              finalExam: {
                ...(p.finalExam ?? {}),
                best,
                total,
                passed: already || passed,
                date: passed && !already ? new Date().toISOString() : p.finalExam?.date,
              },
            },
            gained,
          };
        }, 'Final exam passed!');
        return passed;
      },
      setName: (name) =>
        setProgress((p) => ({ ...p, finalExam: p.finalExam ? { ...p.finalExam, name } : p.finalExam })),
      updateSettings: (s) => setProgress((p) => ({ ...p, settings: { ...p.settings, ...s } })),
      reset: () => setProgress(touchStreak(emptyProgress())),
      importSave: (json) => {
        try {
          setProgress(migrate(JSON.parse(json)));
          return true;
        } catch {
          return false;
        }
      },
      dismissToast: (id) => setToasts((ts) => ts.filter((x) => x.id !== id)),
    }),
    [progress, toasts, apply],
  );

  // keep the sound module in sync
  useEffect(() => {
    sfx.enabled = soundOn;
  }, [soundOn]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useProgress() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useProgress must be used inside ProgressProvider');
  return s;
}

export { BADGES };
