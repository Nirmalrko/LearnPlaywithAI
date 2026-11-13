import type { Lesson, World } from '../types';
import { w1 } from './w1-basics';
import { w2 } from './w2-data';
import { w3 } from './w3-ml';
import { w4 } from './w4-nn';
import { w5 } from './w5-vision';
import { w6 } from './w6-llm';
import { w7 } from './w7-genai';
import { w8 } from './w8-responsible';

export const WORLDS: World[] = [w1, w2, w3, w4, w5, w6, w7, w8];

export const ALL_LESSONS: { world: World; lesson: Lesson }[] = WORLDS.flatMap((world) =>
  world.lessons.map((lesson) => ({ world, lesson })),
);

export function findLesson(lessonId: string) {
  const i = ALL_LESSONS.findIndex((x) => x.lesson.id === lessonId);
  if (i < 0) return null;
  return { ...ALL_LESSONS[i], prev: ALL_LESSONS[i - 1] ?? null, next: ALL_LESSONS[i + 1] ?? null };
}
