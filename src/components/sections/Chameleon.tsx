"use client";

import { useEffect, useRef, type RefObject } from "react";
import { addBug, readBugs } from "@/lib/bugs";
import { useUI } from "@/lib/i18n";

/**
 * The hero mascot: a pixel chameleon on a branch under the system diagram. Its eye follows the
 * pointer, a click on a bug makes it catch the bug with its tongue, a click on empty space nearby
 * is a miss, and after every fifth bug it takes a short break to digest. The tally is kept between
 * visits (lib/bugs.ts), and every tenth bug earns a burst of pixels and a new skin colour.
 *
 * The animal is modelled once from ellipses and capsules in a low-res grid (facing right, mirrored
 * when drawn), shaded with a fake light, then baked into two sprites per theme and cell size. The
 * canvas covers the whole hero so bugs can fly over the text and the diagram; it never takes
 * pointer events, the hero section listens instead.
 */

type Tag = "far" | "leaf" | "bark" | "skin" | "body" | "snout" | "eye";
type Hit = { h: number; nx: number; ny: number } | null;
type Cell = { t: number; tag: Tag };
type Bug = { x: number; y: number; a: number; wob: number; state: "sit" | "fly" | "caught" | "gone"; until: number; tx: number; ty: number; v: number; giveUp: number };
type Shot = { bug: Bug | null; t0: number; x: number; y: number };

const GX0 = -260; // the branch runs far to the right on screen, off the edge of the hero
const GX1 = 124;
const GH = 84;
const GW = GX1 - GX0;
const ANIMAL_COLS = 140; // sprite columns that can hold the animal and its dust
const FULL_EVERY = 5;
const SKIN_EVERY = 10;
// Hue shift of the skin, in degrees from the moss green: green, amber, teal, pink, purple.
const SKINS = [0, -80, 70, 215, 150];
const FULL_MS = 4000;
const ASSEMBLE_MS = 1800;
const MAX_CELL = 3.5;
const PERCH_COLS = 135;

