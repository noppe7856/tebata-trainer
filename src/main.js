import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  GENGA_ORDER,
  GENGA,
  SIGNALS,
  KANA_MAP,
  GOJUON_ROWS,
  SCOUT_SENTENCES,
  TEACHING_LESSONS,
  DAKUTEN_DECOMPOSE,
  normalizeForSemaphore,
  compileTextToTimeline,
  generateRandomProblem,
  generateDistractorChoices
} from './semaphoreData.js';
import { ScoutRig, buildCampsiteEnvironment } from './scoutModel.js';
import { SemaphoreAnimator } from './animator.js';
import { renderGengaMiniSvg } from './miniDiagram.js';
import { sound } from './sound.js';

// -------------------------
// Application State
// -------------------------
const CAM_PRESETS = {
  receiver: {
    pos: new THREE.Vector3(0, 1.50, 5.45),
    target: new THREE.Vector3(0, 1.18, 0),
    note: '（正面＝受信視点）'
  },
  sender: {
    pos: new THREE.Vector3(0, 1.72, -5.35),
    target: new THREE.Vector3(0, 1.20, 0),
    note: '（背面＝送信者と同じ向き）'
  },
  angle: {
    pos: new THREE.Vector3(3.15, 2.02, 4.45),
    target: new THREE.Vector3(0, 1.18, 0),
    note: '（斜め3D＝腕の交差確認）'
  }
};

const QUIZ_CATEGORIES = [
  { id: 'kana_lv1', label: '1画のみ(8字)' },
  { id: 'kana_basic', label: '基本46文字' },
  { id: 'kana_all', label: '濁音・半濁音' },
  { id: 'numbers', label: '数字(0〜999)' },
  { id: 'random_3', label: 'ランダム3文字' },
  { id: 'random_5', label: 'ランダム5文字' },
  { id: 'scout_words', label: 'スカウト用語' },
  { id: 'scout_sentences', label: '短文電報' },
  { id: 'weak_focus', label: '苦手克服' }
];

const HAT_MODES = ['beret', 'campaign', 'none'];
const HAT_LABELS = {
  beret: '帽子: ベレー',
  campaign: '帽子: キャンプ帽',
  none: '帽子: なし'
};

const state = {
  mode: 'quiz', // 'quiz' | 'teach' | 'free'
  camPreset: 'receiver',
  showTrail: true,
  showGuide: false,
  hatMode: 'beret',
  soundEnabled: false,
  cpm: 55,
  slowMo: false,

  quiz: {
    category: 'kana_basic',
    inputMode: 'text', // 'text' | 'choice'
    autoNext: true,
    pauseOnWrong: true,
    includeHandshake: false,
    problemText: '',
    timeline: null,
    choices: [],
    status: 'playing', // 'playing' | 'answered'
    lastUserAnswer: '',
    isCorrect: null,
    hintVisible: false,
    activeCharIndex: -1,
    streak: 0,
    total: 0,
    correct: 0,
    bestCpm: 0,
    weakMap: {},
    autoNextTimer: null
  },

  teach: {
    subtab: 'genga', // 'genga' | 'kana' | 'signals' | 'lessons'
    selectedGenga: '1',
    selectedKana: 'ア',
    kanaStepIndex: 0,
    kanaPlaying: false,
    selectedSignal: 'kishin',
    lessonLooping: false,
    lessonCharsActive: []
  },

  free: {
    text: 'ソナエヨ ツネニ',
    includeHandshake: true,
    loop: false,
    timeline: null,
    activeCharIndex: -1
  }
};

// -------------------------
// DOM Elements
// -------------------------
const el = {
  canvasContainer: document.getElementById('canvas-container'),
  panelContent: document.getElementById('panel-content'),
  hudDot: document.getElementById('hud-dot'),
  hudPoseLabel: document.getElementById('hud-pose-label'),
  hudSubLabel: document.getElementById('hud-sub-label'),
  viewNote: document.getElementById('view-note'),

  speedSlider: document.getElementById('speed-slider'),
  speedValLabel: document.getElementById('speed-val-label'),
  speedRankLabel: document.getElementById('speed-rank-label'),
  speedSecLabel: document.getElementById('speed-sec-label'),
  btnPlayPause: document.getElementById('btn-play-pause'),
  btnReplay: document.getElementById('btn-replay'),
  btnSlowmo: document.getElementById('btn-slowmo'),

  toggleTrail: document.getElementById('toggle-trail'),
  toggleGuide: document.getElementById('toggle-guide'),
  toggleHat: document.getElementById('toggle-hat'),
  toggleSound: document.getElementById('toggle-sound'),

  modeTabs: document.querySelectorAll('.mode-tab'),
  camBtns: document.querySelectorAll('[data-cam]'),
  presetBtns: document.querySelectorAll('.preset-btn[data-cpm]')
};

// -------------------------
// Three.js Stage Setup
// -------------------------
let renderer = null;
let scene = null;
let camera = null;
let controls = null;
let scout = null;
let animator = null;

let camTransition = null; // { fromPos, toPos, fromTarget, toTarget, t }

function initThreeStage() {
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  } catch (err) {
    el.canvasContainer.innerHTML = `
      <div style="display:grid;place-items:center;height:100%;background:#1e3a5f;color:#fff;padding:24px;text-align:center;">
        <div>
          <h2 style="margin-bottom:8px;">3D描画（WebGL）を初期化できませんでした</h2>
          <p style="font-size:13px;opacity:0.85;">ブラウザのハードウェアアクセラレーションを有効にして再読み込みしてください。</p>
        </div>
      </div>`;
    return false;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  el.canvasContainer.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, 1, 0.1, 120);
  camera.position.copy(CAM_PRESETS.receiver.pos);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(CAM_PRESETS.receiver.target);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 2.4;
  controls.maxDistance = 10.5;
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.minPolarAngle = 0.2;
  controls.addEventListener('start', () => {
    camTransition = null;
  });

  buildCampsiteEnvironment(scene);
  scout = new ScoutRig(scene);
  scout.setHatMode(state.hatMode);
  scout.setGuideVisible(state.showGuide);
  scout.setTrailVisible(state.showTrail);

  animator = new SemaphoreAnimator(scout);
  animator.setCpm(state.cpm);

  animator.onStepChange = (step) => {
    updateHudForStep(step);
    if (state.mode === 'quiz' && state.quiz.timeline) {
      if (step.charIndex !== state.quiz.activeCharIndex) {
        state.quiz.activeCharIndex = step.charIndex;
        updateQuizCharSlots();
      }
    } else if (state.mode === 'free' && state.free.timeline) {
      if (step.charIndex !== state.free.activeCharIndex) {
        state.free.activeCharIndex = step.charIndex;
        updateFreeCharSlots();
      }
    } else if (state.mode === 'teach' && state.teach.subtab === 'kana' && state.teach.kanaPlaying) {
      if (typeof step.teachStepIdx === 'number') {
        state.teach.kanaStepIndex = step.teachStepIdx;
        updateTeachKanaStepperHighlight();
      }
    }
    syncPlayPauseBtn();
  };

  animator.onComplete = () => {
    if (state.mode === 'quiz' && state.quiz.timeline) {
      state.quiz.activeCharIndex = state.quiz.timeline.tokens.length;
      updateQuizCharSlots();
      updateHudIdle('送信完了 — 回答してください！', `全 ${state.quiz.timeline.tokens.length} 文字送信済み（もう一度再生も可能）`);
    } else if (state.mode === 'free') {
      state.free.activeCharIndex = state.free.timeline ? state.free.timeline.tokens.length : 0;
      updateFreeCharSlots();
      updateHudIdle('自由送信 完了', '「送信スタート」または「もう一度」で再送できます');
    } else if (state.mode === 'teach') {
      state.teach.kanaPlaying = false;
      updateHudIdle('実演完了（原姿）', 'コマをクリックするとそのポーズで停止して観察できます');
    }
    syncPlayPauseBtn();
  };

  handleResize();
  window.addEventListener('resize', handleResize);
  return true;
}

