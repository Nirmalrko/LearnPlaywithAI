# 🧠 LearnPlay AI — Learn AI from A to Z by playing

An interactive, gamified web app that takes anyone from **“what is AI?”** to **building and shipping an AI product**.
Short lessons, real-world examples, **23 hands-on demos that run real algorithms in your browser**, quizzes after every lesson, XP, levels, streaks, badges, a final exam and a printable certificate.

No sign-up, no backend, no API keys — progress is saved privately in the browser.

## ✨ Features

| | |
|---|---|
| 🗺️ **8 worlds, 39 lessons** | AI Basics → Data → Classic ML → Neural Networks → Computer Vision → Language & LLMs → Generative AI & Prompting → Responsible AI & Shipping |
| 🕹️ **23 interactive demos** | Train a real neural network, fit regression lines, step through k-means, explore k-NN, apply convolution filters, tokenize text, explore embeddings, generate text with a tiny language model, visualise attention, score your prompts, walk through a RAG pipeline, watch diffusion denoise an image, audit bias, and more |
| 🧠 **156 quiz questions** | Multiple choice, true/false and put-in-order questions, with an explanation for every answer |
| 🎮 **Game layer** | XP (no farming: only improvements earn XP), 7 levels, daily streaks, 16 badges, world unlocking, confetti and sound effects |
| 🎓 **Final exam & certificate** | 24 questions drawn across all worlds; pass at 70% to get a printable / PDF certificate |
| 📈 **Progress dashboard** | Per-world progress, quiz accuracy, and recommended topics to review |
| ⚙️ **Settings** | Dark/light/system theme, sound toggle, Explorer mode (unlock everything), export/import/reset progress |
| 📱 **Responsive & accessible** | Works on phones, tablets and desktops; keyboard-friendly; respects reduced motion for confetti |

## 🚀 Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (game logic, ML algorithms, content integrity)
npm run build      # production build in dist/
npm run preview    # serve the production build
```

Requires Node.js 20+.

## 🌍 Deploy

The build is a static site (it uses hash routing, so no server rewrites are needed). You can host `dist/` anywhere: GitHub Pages, Netlify, Vercel, Cloudflare Pages or S3.

**GitHub Pages (already set up):** `.github/workflows/deploy.yml` tests, builds and deploys on every push to `main`.
Turn it on once in **Settings → Pages → Source: GitHub Actions**.

## 🏗️ Architecture

```
src/
├── data/
│   ├── types.ts            # Content model: World → Lesson → Blocks + Quiz
│   └── worlds/             # All course content as typed data (one file per world)
├── lib/
│   ├── game.ts             # Pure game logic: XP, levels, streaks, badges, unlocking, save migration
│   ├── store.tsx           # React context + localStorage persistence, toasts, celebrations
│   ├── ml.ts               # From-scratch ML: linear regression, k-NN, k-means, MLP with backprop + Adam,
│   │                       #   tokenizer, bigram language model, cosine similarity, convolution
│   └── sound.ts            # Synthesised sound effects (Web Audio, no files)
├── demos/                  # 23 interactive demos + DemoFrame (awards XP on first interaction)
├── diagrams/               # Original SVG diagrams (theme-aware)
├── components/             # Layout, Quiz engine, Markdown renderer, toasts, art
└── pages/                  # Home/world map, World, Lesson, Progress, Badges, Exam, Settings
```

**Tech:** React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · Vitest · canvas-confetti.
All ML runs in plain TypeScript, so there are no heavy ML libraries and the whole app is about 160 KB gzipped.

### ✍️ Adding a lesson

Lessons are plain data. Add an object to a world file in `src/data/worlds/`:

```ts
{
  id: 'my-lesson',              // must be unique
  title: 'My Lesson',
  summary: 'One-line description',
  minutes: 5,
  blocks: [
    { type: 'text', md: 'Supports **bold**, *italic*, `code` and - bullet lists.' },
    { type: 'example', title: 'Real world', company: 'Acme', md: '...' },
    { type: 'demo', id: 'knn' },            // any id registered in src/demos/index.tsx
    { type: 'diagram', id: 'neuron' },
  ],
  quiz: [
    { kind: 'mcq', q: '...', options: ['a', 'b'], answer: 0, explain: '...' },
    { kind: 'tf', q: '...', answer: true, explain: '...' },
    { kind: 'order', q: '...', items: ['first', 'second', 'third'], explain: '...' },
  ],
}
```

`npm test` checks the content: unique ids, valid answers, and that every demo it references exists.

## 🗺️ Roadmap (phase 2)

- Accounts and cloud sync (e.g. Supabase) with a global leaderboard
- AI tutor chat that calls an LLM through a small server-side proxy, so the API key stays secret
- More languages, spaced-repetition review, and shareable certificate links
