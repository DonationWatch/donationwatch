"use client";

import { useEffect, useRef } from "react";

const MAX_GRID_SIZE = 4;
const TOTAL_EYES = MAX_GRID_SIZE * MAX_GRID_SIZE;
const TARGET_FPS = 30;
const FRAME_INTERVAL_MS = 1000 / TARGET_FPS;

// Precomputed static geometry & trigonometry tables (zero runtime allocations)
const LID_COUNT = 6;
const LID_T = new Float32Array([-1, -0.62, -0.22, 0.22, 0.62, 1]);
const LID_ARCH = new Float32Array(LID_COUNT);
const LID_LERP = new Float32Array(LID_COUNT);
for (let i = 0; i < LID_COUNT; i++) {
  const t = LID_T[i];
  LID_ARCH[i] = 1 - t * t;
  LID_LERP[i] = (t + 1) * 0.5;
}

const CREASE_COUNT = 5;
const CREASE_T = new Float32Array([-0.88, -0.45, 0, 0.45, 0.88]);
const CREASE_ARCH = new Float32Array(CREASE_COUNT);
for (let i = 0; i < CREASE_COUNT; i++) {
  const t = CREASE_T[i];
  CREASE_ARCH[i] = 1 - t * t * 0.85;
}

const LOWER_CREASE_COUNT = 4;
const LOWER_CREASE_T = new Float32Array([-0.55, -0.15, 0.25, 0.6]);
const LOWER_CREASE_ARCH = new Float32Array(LOWER_CREASE_COUNT);
for (let i = 0; i < LOWER_CREASE_COUNT; i++) {
  const t = LOWER_CREASE_T[i];
  LOWER_CREASE_ARCH[i] = 1 - t * t;
}

const IRIS_SIDES = 7;
const IRIS_COS = new Float32Array(IRIS_SIDES);
const IRIS_SIN = new Float32Array(IRIS_SIDES);
for (let i = 0; i < IRIS_SIDES; i++) {
  const theta = 0.2 + (i / IRIS_SIDES) * Math.PI * 2;
  IRIS_COS[i] = Math.cos(theta);
  IRIS_SIN[i] = Math.sin(theta);
}

const PUPIL_SIDES = 5;
const PUPIL_COS = new Float32Array(PUPIL_SIDES);
const PUPIL_SIN = new Float32Array(PUPIL_SIDES);
for (let i = 0; i < PUPIL_SIDES; i++) {
  const theta = 0.7 + (i / PUPIL_SIDES) * Math.PI * 2;
  PUPIL_COS[i] = Math.cos(theta);
  PUPIL_SIN[i] = Math.sin(theta);
}

// Reusable scratch buffers for eyelid vertices (x0, y0, x1, y1, ...)
const UPPER_LID_PTS = new Float32Array(LID_COUNT * 2);
const LOWER_LID_PTS = new Float32Array(LID_COUNT * 2);

type EyeBehavior =
  | "idle"
  | "dart"
  | "scan"
  | "squint"
  | "wide"
  | "sleepy"
  | "shifty"
  | "roll";

interface EyeState {
  // Base personality / precomputed geometry variations
  scale: number;
  tiltAngle: number;
  cosTilt: number;
  sinTilt: number;
  aspectRatio: number;

  // Gaze target in viewport coordinates (0..vw, 0..vh)
  targetPageX: number;
  targetPageY: number;
  // Secondary point for scanning/rolling
  scanStartX: number;
  scanStartY: number;
  scanEndX: number;
  scanEndY: number;
  scanDuration: number;
  scanElapsed: number;

  // Current normalized local gaze offset (-1..1)
  gazeX: number;
  gazeY: number;
  gazeSpeed: number;

  // Eyelid state
  openness: number; // 0 = closed, 1 = normal open, >1 = wide
  targetOpenness: number;
  lowerLidLift: number; // 0 = normal, >0 = squinted up
  targetLowerLidLift: number;

