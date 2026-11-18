"use client";

import { GraduationCap, Languages } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { MiniChameleon } from "@/components/ui/MiniChameleon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useContent, useUI } from "@/lib/i18n";
import { requestOpenProject } from "@/lib/workBus";

export function Experience() {
  const { copy, education, jobs, projects, site } = useContent();
  const ui = useUI();
  const t = ui.experience;
  const ref = useRef<HTMLDivElement>(null);
  // No target when the timeline is hidden, so the hook has nothing unmounted to track.
  const { scrollYProgress } = useScroll(copy.showTimeline ? { target: ref, offset: ["start 0.8", "end 0.55"] } : {});
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.4 });
  // The chameleon climbs the timeline: he hangs where the filled part ends and faces the way it moves.
  const climberTop = useTransform(scaleY, (v) => `${(Math.max(0, Math.min(1, v)) * 100).toFixed(2)}%`);
  const [step, setStep] = useState(false);
  const [up, setUp] = useState(false);
  const last = useRef(0);
  useMotionValueEvent(scaleY, "change", (v) => {
    setStep(Math.floor(v * 36) % 2 === 1);
    if (Math.abs(v - last.current) < 0.004) return;
    setUp(v < last.current);
    last.current = v;
  });

  return (
    <section id="experience" className="scroll-mt-24 border-t border-line py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              index="03"
              eyebrow={t.eyebrow}
              title={copy.experienceTitle}
              description={copy.experienceDescription}
            />
          </div>
        </div>

        <div className="lg:col-span-8">
          {copy.showTimeline && (
          <div ref={ref} className="relative pl-8 sm:pl-12">
            <div className="absolute bottom-3 left-[5px] top-3 w-px bg-line" />
            <motion.div style={{ scaleY }} className="absolute bottom-3 left-[5px] top-3 w-px origin-top bg-moss" />
            <div aria-hidden className="pointer-events-none absolute bottom-3 left-[5px] top-3 z-10 w-0">
              <motion.div style={{ top: climberTop }} className="absolute left-0">
                {/* Turned on his side with his feet on the line: head down while the reader scrolls down. */}
                <MiniChameleon pose={step ? "step" : "stand"} look={[-0.8, 0.2]} className="absolute -left-[12px] -top-[12.6px] w-12 max-w-none" style={{ transform: `rotate(90deg)${up ? "" : " scaleX(-1)"}` }} />
              </motion.div>
            </div>

            {jobs.map((job, i) => (
              <Reveal key={job.company} delay={i * 0.05} className="relative pb-12 last:pb-0">
                <span className="absolute -left-8 top-2.5 size-[11px] rounded-full border-2 border-moss bg-canvas sm:-left-12" />
                <div className="grid gap-2 sm:grid-cols-[160px_1fr] sm:gap-8">
                  <p className="pt-1.5 font-mono text-xs uppercase tracking-[0.16em] text-muted">
                    {job.start} — {job.end}
                  </p>
                  <div>
                    <h3 className="font-display text-2xl text-ink sm:text-3xl">{job.company}</h3>
                    <p className="mt-1 text-ink-2">{job.role}</p>
                    <p className="mt-1 text-sm text-muted">{job.location}</p>
                    {/* What shipped here: each opens its case in the Work section. */}
                    {job.projects && (
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {job.projects.flatMap((id) => projects.filter((p) => p.id === id)).map((p) => (
                          <li key={p.id}>
                            <button
                              type="button"
                              onClick={() => requestOpenProject(p.id)}
                              aria-label={ui.projects.openCase(p.name)}
                              className="cursor-pointer rounded-full border border-moss/40 bg-moss-soft px-3 py-1 text-xs leading-5 text-ink transition-colors hover:border-moss"
                            >
                              {p.name} ↗
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          )}

          <div className={copy.showTimeline ? "mt-16 grid gap-4 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-2"}>
            <Reveal className="rounded-3xl border border-line bg-surface p-6">
              <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                <GraduationCap className="size-4 text-moss" /> {t.education}
              </p>
              <ul className="mt-4 space-y-4">
                {education.map((e) => (
                  <li key={e.institution}>
                    <p className="font-medium text-ink">{e.institution}</p>
                    <p className="text-sm text-ink-2">{e.degree}</p>
                    <p className="text-xs text-muted">
                      {e.years} · {e.location}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.08} className="rounded-3xl border border-line bg-surface p-6">
              <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                <Languages className="size-4 text-moss" /> {t.languages}
              </p>
              <ul className="mt-4 space-y-4">
                {site.languages.map((l) => (
                  <li key={l.language}>
                    <p className="font-medium text-ink">{l.language}</p>
                    <p className="text-sm text-ink-2">{l.level}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-muted">{site.availability}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
