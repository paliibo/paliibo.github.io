import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Chip({ children, className, tone = "default" }: { children: ReactNode; className?: string; tone?: "default" | "moss" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs leading-5 whitespace-nowrap transition-colors",
        tone === "moss" ? "border-moss/40 bg-moss-soft text-ink" : "border-line bg-surface text-ink-2",
        className,
      )}
    >
      {children}
    </span>
  );
}