  // Blink state machine
  blinkPhase: "none" | "closing" | "closed" | "opening";
  blinkSpeed: number;
  blinkHoldTimer: number;
  pendingBlinks: number;
  nextBlinkIn: number;

  // Pupil state (relative to iris radius)
  pupilScale: number;
  targetPupilScale: number;

  // Behavior timer
  behavior: EyeBehavior;
  behaviorTimer: number;
  rollAngle: number;
}

interface PointerState {
  x: number;
  y: number;
  active: boolean;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

const jitterOffset = (amount: number) =>
  amount <= 0 ? 0 : (Math.random() - 0.5) * 2 * amount;

function createInitialEyeState(vw: number, vh: number): EyeState {
  const startX = rand(0, vw);
  const startY = rand(0, vh);
  const tiltAngle = rand(-0.09, 0.09);
  return {
    scale: rand(0.88, 1.12),
    tiltAngle,
    cosTilt: Math.cos(tiltAngle),
    sinTilt: Math.sin(tiltAngle),
    aspectRatio: rand(0.44, 0.54),

    targetPageX: startX,
    targetPageY: startY,
    scanStartX: startX,
    scanStartY: startY,
    scanEndX: rand(0, vw),
    scanEndY: rand(0, vh),
    scanDuration: 1.5,
    scanElapsed: 0,

    gazeX: rand(-0.3, 0.3),
    gazeY: rand(-0.3, 0.3),
    gazeSpeed: rand(6, 12),

    openness: rand(0.85, 1.05),
    targetOpenness: 1,
    lowerLidLift: 0,
    targetLowerLidLift: 0,

    blinkPhase: "none",
    blinkSpeed: 14,
    blinkHoldTimer: 0,
    pendingBlinks: 0,
    nextBlinkIn: rand(0.6, 4.5),

    pupilScale: rand(0.38, 0.5),
    targetPupilScale: 0.44,

    behavior: "idle",
    behaviorTimer: rand(0.4, 2.5),
    rollAngle: 0,
  };
}

function pickNextBehavior(eye: EyeState, vw: number, vh: number) {
  const roll = Math.random();

  if (roll < 0.25) {
    eye.behavior = "dart";
    eye.targetPageX = rand(0, vw);
    eye.targetPageY = rand(0, vh);
    eye.gazeSpeed = rand(12, 22);
    eye.targetOpenness = rand(0.92, 1.08);
    eye.targetLowerLidLift = 0;
    eye.targetPupilScale = rand(0.38, 0.5);
    eye.behaviorTimer = rand(0.7, 2.2);
  } else if (roll < 0.45) {
    eye.behavior = "scan";
    eye.scanStartX = eye.targetPageX;
    eye.scanStartY = eye.targetPageY;
    eye.scanEndX = rand(0, vw);
    eye.scanEndY = rand(0, vh);
    eye.scanDuration = rand(1.2, 2.8);
    eye.scanElapsed = 0;
    eye.gazeSpeed = rand(5, 9);
    eye.targetOpenness = rand(0.85, 1.0);
    eye.targetLowerLidLift = rand(0.05, 0.18);
    eye.targetPupilScale = rand(0.36, 0.46);
    eye.behaviorTimer = eye.scanDuration + rand(0.3, 0.8);
  } else if (roll < 0.62) {
    eye.behavior = "squint";
    eye.targetPageX = rand(0, vw);
    eye.targetPageY = rand(0, vh);
    eye.gazeSpeed = rand(8, 14);
    eye.targetOpenness = rand(0.38, 0.55);
    eye.targetLowerLidLift = rand(0.25, 0.42);
    eye.targetPupilScale = rand(0.26, 0.34);
    eye.behaviorTimer = rand(1.1, 2.6);
  } else if (roll < 0.76) {
    eye.behavior = "wide";
    eye.targetPageX = rand(0, vw);
    eye.targetPageY = rand(0, vh);
    eye.gazeSpeed = rand(15, 25);
    eye.targetOpenness = rand(1.24, 1.38);
    eye.targetLowerLidLift = -0.08;
    eye.targetPupilScale = rand(0.54, 0.66);
    eye.behaviorTimer = rand(0.8, 1.9);
  } else if (roll < 0.88) {
    eye.behavior = "shifty";
    eye.targetPageX = rand(0, vw);
    eye.targetPageY = rand(0, vh);
    eye.gazeSpeed = 20;
    eye.targetOpenness = rand(0.75, 0.95);
    eye.targetLowerLidLift = rand(0.1, 0.22);
    eye.targetPupilScale = rand(0.35, 0.45);
    eye.behaviorTimer = rand(0.9, 1.8);
  } else if (roll < 0.95) {
    eye.behavior = "sleepy";
    eye.gazeSpeed = 3.5;
    eye.targetOpenness = rand(0.3, 0.48);
    eye.targetLowerLidLift = 0;
    eye.targetPupilScale = rand(0.42, 0.52);
    eye.behaviorTimer = rand(1.2, 2.4);
  } else {
    eye.behavior = "roll";
    eye.rollAngle = rand(0, Math.PI);
    eye.gazeSpeed = 10;
    eye.targetOpenness = rand(0.85, 1.05);
    eye.targetLowerLidLift = 0.08;
    eye.targetPupilScale = 0.4;
    eye.behaviorTimer = rand(1.0, 1.8);
  }
}

function triggerBlink(eye: EyeState) {
  const kind = Math.random();
  eye.blinkPhase = "closing";
  if (kind < 0.18) {
    eye.blinkSpeed = rand(16, 22);
    eye.blinkHoldTimer = 0.02;
    eye.pendingBlinks = 1;
  } else if (kind < 0.3) {
    eye.blinkSpeed = rand(7, 11);
    eye.blinkHoldTimer = rand(0.18, 0.42);
    eye.pendingBlinks = 0;
  } else {
    eye.blinkSpeed = rand(13, 19);
    eye.blinkHoldTimer = rand(0.02, 0.07);
    eye.pendingBlinks = 0;
  }
}

function updateEyeState(
  eye: EyeState,
  dt: number,
  cellCenterX: number,
  cellCenterY: number,
  cellSize: number,
  vw: number,
  vh: number,
  invMaxDist: number,
  invFalloffSpan: number,
  pointer: PointerState,
) {
  eye.behaviorTimer -= dt;
  if (eye.behaviorTimer <= 0) {
    pickNextBehavior(eye, vw, vh);
  }

  if (eye.behavior === "scan") {
    eye.scanElapsed = Math.min(eye.scanDuration, eye.scanElapsed + dt);
    const progress = eye.scanElapsed / Math.max(0.001, eye.scanDuration);
    const smooth = progress * progress * (3 - 2 * progress);
    eye.targetPageX = eye.scanStartX + (eye.scanEndX - eye.scanStartX) * smooth;
    eye.targetPageY = eye.scanStartY + (eye.scanEndY - eye.scanStartY) * smooth;
  } else if (eye.behavior === "shifty") {
    if (Math.random() < dt * 4.5) {
      eye.targetPageX = rand(0, vw);
      eye.targetPageY = rand(0, vh);
    }
  } else if (eye.behavior === "roll") {
    eye.rollAngle += dt * 3.8;
    eye.targetPageX = cellCenterX + Math.cos(eye.rollAngle) * vw * 0.45;
    eye.targetPageY =
      cellCenterY - Math.abs(Math.sin(eye.rollAngle)) * vh * 0.45;
  }

  // Convert autonomous site target point into local rotated normalized gaze (-1..1)
  const dx = eye.targetPageX - cellCenterX;
  const dy = eye.targetPageY - cellCenterY;
  const dist = Math.hypot(dx, dy);
  let desiredGazeX = 0;
  let desiredGazeY = 0;
  if (dist > 0.001) {
    const scale = Math.min(1, dist * invMaxDist) / dist;
    const ux = dx * scale;
    const uy = dy * scale;
    // Rotate by -tiltAngle using precomputed cosTilt / sinTilt
    desiredGazeX = ux * eye.cosTilt + uy * eye.sinTilt;
    desiredGazeY = -ux * eye.sinTilt + uy * eye.cosTilt;
  }

  let effectiveGazeSpeed = eye.gazeSpeed;
  let pokeFactor = 0;

  if (pointer.active) {
    const pdx = pointer.x - cellCenterX;
    const pdy = pointer.y - cellCenterY;
    const pointerDist = Math.hypot(pdx, pdy);

    const fullFocusDist = cellSize * 0.5;
    const normalizedDist = Math.min(
      1,
      Math.max(0, (pointerDist - fullFocusDist) * invFalloffSpan),
    );
    const pointerInfluence = 1 - Math.pow(normalizedDist, 1.1) * 0.65;

    // Local coordinates rotated by -eye.tiltAngle
    const localX = pdx * eye.cosTilt + pdy * eye.sinTilt;
    const localY = -pdx * eye.sinTilt + pdy * eye.cosTilt;

    let pointerGazeX = 0;
    let pointerGazeY = 0;
    if (pointerDist > 0.001) {
      const eyeRadius = Math.max(24, cellSize * 0.18);
      const pointerScale = Math.min(1, pointerDist / eyeRadius) / pointerDist;
      pointerGazeX = localX * pointerScale;
      pointerGazeY = localY * pointerScale;
    }

    desiredGazeX =
      desiredGazeX * (1 - pointerInfluence) + pointerGazeX * pointerInfluence;
    desiredGazeY =
      desiredGazeY * (1 - pointerInfluence) + pointerGazeY * pointerInfluence;
    effectiveGazeSpeed = eye.gazeSpeed + pointerInfluence * 14;

    const eyeRx = Math.max(16, cellSize * 0.31 * eye.scale);
    const eyeRy = Math.max(10, eyeRx * eye.aspectRatio);
    const ellipseDist = Math.hypot(localX / eyeRx, localY / eyeRy);

    if (ellipseDist < 1.45) {
      const rawPoke = Math.min(1, (1.45 - ellipseDist) * 1.25);
      pokeFactor = rawPoke * rawPoke * (3 - 2 * rawPoke);
    }
  }

  const gazeLerp = 1 - Math.exp(-effectiveGazeSpeed * dt);
  eye.gazeX += (desiredGazeX - eye.gazeX) * gazeLerp;
  eye.gazeY += (desiredGazeY - eye.gazeY) * gazeLerp;

  const squintOpenness = 0.15;
  const effectiveTargetLowerLidLift =
    eye.targetLowerLidLift + (0.45 - eye.targetLowerLidLift) * pokeFactor;
  const effectiveTargetOpenness =
    eye.targetOpenness * (1 - pokeFactor) + squintOpenness * pokeFactor;

  const pupilLerp = 1 - Math.exp(-8 * dt);
  eye.pupilScale += (eye.targetPupilScale - eye.pupilScale) * pupilLerp;
  eye.lowerLidLift +=
    (effectiveTargetLowerLidLift - eye.lowerLidLift) *
    (1 - Math.exp(-(8 + pokeFactor * 10) * dt));

  if (eye.blinkPhase === "none" || pokeFactor > 0.05) {
    if (pokeFactor > 0.25) {
      eye.blinkPhase = "none";
    }
    const lidLerp = 1 - Math.exp(-(9 + pokeFactor * 14) * dt);
    eye.openness += (effectiveTargetOpenness - eye.openness) * lidLerp;

    eye.nextBlinkIn -= dt;
    if (eye.nextBlinkIn <= 0 && pokeFactor < 0.2) {
      triggerBlink(eye);
      eye.nextBlinkIn = rand(1.4, 5.2);
    }
  } else if (eye.blinkPhase === "closing") {
    eye.openness -= eye.blinkSpeed * dt;
    if (eye.openness <= 0) {
      eye.openness = 0;
      eye.blinkPhase = "closed";
    }
  } else if (eye.blinkPhase === "closed") {
    eye.blinkHoldTimer -= dt;
    if (eye.blinkHoldTimer <= 0) {
      eye.blinkPhase = "opening";
    }
  } else if (eye.blinkPhase === "opening") {
    eye.openness += eye.blinkSpeed * 0.9 * dt;
    if (eye.openness >= effectiveTargetOpenness) {
      eye.openness = effectiveTargetOpenness;
      if (eye.pendingBlinks > 0) {
        eye.pendingBlinks -= 1;
        eye.blinkPhase = "closing";
        eye.blinkHoldTimer = 0.02;
      } else {
        eye.blinkPhase = "none";
      }
    }
  }
}

function tracePolygonRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  cosTable: Float32Array,
  sinTable: Float32Array,
  jitter: number,
) {
  const sides = cosTable.length;
  const startX = cx + cosTable[0] * rx + jitterOffset(jitter);
  const startY = cy + sinTable[0] * ry + jitterOffset(jitter);
  ctx.moveTo(startX, startY);
  for (let i = 1; i < sides; i++) {
    ctx.lineTo(
      cx + cosTable[i] * rx + jitterOffset(jitter),
      cy + sinTable[i] * ry + jitterOffset(jitter),
    );
  }
  ctx.lineTo(startX, startY);
}

