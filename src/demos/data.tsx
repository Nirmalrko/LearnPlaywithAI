import { useMemo, useState } from 'react';
import { useInteract } from './DemoFrame';
import { knnPredict, makeDataset, MLP, rng, type LabeledPt } from '../lib/ml';
import { sfx } from '../lib/sound';

// Fruit described by two features: weight (g) and colour (0 = green, 1 = orange/red)
const FRUIT = [
  { emoji: '🍎', w: 180, col: 0.9, label: 'apple' },
  { emoji: '🍏', w: 170, col: 0.1, label: 'apple' },
  { emoji: '🍊', w: 140, col: 0.75, label: 'orange' },
  { emoji: '🍋', w: 110, col: 0.6, label: 'orange' },
  { emoji: '🍎', w: 200, col: 0.95, label: 'apple' },
  { emoji: '🍊', w: 160, col: 0.7, label: 'orange' },
  { emoji: '🍏', w: 150, col: 0.2, label: 'apple' },
  { emoji: '🍊', w: 130, col: 0.72, label: 'orange' },
];
const MYSTERY = { w: 165, col: 0.85 };

export function DataLabeler() {
  const interact = useInteract();
  const [labels, setLabels] = useState<(string | null)[]>(FRUIT.map(() => null));
  const done = labels.every(Boolean);
  const correct = labels.filter((l, i) => l === FRUIT[i].label).length;

  const prediction = useMemo(() => {
    if (!done) return null;
    const train: LabeledPt[] = FRUIT.map((f, i) => ({ x: f.w / 200, y: f.col, c: labels[i] === 'apple' ? 0 : 1 }));
    const r = knnPredict(train, { x: MYSTERY.w / 200, y: MYSTERY.col }, 3);
    return r.c === 0 ? 'apple' : 'orange';
  }, [done, labels]);

  const set = (i: number, l: string) => {
    interact();
    setLabels((ls) => ls.map((x, k) => (k === i ? l : x)));
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-2">Item</th>
              <th>Weight (g)</th>
              <th>Colour score</th>
              <th>Your label</th>
            </tr>
          </thead>
          <tbody>
            {FRUIT.map((f, i) => (
              <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                <td className="py-2 text-2xl">{f.emoji}</td>
                <td className="font-mono">{f.w}</td>
                <td className="font-mono">{f.col.toFixed(2)}</td>
                <td className="flex gap-1 py-2">
                  {['apple', 'orange'].map((l) => (
                    <button
                      key={l}
                      onClick={() => set(i, l)}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                        labels[i] === l ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
        {!done ? (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Label all {FRUIT.length} rows ({labels.filter(Boolean).length} done). Then a k-NN model will learn from <b>your</b> labels.
          </p>
        ) : (
          <div className="animate-slide-in">
            <p className="text-sm">
              Label quality: <b>{correct} / {FRUIT.length}</b> match the true labels.{' '}
              {correct < FRUIT.length && 'Some labels are wrong — this is “label noise”!'}
            </p>
            <p className="mt-2">
              🔮 Mystery fruit (165 g, colour 0.85) → model predicts: <b className="text-brand-600 dark:text-brand-400">{prediction}</b>
            </p>
            <p className="mt-1 text-xs text-slate-500">Try mislabelling a few rows and see how the prediction changes. Your labels = the model’s knowledge.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const SPLIT_DATA = makeDataset('circle', 200, 11).map((p, i) => {
  // add label noise so overfitting is visible
  const r = rng(i + 3)();
  return r < 0.08 ? { ...p, c: 1 - p.c } : p;
});

export function TrainTestSplit() {
  const interact = useInteract();
  const [trainPct, setTrainPct] = useState(70);
  const [complexity, setComplexity] = useState(2);
  const [result, setResult] = useState<{ train: number; test: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const nTrain = Math.round((SPLIT_DATA.length * trainPct) / 100);

  const run = () => {
    interact();
    setBusy(true);
    setTimeout(() => {
      const train = SPLIT_DATA.slice(0, nTrain);
      const test = SPLIT_DATA.slice(nTrain);
      const hidden = [2, 4, 12, 32][complexity];
      const net = new MLP(complexity === 0 ? [2, 1] : [2, hidden, hidden, 1], 3);
      const epochs = [150, 250, 500, 900][complexity];
      for (let e = 0; e < epochs; e++) net.trainEpoch(train, 0.03);
      setResult({ train: net.accuracy(train), test: test.length ? net.accuracy(test) : 0 });
      setBusy(false);
      sfx.coin();
    }, 30);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm font-semibold">
            <span>Training data: {trainPct}%</span>
            <span>Test data: {100 - trainPct}%</span>
          </div>
          <input type="range" min={20} max={95} value={trainPct} onChange={(e) => setTrainPct(+e.target.value)} />
          <div className="mt-1 flex h-4 overflow-hidden rounded-full">
            <div className="bg-brand-500" style={{ width: `${trainPct}%` }} />
            <div className="flex-1 bg-amber-400" />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {nTrain} examples to learn from, {SPLIT_DATA.length - nTrain} kept secret for testing.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Model complexity: {['Tiny (linear)', 'Small', 'Medium', 'Huge'][complexity]}</div>
          <input type="range" min={0} max={3} value={complexity} onChange={(e) => setComplexity(+e.target.value)} />
        </div>
        <button className="btn-primary w-full" onClick={run} disabled={busy}>
          {busy ? 'Training…' : '▶ Train & evaluate'}
        </button>
      </div>
      <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
        {result ? (
          <div className="animate-slide-in space-y-3">
            {(['train', 'test'] as const).map((k) => (
              <div key={k}>
                <div className="flex justify-between text-sm font-semibold">
                  <span>{k === 'train' ? 'Training accuracy' : 'Test accuracy (the honest score)'}</span>
                  <span>{(result[k] * 100).toFixed(0)}%</span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className={`h-full transition-all duration-700 ${k === 'train' ? 'bg-brand-500' : 'bg-amber-400'}`} style={{ width: `${result[k] * 100}%` }} />
                </div>
              </div>
            ))}
            <p className="text-sm">
              {result.train - result.test > 0.08
                ? '⚠️ Big gap: the model memorised its training data — overfitting!'
                : result.test < 0.7
                  ? '📉 Low on both: the model is too simple — underfitting.'
                  : '✅ Good fit: it generalises to unseen data.'}
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Choose a split and model size, then train. Try “Huge” with only 20% training data!</p>
        )}
      </div>
    </div>
  );
}
