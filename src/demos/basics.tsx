import { useState } from 'react';
import { ScenarioGame } from './ScenarioGame';
import { useInteract } from './DemoFrame';

export function AiOrNot() {
  return (
    <ScenarioGame
      title="Correct"
      scenarios={[
        {
          prompt: 'A thermostat turns heating on when the temperature drops below 20°C.',
          options: ['🤖 AI / ML', '⚙️ Regular program'],
          answer: 1,
          explain: 'A single hand-written rule (`if temp < 20`). No learning from data.',
        },
        {
          prompt: 'Your phone keyboard suggests the next word as you type.',
          options: ['🤖 AI / ML', '⚙️ Regular program'],
          answer: 0,
          explain: 'A language model trained on lots of text predicts likely next words — and adapts to *your* typing.',
        },
        {
          prompt: 'A calculator app computes 1,234 × 5,678.',
          options: ['🤖 AI / ML', '⚙️ Regular program'],
          answer: 1,
          explain: 'Exact maths with fixed rules. No uncertainty, no learning.',
        },
        {
          prompt: 'A bank flags a payment as “possibly fraudulent” at 3 a.m. from a new country.',
          options: ['🤖 AI / ML', '⚙️ Regular program'],
          answer: 0,
          explain: 'Fraud models learn normal spending patterns from millions of transactions and score unusual ones.',
        },
        {
          prompt: 'A website sorts products from cheapest to most expensive.',
          options: ['🤖 AI / ML', '⚙️ Regular program'],
          answer: 1,
          explain: 'Sorting is a classic algorithm. “Recommended for you” ordering, on the other hand, would be ML.',
        },
        {
          prompt: 'A photo app automatically groups pictures of the same person.',
          options: ['🤖 AI / ML', '⚙️ Regular program'],
          answer: 0,
          explain: 'Face recognition uses deep learning to compare face embeddings.',
        },
      ]}
    />
  );
}

const EVENTS = [
  { year: 1950, title: 'Turing Test', emoji: '🧪', text: 'Alan Turing publishes “Computing Machinery and Intelligence” and asks: can machines think?' },
  { year: 1956, title: 'AI is born', emoji: '🎓', text: 'At the Dartmouth workshop, John McCarthy and others coin the term “Artificial Intelligence”.' },
  { year: 1958, title: 'Perceptron', emoji: '🔌', text: 'Frank Rosenblatt builds the Perceptron — the first trainable artificial neuron.' },
  { year: 1974, title: 'First AI winter', emoji: '❄️', text: 'Early promises fall short; funding dries up for years.' },
  { year: 1986, title: 'Backpropagation', emoji: '🔁', text: 'Rumelhart, Hinton & Williams popularise backprop, making multi-layer networks trainable.' },
  { year: 1997, title: 'Deep Blue', emoji: '♟️', text: 'IBM’s Deep Blue defeats world chess champion Garry Kasparov.' },
  { year: 2012, title: 'AlexNet', emoji: '🖼️', text: 'A deep CNN trained on GPUs smashes the ImageNet competition. The deep learning era begins.' },
  { year: 2016, title: 'AlphaGo', emoji: '⚫', text: 'DeepMind’s AlphaGo beats Lee Sedol at Go — a game thought to be decades away for AI.' },
  { year: 2017, title: 'Transformers', emoji: '⚡', text: '“Attention Is All You Need” introduces the Transformer — the architecture behind every modern LLM.' },
  { year: 2020, title: 'AlphaFold', emoji: '🧬', text: 'AI predicts 3D protein structures with near-lab accuracy, transforming biology (Nobel Prize 2024).' },
  { year: 2022, title: 'ChatGPT', emoji: '💬', text: 'Chat assistants reach 100M users in months. Generative AI goes mainstream.' },
  { year: 2024, title: 'Agents & reasoning', emoji: '🤝', text: 'Models that reason step by step and use tools begin doing multi-step work: coding, research, operating software.' },
];

export function AiTimeline() {
  const interact = useInteract();
  const [i, setI] = useState(0);
  const e = EVENTS[i];
  const go = (k: number) => {
    interact();
    setI(Math.max(0, Math.min(EVENTS.length - 1, k)));
  };
  return (
    <div>
      <div className="relative mb-4 overflow-x-auto pb-2">
        <div className="flex min-w-max items-center gap-1">
          {EVENTS.map((ev, k) => (
            <button
              key={ev.year}
              onClick={() => go(k)}
              className={`flex flex-col items-center rounded-lg px-2 py-1.5 text-xs font-semibold transition ${
                k === i ? 'bg-brand-600 text-white' : k < i ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'
              }`}
            >
              <span className="text-lg">{ev.emoji}</span>
              {ev.year}
            </button>
          ))}
        </div>
      </div>
      <div key={i} className="animate-pop rounded-xl bg-gradient-to-br from-brand-50 to-cyan-50 p-5 dark:from-brand-950/50 dark:to-cyan-950/30">
        <div className="text-4xl">{e.emoji}</div>
        <div className="mt-2 text-sm font-bold text-brand-600 dark:text-brand-400">{e.year}</div>
        <div className="text-xl font-bold text-slate-900 dark:text-white">{e.title}</div>
        <p className="mt-1 text-slate-700 dark:text-slate-300">{e.text}</p>
      </div>
      <div className="mt-3 flex justify-between">
        <button className="btn-ghost" disabled={i === 0} onClick={() => go(i - 1)}>
          ← Earlier
        </button>
        <button className="btn-primary" disabled={i === EVENTS.length - 1} onClick={() => go(i + 1)}>
          Later →
        </button>
      </div>
    </div>
  );
}