function handleResize() {
  if (!renderer || !camera) return;
  const w = Math.max(320, el.canvasContainer.clientWidth || window.innerWidth);
  const h = Math.max(320, el.canvasContainer.clientHeight || window.innerHeight);
  renderer.setSize(w, h);

  const aspect = w / h;
  if (w > 960) {
    camera.fov = 40;
    const panelRightSpace = 424;
    const offsetX = Math.round(panelRightSpace * 0.48);
    const offsetY = 36;
    camera.setViewOffset(w, h, offsetX, offsetY, w, h);
  } else {
    // Expand vertical FOV on narrow portrait viewports so wide horizontal flags stay inside frame
    camera.fov = aspect < 0.85
      ? Math.min(72, Math.max(42, THREE.MathUtils.radToDeg(2 * Math.atan(1.48 / (5.45 * aspect)))))
      : 44;

    const panelTotalBottom = Math.round(h * 0.40) + 122;
    const openTop = 90;
    const desiredCenterY = (openTop + Math.max(openTop + 100, h - panelTotalBottom)) * 0.5;
    const offsetY = Math.round(h * 0.5 - desiredCenterY);
    camera.setViewOffset(w, h, 0, Math.min(offsetY, 215), w, h);
  }
}

function setCameraPreset(presetKey, instant = false) {
  const preset = CAM_PRESETS[presetKey];
  if (!preset || !camera || !controls) return;
  state.camPreset = presetKey;
  el.viewNote.textContent = preset.note;
  el.camBtns.forEach(b => b.classList.toggle('active', b.dataset.cam === presetKey));

  if (instant) {
    camera.position.copy(preset.pos);
    controls.target.copy(preset.target);
    controls.update();
    camTransition = null;
  } else {
    camTransition = {
      fromPos: camera.position.clone(),
      toPos: preset.pos.clone(),
      fromTarget: controls.target.clone(),
      toTarget: preset.target.clone(),
      t: 0
    };
  }
}

// -------------------------
// HUD & Speed Bar Helpers
// -------------------------
function getSpeedRank(cpm) {
  if (cpm < 22) return { text: '亀ゆっくり（入門）', cls: '' };
  if (cpm < 42) return { text: '初級（2級目安）', cls: '' };
  if (cpm < 75) return { text: '標準（1級目安）', cls: '' };
  if (cpm < 120) return { text: '高速（特訓）', cls: 'fast' };
  if (cpm < 200) return { text: '爆速！（上級）', cls: 'extreme' };
  if (cpm < 310) return { text: '鬼速！！（限界挑戦）', cls: 'extreme' };
  return { text: '⚡神速（超人レベル）', cls: 'extreme' };
}

function syncSpeedUI() {
  const cpm = state.cpm;
  const eff = cpm * (state.slowMo ? 0.5 : 1.0);
  const rank = getSpeedRank(cpm);

  el.speedSlider.value = String(cpm);
  el.speedValLabel.textContent = `${cpm} 字/分${state.slowMo ? ' (0.5x中)' : ''}`;
  el.speedRankLabel.textContent = rank.text;
  el.speedRankLabel.className = `speed-rank ${rank.cls}`;
  el.speedSecLabel.textContent = `約${(60 / eff).toFixed(2)}秒/字`;

  el.presetBtns.forEach(btn => {
    btn.classList.toggle('active', Number(btn.dataset.cpm) === cpm);
  });

  el.btnSlowmo.classList.toggle('active', state.slowMo);
  el.hudDot.classList.toggle('turbo', cpm >= 150 && animator?.isPlaying);
}

function syncPlayPauseBtn() {
  if (!animator) return;
  if (animator.isPlaying) {
    el.btnPlayPause.textContent = '⏸ 一時停止';
    el.hudDot.classList.add('live');
    el.hudDot.classList.toggle('turbo', state.cpm >= 150);
  } else {
    el.btnPlayPause.textContent = '▶ 再生';
    el.hudDot.classList.remove('live', 'turbo');
  }
}

function updateHudForStep(step) {
  if (!step) return;
  if (state.mode === 'quiz') {
    const isAnswered = state.quiz.status === 'answered';
    if (step.kind === 'signal') {
      el.hudPoseLabel.textContent = step.label;
      el.hudSubLabel.textContent = `速度 ${state.cpm} 字/分 で送信中…`;
    } else if (step.charIndex < 0) {
      el.hudPoseLabel.textContent = '構え（原姿）';
      el.hudSubLabel.textContent = 'まもなく信号が始まります…';
    } else {
      const totalChars = state.quiz.timeline ? state.quiz.timeline.tokens.length : 1;
      if (isAnswered) {
        el.hudPoseLabel.textContent = step.label;
      } else {
        const gLabel = step.gengaId === 'rest' ? '原姿（区切り）' : `${step.charIndex + 1}文字目 を送信中…`;
        el.hudPoseLabel.textContent = gLabel;
      }
      el.hudSubLabel.textContent = `文字 ${Math.min(step.charIndex + 1, totalChars)} / ${totalChars} ・ ${state.cpm} 字/分`;
    }
  } else {
    el.hudPoseLabel.textContent = step.label || '送信中';
    if (step.kind === 'genga' && GENGA[step.gengaId]) {
      const g = GENGA[step.gengaId];
      el.hudSubLabel.textContent = `赤(右): ${g.rightDesc} / 白(左): ${g.leftDesc}`;
    } else {
      el.hudSubLabel.textContent = step.charLabel ? `符号: ${step.charLabel}` : '動作中';
    }
  }
}

