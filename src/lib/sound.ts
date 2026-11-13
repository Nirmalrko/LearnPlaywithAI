// Tiny synthesized sound effects via Web Audio — no audio files needed.
let ctx: AudioContext | null = null;

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.08) {
  if (!sfx.enabled) return;
  try {
    ctx ??= new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    const t = ctx.currentTime + start;
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur);
  } catch {
    /* audio not available */
  }
}

export const sfx = {
  enabled: true,
  correct: () => {
    tone(660, 0, 0.12);
    tone(880, 0.1, 0.18);
  },
  wrong: () => tone(180, 0, 0.25, 'square', 0.04),
  coin: () => {
    tone(988, 0, 0.08, 'triangle');
    tone(1319, 0.07, 0.2, 'triangle');
  },
  levelUp: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.25, 'triangle')),
};
