import type { Project } from "@/data/profile";
import { cn } from "@/lib/utils";

/** The main stops of a system as a strip of boxes joined by the same moving dashes as the hero diagram. */
/** `className` sets the display (and so where the strip shows): "flex", or "hidden lg:flex". */
export function MiniFlow({ steps, className }: { steps: NonNullable<Project["flow"]>; className?: string }) {
  return (
    <ol className={cn("items-stretch", className ?? "flex")}>
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
