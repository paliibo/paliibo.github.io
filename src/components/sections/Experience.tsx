"use client";

import { GraduationCap, Languages } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { education, jobs, site } from "@/data/profile";

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.55"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.4 });

  return (
    <section id="experience" className="scroll-mt-24 border-t border-line py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              index="03"
              eyebrow="Experience"
              title="Five years, four teams, three time zones."
              description="Remote-first from the start: US, Ukrainian and now EU teams, always in English, always owning features end to end."
            />
          </div>
        </div>

        <div className="lg:col-span-8">
          <div ref={ref} className="relative pl-8 sm:pl-12">
            <div className="absolute bottom-3 left-[5px] top-3 w-px bg-line" />
            <motion.div style={{ scaleY }} className="absolute bottom-3 left-[5px] top-3 w-px origin-top bg-moss" />

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
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2">
            <Reveal className="rounded-3xl border border-line bg-surface p-6">
              <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                <GraduationCap className="size-4 text-moss" /> Education
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
                <Languages className="size-4 text-moss" /> Languages
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