function updateHudIdle(title, sub) {
  el.hudPoseLabel.textContent = title;
  el.hudSubLabel.textContent = sub;
}

// -------------------------
// Quiz Logic & Rendering
// -------------------------
function clearAutoNextTimer() {
  if (state.quiz.autoNextTimer) {
    clearTimeout(state.quiz.autoNextTimer);
    state.quiz.autoNextTimer = null;
  }
}

function startNewQuizProblem() {
  clearAutoNextTimer();
  const q = state.quiz;
  const weakChars = Object.entries(q.weakMap)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([ch]) => ch);

  const rawTarget = generateRandomProblem(q.category, {
    weakChars,
    lastAnswer: q.problemText
  });
  const timeline = compileTextToTimeline(rawTarget, {
    includeHandshake: q.includeHandshake
  });

  q.problemText = timeline.normalized || rawTarget;
  q.timeline = timeline;
  q.choices = generateDistractorChoices(q.problemText, q.category, 4);
  q.status = 'playing';
  q.lastUserAnswer = '';
  q.isCorrect = null;
  q.hintVisible = false;
  q.activeCharIndex = -1;

  animator.setSpeedMultiplier(state.slowMo ? 0.5 : 1.0);
  animator.loadTimeline(timeline.steps, {
    autoplay: true,
    loop: false,
    speedMultiplier: state.slowMo ? 0.5 : 1.0
  });

  renderPanel();
  syncPlayPauseBtn();
  syncSpeedUI();

  if (q.inputMode === 'text' && window.innerWidth > 960) {
    requestAnimationFrame(() => {
      const inp = document.getElementById('quiz-answer-input');
      if (inp) inp.focus();
    });
  }
}

function submitQuizAnswer(rawInput) {
  const q = state.quiz;
  if (q.status === 'answered') return;

  const trimmed = (rawInput || '').trim();
  if (!trimmed) return;

  const normUser = normalizeForSemaphore(trimmed);
  const normExpected = normalizeForSemaphore(q.problemText);
  const compactUser = normUser.replace(/\s+/g, '');
  const compactExpected = normExpected.replace(/\s+/g, '');
  const isOk = compactUser === compactExpected && compactExpected.length > 0;

  q.status = 'answered';
  q.lastUserAnswer = trimmed;
  q.isCorrect = isOk;
  q.total += 1;

  if (isOk) {
    q.correct += 1;
    q.streak += 1;
    if (state.cpm > q.bestCpm) q.bestCpm = state.cpm;
    sound.playCorrect();
  } else {
    q.streak = 0;
    sound.playWrong();
    // Record per-character misses for Weak Focus practice
    const expTokens = q.timeline.tokens.filter(t => !t.isSpace);
    const usrChars = [...compactUser];
    expTokens.forEach((tok, idx) => {
      if (usrChars[idx] !== tok.char) {
        q.weakMap[tok.char] = (q.weakMap[tok.char] || 0) + 1;
      }
    });
  }

  renderPanel();

  if (q.status === 'answered' && q.inputMode === 'text') {
    requestAnimationFrame(() => {
      document.getElementById('btn-result-next')?.focus();
    });
  }

  if (q.autoNext && (isOk || !q.pauseOnWrong)) {
    q.autoNextTimer = setTimeout(() => {
      if (state.mode === 'quiz' && state.quiz.status === 'answered') {
        startNewQuizProblem();
      }
    }, isOk ? 1500 : 2600);
  }
}

function playSingleTokenSlowly(tokenChar) {
  clearAutoNextTimer();
  const singleTimeline = compileTextToTimeline(tokenChar, { includeHandshake: false });
  animator.loadTimeline(singleTimeline.steps, {
    autoplay: true,
    loop: false,
    speedMultiplier: 0.55
  });
  syncPlayPauseBtn();
  const info = KANA_MAP[tokenChar];
  if (info) {
    updateHudIdle(
      `「${tokenChar}」を確認中 (${info.strokes.map(s => GENGA[s].short).join(' → ')})`,
      info.hint
    );
  } else {
    updateHudIdle(`「${tokenChar}」を確認中`, 'ゆっくり動作を再生しています');
  }
}

function updateQuizCharSlots() {
  const container = document.getElementById('quiz-progress-dots');
  if (!container || !state.quiz.timeline) return;
  const slots = container.querySelectorAll('.char-slot');
  const active = state.quiz.activeCharIndex;
  slots.forEach((slot, idx) => {
    slot.classList.toggle('active', idx === active);
    slot.classList.toggle('done', idx < active);
  });
}

