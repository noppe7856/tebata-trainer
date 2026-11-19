import * as THREE from 'three';

function createFlagTexture(isRed) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Woven cloth base
  ctx.fillStyle = isRed ? '#dc2626' : '#f8fafc';
  ctx.fillRect(0, 0, 256, 256);

  // Subtle fabric weave lines
  ctx.strokeStyle = isRed ? 'rgba(127, 29, 29, 0.16)' : 'rgba(148, 163, 184, 0.22)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 256; i += 8) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
    ctx.stroke();
  }

  // Stitched hem border so white flag pops crisply against sky
  ctx.strokeStyle = isRed ? '#991b1b' : '#94a3b8';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 246, 246);

  ctx.strokeStyle = isRed ? 'rgba(255,255,255,0.28)' : 'rgba(51,65,85,0.25)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.strokeRect(14, 14, 228, 228);

  // Reinforcing corner tie tabs on left edge (attached to pole)
  ctx.setLineDash([]);
  ctx.fillStyle = isRed ? '#7f1d1d' : '#cbd5e1';
  ctx.fillRect(0, 12, 14, 24);
  ctx.fillRect(0, 220, 14, 24);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function createGroundTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Rich sunlit meadow grass base
  const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 256);
  grad.addColorStop(0, '#6b8e4e');
  grad.addColorStop(0.28, '#4d7c3f');
  grad.addColorStop(1, '#365e2d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle grass blades & clover speckles
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(134, 194, 72, 0.22)' : 'rgba(30, 58, 26, 0.22)';
    ctx.fillRect(x, y, 2, 4);
  }

  // Central packed earth scout standing circle
  ctx.beginPath();
  ctx.arc(256, 256, 32, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(161, 136, 102, 0.48)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(214, 195, 158, 0.45)';
  ctx.lineWidth = 2;
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSkyDome() {
  const geo = new THREE.SphereGeometry(48, 32, 20);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      topColor: { value: new THREE.Color('#1d4ed8') },
      midColor: { value: new THREE.Color('#3b82f6') },
      horizonColor: { value: new THREE.Color('#93c5fd') }
    },
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 midColor;
      uniform vec3 horizonColor;
      varying vec3 vWorldPos;
      void main() {
        float h = clamp(normalize(vWorldPos).y, 0.0, 1.0);
        vec3 col = mix(horizonColor, midColor, smoothstep(0.0, 0.25, h));
        col = mix(col, topColor, smoothstep(0.25, 0.85, h));
        gl_FragColor = vec4(col, 1.0);
      }
    `
  });
  return new THREE.Mesh(geo, mat);
}

function createPineTree(scale = 1) {
  const g = new THREE.Group();
  const trunkMat = new THREE.MeshStandardMaterial({ color: '#5c3a21', roughness: 0.9 });
  const leafMat1 = new THREE.MeshStandardMaterial({ color: '#1b4332', roughness: 0.85 });
  const leafMat2 = new THREE.MeshStandardMaterial({ color: '#2d6a4f', roughness: 0.85 });

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 1.1, 7), trunkMat);
  trunk.position.y = 0.55;
  trunk.castShadow = true;
  g.add(trunk);

  const c1 = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.6, 8), leafMat1);
  c1.position.y = 1.5;
  c1.castShadow = true;
  g.add(c1);

  const c2 = new THREE.Mesh(new THREE.ConeGeometry(0.74, 1.4, 8), leafMat2);
  c2.position.y = 2.3;
  c2.castShadow = true;
  g.add(c2);

  const c3 = new THREE.Mesh(new THREE.ConeGeometry(0.50, 1.1, 8), leafMat1);
  c3.position.y = 3.0;
  c3.castShadow = true;
  g.add(c3);

  g.scale.setScalar(scale);
  return g;
}

function createPatrolTent() {
  const g = new THREE.Group();
  const canvasMat = new THREE.MeshStandardMaterial({
    color: '#4f6d42',
    roughness: 0.9,
    side: THREE.DoubleSide
  });
  const trimMat = new THREE.MeshStandardMaterial({ color: '#d6c69c', roughness: 0.85 });
  const poleMat = new THREE.MeshStandardMaterial({ color: '#785535', roughness: 0.8 });

  // A-frame tent body using prism shape
  const shape = new THREE.Shape();
  shape.moveTo(-1.0, 0);
  shape.lineTo(1.0, 0);
  shape.lineTo(0, 1.35);
  shape.closePath();
  const extrude = new THREE.ExtrudeGeometry(shape, { depth: 2.2, bevelEnabled: false });
  const tentMesh = new THREE.Mesh(extrude, canvasMat);
  tentMesh.position.set(0, 0, -1.1);
  tentMesh.castShadow = true;
  tentMesh.receiveShadow = true;
  g.add(tentMesh);

  // Ridge pole & front pole
  const frontPole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.45, 8), poleMat);
  frontPole.position.set(0, 0.72, 1.12);
  g.add(frontPole);

  const backPole = frontPole.clone();
  backPole.position.set(0, 0.72, -1.12);
  g.add(backPole);

  // Small dark tent doorway triangle
  const doorGeo = new THREE.BufferGeometry();
  const verts = new Float32Array([
    -0.48, 0.01, 1.11,
     0.48, 0.01, 1.11,
     0.0,  0.95, 1.11
  ]);
  doorGeo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
  const door = new THREE.Mesh(doorGeo, new THREE.MeshBasicMaterial({ color: '#1a2417' }));
  g.add(door);

  // Groundsheet lip
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.06, 0.04, 2.26), trimMat);
  base.position.set(0, 0.02, 0);
  g.add(base);

  return g;
}

export class ScoutRig {
  constructor(scene) {
    this.scene = scene;
    this.root = new THREE.Group();
    this.scene.add(this.root);

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({ color: '#f3c6a5', roughness: 0.65 });
    const hairMat = new THREE.MeshStandardMaterial({ color: '#27201c', roughness: 0.85 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: '#c8b37e', roughness: 0.78 });
    const shirtDarkMat = new THREE.MeshStandardMaterial({ color: '#b49e66', roughness: 0.8 });
    const shortsMat = new THREE.MeshStandardMaterial({ color: '#495437', roughness: 0.84 });
    const sockMat = new THREE.MeshStandardMaterial({ color: '#4a5548', roughness: 0.85 });
    const bootMat = new THREE.MeshStandardMaterial({ color: '#3b2619', roughness: 0.72 });
    const beltMat = new THREE.MeshStandardMaterial({ color: '#452b18', roughness: 0.6 });
    const goldMat = new THREE.MeshStandardMaterial({ color: '#eab308', roughness: 0.35, metalness: 0.4 });
    const scarfMat = new THREE.MeshStandardMaterial({ color: '#166534', roughness: 0.75 });
    const scarfBorderMat = new THREE.MeshStandardMaterial({ color: '#facc15', roughness: 0.7 });
    const hatMat = new THREE.MeshStandardMaterial({ color: '#1b4332', roughness: 0.82 });
    const campaignHatMat = new THREE.MeshStandardMaterial({ color: '#6c5840', roughness: 0.85 });
    const woodMat = new THREE.MeshStandardMaterial({ color: '#d4a373', roughness: 0.65 });

    // Lower body: Boots, socks, legs, shorts (standing stably in 原姿 stance)
    const buildLeg = (xSign) => {
      const leg = new THREE.Group();
      leg.position.set(xSign * 0.11, 0, 0);

      // Boot
      const bootSole = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.06, 0.21), bootMat);
      bootSole.position.set(0, 0.03, 0.03);
      bootSole.castShadow = true;
      leg.add(bootSole);

      const bootAnkle = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.056, 0.10, 12), bootMat);
      bootAnkle.position.set(0, 0.09, -0.01);
      bootAnkle.castShadow = true;
      leg.add(bootAnkle);

      // Socks
      const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.046, 0.23, 12), sockMat);
      sock.position.set(0, 0.24, -0.01);
      sock.castShadow = true;
      leg.add(sock);

      const sockGarter = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.03, 12), scarfMat);
      sockGarter.position.set(0, 0.34, -0.01);
      leg.add(sockGarter);

      // Knee / lower thigh skin
      const knee = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.050, 0.19, 12), skinMat);
      knee.position.set(0, 0.44, -0.01);
      knee.castShadow = true;
      leg.add(knee);

      // Shorts leg
      const shortLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.070, 0.28, 12), shortsMat);
      shortLeg.position.set(0, 0.66, -0.01);
      shortLeg.castShadow = true;
      leg.add(shortLeg);

      return leg;
    };

    const rightLeg = buildLeg(-1);
    rightLeg.rotation.z = -0.03;
    const leftLeg = buildLeg(1);
    leftLeg.rotation.z = 0.04;
    this.root.add(rightLeg, leftLeg);

    // Pelvis & Belt
    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.20), shortsMat);
    pelvis.position.set(0, 0.84, -0.01);
    pelvis.castShadow = true;
    this.root.add(pelvis);

    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.045, 0.21), beltMat);
    belt.position.set(0, 0.91, -0.01);
    this.root.add(belt);

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.048, 0.02), goldMat);
    buckle.position.set(0, 0.91, 0.10);
    this.root.add(buckle);

    // Upper Body Group (for subtle breathing)
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.set(0, 0.93, 0);
    this.root.add(this.torsoGroup);

    // Uniform Shirt Torso (y local 0..0.44 => world 0.93..1.37)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.44, 0.20), shirtMat);
    torso.position.set(0, 0.22, -0.01);
    torso.castShadow = true;
    torso.receiveShadow = true;
    this.torsoGroup.add(torso);

    // Shirt placket & pockets
    const placket = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.38, 0.015), shirtDarkMat);
    placket.position.set(0, 0.21, 0.095);
    this.torsoGroup.add(placket);

    [-0.09, 0.09].forEach(px => {
      const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.10, 0.015), shirtDarkMat);
      pocket.position.set(px, 0.27, 0.095);
      this.torsoGroup.add(pocket);
    });

    // Shoulder epaulets
    [-0.14, 0.14].forEach(ex => {
      const ep = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.018, 0.055), scarfMat);
      ep.position.set(ex, 0.445, -0.01);
      this.torsoGroup.add(ep);
    });

    // Boy Scout Neckerchief (ネッカチーフ) & Woggle (リング)
    const scarfCollar = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.028, 8, 16), scarfMat);
    scarfCollar.rotation.x = Math.PI / 2;
    scarfCollar.position.set(0, 0.435, 0.0);
    this.torsoGroup.add(scarfCollar);

    const scarfFrontGeo = new THREE.ConeGeometry(0.07, 0.16, 4);
    const scarfFront = new THREE.Mesh(scarfFrontGeo, scarfMat);
    scarfFront.rotation.x = Math.PI;
    scarfFront.rotation.y = Math.PI / 4;
    scarfFront.scale.set(0.95, 1.0, 0.35);
    scarfFront.position.set(0, 0.34, 0.10);
    this.torsoGroup.add(scarfFront);

    const scarfBack = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.22, 4), scarfMat);
    scarfBack.rotation.x = Math.PI;
    scarfBack.rotation.y = Math.PI / 4;
    scarfBack.scale.set(1.2, 1.0, 0.22);
    scarfBack.position.set(0, 0.34, -0.115);
    this.torsoGroup.add(scarfBack);

    const woggle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.026, 12), goldMat);
    woggle.position.set(0, 0.39, 0.105);
    this.torsoGroup.add(woggle);

    const scarfStripe = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.012), scarfBorderMat);
    scarfStripe.position.set(0, 0.28, 0.103);
    this.torsoGroup.add(scarfStripe);

    // Neck & Head
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.055, 0.08, 12), skinMat);
    neck.position.set(0, 0.47, 0);
    this.torsoGroup.add(neck);

    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.61, 0.005); // world y = 1.54
    this.torsoGroup.add(this.headGroup);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.115, 18, 16), skinMat);
    head.scale.set(0.95, 1.04, 0.98);
    head.castShadow = true;
    this.headGroup.add(head);

    // Ears
    [-0.108, 0.108].forEach(ex => {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 10), skinMat);
      ear.position.set(ex, -0.01, -0.01);
      this.headGroup.add(ear);
    });

    // Hair cap (back & sides)
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.119, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.56), hairMat);
    hair.rotation.x = -0.35;
    hair.position.set(0, 0.01, -0.015);
    this.headGroup.add(hair);

    // Face features (+Z facing receiver!)
    const eyeMat = new THREE.MeshBasicMaterial({ color: '#1e293b' });
    [-0.04, 0.04].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.013, 8, 8), eyeMat);
      eye.position.set(ex, 0.01, 0.104);
      this.headGroup.add(eye);

      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.007, 0.008), hairMat);
      brow.position.set(ex, 0.036, 0.105);
      this.headGroup.add(brow);
    });
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 8), skinMat);
    nose.position.set(0, -0.012, 0.114);
    this.headGroup.add(nose);

    const smile = new THREE.Mesh(
      new THREE.TorusGeometry(0.022, 0.0045, 6, 12, Math.PI),
      new THREE.MeshBasicMaterial({ color: '#9a3412' })
    );
    smile.rotation.x = Math.PI;
    smile.position.set(0, -0.042, 0.103);
    this.headGroup.add(smile);

    // Boy Scout Beret (Default sleek cap that never blocks overhead 5/6/11 poses)
    this.beretGroup = new THREE.Group();
    const beret = new THREE.Mesh(new THREE.SphereGeometry(0.126, 18, 12), hatMat);
    beret.scale.set(1.06, 0.45, 1.06);
    beret.position.set(0.015, 0.088, -0.008);
    beret.rotation.z = -0.15;
    beret.castShadow = true;
    this.beretGroup.add(beret);

    const beretBand = new THREE.Mesh(new THREE.CylinderGeometry(0.116, 0.114, 0.028, 18), new THREE.MeshStandardMaterial({ color: '#0f291e', roughness: 0.8 }));
    beretBand.position.set(0, 0.062, -0.005);
    this.beretGroup.add(beretBand);

    const badge = new THREE.Mesh(new THREE.OctahedronGeometry(0.017, 0), goldMat);
    badge.position.set(-0.04, 0.085, 0.105);
    this.beretGroup.add(badge);
    this.headGroup.add(this.beretGroup);

    // Campaign Hat (Optional toggleable wide-brim Boy Scout hat!)
    this.campaignHatGroup = new THREE.Group();
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.014, 24), campaignHatMat);
    brim.position.set(0, 0.072, 0);
    brim.castShadow = true;
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.115, 0.11, 16), campaignHatMat);
    crown.position.set(0, 0.125, 0);
    crown.castShadow = true;
    const hatBand = new THREE.Mesh(new THREE.CylinderGeometry(0.114, 0.116, 0.022, 16), scarfMat);
    hatBand.position.set(0, 0.085, 0);
    const hatPin = new THREE.Mesh(new THREE.OctahedronGeometry(0.015, 0), goldMat);
    hatPin.position.set(0, 0.105, 0.112);
    this.campaignHatGroup.add(brim, crown, hatBand, hatPin);
    this.campaignHatGroup.visible = false;
    this.headGroup.add(this.campaignHatGroup);

    // Arms & Flags
    this.arms = {
      R: this._buildArm('R', { shirtMat, skinMat, woodMat, isRed: true }),
      L: this._buildArm('L', { shirtMat, skinMat, woodMat, isRed: false })
    };
    this.torsoGroup.add(this.arms.R.shoulderMount);
    this.torsoGroup.add(this.arms.L.shoulderMount);

    // Cloth wave state
    this.clothTime = 0;

    // 3D Stroke Trail System (tracks flag tips in world space)
    this.trailEnabled = true;
    this.trails = {
      R: this._createTrail('#ef4444'),
      L: this._createTrail('#38bdf8')
    };

    // Angle Compass Guide Ring
    this.guideGroup = this._createGuideRing();
    this.root.add(this.guideGroup);
  }

  _buildArm(side, { shirtMat, skinMat, woodMat, isRed }) {
    const xSign = side === 'R' ? -1 : 1; // R is viewer's LEFT (-X), L is viewer's RIGHT (+X)

    const shoulderMount = new THREE.Group();
    shoulderMount.position.set(xSign * 0.215, 0.42, 0); // World y = 1.35

    const shoulderPivot = new THREE.Group();
    shoulderPivot.rotation.order = 'ZYX';
    shoulderMount.add(shoulderPivot);

    // Short uniform sleeve
    const shoulderBall = new THREE.Mesh(new THREE.SphereGeometry(0.056, 12, 10), shirtMat);
    shoulderPivot.add(shoulderBall);

    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.054, 0.058, 0.15, 12), shirtMat);
    sleeve.position.set(0, -0.075, 0);
    sleeve.castShadow = true;
    shoulderPivot.add(sleeve);

    // Upper arm (skin)
    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.040, 0.15, 10), skinMat);
    upperArm.position.set(0, -0.20, 0);
    upperArm.castShadow = true;
    shoulderPivot.add(upperArm);

    // Elbow pivot at y = -0.27
    const elbowPivot = new THREE.Group();
    elbowPivot.rotation.order = 'ZYX';
    elbowPivot.position.set(0, -0.27, 0);
    shoulderPivot.add(elbowPivot);

    const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.039, 10, 10), skinMat);
    elbowPivot.add(elbowJoint);

    // Forearm (0.25m)
    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.039, 0.033, 0.25, 10), skinMat);
    forearm.position.set(0, -0.125, 0);
    forearm.castShadow = true;
    elbowPivot.add(forearm);

    // Hand + Semaphore Flag Staff (aligned strictly along -Y!)
    const handGroup = new THREE.Group();
    handGroup.position.set(0, -0.26, 0);
    elbowPivot.add(handGroup);

    const fist = new THREE.Mesh(new THREE.SphereGeometry(0.038, 10, 10), skinMat);
    fist.castShadow = true;
    handGroup.add(fist);

    // Wooden pole (extends from +0.08 behind fist to -0.64 ahead of fist!)
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.013, 0.72, 10), woodMat);
    pole.position.set(0, -0.28, 0);
    pole.castShadow = true;
    handGroup.add(pole);

    // Pole tip finial
    const tipCap = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), woodMat);
    tipCap.position.set(0, -0.645, 0);
    handGroup.add(tipCap);

    // Flag tip world anchor for trail & cloth velocity
    const tipAnchor = new THREE.Object3D();
    tipAnchor.position.set(0, -0.62, 0);
    handGroup.add(tipAnchor);

    // Subdivided Cloth Flag Mesh (0.40 x 0.40, anchored on x = 0 edge)
    const flagW = 0.40;
    const flagH = 0.40;
    const segW = 8;
    const segH = 8;
    const flagGeo = new THREE.PlaneGeometry(flagW, flagH, segW, segH);
    // Shift geometry so left edge (u=0) sits directly on the pole at x=0, and top/bottom spans y = -0.22..-0.62
    flagGeo.translate(xSign * (flagW / 2), -0.42, 0);

    const basePositions = new Float32Array(flagGeo.attributes.position.array);
    const flagMat = new THREE.MeshStandardMaterial({
      map: createFlagTexture(isRed),
      roughness: 0.72,
      metalness: 0.02,
      side: THREE.DoubleSide
    });
    const flagMesh = new THREE.Mesh(flagGeo, flagMat);
    flagMesh.castShadow = true;
    handGroup.add(flagMesh);

    return {
      side,
      xSign,
      baseShoulderY: 0.42,
      shoulderMount,
      shoulderPivot,
      elbowPivot,
      handGroup,
      tipAnchor,
      flagMesh,
      flagGeo,
      basePositions,
      flagW,
      prevTipWorld: new THREE.Vector3(),
      velTipWorld: new THREE.Vector3(),
      smoothVelLocal: new THREE.Vector3(),
      hasPrevTip: false
    };
  }

  _createTrail(colorHex) {
    const maxPts = 42;
    const positions = new Float32Array(maxPts * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setDrawRange(0, 0);
    const mat = new THREE.LineBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.78
    });
    const line = new THREE.Line(geo, mat);
    line.frustumCulled = false;
    this.scene.add(line);
    return { line, geo, positions, points: [], maxPts };
  }

  _createGuideRing() {
    const g = new THREE.Group();
    g.position.set(0, 1.35, -0.04);

    // Subtle thin compass circle
    const ringGeo = new THREE.RingGeometry(0.95, 0.975, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    g.add(ring);

    // 8 radial 45-degree ticks
    const tickMat = new THREE.MeshBasicMaterial({
      color: '#fde68a',
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    for (let deg = 0; deg < 360; deg += 45) {
      const rad = THREE.MathUtils.degToRad(deg);
      const tick = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 0.12), tickMat);
      tick.position.set(Math.sin(rad) * 1.02, -Math.cos(rad) * 1.02, 0);
      tick.rotation.z = rad;
      g.add(tick);
    }
    return g;
  }

  setHatMode(mode) {
    // 'beret' | 'campaign' | 'none'
    this.beretGroup.visible = mode === 'beret';
    this.campaignHatGroup.visible = mode === 'campaign';
  }

  setGuideVisible(visible) {
    this.guideGroup.visible = visible;
  }

  setTrailVisible(visible) {
    this.trailEnabled = visible;
    this.trails.R.line.visible = visible;
    this.trails.L.line.visible = visible;
    if (!visible) this.clearTrails();
  }

  clearTrails() {
    for (const key of ['R', 'L']) {
      this.trails[key].points = [];
      this.trails[key].geo.setDrawRange(0, 0);
    }
  }

  applyPose(poseR, poseL) {
    const deg = THREE.MathUtils.degToRad;

    this.arms.R.shoulderMount.position.y = this.arms.R.baseShoulderY + (poseR.lift || 0);
    this.arms.R.shoulderPivot.rotation.set(deg(poseR.srX || 0), deg(poseR.srY || 0), deg(poseR.srZ || 0), 'ZYX');
    this.arms.R.elbowPivot.rotation.set(0, 0, deg(poseR.elZ || 0), 'ZYX');
    this.arms.R.handGroup.rotation.y = deg(poseR.roll || 0);

    this.arms.L.shoulderMount.position.y = this.arms.L.baseShoulderY + (poseL.lift || 0);
    this.arms.L.shoulderPivot.rotation.set(deg(poseL.srX || 0), deg(poseL.srY || 0), deg(poseL.srZ || 0), 'ZYX');
    this.arms.L.elbowPivot.rotation.set(0, 0, deg(poseL.elZ || 0), 'ZYX');
    this.arms.L.handGroup.rotation.y = deg(poseL.roll || 0);
  }

  update(dt, isPlaying, recordTrail) {
    this.clothTime += dt;

    // Gentle idle breathing
    const breath = Math.sin(this.clothTime * 2.1) * (isPlaying ? 0.002 : 0.006);
    this.torsoGroup.position.y = 0.93 + breath;
    this.headGroup.rotation.x = Math.sin(this.clothTime * 1.4) * 0.015;

    this.root.updateMatrixWorld(true);

    const worldGravity = new THREE.Vector3(0, -1, 0);
    const invQuat = new THREE.Quaternion();
    const tmpPos = new THREE.Vector3();
    const tmpVel = new THREE.Vector3();

    for (const side of ['R', 'L']) {
      const arm = this.arms[side];
      arm.tipAnchor.getWorldPosition(tmpPos);

      if (!arm.hasPrevTip) {
        arm.prevTipWorld.copy(tmpPos);
        arm.hasPrevTip = true;
      }

      const safeDt = Math.max(dt, 1 / 120);
      tmpVel.subVectors(tmpPos, arm.prevTipWorld).divideScalar(safeDt);
      arm.prevTipWorld.copy(tmpPos);

      // Transform gravity + velocity lag into handGroup's local space
      arm.handGroup.getWorldQuaternion(invQuat);
      invQuat.invert();

      const localGravity = worldGravity.clone().applyQuaternion(invQuat);
      const localInertia = tmpVel.clone().multiplyScalar(-0.08).applyQuaternion(invQuat);
      // Clamp inertia so extreme 400 CPM speeds whip dramatically without turning cloth inside out
      if (localInertia.length() > 1.35) localInertia.setLength(1.35);

      arm.smoothVelLocal.lerp(localInertia, Math.min(1, dt * 16));

      // Wind + flag flutter traveling along cloth width
      const posAttr = arm.flagGeo.attributes.position;
      const base = arm.basePositions;
      const count = posAttr.count;
      const windForce = 0.42 + arm.smoothVelLocal.length() * 0.55;

      for (let i = 0; i < count; i++) {
        const bx = base[i * 3];
        const by = base[i * 3 + 1];
        const bz = base[i * 3 + 2];

        // u = distance ratio away from the pole (0 on pole -> 1 at outer hem)
        const u = Math.abs(bx) / arm.flagW;
        if (u < 0.001) {
          posAttr.setXYZ(i, bx, by, bz);
          continue;
        }

        // Drape toward local gravity & trailing velocity
        const drapeX = (localGravity.x * 0.24 + arm.smoothVelLocal.x * 0.22) * u;
        const drapeY = (localGravity.y * 0.14 + arm.smoothVelLocal.y * 0.18) * u;
        const drapeZ = (localGravity.z * 0.24 + arm.smoothVelLocal.z * 0.26) * u;

        // Traveling fabric wave
        const wavePhase = this.clothTime * (5.5 + windForce * 4.5) - u * 4.8 + (side === 'R' ? 0 : 1.7);
        const flutterZ = Math.sin(wavePhase) * 0.036 * u * windForce;
        const flutterY = Math.cos(wavePhase * 0.85) * 0.015 * u * windForce;

        // Pull x slightly inward as cloth drapes vertically
        const pullIn = -arm.xSign * (1 - Math.max(0.25, Math.abs(localGravity.x) * 0.4 + 0.55)) * 0.10 * u * u;

        posAttr.setXYZ(
          i,
          bx + drapeX * 0.35 + pullIn,
          by + drapeY + flutterY,
          bz + drapeZ + flutterZ
        );
      }
      posAttr.needsUpdate = true;
      arm.flagGeo.computeVertexNormals();

      // Update air trail
      if (this.trailEnabled && recordTrail) {
        const trail = this.trails[side];
        const last = trail.points[trail.points.length - 1];
        if (!last || last.distanceToSquared(tmpPos) > 0.0012) {
          trail.points.push(tmpPos.clone());
          if (trail.points.length > trail.maxPts) {
            trail.points.shift();
          }
          for (let j = 0; j < trail.points.length; j++) {
            const p = trail.points[j];
            trail.positions[j * 3] = p.x;
            trail.positions[j * 3 + 1] = p.y;
            trail.positions[j * 3 + 2] = p.z;
          }
          trail.geo.attributes.position.needsUpdate = true;
          trail.geo.setDrawRange(0, trail.points.length);
        }
      }
    }
  }
}

export function buildCampsiteEnvironment(scene) {
  scene.add(createSkyDome());
  scene.fog = new THREE.Fog('#93c5fd', 18, 52);

  // Lighting
  const hemi = new THREE.HemisphereLight('#e0f2fe', '#3f6212', 0.95);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight('#fffbeb', 1.65);
  sun.position.set(5.5, 9.5, 7.0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 28;
  sun.shadow.camera.left = -5.5;
  sun.shadow.camera.right = 5.5;
  sun.shadow.camera.top = 5.5;
  sun.shadow.camera.bottom = -5.5;
  sun.shadow.bias = -0.0005;
  scene.add(sun);

  // Subtle rim light from behind-right to separate white flag cleanly
  const rim = new THREE.DirectionalLight('#bae6fd', 0.55);
  rim.position.set(-4, 4, -5);
  scene.add(rim);

  // Meadow ground plane
  const groundMat = new THREE.MeshStandardMaterial({
    map: createGroundTexture(),
    roughness: 0.95
  });
  const ground = new THREE.Mesh(new THREE.CircleGeometry(34, 48), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Distant pine trees placed well outside the center silhouette zone
  const treeCoords = [
    [-7.5, -7.2, 1.35], [-5.2, -9.5, 1.15], [6.4, -8.5, 1.4],
    [8.6, -6.2, 1.1], [-10.5, -3.5, 1.2], [10.2, -2.5, 1.25],
    [-8.8, -11.5, 1.6], [4.0, -13.0, 1.5], [-2.5, -14.5, 1.4]
  ];
  for (const [tx, tz, sc] of treeCoords) {
    const tree = createPineTree(sc);
    tree.position.set(tx, 0, tz);
    scene.add(tree);
  }

  // Patrol tent off to the left rear flank
  const tent = createPatrolTent();
  tent.position.set(-4.8, 0, -5.8);
  tent.rotation.y = 0.55;
  scene.add(tent);

  // Low timber boundary marker posts on flanks
  const postMat = new THREE.MeshStandardMaterial({ color: '#7c5836', roughness: 0.85 });
  [[-3.2, -3.4], [3.2, -3.4]].forEach(([px, pz]) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.55, 8), postMat);
    post.position.set(px, 0.275, pz);
    post.castShadow = true;
    scene.add(post);
  });
}
