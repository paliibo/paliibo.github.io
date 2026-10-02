import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { stats } from "@/data/profile";

export function Stats() {
  return (
    <section aria-label="Key numbers" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
      <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="border-l border-line pl-5 sm:pl-7">
            <dd className="font-display text-5xl leading-none text-ink sm:text-6xl">
              <CountUp value={s.value} suffix={s.suffix} />
            </dd>
            <dt className="mt-3 text-sm text-muted">{s.label}</dt>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