function renderQuizPanel() {
  const q = state.quiz;
  const accuracy = q.total > 0 ? Math.round((q.correct / q.total) * 100) : 0;
  const weakList = Object.entries(q.weakMap).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]);

  const catChipsHtml = QUIZ_CATEGORIES.map(c => {
    const disabledWeak = c.id === 'weak_focus' && weakList.length === 0;
    const label = c.id === 'weak_focus' && weakList.length > 0 ? `苦手克服(${weakList.length})` : c.label;
    return `<button class="cat-chip ${q.category === c.id ? 'active' : ''}" data-quiz-cat="${c.id}" ${disabledWeak ? 'title="間違えた文字が記録されると練習できます"' : ''}>${label}</button>`;
  }).join('');

  const tokens = q.timeline ? q.timeline.tokens : [];
  const slotsHtml = tokens.map((tok, idx) => {
    const isAnswered = q.status === 'answered';
    const cls = idx === q.activeCharIndex ? 'active' : (idx < q.activeCharIndex ? 'done' : '');
    const txt = tok.isSpace ? '␣' : (isAnswered ? tok.display : `${idx + 1}`);
    return `<div class="char-slot ${cls}">${txt}</div>`;
  }).join('');

  // Input UI: Text or 4-Choice
  let inputHtml = '';
  if (q.inputMode === 'text') {
    inputHtml = `
      <form id="quiz-form" class="answer-input-row">
        <input
          type="text"
          id="quiz-answer-input"
          class="answer-input"
          placeholder="読めた文字を入力（ひらがな・カタカナ・数字）"
          value="${q.status === 'answered' ? escapeHtml(q.lastUserAnswer) : ''}"
          ${q.status === 'answered' ? 'readonly' : ''}
          autocomplete="off"
        />
        ${q.status === 'answered'
          ? '<button type="submit" class="btn-primary" id="btn-next-problem">次の問題 →</button>'
          : '<button type="submit" class="btn-primary">回答</button>'
        }
      </form>
    `;
  } else {
    const normExp = normalizeForSemaphore(q.problemText);
    inputHtml = `
      <div class="choice-grid">
        ${q.choices.map(ch => {
          let cls = '';
          if (q.status === 'answered') {
            if (normalizeForSemaphore(ch) === normExp) cls = 'correct';
            else if (ch === q.lastUserAnswer) cls = 'wrong';
          }
          return `<button class="choice-btn ${cls}" data-choice="${escapeHtml(ch)}" ${q.status === 'answered' ? 'disabled' : ''}>${escapeHtml(ch)}</button>`;
        }).join('')}
      </div>
    `;
  }

  // Hint Box
  let hintHtml = '';
  if (q.hintVisible && q.timeline) {
    const lines = q.timeline.tokens.filter(t => !t.isSpace).map((t, i) => {
      const strokeTxt = t.strokes ? t.strokes.map(s => GENGA[s]?.short || s).join('→') : t.display;
      return `${i + 1}文字目：${strokeTxt}`;
    });
    hintHtml = `<div class="hint-box">💡 原画ヒント：${lines.join(' ／ ')}</div>`;
  }

  // Result Feedback Box
  let resultHtml = '';
  if (q.status === 'answered') {
    const expTokens = q.timeline.tokens.filter(t => !t.isSpace);
    const usrChars = [...normalizeForSemaphore(q.lastUserAnswer).replace(/\s+/g, '')];
    const reviewButtons = expTokens.map((tok, idx) => {
      const missed = usrChars[idx] !== tok.char;
      return `<button class="review-char-btn ${missed ? 'miss' : ''}" data-review-char="${escapeHtml(tok.char)}" title="クリックで「${escapeHtml(tok.char)}」だけをスロー再生">
        🚩 ${escapeHtml(tok.char)} ${missed ? '(要確認)' : ''}
      </button>`;
    }).join('');

    resultHtml = `
      <div class="result-box ${q.isCorrect ? 'ok' : 'ng'}">
        <div class="result-title">${q.isCorrect ? '⭕ 正解！お見事！' : `❌ 正解は「${escapeHtml(q.problemText)}」`}</div>
        <div class="result-detail">
          ${q.isCorrect
            ? `回答「${escapeHtml(q.lastUserAnswer)}」・現在 ${q.streak} 問連続正解中（速度 ${state.cpm} 字/分）`
            : `あなたの回答：「${escapeHtml(q.lastUserAnswer)}」<br/>下の文字ボタンを押すと1文字だけスロー確認できます：`
          }
        </div>
        <div class="review-chars">${reviewButtons}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button class="btn-primary" id="btn-result-next">次の問題を出題 →</button>
          <button class="btn-secondary" id="btn-result-slow">全体を0.5x再生</button>
        </div>
      </div>
    `;
  }

  const weakBadgesHtml = weakList.length > 0 ? `
    <div class="section-card">
      <div class="section-title">
        <span>📌 よく間違える文字（クリックで復習）</span>
        <button class="btn-secondary" id="btn-clear-weak" style="padding:3px 7px;font-size:10.5px;">リセット</button>
      </div>
      <div class="chip-grid">
        ${weakList.slice(0, 12).map(([ch, cnt]) => `<button class="weak-badge" data-review-char="${escapeHtml(ch)}">${escapeHtml(ch)} ×${cnt}</button>`).join('')}
      </div>
    </div>
  ` : '';

  el.panelContent.innerHTML = `
    <div class="stats-strip">
      <div class="stat-box"><div class="stat-num">${q.streak}</div><div class="stat-lbl">連続正解</div></div>
      <div class="stat-box"><div class="stat-num">${accuracy}%</div><div class="stat-lbl">正答率</div></div>
      <div class="stat-box"><div class="stat-num">${q.correct}/${q.total}</div><div class="stat-lbl">累計正解</div></div>
      <div class="stat-box"><div class="stat-num">${q.bestCpm || '-'}</div><div class="stat-lbl">最高字/分</div></div>
    </div>

    <div class="section-card">
      <div class="section-title">
        <span>🎲 出題カテゴリー（自動でランダム出題）</span>
      </div>
      <div class="chip-grid">${catChipsHtml}</div>
      <div class="toggle-row">
        <div style="display:flex;gap:4px;">
          <button class="pill-btn ${q.inputMode === 'text' ? 'active' : ''}" data-input-mode="text">⌨ 文字入力</button>
          <button class="pill-btn ${q.inputMode === 'choice' ? 'active' : ''}" data-input-mode="choice">🔘 4択クイズ</button>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <label class="check-label"><input type="checkbox" id="chk-auto-next" ${q.autoNext ? 'checked' : ''} /> 正解後自動で次</label>
          <label class="check-label"><input type="checkbox" id="chk-handshake" ${q.includeHandshake ? 'checked' : ''} /> 起信/終信</label>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="quiz-banner">
        <span>🚩 スカウトの旗を読み取ろう</span>
        <span style="font-size:11px;opacity:0.85;">全 ${tokens.filter(t => !t.isSpace).length} 文字</span>
      </div>
      <div class="progress-dots" id="quiz-progress-dots">${slotsHtml}</div>
      ${inputHtml}
      <div class="quiz-actions-row">
        <button class="btn-secondary" id="btn-quiz-replay">↺ もう1回見る</button>
        <button class="btn-secondary" id="btn-quiz-slow">🐢 0.5xで再生</button>
        <button class="btn-secondary" id="btn-quiz-hint">💡 ${q.hintVisible ? 'ヒントを隠す' : '原画ヒント'}</button>
        <button class="btn-secondary" id="btn-quiz-skip">⏭ 別の問題</button>
      </div>
      ${hintHtml}
      ${resultHtml}
    </div>

    ${weakBadgesHtml}
  `;

  bindQuizEvents();
}

