/**
 * The pixel chameleon's model, shared by the hero (components/sections/Chameleon.tsx) and the small
 * sprites in other sections (components/ui/MiniChameleon.tsx).
 *
 * The animal is built from ellipses and capsules in a low-res grid, facing right (it is mirrored when
 * drawn), shaded with a fake light and dithered into a seven-step ramp. A pose only moves parts:
 * "step" swaps the legs for the second frame of a walk, "sleep" lowers the body onto the branch,
 * folds the legs and tightens the tail, and "wake" is the halfway point between sleeping and standing
 * (the body half raised, the legs half unfolded) for the frames of waking up.
 */

export type Tag = "far" | "leaf" | "bark" | "skin" | "body" | "snout" | "eye";
export type Hit = { h: number; nx: number; ny: number } | null;
export type Cell = { t: number; tag: Tag };
export type Part = { tag: Tag; flora?: boolean; fn: (x: number, y: number) => Hit };
export type Pose = "stand" | "step" | "sleep" | "wake";
/** "half" is an eye with the lid still half down. */
export type Eye = "open" | "half" | "shut" | "happy";

export const RAMPS = {
  dark: ["#0e1a12", "#1f3a2a", "#3d6b4c", "#6e9d73", "#9cc39e", "#d5e6d3", "#f2f2ea"],
  light: ["#1d251f", "#2c382e", "#3f5643", "#5f8163", "#7fa383", "#a5c0a5", "#c4d6c2"],
};
export const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
/** Hue shift of the skin, in degrees from the moss green: green, amber, teal, pink, purple. */
export const SKINS = [0, -80, 70, 215, 150];

