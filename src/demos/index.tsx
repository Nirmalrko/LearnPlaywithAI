import type { ComponentType } from 'react';
import type { DemoId } from '../data/types';
import { AiOrNot, AiTimeline } from './basics';
import { DataLabeler, TrainTestSplit } from './data';
import { DecisionTree, KMeans, Knn, Regression } from './classic';
import { GradientDescent, NeuralNetTrainer, NeuronDemo } from './nn';
import { Convolution, Pixels } from './vision';
import { Attention, Embeddings, NextWord, Tokenizer } from './language';
import { Diffusion, PromptLab, RagDemo } from './genai';
import { BiasSpotter, Hallucination, MvpBuilder } from './responsible';
import { DemoFrame } from './DemoFrame';

export const DEMOS: Record<DemoId, { title: string; C: ComponentType }> = {
  'ai-or-not': { title: 'AI or Not?', C: AiOrNot },
  'ai-timeline': { title: 'AI Timeline', C: AiTimeline },
  'data-labeler': { title: 'Be the Data Labeler', C: DataLabeler },
  'train-test-split': { title: 'Train/Test Split Lab', C: TrainTestSplit },
  regression: { title: 'Fit the Line', C: Regression },
  knn: { title: 'k-Nearest Neighbours Explorer', C: Knn },
  kmeans: { title: 'k-Means Step by Step', C: KMeans },
  'decision-tree': { title: 'Walk a Decision Tree', C: DecisionTree },
  neuron: { title: 'Build-a-Neuron', C: NeuronDemo },
  'gradient-descent': { title: 'Gradient Descent Ball', C: GradientDescent },
  'neural-net': { title: 'Neural Network Playground', C: NeuralNetTrainer },
  pixels: { title: 'Pixel Painter', C: Pixels },
  convolution: { title: 'Convolution Filters', C: Convolution },
  tokenizer: { title: 'Tokenizer', C: Tokenizer },
  embeddings: { title: 'Embedding Space', C: Embeddings },
  'next-word': { title: 'Tiny Language Model', C: NextWord },
  attention: { title: 'Attention Visualizer', C: Attention },
  'prompt-lab': { title: 'Prompt Lab', C: PromptLab },
  rag: { title: 'RAG Pipeline', C: RagDemo },
  diffusion: { title: 'Diffusion: Noise → Image', C: Diffusion },
  'bias-spotter': { title: 'Bias Spotter', C: BiasSpotter },
  hallucination: { title: 'Fact or Fabrication?', C: Hallucination },
  'mvp-builder': { title: 'Ship Your AI MVP', C: MvpBuilder },
};

export function Demo({ id, caption }: { id: DemoId; caption?: string }) {
  const d = DEMOS[id];
  if (!d) return null;
  return (
    <DemoFrame id={id} title={d.title} caption={caption}>
      <d.C />
    </DemoFrame>
  );
}