function bindQuizEvents() {
  document.querySelectorAll('[data-quiz-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.quiz.category = btn.dataset.quizCat;
      startNewQuizProblem();
    });
  });

  document.querySelectorAll('[data-input-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.quiz.inputMode = btn.dataset.inputMode;
      renderPanel();
    });
  });

  const chkAutoNext = document.getElementById('chk-auto-next');
  if (chkAutoNext) {
    chkAutoNext.addEventListener('change', () => {
      state.quiz.autoNext = chkAutoNext.checked;
    });
  }

  const chkHandshake = document.getElementById('chk-handshake');
  if (chkHandshake) {
    chkHandshake.addEventListener('change', () => {
      state.quiz.includeHandshake = chkHandshake.checked;
      startNewQuizProblem();
    });
  }

  const form = document.getElementById('quiz-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (state.quiz.status === 'answered') {
        startNewQuizProblem();
      } else {
        const inp = document.getElementById('quiz-answer-input');
        submitQuizAnswer(inp ? inp.value : '');
      }
    });
  }

  document.querySelectorAll('[data-choice]').forEach(btn => {
    btn.addEventListener('click', () => {
      submitQuizAnswer(btn.dataset.choice);
    });
  });

  document.getElementById('btn-result-next')?.addEventListener('click', startNewQuizProblem);

  document.getElementById('btn-quiz-replay')?.addEventListener('click', () => {
    clearAutoNextTimer();
    animator.setSpeedMultiplier(state.slowMo ? 0.5 : 1.0);
    animator.restart();
    syncPlayPauseBtn();
  });

  document.getElementById('btn-quiz-slow')?.addEventListener('click', () => {
    clearAutoNextTimer();
    animator.loadTimeline(state.quiz.timeline.steps, {
      autoplay: true,
      loop: false,
      speedMultiplier: 0.5
    });
    syncPlayPauseBtn();
  });

  document.getElementById('btn-result-slow')?.addEventListener('click', () => {
    clearAutoNextTimer();
    animator.loadTimeline(state.quiz.timeline.steps, {
      autoplay: true,
      loop: false,
      speedMultiplier: 0.5
    });
    syncPlayPauseBtn();
  });

  document.getElementById('btn-quiz-hint')?.addEventListener('click', () => {
    state.quiz.hintVisible = !state.quiz.hintVisible;
    renderPanel();
  });

  document.getElementById('btn-quiz-skip')?.addEventListener('click', startNewQuizProblem);

  document.querySelectorAll('[data-review-char]').forEach(btn => {
    btn.addEventListener('click', () => {
      playSingleTokenSlowly(btn.dataset.reviewChar);
    });
  });

  document.getElementById('btn-clear-weak')?.addEventListener('click', () => {
    state.quiz.weakMap = {};
    renderPanel();
  });
}

// -------------------------
// Teaching Mode Logic & Rendering
// -------------------------
function getKanaTeachSteps(ch) {
  if (DAKUTEN_DECOMPOSE[ch]) {
    const [base, mark] = DAKUTEN_DECOMPOSE[ch];
    return [
      'rest',
      ...KANA_MAP[base].strokes,
      'rest',
      ...KANA_MAP[mark].strokes,
      'rest'
    ];
  }
  const info = KANA_MAP[ch];
  if (!info) return ['rest'];
  return ['rest', ...info.strokes, 'rest'];
}

function inspectTeachGenga(gengaId) {
  state.teach.subtab = 'genga';
  state.teach.selectedGenga = gengaId;
  state.teach.kanaPlaying = false;
  animator.inspectGenga(gengaId);
  const g = GENGA[gengaId];
  updateHudIdle(`${g.name}（${g.motif}）`, `赤(右): ${g.rightDesc} / 白(左): ${g.leftDesc}`);
  syncPlayPauseBtn();
  renderPanel();
}

function inspectTeachKanaStep(ch, stepIdx = 0) {
  state.teach.subtab = 'kana';
  state.teach.selectedKana = ch;
  const steps = getKanaTeachSteps(ch);
  const idx = Math.max(0, Math.min(steps.length - 1, stepIdx));
  state.teach.kanaStepIndex = idx;
  state.teach.kanaPlaying = false;

  const gId = steps[idx];
  const g = GENGA[gId];
  animator.inspectGenga(gId);
  updateHudIdle(`「${ch}」${idx + 1}/${steps.length}：${g.name}`, g.tip);
  syncPlayPauseBtn();
  renderPanel();
}

function playTeachKanaSequence(ch, slow = false) {
  state.teach.subtab = 'kana';
  state.teach.selectedKana = ch;
  state.teach.kanaPlaying = true;
  const stepIds = getKanaTeachSteps(ch);

  const steps = stepIds.map((gId, idx) => ({
    kind: 'genga',
    gengaId: gId,
    label: `「${ch}」 ${idx + 1}/${stepIds.length}：${GENGA[gId].short}`,
    charIndex: 0,
    charLabel: ch,
    teachStepIdx: idx,
    durationFactor: gId === 'rest' ? 0.75 : (gId === '11' ? 1.55 : 1.15)
  }));

  animator.loadTimeline(steps, {
    autoplay: true,
    loop: false,
    speedMultiplier: slow ? 0.55 : (state.slowMo ? 0.5 : 1.0)
  });
  syncPlayPauseBtn();
  renderPanel();
}

function updateTeachKanaStepperHighlight() {
  const stepper = document.getElementById('teach-kana-stepper');
  if (!stepper) return;
  stepper.querySelectorAll('.step-card-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', idx === state.teach.kanaStepIndex);
  });
}

function inspectTeachSignal(sigId) {
  state.teach.subtab = 'signals';
  state.teach.selectedSignal = sigId;
  state.teach.kanaPlaying = false;
  animator.inspectSignal(sigId);
  const s = SIGNALS[sigId];
  updateHudIdle(`${s.name}`, s.meaning);
  syncPlayPauseBtn();
  renderPanel();
}

function findCharsUsingGenga(gengaId) {
  if (gengaId === 'rest') return [];
  return Object.entries(KANA_MAP)
    .filter(([, v]) => v.strokes.includes(gengaId))
    .map(([ch]) => ch);
}

