"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Lenis smooth scrolling + Motion's reduced-motion handling. Skips Lenis entirely for users who prefer reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      {reduce ? (
        children
      ) : (
        <ReactLenis root options={{ lerp: 0.09, smoothWheel: true, anchors: { offset: -88 } }}>
          {children}
        </ReactLenis>
      )}
    </MotionConfig>
  );
}
