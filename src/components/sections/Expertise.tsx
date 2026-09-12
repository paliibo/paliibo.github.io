"use client";

import { CreditCard, LayoutTemplate, Server, Smartphone, Sparkles, Workflow } from "lucide-react";
import { motion } from "motion/react";
import { Chip } from "@/components/ui/Chip";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { expertise, type ExpertiseIcon } from "@/data/profile";
import { easeOutExpo } from "@/lib/utils";

const ICONS: Record<ExpertiseIcon, typeof Server> = {
  server: Server,
  workflow: Workflow,
  layout: LayoutTemplate,
  smartphone: Smartphone,
  sparkles: Sparkles,
  creditcard: CreditCard,
};

export function Expertise() {
  return (
    <section id="expertise" className="scroll-mt-24 border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="01"
          eyebrow="What I do"
          title="One engineer across the whole request path."
          description="From the screen a clinician taps to the worker that reconciles the invoice at 3 a.m. I own features end to end, so the API, the queue and the UI are designed together."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {expertise.map((area, i) => {
            const Icon = ICONS[area.icon];
            return (
              <motion.article
                key={area.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.7, ease: easeOutExpo, delay: (i % 3) * 0.08 }}
                whileHover={{ y: -4 }}
                className="group flex flex-col gap-5 rounded-3xl border border-line bg-surface p-7 transition-[border-color,box-shadow] duration-300 hover:border-moss hover:shadow-card"
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-moss-soft text-moss transition-transform duration-500 ease-out group-hover:rotate-[-8deg] group-hover:scale-110">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-2xl text-ink">{area.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-2">{area.text}</p>
                </div>
                <ul className="mt-auto flex flex-wrap gap-1.5">
                  {area.tags.map((t) => (
                    <li key={t}>
                      <Chip>{t}</Chip>
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
