"use client";

import { useEffect, useRef, useState } from "react";
import { MiniChameleon } from "@/components/ui/MiniChameleon";
import { useBugsFixed } from "@/lib/bugs";
import { useContent, useUI } from "@/lib/i18n";

// The frames of waking up, in order; lying down again plays them backwards.
const WAKE_FRAMES = [
  { pose: "sleep", eye: "shut" },
  { pose: "sleep", eye: "half" },
  { pose: "wake", eye: "half" },
  { pose: "wake", eye: "open" },
  { pose: "stand", eye: "open" },
] as const;

type FooterProps = {
  /** Show the email and LinkedIn links. Off on the contact-free /upwork page. */
  showContact?: boolean;
};

export function Footer({ showContact = true }: FooterProps) {
  const { site } = useContent();
  const ui = useUI();
  const t = ui.footer;
  // Bugs fed to the chameleon in the hero, kept between visits.
  const bugs = useBugsFixed();
  // The chameleon sleeps on the footer's top edge; "Back to top" (or a pointer on him) wakes him for a
  // moment: he opens an eye, lifts his body, stands, and later lies back down the same way.
  const [frame, setFrame] = useState(0);
  const at = useRef(0);
  const stepper = useRef(0);
  const nap = useRef(0);
  useEffect(() => () => { window.clearTimeout(stepper.current); window.clearTimeout(nap.current); }, []);
  const move = (to: number) => {
    window.clearTimeout(stepper.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { at.current = to; setFrame(to); return; }
    const step = () => {
      if (at.current === to) return;
      at.current += Math.sign(to - at.current);
      setFrame(at.current);
      stepper.current = window.setTimeout(step, 240);
    };
    step();
  };
  const wake = () => {
    move(WAKE_FRAMES.length - 1);
    window.clearTimeout(nap.current);
    nap.current = window.setTimeout(() => move(0), 3600);
  };
  const awake = frame >= 3;

  return (
    <footer className="relative border-t border-line py-10">
      <div aria-hidden className="absolute bottom-full right-5 w-24 sm:right-10" onPointerEnter={wake}>
        {frame <= 1 && <span className="zzz absolute -top-3 left-1 font-mono text-[11px] text-muted">z z z</span>}
        {awake && <span className="absolute -top-6 left-0 whitespace-nowrap rounded-[9px] border border-line-strong bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink">{ui.chameleon.woke}</span>}
        {/* The sprite's feet are at 95% of its height: the margin sets them on the footer's top line. */}
        <MiniChameleon pose={WAKE_FRAMES[frame].pose} eye={WAKE_FRAMES[frame].eye} look={[-0.8, -0.5]} className="-mb-[3px] w-full" />
      </div>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted sm:flex-row sm:px-8">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} {site.name}
          {bugs > 0 && (
            <span className="font-mono text-xs">
              {" "}
              · {t.bugs(bugs)}
              {bugs >= 10 && <span className="text-moss"> · {t.hunter}</span>}
            </span>
          )}
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showContact && (
            <a href={`mailto:${site.email}`} className="text-ink-2 transition-colors hover:text-ink">
              {site.email}
            </a>
          )}
          <a href={site.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
            GitHub
          </a>
          {showContact && (
            <a href={site.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
              LinkedIn
            </a>
          )}
          <a href="#top" onClick={wake} className="transition-colors hover:text-ink">
            {t.backToTop}
          </a>
        </nav>
      </div>
    </footer>
  );
}
