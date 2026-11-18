"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { MiniChameleon } from "@/components/ui/MiniChameleon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { SkillGroup } from "@/data/profile";
import type { UIStrings } from "@/data/ui";
import { useContent, useScrollTo, useUI } from "@/lib/i18n";
import { projectsUsing } from "@/lib/tech";
import { easeOutExpo } from "@/lib/utils";
import { setTechFilter } from "@/lib/workBus";

/** Skin hue (degrees from the moss green) the chameleon takes for each group, in list order. */
const GROUP_HUES = [-80, 150, 70, 215, 35, -40, 110, 180, 260];

/** Chips a group shows before "Show all"; a group only one or two over this is shown whole. */
const PREVIEW = 8;

type RowProps = {
  group: SkillGroup;
  /** How many projects use each keyword; a keyword no project lists is a plain chip. */
  counts: Map<string, number>;
  t: UIStrings["skills"];
  onPick: (keyword: string) => void;
};

function SkillRow({ group, counts, t, onPick }: RowProps) {
  const [open, setOpen] = useState(false);
  // The folded chips stay in the HTML. While they are open or still fading out they are displayed.
  const [shown, setShown] = useState(false);
  const collapsible = group.keywords.length > PREVIEW + 2;
  const toggle = () => {
    if (!open) setShown(true);
    setOpen(!open);
  };

  return (
    <>
      <h3 className="pt-1.5 font-mono text-xs uppercase tracking-[0.18em] text-muted">{group.category}</h3>
      <ul className="flex flex-wrap items-center gap-2">
        {group.keywords.map((k, i) => {
          const used = counts.get(k) ?? 0, extra = collapsible && i >= PREVIEW;
          return (
            // Folded chips stay in the HTML (hidden), so search engines and find-in-page still see them.
            <motion.li
              key={k}
              hidden={extra && !shown}
              initial={false}
              animate={extra ? { opacity: open ? 1 : 0, scale: open ? 1 : 0.85 } : undefined}
              transition={{ duration: open ? 0.35 : 0.2, ease: easeOutExpo, delay: extra ? (open ? (i - PREVIEW) * 0.018 : 0) : 0 }}
              onAnimationComplete={() => extra && !open && setShown(false)}
            >
              {used > 0 ? (
                <button
                  type="button"
                  onClick={() => onPick(k)}
                  title={t.usedIn(used)}
                  className="inline-flex cursor-pointer items-center rounded-full border border-line bg-surface px-3 py-1 text-xs leading-5 whitespace-nowrap text-ink-2 transition-colors hover:border-moss hover:bg-moss-soft hover:text-ink"
                >
                  {k}
                </button>
              ) : (
                <Chip>{k}</Chip>
              )}
            </motion.li>
          );
        })}
        {collapsible && (
          <li>
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              className="cursor-pointer rounded-full border border-moss/40 bg-moss-soft px-3 py-1 text-xs leading-5 text-ink transition-colors hover:border-moss"
            >
              {open ? t.showFewer : t.showAll(group.keywords.length)}
            </button>
          </li>
        )}
      </ul>
    </>
  );
}

export function Skills() {
  const { skills, projects } = useContent();
  const t = useUI().skills;
  const scrollTo = useScrollTo();
  // The chameleon on the list's top edge takes a hue for the group the pointer is over.
  const [group, setGroup] = useState<number | null>(null);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const group of skills) for (const k of group.keywords) map.set(k, projectsUsing(projects, [k]).length);
    return map;
  }, [skills, projects]);

  // A chip leads to the Work section, filtered to the projects that use that tool.
  const pick = (keyword: string) => {
    setTechFilter({ label: keyword, techs: [keyword] });
    scrollTo("#work");
  };

  return (
    <section id="stack" className="scroll-mt-24 border-t border-line bg-canvas-2/50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading index="04" eyebrow={t.eyebrow} title={t.title} description={t.description} />

        <div
          className="relative mt-12 border-y border-line"
          onPointerOver={(e) => {
            const row = Array.from(e.currentTarget.children).findIndex((child) => child.contains(e.target as Node)) - 1; // child 0 is the chameleon
            setGroup(row >= 0 ? row : null);
          }}
          onPointerLeave={() => setGroup(null)}
        >
          <div aria-hidden className="pointer-events-none absolute bottom-full right-3 w-24 sm:right-6 sm:w-28">
            <MiniChameleon hue={group === null ? undefined : GROUP_HUES[group % GROUP_HUES.length]} look={[-0.5, 0.85]} className="-mb-[4px] w-full" />
          </div>
          {skills.map((g, i) => (
            <Reveal key={g.category} delay={Math.min(i, 4) * 0.04} y={16} className="grid gap-3 border-b border-line py-6 last:border-b-0 md:grid-cols-[220px_1fr] md:gap-10">
              <SkillRow group={g} counts={counts} t={t} onPick={pick} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