function drawEye(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  minDim: number,
  eye: EyeState,
  reducedMotion: boolean,
) {
  const rx = minDim * 0.31 * eye.scale;
  const maxRy = rx * eye.aspectRatio;
  const jitter = reducedMotion ? 0 : Math.max(1.2, minDim * 0.011);

  ctx.save();
  ctx.transform(eye.cosTilt, eye.sinTilt, -eye.sinTilt, eye.cosTilt, cx, cy);

  const gazeFollowY = eye.gazeY * maxRy * 0.22;
  const closedMeetY =
    maxRy * (0.18 - eye.lowerLidLift * 0.4) + gazeFollowY * 0.55;
  const openUpperY = -maxRy + gazeFollowY;
  const openLowerY =
    maxRy * (0.72 - eye.lowerLidLift * 0.55) + gazeFollowY * 0.5;

  const clampedOpenness = Math.max(0, Math.min(1.38, eye.openness));
  const upperArchY =
    clampedOpenness <= 0.02
      ? closedMeetY
      : closedMeetY + (openUpperY - closedMeetY) * clampedOpenness;

  const actualLowerArchY =
    clampedOpenness <= 0.02
      ? closedMeetY
      : closedMeetY +
        (openLowerY - closedMeetY) * Math.min(1, clampedOpenness * 1.15);

  const baseCornerY = gazeFollowY * 0.15;
  const leftX = -rx + jitterOffset(jitter);
  const leftY = baseCornerY + jitterOffset(jitter);
  const rightX = rx + jitterOffset(jitter);
  const rightY = baseCornerY + jitterOffset(jitter);

  UPPER_LID_PTS[0] = leftX;
  UPPER_LID_PTS[1] = leftY;
  LOWER_LID_PTS[0] = leftX;
  LOWER_LID_PTS[1] = leftY;

  const lastIdx = (LID_COUNT - 1) * 2;
  UPPER_LID_PTS[lastIdx] = rightX;
  UPPER_LID_PTS[lastIdx + 1] = rightY;
  LOWER_LID_PTS[lastIdx] = rightX;
  LOWER_LID_PTS[lastIdx + 1] = rightY;

  const cornerSpanY = rightY - leftY;
  for (let i = 1; i < LID_COUNT - 1; i++) {
    const xBase = LID_T[i] * rx;
    const arch = LID_ARCH[i];
    const cornerY = leftY + cornerSpanY * LID_LERP[i];
    const idx = i * 2;

    UPPER_LID_PTS[idx] = xBase + jitterOffset(jitter);
    UPPER_LID_PTS[idx + 1] =
      cornerY + (upperArchY - cornerY) * arch + jitterOffset(jitter);

    LOWER_LID_PTS[idx] = xBase + jitterOffset(jitter);
    LOWER_LID_PTS[idx + 1] =
      cornerY + (actualLowerArchY - cornerY) * arch + jitterOffset(jitter);
  }

  // Draw iris and pupil clipped to the open eye aperture polygon
  const isEyeOpen = eye.openness > 0.05 && actualLowerArchY - upperArchY > 2;
  if (isEyeOpen) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(UPPER_LID_PTS[0], UPPER_LID_PTS[1]);
    for (let i = 1; i < LID_COUNT; i++) {
      ctx.lineTo(UPPER_LID_PTS[i * 2], UPPER_LID_PTS[i * 2 + 1]);
    }
    for (let i = LID_COUNT - 2; i >= 1; i--) {
      ctx.lineTo(LOWER_LID_PTS[i * 2], LOWER_LID_PTS[i * 2 + 1]);
    }
    ctx.closePath();
    ctx.clip();

    const pupilX = eye.gazeX * rx * 0.48;
    const pupilY = eye.gazeY * maxRy * 0.52;
    const irisRadius = maxRy * 0.68;
    const pupilRadius = irisRadius * eye.pupilScale;

    ctx.beginPath();
    tracePolygonRing(
      ctx,
      pupilX,
      pupilY,
      irisRadius * 0.95,
      irisRadius,
      IRIS_COS,
      IRIS_SIN,
      jitter * 0.9,
    );
    tracePolygonRing(
      ctx,
      pupilX,
      pupilY,
      pupilRadius * 0.95,
      pupilRadius,
      PUPIL_COS,
      PUPIL_SIN,
      jitter * 0.85,
    );
    ctx.stroke();
    ctx.restore();
  }

  // Batch upper lid, lower lid, upper crease, and lower crease into a single stroke call
  ctx.beginPath();

  // Upper eyelid rim
  ctx.moveTo(UPPER_LID_PTS[0], UPPER_LID_PTS[1]);
  for (let i = 1; i < LID_COUNT; i++) {
    ctx.lineTo(UPPER_LID_PTS[i * 2], UPPER_LID_PTS[i * 2 + 1]);
  }

  // Lower eyelid rim
  if (eye.openness > 0.04) {
    ctx.moveTo(LOWER_LID_PTS[0], LOWER_LID_PTS[1]);
    for (let i = 1; i < LID_COUNT; i++) {
      ctx.lineTo(LOWER_LID_PTS[i * 2], LOWER_LID_PTS[i * 2 + 1]);
    }
  }

  // Upper eyelid crease / fold
  const socketTopY = -maxRy * 1.28 + gazeFollowY * 0.35;
  const creasePeakY =
    socketTopY + (upperArchY - socketTopY) * 0.32 - maxRy * 0.14;
  const creaseBaseY = upperArchY * 0.25;
  const creaseRx = rx * 0.96;
  for (let i = 0; i < CREASE_COUNT; i++) {
    const px = CREASE_T[i] * creaseRx + jitterOffset(jitter);
    const py =
      creaseBaseY + creasePeakY * CREASE_ARCH[i] + jitterOffset(jitter);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }

  // Lower eyelid crease / bag line
  const lowerCreasePeakY = actualLowerArchY + maxRy * 0.28;
  const lowerCreaseBaseY = actualLowerArchY * 0.4;
  const lowerCreaseRx = rx * 0.85;
  const lowerJitter = jitter * 0.9;
  for (let i = 0; i < LOWER_CREASE_COUNT; i++) {
    const px = LOWER_CREASE_T[i] * lowerCreaseRx + jitterOffset(lowerJitter);
    const py =
      lowerCreaseBaseY +
      lowerCreasePeakY * LOWER_CREASE_ARCH[i] +
      jitterOffset(lowerJitter);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }

  ctx.stroke();
  ctx.restore();
}