const RAMPS = {
  dark: ["#0e1a12", "#1f3a2a", "#3d6b4c", "#6e9d73", "#9cc39e", "#d5e6d3", "#f2f2ea"],
  light: ["#1d251f", "#2c382e", "#3f5643", "#5f8163", "#7fa383", "#a5c0a5", "#c4d6c2"],
};
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
const BUG = ["..b.b..", "ww.b.ww", "wwbbbww", "l.bbb.l", ".lbbbl.", "l.bbb.l", "...b..."];

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgba = (c: number[], a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Rotates the hue of an RGB colour (done by hand: canvas filters do not work in Safari). */
function rotateHue(rgb: number[], deg: number) {
  const [r, g, b] = rgb.map((v) => v / 255), max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  if (!d || !deg) return rgb;
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = (((h * 60 + deg) % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const out = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return out.map((v) => Math.round((v + m) * 255));
}

function ell(x: number, y: number, cx: number, cy: number, rx: number, ry: number, rot = 0): Hit {
  const c = Math.cos(rot), s = Math.sin(rot), dx = x - cx, dy = y - cy;
  const u = (dx * c + dy * s) / rx, v = (-dx * s + dy * c) / ry, d = u * u + v * v;
  return d >= 1 ? null : { h: Math.sqrt(1 - d), nx: u * c - v * s, ny: u * s + v * c };
}
function cap(x: number, y: number, x1: number, y1: number, x2: number, y2: number, r1: number, r2: number): Hit {
  const vx = x2 - x1, vy = y2 - y1, len2 = vx * vx + vy * vy || 1;
  const t = Math.max(0, Math.min(1, ((x - x1) * vx + (y - y1) * vy) / len2));
  const r = r1 + (r2 - r1) * t, dx = x - (x1 + vx * t), dy = y - (y1 + vy * t), d = Math.hypot(dx, dy) / r;
  return d >= 1 ? null : { h: Math.sqrt(1 - d * d), nx: dx / r, ny: dy / r };
}
function tri(x: number, y: number, a: number[], b: number[], c: number[]): Hit {
  const side = (p: number[], q: number[], r: number[]) => (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1]);
  const p = [x, y], d1 = side(p, a, b), d2 = side(p, b, c), d3 = side(p, c, a);
  return (d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0) ? null : { h: 0.75, nx: 0.25, ny: -0.2 };
}

let model: { cells: (Cell | null)[]; dust: Float32Array } | null = null;

function buildModel() {
  if (model) return model;
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  const tail: number[][] = [];
  let prev: number[] | null = null;
  for (let i = 0; i <= 70; i++) {
    const s = i / 70, ang = ((-50 - s * 1.6 * 360) * Math.PI) / 180, r = 15 * Math.pow(1 - s, 0.85) + 1.3;
    const p = [21 + r * Math.cos(ang), 56.5 + r * Math.sin(ang), 4.7 - s * 3.5];
    if (prev) tail.push([prev[0], prev[1], p[0], p[1], prev[2], p[2]]);
    prev = p;
  }
  // Painted back to front; `flora` parts are the only ones that exist far from the animal.
  const parts: { tag: Tag; flora?: boolean; fn: (x: number, y: number) => Hit }[] = [
    { tag: "far", fn: (x, y) => cap(x, y, 82, 51, 87, 60, 3, 2.5) || cap(x, y, 87, 60, 86, 68.5, 2.5, 2.1) },
    { tag: "far", fn: (x, y) => cap(x, y, 42, 52, 37, 60, 3, 2.5) || cap(x, y, 37, 60, 39, 68.5, 2.5, 2.1) },
    { tag: "leaf", flora: true, fn: (x, y) => ell(x, y, 0, 53, 6.5, 3, -0.7) || ell(x, y, 113, 64.5, 6, 2.6, 0.5) || ell(x, y, -40, 62, 7, 3, 0.6) },
    { tag: "bark", flora: true, fn: (x, y) => cap(x, y, 118, 72, -262, 68, 2.6, 4.4) || cap(x, y, 9, 70, 2, 57, 1.5, 0.9) || cap(x, y, -36, 69, -39, 64, 1.4, 0.9) },
    { tag: "skin", fn: (x, y) => { for (const s of tail) { const r = cap(x, y, s[0], s[1], s[2], s[3], s[4], s[5]); if (r) return r; } return null; } },
    { tag: "skin", fn: (x, y) => cap(x, y, 39, 45, 31.5, 45.2, 7.5, 4.8) },
    { tag: "body", fn: (x, y) => ell(x, y, 60, 43, 26, 15, -0.05) },
    { tag: "body", fn: (x, y) => ell(x, y, 58, 37.5, 19, 9.5) },
    { tag: "skin", fn: (x, y) => ell(x, y, 83, 49, 9, 6.2) },
    { tag: "skin", fn: (x, y) => tri(x, y, [78, 40], [84.5, 17.5], [101, 36]) },
    { tag: "skin", fn: (x, y) => ell(x, y, 91.5, 40, 11, 9.2) },
    { tag: "snout", fn: (x, y) => cap(x, y, 96, 42, 106.5, 44.2, 5.4, 2.4) },
    { tag: "skin", fn: (x, y) => cap(x, y, 78, 51, 73, 60, 3.3, 2.7) || cap(x, y, 73, 60, 79, 68, 2.7, 2.2) || cap(x, y, 76.5, 69.3, 82, 69.3, 2, 1.8) },
    { tag: "skin", fn: (x, y) => cap(x, y, 46, 52, 52, 61, 3.4, 2.8) || cap(x, y, 52, 61, 45.5, 68, 2.8, 2.2) || cap(x, y, 43, 69.2, 48.5, 69.2, 2, 1.8) },
    { tag: "eye", fn: (x, y) => ell(x, y, 94.5, 38.5, 5.2, 5.2) },
  ];
  const lv = [0.38, -0.62, 0.68], ln = Math.hypot(lv[0], lv[1], lv[2]), light = lv.map((k) => k / ln);

  const cells: (Cell | null)[] = new Array(GW * GH).fill(null);
  for (let j = 0; j < GH; j++) {
    for (let i = 0; i < GW; i++) {
      const x = GX0 + i + 0.5, y = j + 0.5;
      let hit: Hit = null, tag: Tag = "skin";
      for (const part of parts) {
        if (x < -14 && !part.flora) continue;
        const r = part.fn(x, y);
        if (r) { hit = r; tag = part.tag; }
      }
      if (!hit) continue;
      const shade = Math.max(0, hit.nx * light[0] + hit.ny * light[1] + hit.h * light[2]);
      let t: number;
      if (tag === "bark") t = 0.05 + 0.24 * shade + (rnd() - 0.5) * 0.08 + (Math.sin(x * 1.7) > 0.6 ? -0.04 : 0);
      else if (tag === "leaf") t = 0.22 + 0.34 * shade;
      else if (tag === "far") t = 0.1 + 0.22 * shade;
      else if (tag === "eye") t = 0.36 + 0.52 * shade - (hit.h < 0.55 ? 0.16 : 0);
      else {
        t = 0.2 + 0.62 * shade + 0.045 * Math.sin(x * 0.85 + y * 0.45) + (rnd() - 0.5) * 0.05;
        if (tag === "body") {
          if (Math.abs(y - 46.5) < 1.6 && (x + 200) % 7 < 3.2) t += 0.2; // pale flank patches
          if (Math.sin(x * 0.42 + 1) > 0.72 && y < 44) t -= 0.1; // dark saddle bands
        }
        if (tag === "snout" && j === 46 && x > 96) t -= 0.3; // mouth line
      }
      cells[j * GW + i] = { t, tag };
    }
  }
  for (let x = 40; x <= 80; x += 3) { // dorsal crest
    const i = x - GX0;
    for (let j = 1; j < GH; j++) {
      const c = cells[j * GW + i];
      if (c && c.tag === "body") { if (!cells[(j - 1) * GW + i]) cells[(j - 1) * GW + i] = { t: 0.45, tag: "skin" }; break; }
    }
  }
  // Distance to the animal, for the loose pixels floating around it.
  const dust = new Float32Array(GW * GH).fill(99);
  let frontier: number[] = [];
  cells.forEach((c, k) => { if (c && c.tag !== "bark" && c.tag !== "leaf") { dust[k] = 0; frontier.push(k); } });
  for (let d = 1; d <= 9 && frontier.length; d++) {
    const next: number[] = [];
    for (const k of frontier) {
      const i = k % GW, j = (k / GW) | 0;
      for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const ii = i + a, jj = j + b;
        if (ii < 0 || jj < 0 || ii >= GW || jj >= GH) continue;
        const kk = jj * GW + ii;
        if (dust[kk] > d) { dust[kk] = d; next.push(kk); }
      }
    }
    frontier = next;
  }
  model = { cells, dust };
  return model;
}

type ChameleonProps = {
  perchRef: RefObject<HTMLDivElement | null>;
  /** "full": he has just eaten something big (the 404 page) and starts out digesting. */
  mood?: "full";
};

export function Chameleon({ perchRef, mood }: ChameleonProps) {
  const t = useUI().chameleon;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current, canvas = canvasRef.current, perch = perchRef.current;
    const sec = wrap?.parentElement;
    const g = canvas?.getContext("2d");
    if (!wrap || !canvas || !perch || !sec || !g) return;

    const { cells, dust } = buildModel();
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (window.matchMedia("(hover: none)").matches && hintRef.current) hintRef.current.textContent = t.hintTap;

    // ---- geometry: everything is in CSS pixels of the hero section ----
    let w = 0, h = 0, dpr = 1, cell = MAX_CELL, ax = 0, ay = 0, perchW = 0, perchH = 0, perchY = 0;
    let dark = false, ramp = RAMPS.light.map(hex), floraRamp = ramp, skin = 0, ink = [0, 0, 0], moss = [0, 0, 0], tongue = [0, 0, 0], pupil = [0, 0, 0];
    let animal: HTMLCanvasElement | null = null, branch: HTMLCanvasElement | null = null;
    // Every pixel of the animal, for the entrance: they fly in and assemble it from tail to head.
    let dots: { x: number; y: number; s: number; c: string; a: number; r: number; d: number }[] = [];

    const rampAt = (t: number, from = ramp) => {
      const v = Math.max(0, Math.min(1, t)) * (from.length - 1), i = Math.min(from.length - 2, Math.floor(v));
      return mix(from[i], from[i + 1], v - i);
    };

    function bake() {
      const style = getComputedStyle(document.documentElement);
      dark = document.documentElement.dataset.theme === "dark";
      floraRamp = (dark ? RAMPS.dark : RAMPS.light).map(hex);
      ramp = floraRamp.map((c) => rotateHue(c, SKINS[skin])); // the branch and the leaves stay green
      ink = hex(style.getPropertyValue("--ink").trim());
      moss = hex(style.getPropertyValue("--moss").trim());
      tongue = hex(dark ? "#e8a596" : "#c8705f");
      pupil = dark ? [8, 12, 9] : [20, 26, 21];
      const mk = (cols: number) => {
        const c = document.createElement("canvas");
        c.width = Math.ceil(cols * cell * dpr); c.height = Math.ceil(GH * cell * dpr);
        const x = c.getContext("2d")!; x.scale(dpr, dpr);
        return [c, x] as const;
      };
      const [ac, ga] = mk(ANIMAL_COLS), [bc, gb] = mk(GW);
      let seed = 5, seed2 = 23;
      const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const rnd2 = () => (seed2 = (seed2 * 16807) % 2147483647) / 2147483647;
      const next: typeof dots = [];
      for (let j = 0; j < GH; j++) {
        for (let i = 0; i < GW; i++) {
          const k = j * GW + i, c = cells[k], col = 123 - (GX0 + i), x = col * cell, y = j * cell;
          if (!c) {
            const d = dust[k];
            if (col < ANIMAL_COLS && d < 9 && rnd() < 0.3 * Math.pow(1 - d / 9, 1.5)) {
              const s = cell * (0.3 + rnd() * 0.45);
              ga.fillStyle = rgba(rampAt(0.3 + rnd() * 0.4), 0.28 + rnd() * 0.3);
              ga.fillRect(x + rnd() * 2, y + rnd() * 2, s, s);
            }
            continue;
          }
          const flora = c.tag === "bark" || c.tag === "leaf";
          let rgb = rampAt((dark ? c.t : c.t * 0.78 + 0.02) + (BAYER[j & 3][col & 3] / 16 - 0.5) * 0.16, flora ? floraRamp : ramp);
          if (c.tag === "bark") rgb = mix(rgb, dark ? [70, 58, 44] : [74, 60, 46], 0.3);
          const s = dark ? cell * (0.88 + rnd() * 0.12) : cell + 0.35, gx = flora ? gb : ga;
          gx.fillStyle = rgba(rgb);
          gx.fillRect(Math.round(x * 2) / 2, Math.round(y * 2) / 2, s, s);
          if (!flora) next.push({ x: Math.round(x * 2) / 2, y: Math.round(y * 2) / 2, s, c: rgba(rgb), a: rnd2() * 6.283, r: 25 + rnd2() * 70, d: ((137 - col) / 138) * 0.5 + rnd2() * 0.18 });
        }
      }
      animal = ac; branch = bc; dots = next;
    }

    function layout() {
      w = sec!.clientWidth; h = sec!.clientHeight;
      const nextDpr = Math.min(2, window.devicePixelRatio || 1);
      // offsetLeft/Top ignore the entrance transform on the column, unlike getBoundingClientRect.
      let px = 0, py = 0, el: HTMLElement | null = perch!;
      while (el && el !== sec) { px += el.offsetLeft; py += el.offsetTop; el = el.offsetParent as HTMLElement | null; }
      perchW = perch!.offsetWidth; perchH = perch!.offsetHeight; perchY = py;
      const nextCell = Math.max(1.6, Math.min(MAX_CELL, perchW / PERCH_COLS));
      ax = px; ay = py - 17 * nextCell;
      if (canvas!.width !== Math.round(w * nextDpr) || canvas!.height !== Math.round(h * nextDpr)) {
        canvas!.width = Math.round(w * nextDpr); canvas!.height = Math.round(h * nextDpr);
      }
      if (nextCell !== cell || nextDpr !== dpr || !animal) { cell = nextCell; dpr = nextDpr; bake(); }
      if (bubbleRef.current) { bubbleRef.current.style.left = `${ax + 3 * cell}px`; bubbleRef.current.style.top = `${ay + 8 * cell}px`; }
      // On a narrow column the counter would sit on his back, so it drops under the branch.
      const narrow = perchW < 420;
      if (counterRef.current) { counterRef.current.style.right = `${Math.max(8, w - (px + perchW))}px`; counterRef.current.style.top = `${narrow ? py + perchH + 6 : py + 20}px`; }
      if (hintRef.current) { hintRef.current.style.left = `${ax + 5 * cell}px`; hintRef.current.style.top = `${py + perchH + (narrow ? 46 : 8)}px`; }
    }

    // ---- bugs ----
    const zone = () => [Math.max(16, ax - 180), Math.min(w - 16, ax + perchW + 60), Math.max(96, perchY - 460), perchY + perchH - 12];
    const pick = (b: Bug, now: number) => { const z = zone(); b.tx = rand(z[0], z[1]); b.ty = rand(z[2], z[3]); b.v = rand(70, 130); b.giveUp = now + 6000; b.state = "fly"; };
    const spawn = (b: Bug, now: number) => { const z = zone(); b.x = Math.random() < 0.5 ? z[0] - 60 : z[1] + 60; b.y = rand(z[2], z[3]); b.a = 0; b.wob = rand(0, 6); pick(b, now); };
    const bugs: Bug[] = [];
    function seedBugs() {
      const z = zone(), now = performance.now();
      for (let i = 0; i < 4; i++) bugs.push({ x: rand(z[0], z[1]), y: rand(z[2], z[3]), a: rand(0, 6), wob: rand(0, 6), state: "sit", until: now + 1200 + i * 1100, tx: 0, ty: 0, v: 100, giveUp: 0 });
    }
    function stepBug(b: Bug, now: number, dt: number) {
      if (b.state === "sit") { if (!calm && now > b.until) pick(b, now); return; }
      if (b.state === "gone") {
        if (now < b.until) return;
        if (calm) { const z = zone(); b.x = rand(z[0], z[1]); b.y = rand(z[2], z[3]); b.state = "sit"; b.until = Infinity; } else spawn(b, now);
        return;
      }
      if (b.state !== "fly") return;
      const dx = b.tx - b.x, dy = b.ty - b.y, d = Math.hypot(dx, dy);
      if (d < 14 || now > b.giveUp) { if (Math.random() < 0.6) { b.state = "sit"; b.until = now + rand(700, 2600); } else pick(b, now); return; }
      let diff = Math.atan2(dy, dx) - b.a; diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      b.a += diff * Math.min(1, dt * 5); b.wob += dt * 7;
      const a = b.a + Math.sin(b.wob) * Math.min(0.5, d / 80);
      b.x += Math.cos(a) * b.v * dt; b.y += Math.sin(a) * b.v * dt;
    }
    function drawBug(b: Bug, now: number) {
      const s = Math.max(2, cell * 0.86), flap = b.state === "fly" ? 0.3 + 0.5 * Math.abs(Math.sin(now / 45)) : 0.75;
      g!.save(); g!.translate(b.x, b.y); g!.rotate(b.a + Math.PI / 2); g!.translate(-3.5 * s, -3.5 * s);
      for (let j = 0; j < 7; j++) for (let i = 0; i < 7; i++) {
        const ch = BUG[j][i]; if (ch === ".") continue;
        g!.fillStyle = ch === "b" ? rgba(ink) : ch === "w" ? rgba(moss, flap) : rgba(ink, 0.7);
        g!.fillRect(i * s, j * s, s, s);
      }
      g!.restore();
    }

    // ---- pointer, speech bubble ----
    const pointer = { x: 0, y: 0, t: -9999 };
    let shot: Shot | null = null, ring: { x: number; y: number; t0: number } | null = null;
    let count = readBugs(), misses = 0, eatT = -9999, hueSign = -1, fullUntil = -1, sayTimer = 0, nextBlink = 2500;
    const look = [-1, -0.3];
    function say(text: string, ms = 1400) {
      const b = bubbleRef.current; if (!b) return;
      b.textContent = text; b.style.opacity = "1";
      window.clearTimeout(sayTimer); sayTimer = window.setTimeout(() => { b.style.opacity = "0"; }, ms);
    }
    function toLocal(e: PointerEvent | MouseEvent) { const r = sec!.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.t = performance.now(); }
    // Listens in the capture phase: a bug sitting on a node of the diagram is eaten, the node is not followed.
    function onClick(e: MouseEvent) {
      const target = e.target as Element;
      if (target.closest("a,button,input,[role='tab']")) return;
      toLocal(e);
      const now = performance.now(), z = zone();
      let best: Bug | null = null, bd = 40;
      for (const b of bugs) { if (b.state === "gone" || b.state === "caught") continue; const d = Math.hypot(b.x - pointer.x, b.y - pointer.y); if (d < bd) { bd = d; best = b; } }
      if (target.closest("[data-diagram-node]")) { if (!best) return; e.stopPropagation(); }
      const inReach = pointer.x > z[0] - 40 && pointer.x < z[1] + 40 && pointer.y > z[2] - 40 && pointer.y < z[3] + 60;
      if (!best && !inReach) return; // a click far away (selecting text, say) is not his business
      ring = { x: pointer.x, y: pointer.y, t0: now };
      if (shot) return;
      if (now < fullUntil) { say(mood === "full" && count === startCount ? t.atePage : t.full); return; }
      if (best) { best.state = "caught"; shot = { bug: best, t0: now, x: best.x, y: best.y }; }
      else shot = { bug: null, t0: now, x: pointer.x, y: pointer.y }; // a miss: the tongue comes back empty
    }

    // ---- every tenth bug: a burst of pixels and a new skin ----
    const startCount = count;
    let sparks: { x: number; y: number; vx: number; vy: number; c: number[]; s: number; t0: number }[] = [];
    const showCount = () => { if (countRef.current) countRef.current.textContent = String(count).padStart(2, "0"); };
    function celebrate(now: number, x: number, y: number) {
      skin = Math.floor(count / SKIN_EVERY) % SKINS.length; bake();
      say(t.newSkin(count), 2600);
      if (calm) return;
      for (let i = 0; i < 70; i++) {
        const a = rand(-Math.PI, 0), v = rand(120, 420);
        sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, c: i % 4 ? rampAt(rand(0.35, 0.95)) : tongue, s: cell * rand(0.8, 1.7), t0: now });
      }
    }

    // ---- entrance: assemble from pixels, blink, then eat the first bug ----
    let asmT0 = -1, assembled = calm, auto: Bug | null = null, autoBy = 0, introTimer = 0;
    const showLabels = () => { for (const r of [counterRef, hintRef]) if (r.current) r.current.style.opacity = "1"; };
    const beginAssembly = () => { if (asmT0 < 0) asmT0 = performance.now(); };
    function finishAssembly(now: number) {
      assembled = true; nextBlink = now + 200; showLabels();
      if (mood === "full") { fullUntil = now + 6000; say(t.atePage, 6000); return; }
      const b = bugs[0]; if (!b) return;
      b.x = Math.max(-20, ax - 220); b.y = ay + 5 * cell; b.a = 0; b.wob = 0;
      b.tx = Math.max(20, ax - 10 * cell); b.ty = ay + 28 * cell; b.v = 170; b.giveUp = now + 4000; b.state = "fly";
      auto = b; autoBy = now + 2200;
    }

    // ---- frame ----
    let raf = 0, running = false, last = performance.now();
    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!animal || !branch) return;
      g!.setTransform(dpr, 0, 0, dpr, 0, 0); g!.clearRect(0, 0, w, h);
      if (!assembled) {
        if (asmT0 < 0) return; // the intro has not handed over yet
        const p = Math.min(1, (now - asmT0) / ASSEMBLE_MS);
        g!.globalAlpha = Math.min(1, p * 2.5); g!.drawImage(branch, ax, ay, GW * cell, GH * cell);
        for (const d of dots) {
          const q = Math.max(0, Math.min(1, (p - d.d) / 0.32)), k = 1 - Math.pow(1 - q, 3), far = d.r * (1 - k) * cell, s = d.s * (0.45 + 0.55 * k);
          g!.globalAlpha = 0.14 + 0.86 * k; g!.fillStyle = d.c;
          g!.fillRect(ax + d.x + Math.cos(d.a) * far, ay + d.y + Math.sin(d.a) * far * 0.6, s, s);
        }
        g!.globalAlpha = 1;
        if (p >= 1) finishAssembly(now);
        return;
      }
      // The first bug flies up to him on its own, and he eats it.
      if (auto && auto.state !== "fly") auto = null;
      if (auto && !shot && (Math.hypot(auto.tx - auto.x, auto.ty - auto.y) < 26 || now > autoBy)) {
        auto.state = "caught"; shot = { bug: auto, t0: now, x: auto.x, y: auto.y }; auto = null;
      }
      const tracked = pointer.t > 0;
      const ox = calm || !tracked ? 0 : ((pointer.x - (ax + 60 * cell)) / w) * -7;
      const oy = calm ? 0 : (tracked ? ((pointer.y - (ay + 45 * cell)) / h) * -4 : 0) + Math.sin(now / 900) * 1.2;
      g!.drawImage(branch, ax + ox * 0.5, ay, GW * cell, GH * cell);
      for (const b of bugs) stepBug(b, now, dt);

      // Tongue: its geometry is settled here, but it is painted after the animal and the eye so it is
      // always on top, whichever way it is shot (even back across his own head).
      const mx = ax + 18.5 * cell + ox, my = ay + 45.2 * cell + oy;
      let paintTongue: (() => void) | null = null;
      if (shot) {
        const e = now - shot.t0, k = e < 120 ? 1 - Math.pow(1 - e / 120, 2) : e < 340 ? 1 - (e - 120) / 220 : -1;
        if (k < 0) {
          if (shot.bug) {
            shot.bug.state = "gone"; shot.bug.until = now + 900; eatT = now; hueSign = -hueSign; misses = 0; count = addBug();
            showCount();
            if (count % SKIN_EVERY === 0) celebrate(now, mx, my);
            else if (count % FULL_EVERY === 0) { fullUntil = now + FULL_MS; say(t.full, FULL_MS); }
          } else { misses++; nextBlink = now; say(misses >= 3 ? t.aim : t.missed); }
          shot = null;
        } else {
          const tx = mx + (shot.x - mx) * k, ty = my + (shot.y - my) * k, n = Math.max(4, Math.round(Math.hypot(tx - mx, ty - my) / cell));
          paintTongue = () => {
            for (let i = 0; i <= n; i++) {
              const t = i / n, x = mx + (tx - mx) * t, y = my + (ty - my) * t + Math.sin(t * Math.PI) * 9 * k, s = cell * (1.6 - t * 0.6);
              g!.fillStyle = rgba(tongue, i % 2 ? 0.88 : 1);
              g!.fillRect(Math.round(x - s / 2), Math.round(y - s / 2), Math.ceil(s), Math.ceil(s));
            }
            g!.fillStyle = rgba(tongue); g!.fillRect(tx - cell * 1.7, ty - cell * 1.7, cell * 3.4, cell * 3.4);
          };
          if (e >= 120 && shot.bug) { shot.bug.x = tx; shot.bug.y = ty; }
        }
      }

      // The animal, with a short colour shift after each meal and a queasy tint while digesting.
      const full = now < fullUntil, hue = full ? -70 : 85 * hueSign * Math.exp(-(now - eatT) / 1100);
      if (Math.abs(hue) > 1) g!.filter = `hue-rotate(${hue.toFixed(1)}deg) saturate(1.25)`;
      g!.drawImage(animal, ax + ox, ay + oy, ANIMAL_COLS * cell, GH * cell);
      g!.filter = "none";

      // Eye: follows the pointer, otherwise the nearest bug.
      const ex = ax + 29.5 * cell + ox, ey = ay + 38.5 * cell + oy;
      let target: number[] | null = null;
      if (shot) target = [shot.x, shot.y];
      else if (now - pointer.t < 2500) target = [pointer.x, pointer.y];
      else { let bd = 1e9; for (const b of bugs) { if (b.state === "gone") continue; const d = Math.hypot(b.x - ex, b.y - ey); if (d < bd) { bd = d; target = [b.x, b.y]; } } }
      if (target) { const dx = target[0] - ex, dy = target[1] - ey, d = Math.hypot(dx, dy) || 1, f = Math.min(1, dt * 12); look[0] += (dx / d - look[0]) * f; look[1] += (dy / d - look[1]) * f; }
      if (now > nextBlink + 130) nextBlink = now + rand(2500, 6000);
      const blink = now > nextBlink || full, pcx = 29.5 + look[0] * 1.9, pcy = 38.5 + look[1] * 1.9;
      for (let j = 33; j < 44; j++) for (let i = 24; i < 35; i++) {
        const cx = i + 0.5, cy = j + 0.5; if (Math.hypot(cx - 29.5, cy - 38.5) > 5.2) continue;
        let rgb: number[] | null = null;
        if (blink) rgb = rampAt(j === 38 ? (dark ? 0.15 : 0.05) : dark ? 0.55 : 0.42);
        else if (Math.hypot(cx - pcx, cy - pcy) < 1.75) rgb = i === Math.floor(pcx - 0.9) && j === Math.floor(pcy - 0.9) ? [250, 250, 244] : pupil;
        if (rgb) { g!.fillStyle = rgba(rgb); g!.fillRect(ax + i * cell + ox, ay + j * cell + oy, cell + 0.3, cell + 0.3); }
      }

      paintTongue?.();
      for (const b of bugs) if (b.state !== "gone") drawBug(b, now);
      if (sparks.length) {
        sparks = sparks.filter((s) => now - s.t0 < 1500);
        for (const s of sparks) {
          const e = (now - s.t0) / 1000;
          g!.fillStyle = rgba(s.c, Math.max(0, 1 - e / 1.5));
          g!.fillRect(Math.round(s.x + s.vx * e), Math.round(s.y + s.vy * e + 420 * e * e), s.s, s.s);
        }
      }
      if (ring) {
        const e = now - ring.t0;
        if (e > 350) ring = null;
        else { const r = 8 + (e / 350) * 22; g!.fillStyle = rgba(moss, 1 - e / 350);
          for (let a = 0; a < 24; a++) { const an = (a / 24) * Math.PI * 2; g!.fillRect(Math.round(ring.x + Math.cos(an) * r), Math.round(ring.y + Math.sin(an) * r), 2.5, 2.5); } }
      }
    }
    const start = () => { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    skin = Math.floor(count / SKIN_EVERY) % SKINS.length;
    layout(); seedBugs(); showCount();
    if (calm) { showLabels(); if (mood === "full") say(t.atePage, 6000); }
    else if (document.documentElement.dataset.intro) { window.addEventListener("intro:done", beginAssembly, { once: true }); introTimer = window.setTimeout(beginAssembly, 7000); }
    else introTimer = window.setTimeout(beginAssembly, 700); // let the diagram card fade in first
    const onMove = (e: PointerEvent) => toLocal(e);
    const resize = new ResizeObserver(layout); resize.observe(sec); resize.observe(perch);
    const theme = new MutationObserver(bake); theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const seen = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop())); seen.observe(sec);
    sec.addEventListener("pointermove", onMove, { passive: true });
    sec.addEventListener("click", onClick, true);
    return () => {
      stop(); resize.disconnect(); theme.disconnect(); seen.disconnect(); window.clearTimeout(sayTimer);
      window.clearTimeout(introTimer); window.removeEventListener("intro:done", beginAssembly);
      sec.removeEventListener("pointermove", onMove); sec.removeEventListener("click", onClick, true);
    };
  }, [perchRef, mood, t]);

  const label = "font-mono text-[10px] uppercase tracking-[0.16em]";
  return (
    <div ref={wrapRef} aria-hidden className="pointer-events-none absolute inset-0 z-10">
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
      <span ref={bubbleRef} className={`${label} absolute rounded-[10px] border border-line-strong bg-surface px-3 py-2 text-ink opacity-0 transition-opacity duration-200`} />
      <div ref={counterRef} className={`${label} absolute flex items-center gap-2.5 rounded-full border border-line-strong bg-surface px-3.5 py-2 tabular-nums text-muted opacity-0 transition-opacity duration-500`}>
        <span className="size-1.5 rounded-full bg-moss" />
        {t.counter} ·{" "}
        <b ref={countRef} className="font-medium text-ink">00</b>
      </div>
      <span ref={hintRef} className={`${label} absolute text-muted opacity-0 transition-opacity duration-500`}>{t.hintClick}</span>
    </div>
  );
}