function renderTeachPanel() {
  const t = state.teach;
  const subtabBar = `
    <div class="subtabs">
      <button class="subtab ${t.subtab === 'genga' ? 'active' : ''}" data-teach-sub="genga">基本原画</button>
      <button class="subtab ${t.subtab === 'kana' ? 'active' : ''}" data-teach-sub="kana">50音分解</button>
      <button class="subtab ${t.subtab === 'signals' ? 'active' : ''}" data-teach-sub="signals">交信符号</button>
      <button class="subtab ${t.subtab === 'lessons' ? 'active' : ''}" data-teach-sub="lessons">特訓コース</button>
    </div>
  `;

  let bodyHtml = '';

  if (t.subtab === 'genga') {
    const g = GENGA[t.selectedGenga] || GENGA['1'];
    const usedChars = findCharsUsingGenga(g.id);
    const gridHtml = GENGA_ORDER.map(id => {
      const item = GENGA[id];
      return `
        <button class="genga-card-btn ${t.selectedGenga === id ? 'active' : ''}" data-genga-id="${id}">
          ${renderGengaMiniSvg(id, 42)}
          <div class="genga-name">${item.short}${item.number !== null ? ` (${item.number})` : ''}</div>
          <div class="genga-motif">${item.motif}</div>
        </button>
      `;
    }).join('');

    bodyHtml = `
      <div class="teach-detail">
        <div class="section-title">
          <span>🚩 ${g.name}（形：${g.motif}）</span>
          ${g.number !== null ? `<span class="speed-rank">数字「${g.number}」</span>` : ''}
        </div>
        <div class="flag-instruction-row">
          <div class="flag-box red">🔴 右手（赤旗）<br/>${g.rightDesc}</div>
          <div class="flag-box white">⚪ 左手（白旗）<br/>${g.leftDesc}</div>
        </div>
        <div class="tip-callout">${g.tip}</div>
        ${usedChars.length > 0 ? `
          <div style="margin-top:9px;">
            <div style="font-size:11px;font-weight:800;color:#64748b;margin-bottom:5px;">この原画を使う文字（クリックで書き順を見る）：</div>
            <div class="chip-grid">
              ${usedChars.map(ch => `<button class="lesson-char-pill" data-jump-kana="${ch}">${ch}</button>`).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <div class="section-card">
        <div class="section-title"><span>15原画 ＋ 原姿・逆2 一覧（クリックで3D表示）</span></div>
        <div class="genga-grid">${gridHtml}</div>
      </div>
    `;
  } else if (t.subtab === 'kana') {
    const ch = t.selectedKana;
    const info = KANA_MAP[ch] || KANA_MAP['ア'];
    const steps = getKanaTeachSteps(ch);

    const stepperHtml = steps.map((gId, idx) => {
      const arrow = idx < steps.length - 1 ? '<span class="step-arrow">→</span>' : '';
      return `
        <button class="step-card-btn ${idx === t.kanaStepIndex ? 'active' : ''}" data-kana-step="${idx}">
          ${renderGengaMiniSvg(gId, 34)}
          <span>${GENGA[gId].short}</span>
        </button>
        ${arrow}
      `;
    }).join('');

    const tableHtml = GOJUON_ROWS.map(row => `
      <div class="gojuon-row">
        <div class="gojuon-row-lbl">${row.label}</div>
        ${row.chars.map(c => c
          ? `<button class="kana-cell ${c === ch ? 'active' : ''}" data-teach-kana="${c}">${c}</button>`
          : '<div class="kana-empty"></div>'
        ).join('')}
      </div>
    `).join('');

    bodyHtml = `
      <div class="teach-detail">
        <div class="section-title">
          <span>✍ 「${ch}」の打ち方分解</span>
          <button class="pill-btn ${state.camPreset === 'sender' ? 'active' : ''}" id="btn-teach-flip-cam">
            ${state.camPreset === 'sender' ? '👁 受信視点に戻す' : '👤 送信者視点(背中)で見る'}
          </button>
        </div>

        <div class="stroke-stepper" id="teach-kana-stepper">${stepperHtml}</div>

        <div class="quiz-actions-row" style="margin-bottom:8px;">
          <button class="btn-secondary" id="btn-step-prev">◀ 前コマ</button>
          <button class="btn-secondary" id="btn-step-next">次コマ ▶</button>
          <button class="btn-primary" id="btn-kana-play" style="padding:6px 11px;font-size:12px;">▶ 通し再生</button>
          <button class="btn-secondary" id="btn-kana-slow">🐢 スロー</button>
        </div>

        <div class="tip-callout">💡 ${info.hint}</div>
      </div>

      <div class="section-card">
        <div class="section-title"><span>カタカナ50音表（タップで解説＆実演）</span></div>
        <div class="gojuon-table">${tableHtml}</div>
      </div>
    `;
  } else if (t.subtab === 'signals') {
    const cardsHtml = Object.values(SIGNALS).map(sig => `
      <div class="signal-card ${t.selectedSignal === sig.id ? 'active' : ''}" data-signal-id="${sig.id}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
          <strong style="font-size:13px;color:var(--forest-900);">${sig.name}</strong>
          <span style="font-size:10.5px;font-weight:800;color:var(--amber-600);">クリックで実演 ▶</span>
        </div>
        <div style="font-size:11.5px;font-weight:800;color:var(--forest-800);margin-bottom:3px;">意味：${sig.meaning}</div>
        <div style="font-size:11px;color:var(--ink-700);line-height:1.45;">${sig.desc}</div>
      </div>
    `).join('');

    bodyHtml = `
      <div style="display:flex;flex-direction:column;gap:8px;">${cardsHtml}</div>
      <div class="section-card">
        <div class="section-title"><span>🔢 数字・濁音・句読点のルール</span></div>
        <div style="font-size:11.5px;color:var(--ink-700);line-height:1.6;">
          <p><strong>1. 数字の打ち方：</strong> 第13原画（白斜め上）を<strong>通常の約3倍長く</strong>掲げて「今から数字」と合図 → 0〜9を送信 → もう一度 第13原画×3倍で「数字終わり」。</p>
          <p style="margin-top:6px;"><strong>2. 濁点（゛）・半濁点（゜）：</strong> 清音（カ等）を打って<strong>原姿に戻したあと</strong>、第13原画(゛) または 第14原画(゜)を打ちます。</p>
          <p style="margin-top:6px;"><strong>3. 句点（、／。）：</strong> 第14原画（赤斜め上）を<strong>通常の約3倍長く</strong>掲げます。</p>
          <p style="margin-top:6px;"><strong>4. 小書き文字（ャ・ュ・ョ・ッ）：</strong> すべて大きい文字（ヤ・ユ・ヨ・ツ）と同じ形で送信します。</p>
        </div>
      </div>
    `;
  } else {
    // Lessons curriculum
    const lessonsHtml = TEACHING_LESSONS.map(lesson => `
      <div class="lesson-card">
        <div class="lesson-head">${lesson.title}</div>
        <div class="lesson-desc">${lesson.desc}</div>
        <div class="lesson-chars">
          ${lesson.chars.map(c => `<button class="lesson-char-pill" data-jump-kana="${c}">${c}</button>`).join('')}
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button class="btn-primary" style="padding:6px 10px;font-size:11.5px;" data-play-lesson="${lesson.id}">▶ このグループを連続実演</button>
          ${lesson.id === 'lv1' ? '<button class="btn-secondary" data-quiz-lv1="1">🎯 1画8文字でテスト</button>' : ''}
        </div>
      </div>
    `).join('');

    bodyHtml = `<div style="display:flex;flex-direction:column;gap:9px;">${lessonsHtml}</div>`;
  }

  el.panelContent.innerHTML = `${subtabBar}${bodyHtml}`;
  bindTeachEvents();
}

function bindTeachEvents() {
  document.querySelectorAll('[data-teach-sub]').forEach(btn => {
    btn.addEventListener('click', () => {
      el.panelContent.scrollTop = 0;
      const next = btn.dataset.teachSub;
      state.teach.subtab = next;
      if (next === 'genga') {
        inspectTeachGenga(state.teach.selectedGenga);
      } else if (next === 'kana') {
        inspectTeachKanaStep(state.teach.selectedKana, 0);
      } else if (next === 'signals') {
        inspectTeachSignal(state.teach.selectedSignal);
      } else {
        animator.inspectGenga('rest');
        updateHudIdle('特訓コースを選択', 'グループ連続実演や個別文字の確認ができます');
        renderPanel();
      }
    });
  });

  document.querySelectorAll('[data-genga-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      inspectTeachGenga(btn.dataset.gengaId);
    });
  });

  document.querySelectorAll('[data-jump-kana]').forEach(btn => {
    btn.addEventListener('click', () => {
      el.panelContent.scrollTop = 0;
      playTeachKanaSequence(btn.dataset.jumpKana, true);
    });
  });

  document.querySelectorAll('[data-teach-kana]').forEach(btn => {
    btn.addEventListener('click', () => {
      playTeachKanaSequence(btn.dataset.teachKana, false);
    });
  });

  document.querySelectorAll('[data-kana-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      inspectTeachKanaStep(state.teach.selectedKana, Number(btn.dataset.kanaStep));
    });
  });

  document.getElementById('btn-step-prev')?.addEventListener('click', () => {
    inspectTeachKanaStep(state.teach.selectedKana, state.teach.kanaStepIndex - 1);
  });

  document.getElementById('btn-step-next')?.addEventListener('click', () => {
    inspectTeachKanaStep(state.teach.selectedKana, state.teach.kanaStepIndex + 1);
  });

  document.getElementById('btn-kana-play')?.addEventListener('click', () => {
    playTeachKanaSequence(state.teach.selectedKana, false);
  });

  document.getElementById('btn-kana-slow')?.addEventListener('click', () => {
    playTeachKanaSequence(state.teach.selectedKana, true);
  });

  document.getElementById('btn-teach-flip-cam')?.addEventListener('click', () => {
    setCameraPreset(state.camPreset === 'sender' ? 'receiver' : 'sender');
    renderPanel();
  });

  document.querySelectorAll('[data-signal-id]').forEach(card => {
    card.addEventListener('click', () => {
      inspectTeachSignal(card.dataset.signalId);
    });
  });

  document.querySelectorAll('[data-play-lesson]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lesson = TEACHING_LESSONS.find(l => l.id === btn.dataset.playLesson);
      if (!lesson) return;
      const timeline = compileTextToTimeline(lesson.chars.join(''), { includeHandshake: false });
      animator.loadTimeline(timeline.steps, {
        autoplay: true,
        loop: false,
        speedMultiplier: state.slowMo ? 0.5 : 1.0
      });
      updateHudIdle(`${lesson.title}`, `連続実演中：${lesson.chars.join('・')}`);
      syncPlayPauseBtn();
    });
  });

  document.querySelector('[data-quiz-lv1]')?.addEventListener('click', () => {
    state.quiz.category = 'kana_lv1';
    switchAppMode('quiz');
  });
}

// -------------------------
// Free Send Mode Logic & Rendering
// -------------------------
function startFreeSend() {
  const f = state.free;
  const compiled = compileTextToTimeline(f.text, { includeHandshake: f.includeHandshake });
  f.timeline = compiled;
  f.activeCharIndex = -1;

  if (compiled.steps.length === 0) return;

  animator.loadTimeline(compiled.steps, {
    autoplay: true,
    loop: f.loop,
    speedMultiplier: state.slowMo ? 0.5 : 1.0
  });
  syncPlayPauseBtn();
  renderPanel();
}

function updateFreeCharSlots() {
  const container = document.getElementById('free-progress-dots');
  if (!container || !state.free.timeline) return;
  const slots = container.querySelectorAll('.char-slot');
  const active = state.free.activeCharIndex;
  slots.forEach((slot, idx) => {
    slot.classList.toggle('active', idx === active);
    slot.classList.toggle('done', idx < active);
  });
}

function renderFreePanel() {
  const f = state.free;
  const normalizedPreview = normalizeForSemaphore(f.text);
  const tokens = f.timeline ? f.timeline.tokens : compileTextToTimeline(f.text).tokens;
  const slotsHtml = tokens.map((tok, idx) => {
    const cls = idx === f.activeCharIndex ? 'active' : (idx < f.activeCharIndex ? 'done' : '');
    return `<div class="char-slot ${cls}">${tok.display}</div>`;
  }).join('');

  const samples = SCOUT_SENTENCES.slice(0, 6);

  el.panelContent.innerHTML = `
    <div class="section-card">
      <div class="section-title"><span>🚩 好きな文章を3Dスカウトに送信させる</span></div>
      <textarea id="free-text-input" class="free-textarea" placeholder="例：ソナエヨ ツネニ / 10ジ シュウゴウ">${escapeHtml(f.text)}</textarea>
      <div style="font-size:11px;color:var(--ink-500);margin:5px 0 8px;">
        変換後の送信電文：<strong id="free-normalized-preview">${escapeHtml(normalizedPreview || '（入力してください）')}</strong>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
        <div style="display:flex;gap:10px;">
          <label class="check-label"><input type="checkbox" id="chk-free-handshake" ${f.includeHandshake ? 'checked' : ''} /> 起信・終信</label>
          <label class="check-label"><input type="checkbox" id="chk-free-loop" ${f.loop ? 'checked' : ''} /> ループ</label>
        </div>
        <button class="btn-primary" id="btn-free-send">🚩 送信スタート</button>
      </div>
    </div>

    <div class="section-card">
      <div class="section-title"><span>📡 送信タイムライン</span></div>
      <div class="progress-dots" id="free-progress-dots">${slotsHtml}</div>
    </div>

    <div class="section-card">
      <div class="section-title"><span>⛺ スカウト例文プリセット</span></div>
      <div class="chip-grid">
        ${samples.map(s => `<button class="cat-chip" data-free-sample="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join('')}
      </div>
    </div>
  `;

  bindFreeEvents();
}

function bindFreeEvents() {
  const txt = document.getElementById('free-text-input');
  txt?.addEventListener('input', () => {
    state.free.text = txt.value;
    state.free.timeline = compileTextToTimeline(state.free.text, { includeHandshake: state.free.includeHandshake });
    state.free.activeCharIndex = -1;
    const prevEl = document.getElementById('free-normalized-preview');
    if (prevEl) prevEl.textContent = state.free.timeline.normalized || '（入力してください）';
    const dotsEl = document.getElementById('free-progress-dots');
    if (dotsEl) {
      dotsEl.innerHTML = state.free.timeline.tokens.map(tok => `<div class="char-slot">${escapeHtml(tok.display)}</div>`).join('');
    }
  });

  document.getElementById('chk-free-handshake')?.addEventListener('change', (e) => {
    state.free.includeHandshake = e.target.checked;
  });

  document.getElementById('chk-free-loop')?.addEventListener('change', (e) => {
    state.free.loop = e.target.checked;
    if (animator) animator.loop = state.free.loop;
  });

  document.getElementById('btn-free-send')?.addEventListener('click', startFreeSend);

  document.querySelectorAll('[data-free-sample]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.free.text = btn.dataset.freeSample;
      startFreeSend();
    });
  });
}

// -------------------------
// Global Mode Switch & Control Wiring
// -------------------------
function renderPanel() {
  if (state.mode === 'quiz') renderQuizPanel();
  else if (state.mode === 'teach') renderTeachPanel();
  else renderFreePanel();
}

function switchAppMode(nextMode) {
  clearAutoNextTimer();
  state.mode = nextMode;
  el.modeTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.mode === nextMode));
  el.panelContent.scrollTop = 0;

  if (nextMode === 'quiz') {
    startNewQuizProblem();
  } else if (nextMode === 'teach') {
    if (state.teach.subtab === 'genga') inspectTeachGenga(state.teach.selectedGenga);
    else if (state.teach.subtab === 'kana') inspectTeachKanaStep(state.teach.selectedKana, state.teach.kanaStepIndex);
    else if (state.teach.subtab === 'signals') inspectTeachSignal(state.teach.selectedSignal);
    else {
      animator.inspectGenga('rest');
      renderPanel();
    }
  } else {
    startFreeSend();
  }
}

