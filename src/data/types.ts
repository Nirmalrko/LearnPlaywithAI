// Content model. Lessons are pure data so new ones can be added without touching UI code.

export type DemoId =
  | 'ai-or-not'
  | 'ai-timeline'
  | 'data-labeler'
  | 'train-test-split'
  | 'regression'
  | 'knn'
  | 'kmeans'
  | 'decision-tree'
  | 'neuron'
  | 'gradient-descent'
  | 'neural-net'
  | 'pixels'
  | 'convolution'
  | 'tokenizer'
  | 'embeddings'
  | 'next-word'
  | 'attention'
  | 'prompt-lab'
  | 'rag'
  | 'diffusion'
  | 'bias-spotter'
  | 'hallucination'
  | 'mvp-builder';

export type DiagramId =
  | 'ai-venn'
  | 'ml-pipeline'
  | 'learning-types'
  | 'neuron'
  | 'network'
  | 'cnn'
  | 'transformer'
  | 'rag'
  | 'agent-loop'
  | 'diffusion'
  | 'deploy';

export type Block =
  | { type: 'text'; md: string }
  | { type: 'callout'; tone: 'info' | 'tip' | 'warn'; md: string }
  | { type: 'example'; title: string; company?: string; md: string }
  | { type: 'keypoints'; items: string[] }
  | { type: 'demo'; id: DemoId; caption?: string }
  | { type: 'diagram'; id: DiagramId; caption?: string }
  | { type: 'code'; lang: string; code: string };

export type Question =
  | { kind: 'mcq'; q: string; options: string[]; answer: number; explain: string }
  | { kind: 'tf'; q: string; answer: boolean; explain: string }
  | { kind: 'order'; q: string; items: string[]; explain: string }; // items are in the CORRECT order

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  blocks: Block[];
  quiz: Question[];
}

export interface World {
  id: string;
  index: number;
  title: string;
  tagline: string;
  emoji: string;
  color: string; // tailwind-ish hex used for accents
  lessons: Lesson[];
}
