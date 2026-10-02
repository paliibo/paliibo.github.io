import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({ index, eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <Reveal className={className ?? "max-w-3xl"}>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        <span className="text-moss">{index}</span>
        <span className="mx-2">—</span>
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.04] tracking-tight text-ink">{title}</h2>
      {description ? <p className="mt-5 text-lg leading-relaxed text-ink-2">{description}</p> : null}
    </Reveal>
  );
}