function wireGlobalControls() {
  el.modeTabs.forEach(tab => {
    tab.addEventListener('click', () => switchAppMode(tab.dataset.mode));
  });

  el.camBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setCameraPreset(btn.dataset.cam);
      if (state.mode === 'teach' && state.teach.subtab === 'kana') {
        renderPanel();
      }
    });
  });

  el.toggleTrail.addEventListener('click', () => {
    state.showTrail = !state.showTrail;
    scout.setTrailVisible(state.showTrail);
    el.toggleTrail.classList.toggle('active', state.showTrail);
    el.toggleTrail.textContent = `軌跡 ${state.showTrail ? 'ON' : 'OFF'}`;
  });

  el.toggleGuide.addEventListener('click', () => {
    state.showGuide = !state.showGuide;
    scout.setGuideVisible(state.showGuide);
    el.toggleGuide.classList.toggle('active', state.showGuide);
    el.toggleGuide.textContent = `角度ガイド ${state.showGuide ? 'ON' : 'OFF'}`;
  });

  el.toggleHat.addEventListener('click', () => {
    const idx = HAT_MODES.indexOf(state.hatMode);
    state.hatMode = HAT_MODES[(idx + 1) % HAT_MODES.length];
    scout.setHatMode(state.hatMode);
    el.toggleHat.textContent = HAT_LABELS[state.hatMode];
  });

  el.toggleSound.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    sound.setEnabled(state.soundEnabled);
    el.toggleSound.classList.toggle('active', state.soundEnabled);
    el.toggleSound.textContent = `音 ${state.soundEnabled ? 'ON' : 'OFF'}`;
  });

  // Speed Slider + Presets (works live even mid-animation!)
  el.speedSlider.addEventListener('input', () => {
    state.cpm = Number(el.speedSlider.value);
    animator.setCpm(state.cpm);
    syncSpeedUI();
  });

  el.presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      state.cpm = Number(btn.dataset.cpm);
      animator.setCpm(state.cpm);
      syncSpeedUI();
    });
  });

  el.btnPlayPause.addEventListener('click', () => {
    if (animator.isPlaying) {
      animator.pause();
    } else if (animator.steps.length > 0) {
      animator.resume();
    } else if (state.mode === 'teach' && state.teach.subtab === 'kana') {
      playTeachKanaSequence(state.teach.selectedKana, false);
      return;
    } else if (state.mode === 'free') {
      startFreeSend();
      return;
    }
    syncPlayPauseBtn();
  });

  el.btnReplay.addEventListener('click', () => {
    clearAutoNextTimer();
    if (state.mode === 'teach' && state.teach.subtab === 'kana') {
      playTeachKanaSequence(state.teach.selectedKana, state.slowMo);
    } else if (animator.steps.length > 0) {
      animator.setSpeedMultiplier(state.slowMo ? 0.5 : 1.0);
      animator.restart();
      syncPlayPauseBtn();
    } else if (state.mode === 'free') {
      startFreeSend();
    }
  });

  el.btnSlowmo.addEventListener('click', () => {
    state.slowMo = !state.slowMo;
    animator.setSpeedMultiplier(state.slowMo ? 0.5 : 1.0);
    syncSpeedUI();
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// -------------------------
// Main Render Loop
// -------------------------
let lastFrameTime = performance.now();

function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min(0.08, Math.max(0.001, (now - lastFrameTime) / 1000));
  lastFrameTime = now;

  if (camTransition) {
    camTransition.t = Math.min(1, camTransition.t + dt * 3.4);
    const e = 1 - Math.pow(1 - camTransition.t, 3);
    camera.position.lerpVectors(camTransition.fromPos, camTransition.toPos, e);
    controls.target.lerpVectors(camTransition.fromTarget, camTransition.toTarget, e);
    if (camTransition.t >= 1) camTransition = null;
  }

  controls.update();
  animator.update(dt);
  renderer.render(scene, camera);
}

// -------------------------
// Bootstrap
// -------------------------
if (initThreeStage()) {
  wireGlobalControls();
  syncSpeedUI();
  switchAppMode('quiz');
  requestAnimationFrame(animate);

  // Expose lightweight debug handle for automated inspection
  window.__TEBATA_APP__ = {
    state,
    switchAppMode,
    setCameraPreset,
    inspectTeachGenga,
    inspectTeachKanaStep
  };
}