function getGridSizeForWidth(vw: number): number {
  if (vw < 640) return 2;
  if (vw < 1024) return 3;
  return 4;
}

export const NotFoundEyes = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let vw = window.innerWidth || 1024;
    let vh = window.innerHeight || 768;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let gridSize = getGridSizeForWidth(vw);
    let cellWidth = vw / gridSize;
    let cellHeight = vh / gridSize;
    let cellSize = Math.min(cellWidth, cellHeight);
    let invMaxDist = 1 / Math.max(1, Math.hypot(vw, vh) * 0.45);
    let invFalloffSpan = 1 / Math.max(1, Math.hypot(vw, vh) * 0.75);
    let strokeColor = getComputedStyle(container).color;

    const eyes = Array.from({ length: TOTAL_EYES }, () =>
      createInitialEyeState(vw, vh),
    );

    const pointer: PointerState = {
      x: 0,
      y: 0,
      active: false,
    };

    const syncLayoutAndStyles = () => {
      vw = window.innerWidth || 1024;
      vh = window.innerHeight || 768;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      gridSize = getGridSizeForWidth(vw);
      cellWidth = vw / gridSize;
      cellHeight = vh / gridSize;
      cellSize = Math.min(cellWidth, cellHeight);
      const diag = Math.hypot(vw, vh);
      invMaxDist = 1 / Math.max(1, diag * 0.45);
      invFalloffSpan = 1 / Math.max(1, diag * 0.75);
      strokeColor = getComputedStyle(container).color;

      const targetW = Math.max(1, Math.floor(vw * dpr));
      const targetH = Math.max(1, Math.floor(vh * dpr));
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };

    const handlePointerDown = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        pointer.active = false;
      }
    };

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let prefersReducedMotion = reducedMotionQuery.matches;
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
    };

    const darkSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleColorSchemeChange = () => {
      strokeColor = getComputedStyle(container).color;
    };

    let animationFrameId = 0;
    let lastTime = performance.now();

    const render = (now: number) => {
      if (document.hidden) {
        animationFrameId = 0;
        return;
      }

      const elapsedMs = now - lastTime;
      if (elapsedMs < FRAME_INTERVAL_MS) {
        animationFrameId = window.requestAnimationFrame(render);
        return;
      }

      const dt = Math.min(0.1, elapsedMs / 1000);
      lastTime = now;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vw, vh);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const activeEyes = gridSize * gridSize;
      for (let i = 0; i < activeEyes; i++) {
        const col = i % gridSize;
        const row = (i / gridSize) | 0;
        const cellCenterX = (col + 0.5) * cellWidth;
        const cellCenterY = (row + 0.5) * cellHeight;

        const eye = eyes[i];
        updateEyeState(
          eye,
          dt,
          cellCenterX,
          cellCenterY,
          cellSize,
          vw,
          vh,
          invMaxDist,
          invFalloffSpan,
          pointer,
        );

        drawEye(
          ctx,
          cellCenterX,
          cellCenterY,
          cellSize,
          eye,
          prefersReducedMotion,
        );
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameId !== 0) {
          window.cancelAnimationFrame(animationFrameId);
          animationFrameId = 0;
        }
      } else if (animationFrameId === 0) {
        lastTime = performance.now();
        animationFrameId = window.requestAnimationFrame(render);
      }
    };

    syncLayoutAndStyles();
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    darkSchemeQuery.addEventListener("change", handleColorSchemeChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", syncLayoutAndStyles);
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });
    window.addEventListener("pointercancel", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);
    document.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("mouseout", handleMouseOut);

    if (!document.hidden) {
      animationFrameId = window.requestAnimationFrame(render);
    }

    return () => {
      if (animationFrameId !== 0) {
        window.cancelAnimationFrame(animationFrameId);
      }
      reducedMotionQuery.removeEventListener(
        "change",
        handleReducedMotionChange,
      );
      darkSchemeQuery.removeEventListener("change", handleColorSchemeChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", syncLayoutAndStyles);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointercancel", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      document.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 text-slate-900/25 dark:text-slate-100/25"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
};
