// Synthesized Web Audio sound effects (zero external audio files needed)

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  _ensureCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setEnabled(on) {
    this.enabled = on;
    if (on) this._ensureCtx();
  }

  // Crisp subtle cloth-snap / metronome tick when hitting a stroke
  playSnap(isRest = false) {
    if (!this.enabled) return;
    const ctx = this._ensureCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isRest ? 260 : 520, now);
    osc.frequency.exponentialRampToValueAtTime(isRest ? 140 : 220, now + 0.035);

    gain.gain.setValueAtTime(isRest ? 0.04 : 0.075, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  playCorrect() {
    if (!this.enabled) return;
    const ctx = this._ensureCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.065);
      gain.gain.setValueAtTime(0.001, now + idx * 0.065);
      gain.gain.linearRampToValueAtTime(0.10, now + idx * 0.065 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.065 + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.065);
      osc.stop(now + idx * 0.065 + 0.24);
    });
  }

  playWrong() {
    if (!this.enabled) return;
    const ctx = this._ensureCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    [240, 185].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      gain.gain.setValueAtTime(0.06, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.18);
    });
  }
}

export const sound = new SoundEngine();
