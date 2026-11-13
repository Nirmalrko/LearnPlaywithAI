import { describe, expect, it } from 'vitest';
import { Bigram, convolve, cosine, fitLine, kmeansAssign, kmeansUpdate, knnPredict, makeDataset, MLP, mse, tokenize } from './ml';

describe('linear regression', () => {
  it('recovers a perfect line', () => {
    const pts = [0, 1, 2, 3].map((x) => ({ x, y: 2 * x + 1 }));
    const { w, b } = fitLine(pts);
    expect(w).toBeCloseTo(2);
    expect(b).toBeCloseTo(1);
    expect(mse(pts, w, b)).toBeCloseTo(0);
  });
});

describe('k-NN', () => {
  it('votes by nearest neighbours', () => {
    const train = [
      { x: 0, y: 0, c: 0 },
      { x: 0.1, y: 0, c: 0 },
      { x: 1, y: 1, c: 1 },
    ];
    expect(knnPredict(train, { x: 0.05, y: 0 }, 1).c).toBe(0);
    expect(knnPredict(train, { x: 0.9, y: 0.9 }, 1).c).toBe(1);
  });
});

describe('k-means', () => {
  it('moves centroids to cluster means', () => {
    const pts = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 10, y: 10 },
      { x: 10, y: 11 },
    ];
    const cents = [
      { x: 1, y: 1 },
      { x: 9, y: 9 },
    ];
    const a = kmeansAssign(pts, cents);
    expect(a).toEqual([0, 0, 1, 1]);
    const u = kmeansUpdate(pts, a, cents);
    expect(u[0]).toEqual({ x: 0, y: 0.5 });
    expect(u[1]).toEqual({ x: 10, y: 10.5 });
  });
});

describe('neural network', () => {
  it('learns the circle dataset (loss goes down, accuracy goes up)', () => {
    const data = makeDataset('circle', 120, 3);
    const net = new MLP([2, 8, 8, 1], 2);
    const first = net.trainEpoch(data, 0.03);
    let last = first;
    for (let i = 0; i < 400; i++) last = net.trainEpoch(data, 0.03);
    expect(last).toBeLessThan(first * 0.5);
    expect(net.accuracy(data)).toBeGreaterThan(0.9);
  });
  it('a linear model cannot solve XOR', () => {
    const data = makeDataset('xor', 160, 3);
    const net = new MLP([2, 1], 2);
    for (let i = 0; i < 300; i++) net.trainEpoch(data, 0.03);
    expect(net.accuracy(data)).toBeLessThan(0.75);
  });
});

describe('tokenizer', () => {
  it('keeps common words whole and splits rare words', () => {
    expect(tokenize('the cat')).toEqual(['the', ' cat']);
    const rare = tokenize('unbelievably');
    expect(rare.length).toBeGreaterThan(1);
    expect(rare.join('')).toBe('unbelievably');
  });
  it('is lossless', () => {
    const s = 'Hello, world! Tokenization is fun in 2026.';
    expect(tokenize(s).join('')).toBe(s);
  });
});

describe('vectors & language model', () => {
  it('computes cosine similarity', () => {
    expect(cosine([1, 0], [1, 0])).toBeCloseTo(1);
    expect(cosine([1, 0], [0, 1])).toBeCloseTo(0);
  });
  it('bigram probabilities sum to 1 and respond to temperature', () => {
    const lm = new Bigram('a b . a b . a c .');
    const d = lm.next('a', 1);
    expect(d.reduce((s, x) => s + x.p, 0)).toBeCloseTo(1);
    expect(d[0].word).toBe('b');
    expect(lm.next('a', 0.1)[0].p).toBeGreaterThan(d[0].p);
  });
});

describe('convolution', () => {
  it('identity kernel returns the input', () => {
    const img = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    expect(convolve(img, 3, 3, [0, 0, 0, 0, 1, 0, 0, 0, 0])).toEqual(img);
  });
});
