import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function IconLink({ href, label, children, className }: { href: string; label: string; children: ReactNode; className?: string }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        "grid size-11 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-moss hover:bg-moss-soft hover:text-ink",
        className,
      )}
    >
      {children}
    </a>
  );
}
