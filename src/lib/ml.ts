// Small, real ML algorithms implemented from scratch so learners can watch them run in the browser.

export type Pt = { x: number; y: number };
export type LabeledPt = Pt & { c: number };

// ---------- Linear regression ----------
export function fitLine(pts: Pt[]): { w: number; b: number } {
  const n = pts.length;
  if (n < 2) return { w: 0, b: n ? pts[0].y : 0 };
  const mx = pts.reduce((s, p) => s + p.x, 0) / n;
  const my = pts.reduce((s, p) => s + p.y, 0) / n;
  let num = 0;
  let den = 0;
  for (const p of pts) {
    num += (p.x - mx) * (p.y - my);
    den += (p.x - mx) ** 2;
  }
  const w = den === 0 ? 0 : num / den;
  return { w, b: my - w * mx };
}

export function mse(pts: Pt[], w: number, b: number): number {
  if (!pts.length) return 0;
  return pts.reduce((s, p) => s + (p.y - (w * p.x + b)) ** 2, 0) / pts.length;
}

// ---------- k-NN ----------
export function knnPredict(train: LabeledPt[], q: Pt, k: number): { c: number; votes: number[]; neighbors: LabeledPt[] } {
  const sorted = [...train].sort((a, b) => dist2(a, q) - dist2(b, q));
  const neighbors = sorted.slice(0, Math.max(1, Math.min(k, sorted.length)));
  const votes = [0, 0, 0];
  for (const n of neighbors) votes[n.c]++;
  const c = votes.indexOf(Math.max(...votes));
  return { c, votes, neighbors };
}

export const dist2 = (a: Pt, b: Pt) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

// ---------- k-means ----------
export function kmeansAssign(pts: Pt[], cents: Pt[]): number[] {
  return pts.map((p) => {
    let best = 0;
    for (let i = 1; i < cents.length; i++) if (dist2(p, cents[i]) < dist2(p, cents[best])) best = i;
    return best;
  });
}

export function kmeansUpdate(pts: Pt[], assign: number[], cents: Pt[]): Pt[] {
  return cents.map((c, i) => {
    const mine = pts.filter((_, j) => assign[j] === i);
    if (!mine.length) return c;
    return { x: mine.reduce((s, p) => s + p.x, 0) / mine.length, y: mine.reduce((s, p) => s + p.y, 0) / mine.length };
  });
}

export function inertia(pts: Pt[], assign: number[], cents: Pt[]): number {
  return pts.reduce((s, p, i) => s + dist2(p, cents[assign[i]]), 0);
}