export const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
export const rgba = (c: number[], a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/** Rotates the hue of an RGB colour (done by hand: canvas filters do not work in Safari). */
export function rotateHue(rgb: number[], deg: number) {
  const [r, g, b] = rgb.map((v) => v / 255), max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  if (!d || !deg) return rgb;
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = (((h * 60 + deg) % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const out = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return out.map((v) => Math.round((v + m) * 255));
}

export function ell(x: number, y: number, cx: number, cy: number, rx: number, ry: number, rot = 0): Hit {
  const c = Math.cos(rot), s = Math.sin(rot), dx = x - cx, dy = y - cy;
  const u = (dx * c + dy * s) / rx, v = (-dx * s + dy * c) / ry, d = u * u + v * v;
  return d >= 1 ? null : { h: Math.sqrt(1 - d), nx: u * c - v * s, ny: u * s + v * c };
}
export function cap(x: number, y: number, x1: number, y1: number, x2: number, y2: number, r1: number, r2: number): Hit {
  const vx = x2 - x1, vy = y2 - y1, len2 = vx * vx + vy * vy || 1;
  const t = Math.max(0, Math.min(1, ((x - x1) * vx + (y - y1) * vy) / len2));
  const r = r1 + (r2 - r1) * t, dx = x - (x1 + vx * t), dy = y - (y1 + vy * t), d = Math.hypot(dx, dy) / r;
  return d >= 1 ? null : { h: Math.sqrt(1 - d * d), nx: dx / r, ny: dy / r };
}
export function tri(x: number, y: number, a: number[], b: number[], c: number[]): Hit {
  const side = (p: number[], q: number[], r: number[]) => (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1]);
  const p = [x, y], d1 = side(p, a, b), d2 = side(p, b, c), d3 = side(p, c, a);
  return (d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0) ? null : { h: 0.75, nx: 0.25, ny: -0.2 };
}

// A leg is a chain of capsules: [x1, y1, x2, y2, r1, r2]. ff / fh are the far pair, nf / nh the near pair.
type Leg = number[][];
const LEGS: Record<Pose, { ff: Leg; fh: Leg; nf: Leg; nh: Leg }> = {
  stand: {
    ff: [[82, 51, 87, 60, 3, 2.5], [87, 60, 86, 68.5, 2.5, 2.1]],
    fh: [[42, 52, 37, 60, 3, 2.5], [37, 60, 39, 68.5, 2.5, 2.1]],
    nf: [[78, 51, 73, 60, 3.3, 2.7], [73, 60, 79, 68, 2.7, 2.2], [76.5, 69.3, 82, 69.3, 2, 1.8]],
    nh: [[46, 52, 52, 61, 3.4, 2.8], [52, 61, 45.5, 68, 2.8, 2.2], [43, 69.2, 48.5, 69.2, 2, 1.8]],
  },
  step: {
    ff: [[82, 51, 78, 60, 3, 2.5], [78, 60, 75, 68.5, 2.5, 2.1]],
    fh: [[42, 52, 47, 60, 3, 2.5], [47, 60, 50, 68.5, 2.5, 2.1]],
    nf: [[78, 51, 84, 60, 3.3, 2.7], [84, 60, 86, 68, 2.7, 2.2], [84, 69.3, 89.5, 69.3, 2, 1.8]],
    nh: [[46, 52, 43, 61, 3.4, 2.8], [43, 61, 38, 68, 2.8, 2.2], [35.5, 69.2, 41, 69.2, 2, 1.8]],
  },
  wake: {
    ff: [[82, 56, 85, 63, 3, 2.5], [85, 63, 86, 68.5, 2.5, 2.1]],
    fh: [[42, 57, 39, 63, 3, 2.5], [39, 63, 40, 68.5, 2.5, 2.1]],
    nf: [[79, 57, 77, 63, 3.2, 2.6], [77, 63, 81, 68, 2.6, 2.2], [79, 69.3, 84.5, 69.3, 2, 1.8]],
    nh: [[47, 57.5, 50, 63, 3.3, 2.7], [50, 63, 45, 68, 2.7, 2.2], [42.5, 69.2, 48, 69.2, 2, 1.8]],
  },
  sleep: {
    ff: [],
    fh: [],
    nf: [[80, 63, 86, 67.5, 3, 2.4], [84, 69.3, 90, 69.3, 2, 1.8]],
    nh: [[48, 63, 42, 67.5, 3, 2.4], [40, 69.2, 46, 69.2, 2, 1.8]],
  },
};
const leg = (segments: Leg) => (x: number, y: number): Hit => {
  for (const s of segments) { const r = cap(x, y, s[0], s[1], s[2], s[3], s[4], s[5]); if (r) return r; }
  return null;
};

/** How far a pose lowers the body and the head (the eye and the skin pattern move with it). */
export const poseDrop = (pose: Pose) => (pose === "sleep" ? 9 : pose === "wake" ? 4.5 : 0);

/**
 * The animal's parts, back to front, split around the place where the hero puts its branch:
 * the far legs go behind the branch, everything else in front of it.
 */
export function animalParts(pose: Pose): { far: Part[]; near: Part[] } {
  const legs = LEGS[pose], d = poseDrop(pose);
  // The tail is a spiral of capsules; asleep it is curled tighter so it stays on the branch.
  const k = pose === "sleep" ? 0.5 : pose === "wake" ? 0.75 : 1;
  const tcx = pose === "sleep" ? 25.8 : pose === "wake" ? 23.4 : 21, tcy = pose === "sleep" ? 60.9 : pose === "wake" ? 58.7 : 56.5;
  const tail: number[][] = [];
  let prev: number[] | null = null;
  for (let i = 0; i <= 70; i++) {
    const s = i / 70, ang = ((-50 - s * 1.6 * 360) * Math.PI) / 180, r = k * 15 * Math.pow(1 - s, 0.85) + 1.3;
    const p = [tcx + r * Math.cos(ang), tcy + r * Math.sin(ang), (4.7 - s * 3.5) * (k < 1 ? 0.85 : 1)];
    if (prev) tail.push([prev[0], prev[1], p[0], p[1], prev[2], p[2]]);
    prev = p;
  }
  return {
    far: [
      { tag: "far", fn: leg(legs.ff) },
      { tag: "far", fn: leg(legs.fh) },
    ],
    near: [
      { tag: "skin", fn: leg(tail) },
      { tag: "skin", fn: (x, y) => cap(x, y, 39, 45 + d, 31.5, 45.2 + d, 7.5, 4.8) },
      { tag: "body", fn: (x, y) => ell(x, y, 60, 43 + d, 26, 15, -0.05) },
      { tag: "body", fn: (x, y) => ell(x, y, 58, 37.5 + d, 19, 9.5) },
      { tag: "skin", fn: (x, y) => ell(x, y, 83, 49 + d, 9, 6.2) },
      { tag: "skin", fn: (x, y) => tri(x, y, [78, 40 + d], [84.5, 17.5 + d], [101, 36 + d]) },
      { tag: "skin", fn: (x, y) => ell(x, y, 91.5, 40 + d, 11, 9.2) },
      { tag: "snout", fn: (x, y) => cap(x, y, 96, 42 + d, 106.5, 44.2 + d, 5.4, 2.4) },
      { tag: "skin", fn: leg(legs.nf) },
      { tag: "skin", fn: leg(legs.nh) },
      { tag: "eye", fn: (x, y) => ell(x, y, 94.5, 38.5 + d, 5.2, 5.2) },
    ],
  };
}

const LIGHT = (() => {
  const v = [0.38, -0.62, 0.68], n = Math.hypot(v[0], v[1], v[2]);
  return v.map((k) => k / n);
})();

/** Brightness (0…1 along the ramp) of one hit cell. `drop` is the pose's poseDrop. */
export function shade(hit: NonNullable<Hit>, tag: Tag, x: number, y: number, rnd: () => number, drop = 0): number {
  const light = Math.max(0, hit.nx * LIGHT[0] + hit.ny * LIGHT[1] + hit.h * LIGHT[2]);
  if (tag === "bark") return 0.05 + 0.24 * light + (rnd() - 0.5) * 0.08 + (Math.sin(x * 1.7) > 0.6 ? -0.04 : 0);
  if (tag === "leaf") return 0.22 + 0.34 * light;
  if (tag === "far") return 0.1 + 0.22 * light;
  if (tag === "eye") return 0.36 + 0.52 * light - (hit.h < 0.55 ? 0.16 : 0);
  let t = 0.2 + 0.62 * light + 0.045 * Math.sin(x * 0.85 + y * 0.45) + (rnd() - 0.5) * 0.05;
  if (tag === "body") {
    if (Math.abs(y - drop - 46.5) < 1.6 && (x + 200) % 7 < 3.2) t += 0.2; // pale flank patches
    if (Math.sin(x * 0.42 + 1) > 0.72 && y - drop < 44) t -= 0.1; // dark saddle bands
  }
  if (tag === "snout" && Math.floor(y - drop) === 46 && x > 96) t -= 0.3; // mouth line
  return t;
}

/** Adds the dorsal crest: one skin pixel above the back every third column. `x0` is the model x of column 0. */
export function addCrest(cells: (Cell | null)[], w: number, h: number, x0: number) {
  for (let x = 40; x <= 80; x += 3) {
    const i = x - x0;
    for (let j = 1; j < h; j++) {
      const c = cells[j * w + i];
      if (c && c.tag === "body") { if (!cells[(j - 1) * w + i]) cells[(j - 1) * w + i] = { t: 0.45, tag: "skin" }; break; }
    }
  }
}

// ---- the small sprite: the animal alone, 114 × 60 cells, facing left ----
export const MINI_W = 114;
export const MINI_H = 60;
const MINI_Y0 = 14;
const miniCells = new Map<Pose, (Cell | null)[]>();

function buildMini(pose: Pose) {
  const cached = miniCells.get(pose);
  if (cached) return cached;
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const { far, near } = animalParts(pose), parts = [...far, ...near], drop = poseDrop(pose);
  const cells: (Cell | null)[] = new Array(MINI_W * MINI_H).fill(null);
  for (let j = 0; j < MINI_H; j++) {
    for (let i = 0; i < MINI_W; i++) {
      const x = i + 0.5, y = MINI_Y0 + j + 0.5;
      let hit: Hit = null, tag: Tag = "skin";
      for (const part of parts) { const r = part.fn(x, y); if (r) { hit = r; tag = part.tag; } }
      if (hit) cells[j * MINI_W + i] = { t: shade(hit, tag, x, y, rnd, drop), tag };
    }
  }
  addCrest(cells, MINI_W, MINI_H, 0);
  miniCells.set(pose, cells);
  return cells;
}

export type MiniOptions = { pose: Pose; eye: Eye; dark: boolean; hue: number; /** Where the pupil looks, each −1…1. */ look?: readonly [number, number] };

const sprites = new Map<string, HTMLCanvasElement>();
const MAX_SPRITES = 96; // a hue sweep bakes a sprite per step: keep the newest ones only

/** A cached canvas (two device pixels per cell) with the animal in the given pose, theme and skin hue. */
export function miniSprite({ pose, eye, dark, hue: rawHue, look = [-0.7, 0.1] }: MiniOptions): HTMLCanvasElement {
  const hue = ((Math.round(rawHue / 3) * 3) % 360 + 360) % 360; // 3° steps: a sweep reuses sprites, and the eye cannot tell
  const key = `${pose}|${eye}|${dark}|${hue}|${look[0]}|${look[1]}`;
  const cached = sprites.get(key);
  if (cached) return cached;
  const S = 2, cells = buildMini(pose), drop = poseDrop(pose);
  const ramp = (dark ? RAMPS.dark : RAMPS.light).map(hex).map((c) => rotateHue(c, hue));
  const at = (t: number) => {
    const v = Math.max(0, Math.min(1, t)) * (ramp.length - 1), i = Math.min(ramp.length - 2, Math.floor(v));
    return rgba(mix(ramp[i], ramp[i + 1], v - i));
  };
  const canvas = document.createElement("canvas");
  canvas.width = MINI_W * S; canvas.height = MINI_H * S;
  const g = canvas.getContext("2d")!;
  for (let j = 0; j < MINI_H; j++) {
    for (let i = 0; i < MINI_W; i++) {
      const c = cells[j * MINI_W + i];
      if (!c) continue;
      const col = MINI_W - 1 - i; // mirrored: the model faces right, the sprite left
      g.fillStyle = at((dark ? c.t : c.t * 0.78 + 0.02) + (BAYER[(j + MINI_Y0) & 3][col & 3] / 16 - 0.5) * 0.16);
      g.fillRect(col * S, j * S, S, S);
    }
  }
  // The eye: a pupil that looks somewhere, a closed lid, or the upward arc of a pleased squint.
  const ecx = MINI_W - 94.5, ecy = 38.5 + drop - MINI_Y0, pcx = ecx + look[0] * 1.9, pcy = ecy + look[1] * 1.9;
  for (let j = Math.floor(ecy) - 5; j <= Math.floor(ecy) + 5; j++) {
    for (let i = Math.floor(ecx) - 5; i <= Math.floor(ecx) + 5; i++) {
      const cx = i + 0.5, cy = j + 0.5, r = Math.hypot(cx - ecx, cy - ecy);
      if (r > 5.2) continue;
      let fill: string | null = null;
      if (eye === "shut") fill = at(j === Math.floor(ecy) ? (dark ? 0.15 : 0.05) : dark ? 0.55 : 0.42);
      else if (eye === "half" && cy < ecy + 0.3) fill = at(Math.abs(cy - (ecy + 0.3)) < 0.6 ? (dark ? 0.15 : 0.05) : dark ? 0.55 : 0.42); // the lid, with its edge
      else if (eye === "happy") fill = at(Math.abs(r - 2.6) < 0.75 && cy < ecy + 0.6 ? (dark ? 0.12 : 0.04) : dark ? 0.55 : 0.42);
      else if (Math.hypot(cx - pcx, cy - pcy) < 1.75) fill = i === Math.floor(pcx - 0.9) && j === Math.floor(pcy - 0.9) ? "rgb(250,250,244)" : dark ? "rgb(8,12,9)" : "rgb(20,26,21)";
      if (fill) { g.fillStyle = fill; g.fillRect(i * S, j * S, S, S); }
    }
  }
  sprites.set(key, canvas);
  if (sprites.size > MAX_SPRITES) sprites.delete(sprites.keys().next().value as string);
  return canvas;
}
