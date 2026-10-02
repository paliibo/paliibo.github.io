"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projectFilters, projects, type Project, type ProjectTag } from "@/data/profile";
import { cn, easeOutExpo } from "@/lib/utils";
import { ProjectDialog } from "./ProjectDialog";

type Filter = ProjectTag | "all";

function ProjectCard({ project, index, featured, onOpen }: { project: Project; index: number; featured: boolean; onOpen: () => void }) {
  const visibleStack = project.stack.slice(0, featured ? 8 : 5);
  const rest = project.stack.length - visibleStack.length;

  return (
    <motion.article
      layout
      layoutId={`card-${project.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.6, ease: easeOutExpo }}
      whileHover={{ y: -5 }}
      onClick={onOpen}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-5 rounded-3xl border border-line bg-surface p-6 transition-[border-color,box-shadow] duration-300 hover:border-moss hover:shadow-card sm:p-7",
        featured && "lg:col-span-2",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
        <span className="text-right text-xs text-muted">{project.country}</span>
      </div>

      <div className={cn(featured && "lg:grid lg:grid-cols-2 lg:gap-10")}>
        <div>
          <h3 className="font-display text-[1.75rem] leading-tight text-ink sm:text-3xl">{project.name}</h3>
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

      <ul className="mt-auto flex flex-wrap gap-1.5">
        {visibleStack.map((s) => (
          <li key={s}>
            <Chip>{s}</Chip>
          </li>
        ))}
        {rest > 0 && (
          <li>
            <Chip tone="moss">+{rest}</Chip>
          </li>
        )}
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
  const [filter, setFilter] = useState<Filter>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const list = useMemo(() => (filter === "all" ? projects : projects.filter((p) => p.tags.includes(filter))), [filter]);
  const active = projects.find((p) => p.id === activeId) ?? null;
  const close = useCallback(() => setActiveId(null), []);

  return (
    <section id="work" className="scroll-mt-24 border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="02"
          eyebrow="Selected work"
          title="Twelve production systems, one stack."
          description="Multi-tenant SaaS, async pipelines and mobile apps built end to end for teams in the UK, EU and US. Open a card for the full story."
        />

        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
          {projectFilters.map((f) => {
            const selected = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(f.id)}
                className={cn("relative rounded-full px-4 py-2 text-sm transition-colors", selected ? "text-accent-fg" : "text-muted hover:text-ink")}
              >
                {selected && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="relative">{f.label}</span>
              </button>
            );
          })}
        </div>

        <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p) => (
              <ProjectCard key={p.id} project={p} index={projects.indexOf(p)} featured={Boolean(p.featured) && filter === "all"} onOpen={() => setActiveId(p.id)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <ProjectDialog project={active} onClose={close} />
    </section>
  );
}
