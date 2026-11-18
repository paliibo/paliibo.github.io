"use client";

import { CreditCard, LayoutTemplate, Server, Smartphone, Sparkles, Workflow } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState, type CSSProperties } from "react";
import { Chip } from "@/components/ui/Chip";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ExpertiseIcon } from "@/data/profile";
import { useContent, useUI } from "@/lib/i18n";
import { cn, easeOutExpo } from "@/lib/utils";

const ICONS: Record<ExpertiseIcon, typeof Server> = {
  server: Server,
  workflow: Workflow,
  layout: LayoutTemplate,
  smartphone: Smartphone,
  sparkles: Sparkles,
  creditcard: CreditCard,
};

/**
 * The request path beside the cards, stop by stop (labels in data/ui.ts, same order): which expertise
 * cards each stop lights up. On large screens the cards are also laid out in this order, so the
 * highlight moves down the grid as the reader scrolls.
 */
const STOPS: ExpertiseIcon[][] = [["layout", "smartphone"], ["server"], ["workflow"], ["creditcard"], ["sparkles"]];
const PATH_ORDER = STOPS.flat();

export function Expertise() {
  const { expertise } = useContent();
  const t = useUI().expertise;
  const ref = useRef<HTMLDivElement>(null);
  const [stop, setStop] = useState(0);
  // The stop follows the scroll through the cards; picking one by hand holds until the next scroll step.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.62", "end 0.55"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setStop(Math.max(0, Math.min(STOPS.length - 1, Math.floor(v * STOPS.length)))));

  return (
    <section id="expertise" className="scroll-mt-24 border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading index="01" eyebrow={t.eyebrow} title={t.title} description={t.description} />

        <div ref={ref} className="mt-14 lg:grid lg:grid-cols-12 lg:gap-10">
          {/* The path of one request. Large screens only: below that the cards stand on their own. */}
          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-32">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{t.pathTitle}</p>
              <ol className="mt-5">
                {t.path.map((s, i) => (
                  <li key={s.label} className="relative pb-4 pl-9 last:pb-0">
                    {i < t.path.length - 1 && <span aria-hidden className={cn("absolute bottom-0 left-[10px] top-6 border-l border-dashed transition-colors duration-500", i < stop ? "border-moss" : "border-line-strong")} />}
                    <span aria-hidden className={cn("absolute left-[5px] top-[18px] size-[11px] rounded-full border-2 transition-colors duration-300", i === stop ? "live-dot border-moss bg-moss" : i < stop ? "border-moss bg-canvas" : "border-line-strong bg-canvas")} />
                    <button
                      type="button"
                      onClick={() => setStop(i)}
                      aria-pressed={i === stop}
                      className={cn(
                        "flex w-full cursor-pointer flex-col rounded-2xl border px-4 py-2.5 text-left transition-[border-color,background-color] duration-300",
                        i === stop ? "border-moss bg-moss-soft" : "border-line bg-surface hover:border-line-strong",
                      )}
                    >
                      <span className="text-[15px] font-semibold text-ink">{s.label}</span>
                      <span className="font-mono text-[10.5px] text-muted">{s.sub}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {expertise.map((area, i) => {
              const Icon = ICONS[area.icon];
              const active = STOPS[stop].includes(area.icon);
              return (
                <motion.article
                  key={area.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 0.7, ease: easeOutExpo, delay: (i % 2) * 0.08 }}
                  whileHover={{ y: -4 }}
                  style={{ "--o": PATH_ORDER.indexOf(area.icon) } as CSSProperties}
                  className={cn(
                    "group flex flex-col gap-5 rounded-3xl border bg-surface p-7 transition-[border-color,box-shadow] duration-300 hover:border-moss hover:shadow-card lg:[order:var(--o)]",
                    active ? "border-line lg:border-moss lg:shadow-card" : "border-line",
                  )}
                >
                  {/* Cards off the current stop step back a little (large screens), without hiding their text. */}
                  <div className={cn("flex flex-1 flex-col gap-5 transition-opacity duration-500", !active && "lg:opacity-55 lg:group-hover:opacity-100")}>
                    <span className="grid size-11 place-items-center rounded-2xl bg-moss-soft text-moss transition-transform duration-500 ease-out group-hover:rotate-[-8deg] group-hover:scale-110">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-2xl text-ink">{area.title}</h3>
                      <p className="mt-3 leading-relaxed text-ink-2">{area.text}</p>
                    </div>
                    <ul className="mt-auto flex flex-wrap gap-1.5">
                      {area.tags.slice(0, 3).map((tag) => (
                        <li key={tag}>
                          <Chip>{tag}</Chip>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
