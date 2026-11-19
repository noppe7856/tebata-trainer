import { GENGA } from './semaphoreData.js';

function degToRad(d) {
  return (d * Math.PI) / 180;
}

/**
 * Computes 2D SVG coordinates (facing receiver, +X right, +Y down in SVG)
 * from the exact same shoulder/elbow angles used in the 3D ScoutRig.
 */
function armEndpoints(side, armPose) {
  const sx = side === 'R' ? 20 : 28;
  const sy = 19 - (armPose.lift || 0) * 30;
  const upperLen = 6.5;
  const foreLen = 6.0;
  const poleLen = 11.5;

  const sr = degToRad(armPose.srZ || 0);
  const ex = sx + Math.sin(sr) * upperLen;
  const ey = sy + Math.cos(sr) * upperLen;

  const fr = degToRad((armPose.srZ || 0) + (armPose.elZ || 0));
  const wx = ex + Math.sin(fr) * foreLen;
  const wy = ey + Math.cos(fr) * foreLen;

  const tx = wx + Math.sin(fr) * poleLen;
  const ty = wy + Math.cos(fr) * poleLen;

  // Normal vector for flag cloth rectangle side
  const nx = Math.cos(fr) * (side === 'R' ? -1 : 1);
  const ny = -Math.sin(fr) * (side === 'R' ? -1 : 1);

  return { sx, sy, ex, ey, wx, wy, tx, ty, nx, ny };
}

export function renderGengaMiniSvg(gengaId, size = 48) {
  const g = GENGA[gengaId];
  if (!g) return '';

  const pose = g.type === 'pose' ? g.pose : g.keyframes[g.id === '11' ? 0 : 1];
  const r = armEndpoints('R', pose.R);
  const l = armEndpoints('L', pose.L);

  const drawFlag = (pts, isRed) => {
    const fStart = 0.35;
    const fx1 = pts.wx + (pts.tx - pts.wx) * fStart;
    const fy1 = pts.wy + (pts.ty - pts.wy) * fStart;
    const fx2 = pts.tx;
    const fy2 = pts.ty;
    const fw = 6.5;
    const p1 = `${fx1.toFixed(1)},${fy1.toFixed(1)}`;
    const p2 = `${fx2.toFixed(1)},${fy2.toFixed(1)}`;
    const p3 = `${(fx2 + pts.nx * fw).toFixed(1)},${(fy2 + pts.ny * fw).toFixed(1)}`;
    const p4 = `${(fx1 + pts.nx * fw).toFixed(1)},${(fy1 + pts.ny * fw).toFixed(1)}`;
    const fill = isRed ? '#dc2626' : '#ffffff';
    const stroke = isRed ? '#991b1b' : '#475569';
    return `<polygon points="${p1} ${p2} ${p3} ${p4}" fill="${fill}" stroke="${stroke}" stroke-width="0.9"/>`;
  };

  let extra = '';
  if (gengaId === '0') {
    extra = `<circle cx="24" cy="24" r="14" fill="none" stroke="#dc2626" stroke-width="1.3" stroke-dasharray="2.5 2"/>`;
  } else if (gengaId === '11') {
    const endPose = g.endPose || g.keyframes[g.keyframes.length - 1];
    const r2 = armEndpoints('R', endPose.R);
    const l2 = armEndpoints('L', endPose.L);
    const sx = ((r.tx + l.tx) * 0.5).toFixed(1);
    const sy = ((r.ty + l.ty) * 0.5).toFixed(1);
    const ex = ((r2.tx + l2.tx) * 0.5).toFixed(1);
    const ey = ((r2.ty + l2.ty) * 0.5).toFixed(1);
    extra = `
      <g opacity="0.32">
        <line x1="${r2.wx.toFixed(1)}" y1="${r2.wy.toFixed(1)}" x2="${r2.tx.toFixed(1)}" y2="${r2.ty.toFixed(1)}" stroke="#dc2626" stroke-width="1.4" stroke-linecap="round"/>
        <line x1="${l2.wx.toFixed(1)}" y1="${l2.wy.toFixed(1)}" x2="${l2.tx.toFixed(1)}" y2="${l2.ty.toFixed(1)}" stroke="#475569" stroke-width="1.4" stroke-linecap="round"/>
      </g>
      <path d="M ${sx} ${sy} L ${ex} ${ey}" fill="none" stroke="#d97706" stroke-width="1.6" stroke-dasharray="2.4 1.8" stroke-linecap="round"/>
      <polygon points="${ex},${ey} ${(Number(ex) + 4.2).toFixed(1)},${(Number(ey) - 1.2).toFixed(1)} ${(Number(ex) + 1.2).toFixed(1)},${(Number(ey) - 4.2).toFixed(1)}" fill="#d97706"/>
    `;
  }

  return `
    <svg viewBox="0 0 48 48" width="${size}" height="${size}" class="genga-mini-svg" aria-hidden="true">
      ${extra}
      <!-- Legs & Torso -->
      <line x1="22" y1="29" x2="20" y2="41" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
      <line x1="26" y1="29" x2="28" y2="41" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
      <rect x="20" y="18" width="8" height="12" rx="2" fill="#b49e66" stroke="#334155" stroke-width="0.9"/>
      <circle cx="24" cy="13.5" r="3.4" fill="#f3c6a5" stroke="#334155" stroke-width="0.9"/>
      <path d="M 20.8 11.5 Q 24 8.5 27.2 11.5" fill="#1b4332"/>
      <!-- Right arm (Red) -->
      <polyline points="${r.sx},${r.sy} ${r.ex.toFixed(1)},${r.ey.toFixed(1)} ${r.wx.toFixed(1)},${r.wy.toFixed(1)}" fill="none" stroke="#334155" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="${r.wx.toFixed(1)}" y1="${r.wy.toFixed(1)}" x2="${r.tx.toFixed(1)}" y2="${r.ty.toFixed(1)}" stroke="#92400e" stroke-width="1.4" stroke-linecap="round"/>
      ${drawFlag(r, true)}
      <!-- Left arm (White) -->
      <polyline points="${l.sx},${l.sy} ${l.ex.toFixed(1)},${l.ey.toFixed(1)} ${l.wx.toFixed(1)},${l.wy.toFixed(1)}" fill="none" stroke="#334155" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="${l.wx.toFixed(1)}" y1="${l.wy.toFixed(1)}" x2="${l.tx.toFixed(1)}" y2="${l.ty.toFixed(1)}" stroke="#92400e" stroke-width="1.4" stroke-linecap="round"/>
      ${drawFlag(l, false)}
    </svg>
  `;
}