// ---------- Seeded random (so demos are reproducible) ----------
export function rng(seed = 42) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gaussian(r: () => number) {
  const u = Math.max(1e-9, r());
  const v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// ---------- 2D classification datasets (coords in [-1, 1]) ----------
export type DatasetKind = 'blobs' | 'circle' | 'xor' | 'spiral';

export function makeDataset(kind: DatasetKind, n = 160, seed = 7): LabeledPt[] {
  const r = rng(seed);
  const out: LabeledPt[] = [];
  for (let i = 0; i < n; i++) {
    const c = i % 2;
    let x = 0;
    let y = 0;
    if (kind === 'blobs') {
      x = (c ? 0.45 : -0.45) + gaussian(r) * 0.22;
      y = (c ? 0.35 : -0.35) + gaussian(r) * 0.22;
    } else if (kind === 'circle') {
      const rad = c ? r() * 0.4 : 0.6 + r() * 0.35;
      const a = r() * Math.PI * 2;
      x = Math.cos(a) * rad;
      y = Math.sin(a) * rad;
    } else if (kind === 'xor') {
      x = r() * 2 - 1;
      y = r() * 2 - 1;
      const pad = 0.08;
      if (Math.abs(x) < pad) x += x < 0 ? -pad : pad;
      if (Math.abs(y) < pad) y += y < 0 ? -pad : pad;
      out.push({ x, y, c: x * y > 0 ? 1 : 0 });
      continue;
    } else {
      const t = (i / n) * 2 + 0.15; // 0..2
      const rad = t * 0.45;
      const a = t * 1.75 * Math.PI + (c ? Math.PI : 0);
      x = Math.cos(a) * rad + gaussian(r) * 0.03;
      y = Math.sin(a) * rad + gaussian(r) * 0.03;
    }
    out.push({ x, y, c });
  }
  return out;
}

// ---------- A tiny multi-layer perceptron with backprop + Adam ----------
export class MLP {
  sizes: number[];
  W: number[][][]; // W[l][j][i]: weight from neuron i in layer l to neuron j in layer l+1
  B: number[][];
  private mW: number[][][];
  private vW: number[][][];
  private mB: number[][];
  private vB: number[][];
  private t = 0;

  constructor(sizes: number[], seed = 1) {
    this.sizes = sizes;
    const r = rng(seed);
    this.W = [];
    this.B = [];
    for (let l = 0; l < sizes.length - 1; l++) {
      const fanIn = sizes[l];
      const scale = Math.sqrt(2 / fanIn);
      this.W.push(Array.from({ length: sizes[l + 1] }, () => Array.from({ length: fanIn }, () => gaussian(r) * scale)));
      this.B.push(Array(sizes[l + 1]).fill(0));
    }
    const zerosW = () => this.W.map((L) => L.map((row) => row.map(() => 0)));
    const zerosB = () => this.B.map((L) => L.map(() => 0));
    this.mW = zerosW();
    this.vW = zerosW();
    this.mB = zerosB();
    this.vB = zerosB();
  }

  /** Returns activations for every layer. Hidden: tanh. Output: sigmoid. */
  forward(input: number[]): number[][] {
    const acts = [input];
    let a = input;
    for (let l = 0; l < this.W.length; l++) {
      const last = l === this.W.length - 1;
      a = this.W[l].map((row, j) => {
        let z = this.B[l][j];
        for (let i = 0; i < row.length; i++) z += row[i] * a[i];
        return last ? 1 / (1 + Math.exp(-z)) : Math.tanh(z);
      });
      acts.push(a);
    }
    return acts;
  }

  predict(x: number, y: number): number {
    const acts = this.forward([x, y]);
    return acts[acts.length - 1][0];
  }

  /** One epoch of full-batch gradient descent with Adam. Returns the mean binary cross-entropy loss. */
  trainEpoch(data: LabeledPt[], lr = 0.03): number {
    const gW = this.W.map((L) => L.map((row) => row.map(() => 0)));
    const gB = this.B.map((L) => L.map(() => 0));
    let loss = 0;
    for (const p of data) {
      const acts = this.forward([p.x, p.y]);
      const out = acts[acts.length - 1][0];
      const yv = p.c;
      loss += -(yv * Math.log(out + 1e-9) + (1 - yv) * Math.log(1 - out + 1e-9));
      // delta at output for sigmoid + BCE = out - y
      let delta = [out - yv];
      for (let l = this.W.length - 1; l >= 0; l--) {
        const aPrev = acts[l];
        for (let j = 0; j < delta.length; j++) {
          gB[l][j] += delta[j];
          for (let i = 0; i < aPrev.length; i++) gW[l][j][i] += delta[j] * aPrev[i];
        }
        if (l > 0) {
          const nd = Array(aPrev.length).fill(0);
          for (let i = 0; i < aPrev.length; i++) {
            let s = 0;
            for (let j = 0; j < delta.length; j++) s += this.W[l][j][i] * delta[j];
            nd[i] = s * (1 - aPrev[i] * aPrev[i]); // tanh'
          }
          delta = nd;
        }
      }
    }
    const n = data.length || 1;
    this.t++;
    const b1 = 0.9;
    const b2 = 0.999;
    const eps = 1e-8;
    const c1 = 1 - b1 ** this.t;
    const c2 = 1 - b2 ** this.t;
    for (let l = 0; l < this.W.length; l++) {
      for (let j = 0; j < this.W[l].length; j++) {
        for (let i = 0; i < this.W[l][j].length; i++) {
          const g = gW[l][j][i] / n;
          this.mW[l][j][i] = b1 * this.mW[l][j][i] + (1 - b1) * g;
          this.vW[l][j][i] = b2 * this.vW[l][j][i] + (1 - b2) * g * g;
          this.W[l][j][i] -= (lr * (this.mW[l][j][i] / c1)) / (Math.sqrt(this.vW[l][j][i] / c2) + eps);
        }
        const g = gB[l][j] / n;
        this.mB[l][j] = b1 * this.mB[l][j] + (1 - b1) * g;
        this.vB[l][j] = b2 * this.vB[l][j] + (1 - b2) * g * g;
        this.B[l][j] -= (lr * (this.mB[l][j] / c1)) / (Math.sqrt(this.vB[l][j] / c2) + eps);
      }
    }
    return loss / n;
  }

  accuracy(data: LabeledPt[]): number {
    if (!data.length) return 0;
    return data.filter((p) => (this.predict(p.x, p.y) > 0.5 ? 1 : 0) === p.c).length / data.length;
  }
}

// ---------- Text: a simplified sub-word tokenizer ----------
const COMMON = new Set(
  'the a an and or but if of to in on at for with is are was were be been it this that i you he she we they my your me not no yes do does did have has had can will would should could from by as so what how why when where who which all some any more most very just about into over than then there their our out up down new one two good great like love ai model data learn learning machine deep neural network token tokens word words hello world cat dog play game'.split(
    ' ',
  ),
);
const PREFIXES = ['un', 're', 'dis', 'pre', 'over', 'under', 'inter', 'trans', 'super', 'micro'];
const SUFFIXES = ['ization', 'ation', 'ness', 'ment', 'able', 'ible', 'ing', 'tion', 'ed', 'er', 'est', 'ly', 'ful', 'less', 's'];

/** Approximates BPE behaviour: common words = 1 token, rare words split into prefix/stem/suffix chunks. */
export function tokenize(text: string): string[] {
  const parts = text.match(/\s*[A-Za-z]+|\s*\d{1,3}|\s*[^\sA-Za-z\d]|\s+/g) ?? [];
  const out: string[] = [];
  for (const raw of parts) {
    const lead = raw.match(/^\s*/)?.[0] ?? '';
    const word = raw.slice(lead.length);
    if (!word) {
      if (raw) out.push(raw);
      continue;
    }
    if (!/^[A-Za-z]+$/.test(word) || word.length <= 4 || COMMON.has(word.toLowerCase())) {
      out.push(lead + word);
      continue;
    }
    const pieces: string[] = [];
    let w = word;
    const pre = PREFIXES.find((p) => w.toLowerCase().startsWith(p) && w.length - p.length >= 4);
    if (pre) {
      pieces.push(w.slice(0, pre.length));
      w = w.slice(pre.length);
    }
    const suf = SUFFIXES.find((s) => w.toLowerCase().endsWith(s) && w.length - s.length >= 3);
    let tail = '';
    if (suf) {
      tail = w.slice(w.length - suf.length);
      w = w.slice(0, w.length - suf.length);
    }
    // long stems get chunked into ~5 character pieces
    while (w.length > 6) {
      pieces.push(w.slice(0, 5));
      w = w.slice(5);
    }
    if (w) pieces.push(w);
    if (tail) pieces.push(tail);
    pieces[0] = lead + pieces[0];
    out.push(...pieces);
  }
  return out;
}

/** Deterministic fake vocabulary id for display purposes. */
export function tokenId(tok: string): number {
  let h = 2166136261;
  for (let i = 0; i < tok.length; i++) h = Math.imul(h ^ tok.charCodeAt(i), 16777619);
  return (h >>> 0) % 100000;
}

// ---------- Vectors ----------
export function cosine(a: number[], b: number[]): number {
  let d = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    d += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? d / Math.sqrt(na * nb) : 0;
}

// ---------- Bigram language model ----------
export class Bigram {
  counts = new Map<string, Map<string, number>>();

  constructor(corpus: string) {
    const words = corpus.toLowerCase().replace(/[^a-z.\s]/g, ' ').replace(/\./g, ' . ').split(/\s+/).filter(Boolean);
    for (let i = 0; i < words.length - 1; i++) {
      const m = this.counts.get(words[i]) ?? new Map<string, number>();
      m.set(words[i + 1], (m.get(words[i + 1]) ?? 0) + 1);
      this.counts.set(words[i], m);
    }
  }

  /** Probability distribution over next words, shaped by temperature. */
  next(word: string, temperature = 1): { word: string; p: number }[] {
    const m = this.counts.get(word.toLowerCase());
    if (!m) return [];
    const t = Math.max(0.05, temperature);
    const entries = [...m.entries()].map(([w, c]) => ({ word: w, s: Math.log(c) / t }));
    const max = Math.max(...entries.map((e) => e.s));
    const exps = entries.map((e) => ({ word: e.word, e: Math.exp(e.s - max) }));
    const sum = exps.reduce((s, e) => s + e.e, 0);
    return exps.map((e) => ({ word: e.word, p: e.e / sum })).sort((a, b) => b.p - a.p);
  }

  sample(word: string, temperature: number, r: () => number = Math.random): string | null {
    const dist = this.next(word, temperature);
    if (!dist.length) return null;
    let x = r();
    for (const d of dist) {
      x -= d.p;
      if (x <= 0) return d.word;
    }
    return dist[dist.length - 1].word;
  }
}

// ---------- Convolution ----------
export function convolve(src: number[], w: number, h: number, k: number[]): number[] {
  const out = new Array(w * h).fill(0);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let s = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const xx = Math.min(w - 1, Math.max(0, x + kx));
          const yy = Math.min(h - 1, Math.max(0, y + ky));
          s += src[yy * w + xx] * k[(ky + 1) * 3 + (kx + 1)];
        }
      }
      out[y * w + x] = s;
    }
  }
  return out;
}
