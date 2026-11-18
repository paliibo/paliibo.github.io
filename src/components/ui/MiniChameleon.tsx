"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import { useBugsFixed } from "@/lib/bugs";
import { MINI_H, MINI_W, SKINS, miniSprite, type Eye, type Pose } from "@/lib/chameleonModel";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

/** How far the skin hue travels, in degrees, between the top of the page and the bottom. */
const DRIFT = 300;
/** Seconds the hue takes to settle (an exponential ease), and the theme crossfade to run. */
const HUE_EASE = 0.16;
const THEME_FADE = 0.7;

type MiniChameleonProps = {
  pose?: Pose;
  eye?: Eye;
  /** Where the pupil looks, each from −1 to 1. */
  look?: readonly [number, number];
  /**
   * Skin hue in degrees from the moss green. Left out, he wears the skin he has earned in the hero
   * (lib/bugs.ts) and his colour drifts with the place on the page where he stands.
   */
  hue?: number;
  className?: string;
  style?: CSSProperties;
};

type Anim = { hue: number; tHue: number; dark: number; tDark: number; raf: number; last: number };

const prefersCalm = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The hero's chameleon as a small sprite for other sections. He faces left; flip or rotate him with
 * `style`. His colour never jumps: the hue eases to its target, and a theme change crossfades a
 * second after the page has changed (he takes a moment to adapt).
 */
export function MiniChameleon({ pose = "stand", eye = "open", look, hue, className, style }: MiniChameleonProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const bugs = useBugsFixed();
  const { scrollYProgress } = useScroll();
  const anim = useRef<Anim | null>(null);
  const view = useRef({ pose, eye, look: undefined as readonly [number, number] | undefined });
  const lx = look?.[0], ly = look?.[1];

  // The hue he is heading for at a given scroll progress.
  const base = hue ?? SKINS[Math.floor(bugs / 10) % SKINS.length];
  const hueAt = useCallback((progress: number) => base + (hue === undefined ? progress * DRIFT : 0), [base, hue]);

  const draw = useCallback(() => {
    const s = anim.current, g = ref.current?.getContext("2d");
    if (!s || !g) return;
    const { pose: p, eye: e, look: l } = view.current;
    g.clearRect(0, 0, MINI_W * 2, MINI_H * 2);
    // Light colours underneath, dark ones fading in over them: in between he is a blend of both.
    if (s.dark < 1) g.drawImage(miniSprite({ pose: p, eye: e, dark: false, hue: s.hue, look: l }), 0, 0);
    if (s.dark > 0) {
      g.globalAlpha = s.dark;
      g.drawImage(miniSprite({ pose: p, eye: e, dark: true, hue: s.hue, look: l }), 0, 0);
      g.globalAlpha = 1;
    }
  }, []);

  // Paints once, and keeps painting frames while the hue or the theme mix still has somewhere to go.
  const run = useCallback(() => {
    const s = anim.current;
    if (!s || s.raf) return;
    s.last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - s.last) / 1000);
      s.last = now;
      s.hue += (s.tHue - s.hue) * (1 - Math.exp(-dt / HUE_EASE));
      if (Math.abs(s.tHue - s.hue) < 0.5) s.hue = s.tHue;
      const gap = s.tDark - s.dark;
      s.dark += Math.sign(gap) * Math.min(Math.abs(gap), dt / THEME_FADE);
      draw();
      s.raf = s.hue !== s.tHue || s.dark !== s.tDark ? requestAnimationFrame(tick) : 0;
    };
    s.raf = requestAnimationFrame(tick);
  }, [draw]);

  useEffect(() => {
    const dark = document.documentElement.dataset.theme === "dark" ? 1 : 0, h = hueAt(scrollYProgress.get());
    anim.current = { hue: h, tHue: h, dark, tDark: dark, raf: 0, last: 0 };
    return () => cancelAnimationFrame(anim.current?.raf ?? 0);
    // Mount only: later changes reach him through the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    view.current = { pose, eye, look: lx === undefined || ly === undefined ? undefined : [lx, ly] };
    const s = anim.current;
    if (!s) return;
    s.tHue = hueAt(scrollYProgress.get());
    if (prefersCalm()) s.hue = s.tHue;
    run();
  }, [pose, eye, lx, ly, hueAt, scrollYProgress, run]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const s = anim.current;
    if (!s) return;
    s.tHue = hueAt(p);
    run();
  });

  // He follows a theme change a second late, then fades into the new colours.
  useEffect(() => {
    const s = anim.current, target = theme === "dark" ? 1 : 0;
    if (!s || s.tDark === target) return;
    const calm = prefersCalm();
    const timer = window.setTimeout(() => {
      s.tDark = target;
      if (calm) s.dark = target;
      run();
    }, calm ? 0 : 1000);
    return () => window.clearTimeout(timer);
  }, [theme, run]);

  return <canvas ref={ref} width={MINI_W * 2} height={MINI_H * 2} aria-hidden className={cn("block h-auto [image-rendering:pixelated]", className)} style={style} />;
}
