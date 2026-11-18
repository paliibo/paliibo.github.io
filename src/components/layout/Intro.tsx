"use client";

import { useEffect, useRef } from "react";
import { site } from "@/data/profile";

/**
 * Page-load intro: the outlined name fills with ink from the bottom, then travels to its place in
 * the hero while the page fades in behind it.
 *
 * A script in <head> (layout.tsx) sets `data-intro` on <html> before the first paint, on every load
 * and never under reduced motion. The fill itself is plain CSS (globals.css), so it starts
 * with the HTML; this component only waits for it and the fonts, then lands the name on the hero
 * heading (the element marked `data-intro-target`; a page without one just fades the name out). If
 * the script bundle never arrives, CSS removes the overlay on its own after a few seconds.
 */
export function Intro() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement, el = ref.current;
    if (!root.dataset.intro || !el) return;
    const name = el.querySelector<HTMLElement>("[data-intro-name]");
    if (!name) return;

    let cancelled = false, timer = 0;
    const finish = () => {
      if (cancelled) return;
      delete root.dataset.intro;
      delete root.dataset.introLand;
      window.dispatchEvent(new Event("intro:done"));
    };
    const land = () => {
      if (cancelled) return;
      const from = name.getBoundingClientRect();
      const to = document.querySelector<HTMLElement>("[data-intro-target]")?.getBoundingClientRect();
      el.dataset.state = "land";
      root.dataset.introLand = "1"; // the page behind the overlay fades in (globals.css)
      // No hero heading on this page, or it is off screen (deep link, already scrolled): just fade out.
      if (to && to.bottom > 0 && to.top < window.innerHeight) name.style.transform = `translate(${to.left - from.left}px, ${to.top - from.top}px)`;
      else name.style.opacity = "0";
      timer = window.setTimeout(finish, 800);
    };

    const filled = typeof name.getAnimations === "function"
      ? Promise.all(name.getAnimations({ subtree: true }).map((a) => a.finished.catch(() => undefined)))
      : new Promise((resolve) => window.setTimeout(resolve, 1200));
    Promise.all([filled, document.fonts?.ready]).then(land, land);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={ref} className="intro" aria-hidden>
      <p data-intro-name className="intro-name font-display text-[clamp(3.6rem,11.5vw,9.5rem)] leading-[0.9] tracking-[-0.02em]">
        <span className="intro-line pb-[0.06em] pt-[0.15em]" data-t={site.firstName}>
          {site.firstName}
        </span>
        <span className="intro-line pb-[0.08em]" data-t={site.lastName}>
          {site.lastName}
        </span>
      </p>
    </div>
  );
}
