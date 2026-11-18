"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { MiniChameleon } from "@/components/ui/MiniChameleon";

const WIDTH = 56; // px, the walker's width

/**
 * Page progress as a branch along the top edge, with the chameleon walking it upside down: where he
 * hangs is how far down the page the reader is. He passes behind the nav pill.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });
  const left = useTransform(progress, (v) => `calc(${(v * 100).toFixed(3)}vw - ${(v * WIDTH).toFixed(2)}px)`);
  const [step, setStep] = useState(false);
  const [back, setBack] = useState(false);
  const last = useRef(0);

  useMotionValueEvent(progress, "change", (v) => {
    setStep(Math.floor(v * 120) % 2 === 1); // two walk frames, swapped every 1/120 of the page
    if (Math.abs(v - last.current) < 0.0015) return;
    setBack(v < last.current);
    last.current = v;
  });

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-30 h-9">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[var(--bark)] opacity-40" />
      <motion.div style={{ scaleX: progress, transformOrigin: "0%" }} className="absolute inset-x-0 top-0 h-[3px] bg-moss" />
      <motion.div style={{ left, width: WIDTH }} className="absolute top-px">
        {/* Upside down, feet on the branch; he faces the way the page is moving. */}
        <MiniChameleon pose={step ? "step" : "stand"} look={[-0.6, 0.7]} className="w-full" style={{ transform: `scaleY(-1)${back ? "" : " scaleX(-1)"}` }} />
      </motion.div>
    </div>
  );
}
