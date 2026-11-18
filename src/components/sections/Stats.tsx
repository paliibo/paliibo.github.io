"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { integrations, type StatKey } from "@/data/profile";
import { useContent } from "@/lib/i18n";
import { cn, easeOutExpo } from "@/lib/utils";

export function Stats() {
  const { stats, projects } = useContent();
  const [open, setOpen] = useState<StatKey | null>(null);

  // Countries from the project cards ("Switzerland, Germany, Italy" is three), with the projects in each.
  const countries = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const p of projects) {
      if (p.id === "surge-ai") continue; // "Remote" is not a country
      for (const c of p.country.split(", ")) map.set(c, [...(map.get(c) ?? []), p.name]);
    }
    return [...map].sort((a, b) => b[1].length - a[1].length);
  }, [projects]);

  // A figure opens its list only when the list really backs it (a build variant may show other projects).
  const backed = (key: StatKey, value: number) => (key === "countries" ? countries.length === value : key === "integrations" ? integrations.length >= value : false);

  return (
    <section aria-label="Key numbers" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
      <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
        {stats.map((s, i) => {
          const expandable = backed(s.key, s.value), isOpen = open === s.key;
          return (
            <Reveal key={s.label} delay={i * 0.08} className={cn("border-l pl-5 transition-colors duration-300 sm:pl-7", isOpen ? "border-moss" : "border-line")}>
              <dd className="font-display text-5xl leading-none text-ink sm:text-6xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
              <dt className="mt-3 text-sm text-muted">
                {expandable ? (
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : s.key)}
                    aria-expanded={isOpen}
                    aria-controls="stat-detail"
                    className={cn("inline-flex cursor-pointer items-center gap-1 underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink", isOpen && "text-ink decoration-moss")}
                  >
                    {s.label}
                    <ChevronDown className={cn("size-3.5 transition-transform duration-300", isOpen && "rotate-180")} aria-hidden />
                  </button>
                ) : (
                  s.label
                )}
              </dt>
            </Reveal>
          );
        })}
      </dl>

      {/* The panel grows from nothing and folds back; switching between the two lists fades one out
          before the other grows, and the items drift in one after another. */}
      <div id="stat-detail">
        <AnimatePresence initial={false} mode="wait">
          {(open === "countries" || open === "integrations") && (
            <motion.div
              key={open}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ height: { duration: 0.5, ease: easeOutExpo }, opacity: { duration: 0.3 } }}
              className="overflow-hidden"
            >
              {open === "countries" ? (
                <ul className="mt-10 grid gap-x-8 gap-y-3 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-3">
                  {countries.map(([country, names], i) => (
                    <motion.li key={country} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: easeOutExpo, delay: 0.08 + i * 0.04 }} className="border-b border-line pb-3">
                      <p className="text-ink">{country}</p>
                      <p className="text-sm text-muted">{names.join(" · ")}</p>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-10 flex flex-wrap gap-2 border-t border-line pt-6">
                  {integrations.map((name, i) => (
                    <motion.li key={name} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, ease: easeOutExpo, delay: 0.08 + i * 0.015 }}>
                      <Chip>{name}</Chip>
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
