"use client";

import { ArrowUpRight, Check, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project, ProjectTag } from "@/data/profile";
import type { UIStrings } from "@/data/ui";
import { useContent, useScrollTo, useUI } from "@/lib/i18n";
import { projectsUsing } from "@/lib/tech";
import { cn, easeOutExpo } from "@/lib/utils";
import { clearViewedProjects, markProjectViewed, useViewedProjects } from "@/lib/viewedProjects";
import { onOpenProjectRequest, setTechFilter, useTechFilter } from "@/lib/workBus";
import { ProjectDialog } from "./ProjectDialog";

type Filter = ProjectTag | "all";

/** The main stops of the system as a strip of boxes joined by the same moving dashes as the hero diagram. */
function MiniFlow({ steps }: { steps: NonNullable<Project["flow"]> }) {
  return (
    <ol className="hidden items-stretch lg:flex">
      {steps.map((step, i) => (
        <li key={step.label} className="flex min-w-0 flex-1 items-center">
          {i > 0 && (
            <svg viewBox="0 0 22 8" width="22" height="8" className="shrink-0 self-center" aria-hidden>
              <path d="M1 4 H20" fill="none" strokeWidth="1.2" className="edge-flow stroke-line-strong" />
              <path d="M16.5 1 L20.5 4 L16.5 7" fill="none" strokeWidth="1.2" className="stroke-line-strong" />
            </svg>
          )}
          <div className="min-w-0 flex-1 rounded-xl border border-line bg-canvas/40 px-3 py-2">
            <p className="truncate text-[13px] font-semibold leading-5 text-ink">{step.label}</p>
            <p className="font-mono text-[10px] leading-[1.35] text-muted">{step.sub}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

type CardProps = {
  project: Project;
  /** Wide card: two columns on large screens, with highlights and the mini diagram. */
  featured: boolean;
  /** Wide cards alternate sides: this one sits against the right edge. */
  alignEnd: boolean;
  viewed: boolean;
  t: UIStrings["projects"];
  onOpen: () => void;
};

function ProjectCard({ project, featured, alignEnd, viewed, t, onOpen }: CardProps) {
  // The full stack is in the dialog; the card shows only the first few.
  const visibleStack = project.stack.slice(0, featured ? 5 : 3);

  return (
    <motion.article
      id={`project-${project.id}`}
      layout
      layoutId={`card-${project.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.6, ease: easeOutExpo }}
      whileHover={{ y: -5 }}
      className={cn(
        "group relative flex flex-col gap-5 rounded-3xl border border-line bg-surface p-6 transition-[border-color,box-shadow] duration-300 hover:border-moss hover:shadow-card has-[button:focus-visible]:border-moss has-[button:focus-visible]:shadow-card sm:p-7",
        featured && "lg:col-span-2",
        featured && alignEnd && "lg:col-start-2",
      )}
    >
      <div className="flex min-h-5 items-start justify-between gap-4">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          {project.inDevelopment && (
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-moss" />
              {t.inDevelopment}
            </span>
          )}
          {viewed && (
            <span className="inline-flex items-center gap-1 text-moss">
              <Check className="size-3" aria-hidden />
              {t.viewedMark}
            </span>
          )}
        </span>
        <span className="text-right text-xs text-muted">{project.country}</span>
      </div>

      <div className={cn(featured && "lg:grid lg:grid-cols-2 lg:gap-10")}>
        <div>
          <h3 className="font-display text-[1.75rem] leading-tight text-ink sm:text-3xl">
            {/* The title is the control: its ::after covers the card, so the whole card opens the case
                for a pointer and the keyboard reaches it with Tab. */}
            <button
              type="button"
              onClick={onOpen}
              aria-haspopup="dialog"
              aria-label={t.openCase(project.name)}
              className="cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-3xl focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-moss"
            >
              {project.name}
            </button>
          </h3>
          <p className="mt-1 text-muted">{project.tagline}</p>
          <p className="mt-4 leading-relaxed text-ink-2">{project.summary}</p>
        </div>
        {featured && (
          <ul className="mt-6 hidden space-y-2 text-sm leading-relaxed text-ink-2 lg:mt-0 lg:block">
            {project.highlights.slice(1, 4).map((h) => (
              <li key={h} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-moss" />
                <span className="line-clamp-2">{h}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {featured && project.flow && <MiniFlow steps={project.flow} />}

      <ul className="mt-auto flex flex-wrap gap-1.5">
        {visibleStack.map((s) => (
          <li key={s}>
            <Chip>{s}</Chip>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-line pt-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{project.role}</span>
        <span className="grid size-9 place-items-center rounded-full border border-line text-ink-2 transition-all duration-300 group-hover:border-moss group-hover:bg-accent group-hover:text-accent-fg">
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </motion.article>
  );
}

export function Projects() {
  const { projects, projectFilters, copy } = useContent();
  const ui = useUI();
  const t = ui.projects;
  const scrollTo = useScrollTo();

  const [filter, setFilter] = useState<Filter>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  // The card the dialog grew out of: it shrinks back there, whichever case it ends on.
  const [originId, setOriginId] = useState<string | null>(null);
  const viewed = useViewedProjects();
  // Set from outside the section: a node of the hero diagram or a Stack chip.
  const tech = useTechFilter();

  // Filters with no matching project are hidden (a variant may show only some projects).
  const visibleFilters = useMemo(
    () => projectFilters.filter((f) => f.id === "all" || projects.some((p) => p.tags.includes(f.id as ProjectTag))),
    [projectFilters, projects],
  );
  const list = useMemo(() => {
    if (tech) return projectsUsing(projects, tech.techs);
    return filter === "all" ? projects : projects.filter((p) => p.tags.includes(filter));
  }, [filter, projects, tech]);
  const activeIndex = list.findIndex((p) => p.id === activeId);
  const active = activeIndex === -1 ? null : list[activeIndex];
  const viewedCount = projects.filter((p) => viewed.has(p.id)).length;

  const open = useCallback((id: string) => {
    setOriginId(id);
    setActiveId(id);
    markProjectViewed(id);
  }, []);
  const close = useCallback(() => setActiveId(null), []);
  /** Prev / next inside the dialog, through the cards the current filter shows, wrapping at the ends. */
  const step = useCallback(
    (delta: number) => {
      if (activeIndex === -1) return;
      const next = list[(activeIndex + delta + list.length) % list.length];
      setActiveId(next.id);
      markProjectViewed(next.id);
    },
    [activeIndex, list],
  );
  const pickFilter = (id: Filter) => {
    setTechFilter(null);
    setFilter(id);
  };

  // The command palette opens a case by id: show every card, bring that one into view, open it.
  useEffect(
    () =>
      onOpenProjectRequest((id) => {
        setTechFilter(null);
        setFilter("all");
        requestAnimationFrame(() => {
          scrollTo(`#project-${id}`, true);
          requestAnimationFrame(() => open(id));
        });
      }),
    [open, scrollTo],
  );

  // Wide cards alternate sides so the grid reads as a zigzag, not as a column of wide cards. Under a
  // filter every card is the same size.
  const wide = useMemo(() => (filter === "all" && !tech ? list.filter((p) => p.featured).map((p) => p.id) : []), [filter, list, tech]);

  return (
    <section id="work" className="scroll-mt-24 border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading index="02" eyebrow={t.eyebrow} title={copy.projectsTitle} description={copy.projectsDescription} />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label={t.filterAria}>
              {visibleFilters.map((f) => {
                const selected = !tech && filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => pickFilter(f.id as Filter)}
                    className={cn("relative rounded-full px-4 py-2 text-sm transition-colors", selected ? "text-accent-fg" : "text-muted hover:text-ink")}
                  >
                    {selected && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                    <span className="relative">{f.label}</span>
                  </button>
                );
              })}
            </div>
            {tech && (
              <button
                type="button"
                onClick={() => setTechFilter(null)}
                aria-label={`${tech.label}, ${t.usedIn(list.length)}. ${t.clearTech}`}
                className="inline-flex items-center gap-2 rounded-full border border-moss/50 bg-moss-soft px-4 py-2 text-sm text-ink transition-colors hover:border-moss"
              >
                <span className="font-medium">{tech.label}</span>
                <span className="text-ink-2">· {t.usedIn(list.length)}</span>
                <X className="size-3.5" aria-hidden />
              </button>
            )}
          </div>

          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted" aria-live="polite">
            <span>{t.viewed(viewedCount, projects.length)}</span>
            {viewedCount > 0 && (
              <button type="button" onClick={clearViewedProjects} className="uppercase tracking-[0.16em] underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink">
                {t.reset}
              </button>
            )}
          </p>
        </div>

        <motion.div layout className="mt-10 grid grid-flow-dense gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                featured={wide.includes(p.id)}
                alignEnd={wide.indexOf(p.id) % 2 === 1}
                viewed={viewed.has(p.id)}
                t={t}
                onOpen={() => open(p.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <ProjectDialog
        project={active}
        originId={originId}
        position={activeIndex + 1}
        total={list.length}
        next={active ? list[(activeIndex + 1) % list.length] : null}
        onStep={step}
        onClose={close}
      />
    </section>
  );
}
