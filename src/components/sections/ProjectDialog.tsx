"use client";

import { X } from "lucide-react";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Chip } from "@/components/ui/Chip";
import type { Project } from "@/data/profile";

const subscribeNoop = () => () => {};

export function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);
  // true only on the client, without a setState-in-effect
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  useEffect(() => {
    if (!project) return;
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 250);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
      lenis?.start();
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, [project, onClose, lenis]);

  if (!mounted) return null; // portals need document.body: render nothing during SSR

  return createPortal(
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title">
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          <motion.div
            layoutId={`card-${project.id}`}
            data-lenis-prevent="true"
            transition={{ type: "spring", stiffness: 240, damping: 30 }}
            className="relative max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-line bg-surface shadow-card"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.35 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="p-6 sm:p-10"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                    {project.role} · {project.country}
                  </p>
                  <h3 id="project-dialog-title" className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">
                    {project.title}
                  </h3>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-moss hover:bg-moss-soft hover:text-ink"
                >
                  <X className="size-4" />
                </button>
              </div>

              <ul className="mt-8 space-y-4">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-4 leading-relaxed text-ink-2">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-moss" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t border-line pt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Stack</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <li key={s}>
                      <Chip>{s}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
