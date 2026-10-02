import type { CSSProperties } from "react";
import { marqueePrimary, marqueeSecondary } from "@/data/profile";

function Row({ items, reverse, duration, className }: { items: string[]; reverse?: boolean; duration: string; className: string }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee">
      <div className={`marquee-track ${reverse ? "reverse" : ""}`} style={{ "--dur": duration } as CSSProperties}>
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className={`flex items-center gap-6 whitespace-nowrap px-3 ${className}`} aria-hidden={i >= items.length}>
            {item}
            <span className="size-1.5 rounded-full bg-moss" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function TechMarquee() {
  return (
    <section aria-label="Technologies" className="space-y-4 border-y border-line py-6">
      <Row items={marqueePrimary} duration="48s" className="font-display text-2xl text-ink-2 sm:text-3xl" />
      <Row items={marqueeSecondary} reverse duration="64s" className="font-mono text-xs uppercase tracking-[0.2em] text-muted" />
    </section>
  );
}
