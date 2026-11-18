"use client";

import { ArrowUpRight, Check, Copy, CornerDownLeft, Download, FolderOpen, Hash, Languages, Mail, Search, SunMoon } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useContent, useScrollTo, useUI } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { requestOpenProject } from "@/lib/workBus";

type Group = "sections" | "projects" | "actions";
type Command = {
  id: string;
  group: Group;
  label: string;
  /** Shown muted after the label and searched together with it. */
  detail?: string;
  icon: ReactNode;
  /** Runs after the palette has closed, unless `stay` keeps it open. */
  run: () => void;
  stay?: boolean;
};

const GROUPS: Group[] = ["sections", "projects", "actions"];

type PaletteProps = {
  /** In-page sections the palette can jump to (the nav's own links). */
  sections: { href: string; label: string }[];
  /** Offer the email, CV, LinkedIn and language commands. Off on the contact-free /upwork page. */
  showContact: boolean;
  onClose: () => void;
};

/**
 * ⌘K palette: jump to a section, open a project case, or run an action (copy the email, switch the
 * theme, download the CV). Mounted by the nav only while open, so its state starts fresh each time.
 */
export function CommandPalette({ sections, showContact, onClose }: PaletteProps) {
  const { site, projects } = useContent();
  const ui = useUI();
  const t = ui.palette;
  const scrollTo = useScrollTo();
  const { toggle } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  const commands = useMemo<Command[]>(() => {
    const icon = "size-4 shrink-0";
    const all: Command[] = [
      ...sections.map((s) => ({ id: `section-${s.href}`, group: "sections" as const, label: s.label, icon: <Hash className={icon} />, run: () => scrollTo(s.href) })),
      ...projects.map((p) => ({
        id: `project-${p.id}`,
        group: "projects" as const,
        label: p.name,
        detail: p.tagline,
        icon: <FolderOpen className={icon} />,
        run: () => requestOpenProject(p.id),
      })),
    ];
    if (showContact) {
      all.push(
        {
          id: "copy-email",
          group: "actions",
          label: copied ? t.emailCopied : t.copyEmail,
          detail: site.email,
          icon: copied ? <Check className={cn(icon, "text-moss")} /> : <Copy className={icon} />,
          stay: true,
          run: () => {
            navigator.clipboard
              .writeText(site.email)
              .then(() => {
                setCopied(true);
                window.setTimeout(onClose, 900);
              })
              .catch(() => {
                window.location.href = `mailto:${site.email}`; // clipboard blocked: open the mail client instead
              });
          },
        },
        { id: "email", group: "actions", label: t.emailMe, icon: <Mail className={icon} />, run: () => { window.location.href = `mailto:${site.email}`; } },
        {
          id: "cv",
          group: "actions",
          label: t.downloadCv,
          icon: <Download className={icon} />,
          run: () => {
            const a = document.createElement("a");
            a.href = site.cvPath;
            a.download = "";
            a.click();
          },
        },
      );
    }
    all.push({ id: "theme", group: "actions", label: t.toggleTheme, icon: <SunMoon className={icon} />, stay: true, run: toggle });
    all.push({ id: "github", group: "actions", label: t.github, detail: site.githubHandle, icon: <ArrowUpRight className={icon} />, run: () => window.open(site.github, "_blank", "noreferrer") });
    if (showContact) {
      all.push(
        { id: "linkedin", group: "actions", label: t.linkedin, icon: <ArrowUpRight className={icon} />, run: () => window.open(site.linkedin, "_blank", "noreferrer") },
        { id: "language", group: "actions", label: t.language, icon: <Languages className={icon} />, run: () => router.push(ui.nav.otherLocale.href) },
      );
    }
    return all;
  }, [sections, projects, showContact, copied, t, ui.nav.otherLocale.href, site, scrollTo, toggle, router, onClose]);

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return commands.filter((c) => {
      const text = `${c.label} ${c.detail ?? ""}`.toLowerCase();
      return words.every((w) => text.includes(w));
    });
  }, [commands, query]);
  const active = Math.min(index, Math.max(0, results.length - 1));

  // Keep the highlighted row in view while moving through the list with the arrows.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>("[aria-selected='true']")?.scrollIntoView({ block: "nearest" });
  }, [active, query]);

  const run = (command: Command | undefined) => {
    if (!command) return;
    if (command.stay) return command.run();
    onClose();
    // The nav unlocks scrolling when the palette unmounts; act on the next frame, once it has.
    requestAnimationFrame(command.run);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((active + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((active - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[65] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label={ui.nav.search} onKeyDown={onKeyDown}>
      <button type="button" aria-label={ui.dialog.close} tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18 }}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-card"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-4 shrink-0 text-muted" aria-hidden />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            placeholder={t.placeholder}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
            autoComplete="off"
            spellCheck={false}
            className="h-13 w-full min-w-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
          />
          <kbd className="shrink-0 rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">esc</kbd>
        </div>

        <ul ref={listRef} id="palette-list" role="listbox" data-lenis-prevent="true" className="max-h-[min(52vh,26rem)] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">{t.empty}</li>}
          {GROUPS.map((group) => {
            const rows = results.filter((c) => c.group === group);
            if (!rows.length) return null;
            return (
              <li key={group} role="presentation">
                <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{t[group]}</p>
                <ul role="group">
                  {rows.map((c) => {
                    const selected = results[active]?.id === c.id;
                    return (
                      <li
                        key={c.id}
                        id={`palette-${c.id}`}
                        role="option"
                        aria-selected={selected}
                        onClick={() => run(c)}
                        onPointerMove={() => setIndex(results.indexOf(c))}
                        className={cn("flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm", selected ? "bg-moss-soft text-ink" : "text-ink-2")}
                      >
                        <span className={selected ? "text-moss" : "text-muted"}>{c.icon}</span>
                        <span className="shrink-0">{c.label}</span>
                        {c.detail && <span className="min-w-0 truncate text-muted">{c.detail}</span>}
                        {selected && <CornerDownLeft className="ml-auto size-3.5 shrink-0 text-muted" aria-hidden />}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>

        <p className="hidden border-t border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:block">{t.hint}</p>
      </motion.div>
    </div>,
    document.body,
  );
}
