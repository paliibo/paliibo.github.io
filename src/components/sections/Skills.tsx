import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skills } from "@/data/profile";

export function Skills() {
  return (
    <section id="stack" className="scroll-mt-24 border-t border-line bg-canvas-2/50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="04"
          eyebrow="Stack"
          title="Tools I reach for."
          description="The full inventory, grouped the way I think about a system: from the language down to the queue and the cloud it runs on."
        />

        <div className="mt-12 border-y border-line">
          {skills.map((group, i) => (
            <Reveal key={group.category} delay={Math.min(i, 4) * 0.04} y={16} className="grid gap-3 border-b border-line py-6 last:border-b-0 md:grid-cols-[220px_1fr] md:gap-10">
              <h3 className="pt-1.5 font-mono text-xs uppercase tracking-[0.18em] text-muted">{group.category}</h3>
              <ul className="flex flex-wrap gap-2">
                {group.keywords.map((k) => (
                  <li key={k}>
                    <Chip>{k}</Chip>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
