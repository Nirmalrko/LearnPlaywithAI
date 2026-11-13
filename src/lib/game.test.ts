import { describe, expect, it } from 'vitest';
import { WORLDS } from '../data/worlds';
import {
  completeLesson,
  earnedBadges,
  emptyProgress,
  isWorldUnlocked,
  levelFor,
  migrate,
  quizXp,
  recordQuiz,
  scoreOrder,
  touchStreak,
  tryDemo,
  XP,
} from './game';

describe('XP & levels', () => {
  it('starts at level 1', () => {
    expect(levelFor(0).index).toBe(1);
    expect(levelFor(0).pct).toBe(0);
  });
  it('levels up at thresholds', () => {
    expect(levelFor(150).index).toBe(2);
    expect(levelFor(99999).next).toBeUndefined();
    expect(levelFor(99999).pct).toBe(1);
  });
  it('awards lesson XP only once', () => {
    const a = completeLesson(emptyProgress(), 'x');
    expect(a.gained).toBe(XP.lesson);
    const b = completeLesson(a.next, 'x');
    expect(b.gained).toBe(0);
    expect(b.next).toBe(a.next);
  });
  it('awards demo XP only once', () => {
    const a = tryDemo(emptyProgress(), 'knn');
    expect(a.gained).toBe(XP.demo);
    expect(tryDemo(a.next, 'knn').gained).toBe(0);
  });
});

describe('quiz scoring', () => {
  it('only rewards improvements so replays cannot farm XP', () => {
    expect(quizXp(undefined, 2, 4)).toBe(2 * XP.correct);
    expect(quizXp({ best: 2, total: 4, attempts: 1 }, 2, 4)).toBe(0);
    expect(quizXp({ best: 2, total: 4, attempts: 1 }, 4, 4)).toBe(2 * XP.correct + XP.perfect);
    expect(quizXp({ best: 4, total: 4, attempts: 1 }, 4, 4)).toBe(0);
  });
  it('tracks best score and attempts', () => {
    let p = emptyProgress();
    p = recordQuiz(p, 'l', 3, 4).next;
    p = recordQuiz(p, 'l', 1, 4).next;
    expect(p.quiz.l).toEqual({ best: 3, total: 4, attempts: 2 });
  });
  it('checks order questions', () => {
    expect(scoreOrder(['a', 'b'], ['a', 'b'])).toBe(true);
    expect(scoreOrder(['b', 'a'], ['a', 'b'])).toBe(false);
    expect(scoreOrder(['a'], ['a', 'b'])).toBe(false);
  });
});

describe('streaks', () => {
  it('increments on consecutive days and resets after a gap', () => {
    let p = touchStreak(emptyProgress(), new Date(2026, 0, 1));
    expect(p.streak).toBe(1);
    p = touchStreak(p, new Date(2026, 0, 1, 20));
    expect(p.streak).toBe(1);
    p = touchStreak(p, new Date(2026, 0, 2));
    expect(p.streak).toBe(2);
    p = touchStreak(p, new Date(2026, 0, 5));
    expect(p.streak).toBe(1);
  });
});

describe('unlocking & badges', () => {
  it('locks world 2 until half of world 1 is complete', () => {
    let p = emptyProgress();
    expect(isWorldUnlocked(p, WORLDS, 0)).toBe(true);
    expect(isWorldUnlocked(p, WORLDS, 1)).toBe(false);
    const half = Math.ceil(WORLDS[0].lessons.length / 2);
    for (const l of WORLDS[0].lessons.slice(0, half)) p = completeLesson(p, l.id).next;
    expect(isWorldUnlocked(p, WORLDS, 1)).toBe(true);
  });
  it('explorer mode unlocks everything', () => {
    const p = { ...emptyProgress(), settings: { ...emptyProgress().settings, explorer: true } };
    expect(WORLDS.every((_, i) => isWorldUnlocked(p, WORLDS, i))).toBe(true);
  });
  it('awards world badge when a world is finished', () => {
    let p = emptyProgress();
    for (const l of WORLDS[0].lessons) p = completeLesson(p, l.id).next;
    const ids = earnedBadges(p, WORLDS).map((b) => b.id);
    expect(ids).toContain('first-step');
    expect(ids).toContain('w1');
  });
});

describe('save migration', () => {
  it('handles garbage and partial saves', () => {
    expect(migrate(null).xp).toBe(0);
    expect(migrate('nope').completedLessons).toEqual([]);
    const m = migrate({ xp: 120, settings: { sound: false } });
    expect(m.xp).toBe(120);
    expect(m.settings.sound).toBe(false);
    expect(m.settings.theme).toBe('system');
  });
});
