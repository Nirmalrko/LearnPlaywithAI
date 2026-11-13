import { describe, expect, it } from 'vitest';
import { ALL_LESSONS, findLesson, WORLDS } from './worlds';

const DEMO_IDS = [
  'ai-or-not', 'ai-timeline', 'data-labeler', 'train-test-split', 'regression', 'knn', 'kmeans', 'decision-tree', 'neuron',
  'gradient-descent', 'neural-net', 'pixels', 'convolution', 'tokenizer', 'embeddings', 'next-word', 'attention', 'prompt-lab',
  'rag', 'diffusion', 'bias-spotter', 'hallucination', 'mvp-builder',
];

describe('course content integrity', () => {
  it('has 8 worlds with unique ids and lessons', () => {
    expect(WORLDS).toHaveLength(8);
    expect(new Set(WORLDS.map((w) => w.id)).size).toBe(8);
    for (const w of WORLDS) expect(w.lessons.length).toBeGreaterThanOrEqual(4);
  });

  it('has globally unique lesson ids', () => {
    const ids = ALL_LESSONS.map((x) => x.lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every lesson has content and a quiz with valid answers', () => {
    for (const { lesson } of ALL_LESSONS) {
      expect(lesson.blocks.length, lesson.id).toBeGreaterThan(0);
      expect(lesson.quiz.length, lesson.id).toBeGreaterThanOrEqual(3);
      for (const q of lesson.quiz) {
        expect(q.explain.length, q.q).toBeGreaterThan(0);
        if (q.kind === 'mcq') {
          expect(q.answer, q.q).toBeGreaterThanOrEqual(0);
          expect(q.answer, q.q).toBeLessThan(q.options.length);
          expect(new Set(q.options).size, q.q).toBe(q.options.length);
        }
        if (q.kind === 'order') {
          expect(q.items.length, q.q).toBeGreaterThanOrEqual(2);
          expect(new Set(q.items).size, q.q).toBe(q.items.length);
        }
      }
    }
  });

  it('references only existing demos, and every demo is used', () => {
    const used = new Set<string>();
    for (const { lesson } of ALL_LESSONS)
      for (const b of lesson.blocks)
        if (b.type === 'demo') {
          expect(DEMO_IDS, lesson.id).toContain(b.id);
          used.add(b.id);
        }
    expect([...used].sort()).toEqual([...DEMO_IDS].sort());
  });

  it('findLesson links prev/next across worlds', () => {
    const first = findLesson(ALL_LESSONS[0].lesson.id)!;
    expect(first.prev).toBeNull();
    expect(first.next?.lesson.id).toBe(ALL_LESSONS[1].lesson.id);
    expect(findLesson('nope')).toBeNull();
  });
});
