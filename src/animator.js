import { GENGA, SIGNALS } from './semaphoreData.js';
import { sound } from './sound.js';

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeOutQuart(t) {
  const inv = 1 - t;
  return 1 - inv * inv * inv * inv;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function cloneArm(arm) {
  return {
    srZ: arm.srZ || 0,
    srX: arm.srX || 0,
    srY: arm.srY || 0,
    elZ: arm.elZ || 0,
    roll: arm.roll || 0,
    lift: arm.lift || 0
  };
}

function clonePose(pose) {
  return {
    R: cloneArm(pose.R),
    L: cloneArm(pose.L)
  };
}

function lerpArm(a, b, t) {
  return {
    srZ: lerp(a.srZ || 0, b.srZ || 0, t),
    srX: lerp(a.srX || 0, b.srX || 0, t),
    srY: lerp(a.srY || 0, b.srY || 0, t),
    elZ: lerp(a.elZ || 0, b.elZ || 0, t),
    roll: lerp(a.roll || 0, b.roll || 0, t),
    lift: lerp(a.lift || 0, b.lift || 0, t)
  };
}

function lerpPose(pA, pB, t) {
  return {
    R: lerpArm(pA.R, pB.R, t),
    L: lerpArm(pA.L, pB.L, t)
  };
}

function sampleKeyframes(keyframes, tNorm) {
  if (tNorm <= keyframes[0].t) return clonePose(keyframes[0]);
  const last = keyframes[keyframes.length - 1];
  if (tNorm >= last.t) return clonePose(last);

  for (let i = 0; i < keyframes.length - 1; i++) {
    const k0 = keyframes[i];
    const k1 = keyframes[i + 1];
    if (tNorm >= k0.t && tNorm <= k1.t) {
      const span = Math.max(0.0001, k1.t - k0.t);
      const localT = easeInOutCubic((tNorm - k0.t) / span);
      return lerpPose(k0, k1, localT);
    }
  }
  return clonePose(last);
}

export class SemaphoreAnimator {
  constructor(scoutRig) {
    this.scout = scoutRig;
    this.cpm = 55; // Characters per minute (10..400)
    this.speedMultiplier = 1.0; // e.g., 0.5x slow-mo replay

    this.steps = [];
    this.stepIndex = 0;
    this.stepProgress = 0; // 0..1 within current step
    this.isPlaying = false;
    this.loop = false;

    this.currentPose = clonePose(GENGA.rest.pose);
    this.fromPose = clonePose(GENGA.rest.pose);
    this.staticTarget = null; // When holding a fixed inspected pose
    this.staticLoopGenga = null; // When looping a dynamic pose like 0 or 11 or signal in Teach Mode
    this.staticLoopTime = 0;

    this.stepSnapped = false;

    // Callbacks
    this.onStepChange = null;
    this.onComplete = null;
  }

  setCpm(cpm) {
    this.cpm = Math.max(10, Math.min(400, Number(cpm) || 55));
  }

  setSpeedMultiplier(mult) {
    this.speedMultiplier = mult;
  }

  /**
   * Load and optionally play a compiled timeline of steps.
   */
  loadTimeline(steps, { autoplay = true, loop = false, speedMultiplier = 1.0 } = {}) {
    this.steps = steps || [];
    this.stepIndex = 0;
    this.stepProgress = 0;
    this.loop = loop;
    this.speedMultiplier = speedMultiplier;
    this.staticTarget = null;
    this.staticLoopGenga = null;
    this.stepSnapped = false;

    // Start smoothly from currentPose
    this.fromPose = clonePose(this.currentPose);
    this.scout.clearTrails();

    if (autoplay && this.steps.length > 0) {
      this.isPlaying = true;
      this._notifyStep();
    } else {
      this.isPlaying = false;
    }
  }

  pause() {
    this.isPlaying = false;
  }

  resume() {
    if (this.steps.length === 0) return;
    this.staticTarget = null;
    this.staticLoopGenga = null;
    if (this.stepIndex >= this.steps.length) {
      this.stepIndex = 0;
      this.stepProgress = 0;
      this.fromPose = clonePose(this.currentPose);
      this.scout.clearTrails();
    }
    this.isPlaying = true;
    this._notifyStep();
  }

  restart() {
    if (this.steps.length === 0) return;
    this.stepIndex = 0;
    this.stepProgress = 0;
    this.stepSnapped = false;
    this.staticTarget = null;
    this.staticLoopGenga = null;
    this.fromPose = clonePose(this.currentPose);
    this.scout.clearTrails();
    this.isPlaying = true;
    this._notifyStep();
  }

  /**
   * Freeze or demonstrate a single Genga or Signal immediately (Teaching Mode).
   */
  inspectGenga(gengaId) {
    this.isPlaying = false;
    this.steps = [];
    this.fromPose = clonePose(this.currentPose);
    this.scout.clearTrails();

    const g = GENGA[gengaId];
    if (!g) return;
    if (g.type === 'pose') {
      this.staticLoopGenga = null;
      this.staticTarget = clonePose(g.pose);
      this.staticBlend = 0;
    } else {
      // Dynamic genga like 0 (circle) or 11 (sweep) loops cleanly so learner sees the motion
      this.staticTarget = null;
      this.staticLoopGenga = { kind: 'genga', def: g };
      this.staticLoopTime = 0;
    }
  }

  inspectSignal(signalId) {
    const s = SIGNALS[signalId];
    if (!s) return;
    this.isPlaying = false;
    this.steps = [];
    this.fromPose = clonePose(this.currentPose);
    this.scout.clearTrails();
    this.staticTarget = null;
    this.staticLoopGenga = { kind: 'signal', def: s };
    this.staticLoopTime = 0;
  }

  _notifyStep() {
    if (this.onStepChange && this.steps[this.stepIndex]) {
      this.onStepChange(this.steps[this.stepIndex], this.stepIndex, this.steps.length);
    }
  }

  _getStepDuration(step) {
    const effectiveCpm = this.cpm * this.speedMultiplier;
    // Average character has ~2.6 unit-steps (strokes + rest)
    const baseBeat = (60 / Math.max(5, effectiveCpm)) / 2.6;
    return Math.max(0.025, baseBeat * (step.durationFactor || 1.0));
  }

  _evaluateStep(step, progress) {
    if (step.kind === 'signal') {
      const sig = SIGNALS[step.signalId];
      const enterFrac = 0.14;
      if (progress < enterFrac) {
        return lerpPose(this.fromPose, sig.keyframes[0], easeOutQuart(progress / enterFrac));
      }
      return sampleKeyframes(sig.keyframes, (progress - enterFrac) / (1 - enterFrac));
    }

    const g = GENGA[step.gengaId];
    if (!g) return clonePose(GENGA.rest.pose);

    if (g.type === 'pose') {
      // At higher CPM, transition rapidly in first 45-50%, hold crisply on target for the rest!
      const moveFrac = this.cpm >= 150 ? 0.50 : 0.40;
      if (progress < moveFrac) {
        const t = easeOutQuart(progress / moveFrac);
        return lerpPose(this.fromPose, g.pose, t);
      }
      return clonePose(g.pose);
    }

    // Continuous diagonal sword-cut sweep (e.g. '11')
    if (g.evaluateSlash) {
      const enterFrac = 0.22;
      const holdStartFrac = 0.30;
      const slashEndFrac = 0.85;
      if (progress < enterFrac) {
        return lerpPose(this.fromPose, g.startPose, easeOutQuart(progress / enterFrac));
      }
      if (progress < holdStartFrac) {
        return clonePose(g.startPose);
      }
      if (progress < slashEndFrac) {
        return g.evaluateSlash((progress - holdStartFrac) / (slashEndFrac - holdStartFrac));
      }
      return clonePose(g.endPose);
    }

    // Multi-keyframe Genga ('0' circle)
    const enterFrac = 0.16;
    if (progress < enterFrac) {
      return lerpPose(this.fromPose, g.keyframes[0], easeOutQuart(progress / enterFrac));
    }
    return sampleKeyframes(g.keyframes, (progress - enterFrac) / (1 - enterFrac));
  }

  _normalizeEndPose(pose, gengaId = null) {
    // Canonicalize '11' finish pose so next transition returns cleanly without -152° unwinding
    if (gengaId === '11' && GENGA['11'].endPose) {
      return clonePose(GENGA['11'].endPose);
    }
    // Wrap 360 -> 0 after '0' circle so next transition doesn't unwind backwards
    const p = clonePose(pose);
    if (Math.abs(p.R.srZ - 360) < 1) p.R.srZ = 0;
    if (Math.abs(p.L.srZ - 360) < 1) p.L.srZ = 0;
    return p;
  }

  update(dt) {
    // Clamp dt on tab-switch spikes so timeline doesn't skip whole words
    const safeDt = Math.min(dt, 0.06);
    let recordTrail = false;

    if (this.staticTarget) {
      this.staticBlend = Math.min(1, (this.staticBlend || 0) + safeDt * 6.5);
      this.currentPose = lerpPose(this.fromPose, this.staticTarget, easeOutQuart(this.staticBlend));
      this.scout.applyPose(this.currentPose.R, this.currentPose.L);
      this.scout.update(safeDt, false, false);
      return;
    }

    if (this.staticLoopGenga) {
      const def = this.staticLoopGenga.def;
      const isSlash = this.staticLoopGenga.kind === 'genga' && typeof def.evaluateSlash === 'function';
      const cycleSec = isSlash ? 2.15 : (this.staticLoopGenga.kind === 'signal' ? 2.2 : 1.7);
      this.staticLoopTime += safeDt;

      let loopTrail = true;
      if (isSlash) {
        if (this.staticLoopTime < 0.26) {
          this.currentPose = lerpPose(this.fromPose, def.startPose, easeOutQuart(this.staticLoopTime / 0.26));
          this.scout.clearTrails();
          loopTrail = false;
        } else {
          const tNorm = ((this.staticLoopTime - 0.26) % cycleSec) / cycleSec;
          if (tNorm < 0.14) {
            this.currentPose = clonePose(def.startPose);
            if (tNorm < 0.12) this.scout.clearTrails();
            loopTrail = false;
          } else if (tNorm < 0.62) {
            this.currentPose = def.evaluateSlash((tNorm - 0.14) / 0.48);
            loopTrail = true;
          } else if (tNorm < 0.80) {
            this.currentPose = clonePose(def.endPose);
            loopTrail = true;
          } else {
            this.currentPose = lerpPose(def.endPose, def.startPose, easeInOutCubic((tNorm - 0.80) / 0.20));
            loopTrail = false;
          }
        }
      } else {
        const tNorm = (this.staticLoopTime % cycleSec) / cycleSec;
        if (this.staticLoopTime < 0.25) {
          this.currentPose = lerpPose(this.fromPose, def.keyframes[0], easeOutQuart(this.staticLoopTime / 0.25));
        } else {
          this.currentPose = sampleKeyframes(def.keyframes, tNorm);
        }
        if (tNorm < 0.04) this.scout.clearTrails();
      }

      this.scout.applyPose(this.currentPose.R, this.currentPose.L);
      this.scout.update(safeDt, true, loopTrail);
      return;
    }

    if (this.isPlaying && this.stepIndex < this.steps.length) {
      let remainingDt = safeDt;
      // Loop handles ultra-fast 400 CPM speeds cleanly even if >1 step completes in a single frame
      let guard = 0;
      while (remainingDt > 0 && this.stepIndex < this.steps.length && guard < 8) {
        guard++;
        const step = this.steps[this.stepIndex];
        const stepDur = this._getStepDuration(step);
        const progressInc = remainingDt / stepDur;

        if (this.stepProgress + progressInc < 1.0) {
          this.stepProgress += progressInc;
          remainingDt = 0;

          if (!this.stepSnapped && this.stepProgress >= 0.35) {
            this.stepSnapped = true;
            sound.playSnap(step.gengaId === 'rest');
          }

          this.currentPose = this._evaluateStep(step, this.stepProgress);
          recordTrail = step.gengaId !== 'rest' && !(step.gengaId === '11' && this.stepProgress < 0.28);
        } else {
          // Step completed!
          const usedDt = (1.0 - this.stepProgress) * stepDur;
          remainingDt -= usedDt;

          const endPose = this._evaluateStep(step, 1.0);
          this.fromPose = this._normalizeEndPose(endPose, step.gengaId);
          this.currentPose = clonePose(this.fromPose);

          if (!this.stepSnapped) {
            sound.playSnap(step.gengaId === 'rest');
          }

          this.stepIndex++;
          this.stepProgress = 0;
          this.stepSnapped = false;

          if (this.stepIndex < this.steps.length) {
            this._notifyStep();
            // Reset trail cleanly when starting a brand new character
            const nextStep = this.steps[this.stepIndex];
            if (nextStep.charIndex !== step.charIndex && nextStep.gengaId !== 'rest') {
              this.scout.clearTrails();
            }
          } else if (this.loop) {
            this.stepIndex = 0;
            this.scout.clearTrails();
            this._notifyStep();
          } else {
            this.isPlaying = false;
            if (this.onComplete) this.onComplete();
            break;
          }
        }
      }
    }

    this.scout.applyPose(this.currentPose.R, this.currentPose.L);
    this.scout.update(safeDt, this.isPlaying, recordTrail);
  }
}
