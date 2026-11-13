import type { ReactNode } from 'react';
import type { DiagramId } from '../data/types';

const T = 'fill-slate-700 dark:fill-slate-200';
const Tm = 'fill-slate-500 dark:fill-slate-400';
const Ln = 'stroke-slate-400 dark:stroke-slate-500';

function Box({ x, y, w, h, fill, label, sub, r = 12 }: { x: number; y: number; w: number; h: number; fill: string; label: string; sub?: string; r?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} opacity={0.18} />
      <rect x={x} y={y} width={w} height={h} rx={r} fill="none" stroke={fill} strokeWidth={2} />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -3 : 5)} textAnchor="middle" className={`${T} text-[13px] font-bold`}>
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" className={`${Tm} text-[10px]`}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} className={Ln} strokeWidth={2} markerEnd="url(#arrow)" />;
}

function Svg({ vb, label, children }: { vb: string; label: string; children: ReactNode }) {
  return (
    <svg viewBox={vb} className="w-full" role="img" aria-label={label}>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" className="fill-slate-400 dark:fill-slate-500" />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

const DIAGRAMS: Record<DiagramId, () => ReactNode> = {
  'ai-venn': () => (
    <Svg vb="0 0 520 300" label="Nested circles: AI contains ML contains Deep Learning contains Generative AI">
      <ellipse cx={260} cy={150} rx={245} ry={140} fill="#7c3aed" opacity={0.12} stroke="#7c3aed" strokeWidth={2} />
      <ellipse cx={290} cy={165} rx={185} ry={108} fill="#0891b2" opacity={0.14} stroke="#0891b2" strokeWidth={2} />
      <ellipse cx={320} cy={180} rx={125} ry={76} fill="#db2777" opacity={0.15} stroke="#db2777" strokeWidth={2} />
      <ellipse cx={345} cy={192} rx={68} ry={42} fill="#ea580c" opacity={0.2} stroke="#ea580c" strokeWidth={2} />
      <text x={45} y={70} className={`${T} text-[16px] font-bold`}>Artificial Intelligence</text>
      <text x={45} y={88} className={`${Tm} text-[11px]`}>rules, search, planning, ML…</text>
      <text x={130} y={115} className={`${T} text-[15px] font-bold`}>Machine Learning</text>
      <text x={130} y={132} className={`${Tm} text-[11px]`}>learns from data</text>
      <text x={215} y={150} className={`${T} text-[14px] font-bold`}>Deep Learning</text>
      <text x={215} y={166} className={`${Tm} text-[11px]`}>neural networks</text>
      <text x={345} y={190} textAnchor="middle" className={`${T} text-[13px] font-bold`}>Generative</text>
      <text x={345} y={206} textAnchor="middle" className={`${T} text-[13px] font-bold`}>AI</text>
    </Svg>
  ),
  'ml-pipeline': () => {
    const steps = [
      ['🎯', 'Define', '#7c3aed'],
      ['📥', 'Collect', '#0891b2'],
      ['🧹', 'Prepare', '#059669'],
      ['🏋️', 'Train', '#db2777'],
      ['📏', 'Evaluate', '#ea580c'],
      ['🚀', 'Deploy', '#2563eb'],
    ];
    return (
      <Svg vb="0 0 600 170" label="ML lifecycle: define, collect, prepare, train, evaluate, deploy, then monitor and loop back">
        {steps.map(([e, l, c], i) => (
          <g key={l}>
            <circle cx={50 + i * 100} cy={65} r={34} fill={c} opacity={0.15} stroke={c} strokeWidth={2} />
            <text x={50 + i * 100} y={73} textAnchor="middle" className="text-[24px]">{e}</text>
            <text x={50 + i * 100} y={122} textAnchor="middle" className={`${T} text-[13px] font-bold`}>{l}</text>
            {i < 5 && <Arrow x1={86 + i * 100} y1={65} x2={112 + i * 100} y2={65} />}
          </g>
        ))}
        <path d="M550 102 C 550 165, 50 165, 50 102" fill="none" className={Ln} strokeWidth={2} strokeDasharray="6 5" markerEnd="url(#arrow)" />
        <text x={300} y={160} textAnchor="middle" className={`${Tm} text-[11px]`}>monitor → retrain when the world changes</text>
      </Svg>
    );
  },
  'learning-types': () => (
    <Svg vb="0 0 600 210" label="Three learning types">
      {[
        ['Supervised', 'examples + answers', '🏷️ → 📈', 'price prediction, spam', '#7c3aed'],
        ['Unsupervised', 'examples, no answers', '🔵🔵 🟠🟠', 'customer segments', '#0891b2'],
        ['Reinforcement', 'trial, error, reward', '🤖 ⇄ 🌍 +🏆', 'games, robots, RLHF', '#db2777'],
      ].map(([t, s, e, ex, c], i) => (
        <g key={t}>
          <rect x={10 + i * 197} y={10} width={185} height={190} rx={16} fill={c} opacity={0.1} stroke={c} strokeWidth={2} />
          <text x={102 + i * 197} y={45} textAnchor="middle" className={`${T} text-[16px] font-bold`}>{t}</text>
          <text x={102 + i * 197} y={66} textAnchor="middle" className={`${Tm} text-[11px]`}>{s}</text>
          <text x={102 + i * 197} y={118} textAnchor="middle" className="text-[28px]">{e}</text>
          <text x={102 + i * 197} y={170} textAnchor="middle" className={`${T} text-[11px]`}>e.g. {ex}</text>
        </g>
      ))}
    </Svg>
  ),
  neuron: () => (
    <Svg vb="0 0 600 220" label="A neuron: inputs times weights, summed with bias, through activation, to output">
      {['x₁', 'x₂', 'x₃'].map((x, i) => (
        <g key={x}>
          <circle cx={50} cy={50 + i * 60} r={22} fill="#0891b2" opacity={0.2} stroke="#0891b2" strokeWidth={2} />
          <text x={50} y={56 + i * 60} textAnchor="middle" className={`${T} text-[14px] font-bold`}>{x}</text>
          <Arrow x1={74} y1={50 + i * 60} x2={232} y2={110} />
          <text x={150} y={62 + i * 45} className="fill-brand-600 text-[13px] font-bold dark:fill-brand-400">w{i + 1}</text>
        </g>
      ))}
      <circle cx={270} cy={110} r={38} fill="#7c3aed" opacity={0.2} stroke="#7c3aed" strokeWidth={2} />
      <text x={270} y={118} textAnchor="middle" className={`${T} text-[24px] font-bold`}>Σ</text>
      <text x={270} y={170} textAnchor="middle" className={`${Tm} text-[11px]`}>+ bias b</text>
      <Arrow x1={310} y1={110} x2={378} y2={110} />
      <rect x={380} y={80} width={90} height={60} rx={12} fill="#db2777" opacity={0.2} stroke="#db2777" strokeWidth={2} />
      <path d="M392 128 L 420 128 L 458 92" fill="none" stroke="#db2777" strokeWidth={3} />
      <text x={425} y={160} textAnchor="middle" className={`${Tm} text-[11px]`}>activation</text>
      <Arrow x1={472} y1={110} x2={530} y2={110} />
      <text x={560} y={116} textAnchor="middle" className={`${T} text-[16px] font-bold`}>ŷ</text>
    </Svg>
  ),
  network: () => {
    const layers = [3, 5, 5, 2];
    const xs = [70, 230, 390, 530];
    const pos = layers.map((n, l) => Array.from({ length: n }, (_, i) => ({ x: xs[l], y: 120 + (i - (n - 1) / 2) * 42 })));
    const colors = ['#0891b2', '#7c3aed', '#7c3aed', '#db2777'];
    return (
      <Svg vb="0 0 600 250" label="Neural network with input, two hidden layers, and output">
        {pos.slice(0, -1).map((L, l) => L.map((a, i) => pos[l + 1].map((b, j) => <line key={`${l}-${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={Ln} strokeWidth={1} opacity={0.5} />)))}
        {pos.map((L, l) => L.map((p, i) => <circle key={`${l}-${i}`} cx={p.x} cy={p.y} r={14} fill={colors[l]} opacity={0.9} />))}
        {['Input', 'Hidden 1', 'Hidden 2', 'Output'].map((t, i) => (
          <text key={t} x={xs[i]} y={238} textAnchor="middle" className={`${T} text-[12px] font-bold`}>{t}</text>
        ))}
        <text x={300} y={18} textAnchor="middle" className={`${Tm} text-[11px]`}>forward pass → predictions · ← backpropagation of error</text>
      </Svg>
    );
  },
  cnn: () => (
    <Svg vb="0 0 620 200" label="CNN: image, convolution, pooling, deeper convolution, dense layer, class probabilities">
      <rect x={10} y={50} width={90} height={90} rx={6} fill="#ea580c" opacity={0.25} stroke="#ea580c" strokeWidth={2} />
      <text x={55} y={102} textAnchor="middle" className="text-[30px]">🐱</text>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={135 + i * 6} y={45 + i * 6} width={70} height={70} rx={4} fill="#7c3aed" opacity={0.25} stroke="#7c3aed" />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={260 + i * 5} y={60 + i * 5} width={45} height={45} rx={4} fill="#0891b2" opacity={0.25} stroke="#0891b2" />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={370 + i * 4} y={70 + i * 4} width={28} height={28} rx={3} fill="#db2777" opacity={0.25} stroke="#db2777" />
      ))}
      {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={475} cy={40 + i * 16} r={6} fill="#059669" opacity={0.8} />)}
      {['cat 0.92', 'dog 0.06', 'fox 0.02'].map((t, i) => (
        <text key={t} x={510} y={78 + i * 22} className={`${T} text-[12px] ${i === 0 ? 'font-bold' : ''}`}>{t}</text>
      ))}
      {[
        [55, 'Image'],
        [170, 'Conv: edges'],
        [285, 'Pool + Conv'],
        [395, 'Parts'],
        [475, 'Dense'],
        [550, 'Softmax'],
      ].map(([x, t]) => (
        <text key={t} x={x} y={185} textAnchor="middle" className={`${Tm} text-[11px] font-semibold`}>{t}</text>
      ))}
    </Svg>
  ),
  transformer: () => (
    <Svg vb="0 0 600 320" label="Transformer stack: tokens, embeddings plus positions, repeated attention and feed-forward blocks, next-token probabilities">
      <Box x={150} y={270} w={300} h={40} fill="#0891b2" label="Tokens → Embeddings + Position" />
      <Arrow x1={300} y1={268} x2={300} y2={236} />
      <rect x={130} y={70} width={340} height={164} rx={16} fill="none" className={Ln} strokeDasharray="6 5" strokeWidth={2} />
      <text x={482} y={155} className={`${Tm} text-[12px] font-bold`}>× N layers</text>
      <Box x={160} y={170} w={280} h={50} fill="#7c3aed" label="Multi-Head Self-Attention" sub="tokens look at each other" />
      <Arrow x1={300} y1={168} x2={300} y2={142} />
      <Box x={160} y={88} w={280} h={50} fill="#db2777" label="Feed-Forward Network" sub="process each token" />
      <Arrow x1={300} y1={68} x2={300} y2={50} />
      <Box x={170} y={8} w={260} h={40} fill="#059669" label="Next-token probabilities" />
    </Svg>
  ),
  rag: () => (
    <Svg vb="0 0 620 230" label="RAG: question is embedded, vector DB search, top chunks added to prompt, LLM answers with citations">
      <Box x={10} y={20} w={120} h={50} fill="#0891b2" label="❓ Question" />
      <Arrow x1={132} y1={45} x2={168} y2={45} />
      <Box x={170} y={20} w={120} h={50} fill="#7c3aed" label="Embed" sub="→ vector" />
      <Arrow x1={292} y1={45} x2={328} y2={45} />
      <Box x={330} y={20} w={130} h={50} fill="#059669" label="🗄️ Vector DB" sub="find nearest chunks" />
      <Box x={330} y={150} w={130} h={56} fill="#64748b" label="📄 Your docs" sub="chunked + embedded" />
      <Arrow x1={395} y1={148} x2={395} y2={74} />
      <Arrow x1={462} y1={45} x2={498} y2={45} />
      <Box x={500} y={20} w={110} h={50} fill="#ea580c" label="Prompt" sub="question + chunks" />
      <Arrow x1={555} y1={72} x2={555} y2={146} />
      <Box x={500} y={150} w={110} h={56} fill="#db2777" label="🤖 LLM" sub="answer + sources" />
    </Svg>
  ),
  'agent-loop': () => (
    <Svg vb="0 0 560 260" label="Agent loop: goal, think, act with a tool, observe, repeat until done">
      <Box x={20} y={105} w={110} h={50} fill="#0891b2" label="🎯 Goal" />
      <Arrow x1={132} y1={130} x2={190} y2={130} />
      <Box x={195} y={20} w={150} h={50} fill="#7c3aed" label="🧠 Think / plan" />
      <Box x={385} y={105} w={150} h={50} fill="#db2777" label="🔧 Act (call tool)" sub="search, code, API" />
      <Box x={195} y={190} w={150} h={50} fill="#059669" label="👀 Observe result" />
      <path d="M345 50 C 420 50, 460 70, 460 102" fill="none" className={Ln} strokeWidth={2} markerEnd="url(#arrow)" />
      <path d="M460 158 C 460 200, 420 215, 348 215" fill="none" className={Ln} strokeWidth={2} markerEnd="url(#arrow)" />
      <path d="M195 215 C 150 215, 150 50, 192 45" fill="none" className={Ln} strokeWidth={2} markerEnd="url(#arrow)" />
      <text x={270} y={135} textAnchor="middle" className={`${Tm} text-[11px]`}>repeat until done ✓</text>
    </Svg>
  ),
  diffusion: () => (
    <Svg vb="0 0 620 160" label="Diffusion: noise is removed step by step guided by a prompt to form an image">
      {[0, 1, 2, 3, 4].map((i) => {
        const noise = 1 - i / 4;
        return (
          <g key={i}>
            <rect x={15 + i * 122} y={20} width={90} height={90} rx={10} fill="#f59e0b" opacity={0.15 + (1 - noise) * 0.6} />
            {Array.from({ length: Math.round(noise * 60) }, (_, k) => (
              <rect key={k} x={15 + i * 122 + ((k * 37) % 86)} y={20 + ((k * 53) % 86)} width={4} height={4} className="fill-slate-500" opacity={0.7} />
            ))}
            {i === 4 && <text x={60 + i * 122} y={78} textAnchor="middle" className="text-[36px]">🌅</text>}
            {i < 4 && <Arrow x1={108 + i * 122} y1={65} x2={133 + i * 122} y2={65} />}
            <text x={60 + i * 122} y={132} textAnchor="middle" className={`${Tm} text-[11px]`}>{['pure noise', 'step 10', 'step 25', 'step 40', 'image!'][i]}</text>
          </g>
        );
      })}
      <text x={310} y={155} textAnchor="middle" className={`${T} text-[12px] font-semibold`}>prompt: “a sunset over the sea” guides every step</text>
    </Svg>
  ),
  deploy: () => (
    <Svg vb="0 0 620 150" label="AI MVP loop: idea, prototype, evals, launch, monitor, improve">
      {[
        ['💡', 'Narrow problem'],
        ['🧪', 'Prototype'],
        ['📋', 'Evals'],
        ['🚀', 'Launch small'],
        ['📊', 'Monitor'],
      ].map(([e, l], i) => (
        <g key={l}>
          <rect x={10 + i * 122} y={20} width={105} height={70} rx={14} fill="#ca8a04" opacity={0.14} stroke="#ca8a04" strokeWidth={2} />
          <text x={62 + i * 122} y={52} textAnchor="middle" className="text-[22px]">{e}</text>
          <text x={62 + i * 122} y={76} textAnchor="middle" className={`${T} text-[12px] font-bold`}>{l}</text>
          {i < 4 && <Arrow x1={116 + i * 122} y1={55} x2={130 + i * 122} y2={55} />}
        </g>
      ))}
      <path d="M555 92 C 555 140, 160 140, 160 94" fill="none" className={Ln} strokeWidth={2} strokeDasharray="6 5" markerEnd="url(#arrow)" />
      <text x={360} y={134} textAnchor="middle" className={`${Tm} text-[11px]`}>iterate on the top failure modes</text>
    </Svg>
  ),
};

export function Diagram({ id, caption }: { id: DiagramId; caption?: string }) {
  const D = DIAGRAMS[id];
  return (
    <figure className="my-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <D />
      {caption && <figcaption className="mt-2 text-center text-sm text-slate-500">{caption}</figcaption>}
    </figure>
  );
}
