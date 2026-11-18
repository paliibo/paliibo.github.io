"use client";

import { Download, Menu, Search, X } from "lucide-react";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useContent, useUI } from "@/lib/i18n";
import { cn, easeOutExpo } from "@/lib/utils";
import { CommandPalette } from "./CommandPalette";
import { ThemeToggle } from "./ThemeToggle";

type NavProps = {
  /** Show the Contact link, CV download, email button and language switch. Off on the contact-free /upwork page. */
  showContact?: boolean;
};

const subscribeNoop = () => () => {};
// The palette shortcut as the visitor's keyboard prints it. The server render assumes a Mac.
const isApple = () => /Mac|iPhone|iPad/.test(navigator.platform);

export function Nav({ showContact = true }: NavProps) {
  const { site } = useContent();
  const t = useUI().nav;
  // The contact-free page (/upwork) has no #contact section.
  const items = useMemo(
    () =>
      [
        { href: "#work", label: t.work },
        { href: "#experience", label: t.experience },
        { href: "#stack", label: t.stack },
        { href: "#open-source", label: t.openSource },
        { href: "#contact", label: t.contact },
      ].filter((l) => showContact || l.href !== "#contact"),
    [t, showContact],
  );
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const lenis = useLenis();
  const apple = useSyncExternalStore(subscribeNoop, isApple, () => true);
  const closePalette = useCallback(() => setPalette(false), []);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  // Section spy: whichever section crosses the middle of the viewport is "active". When that section
  // leaves and no other took over (back at the hero, say), nothing is highlighted.
  useEffect(() => {
    const sections = items
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) setActive(id);
          else setActive((current) => (current === id ? null : current));
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  // Lock the page while the mobile menu or the command palette is open.
  useEffect(() => {
    const locked = open || palette;
    document.body.style.overflow = locked ? "hidden" : "";
    if (locked) lenis?.stop();
    else lenis?.start();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, palette, lenis]);

  // ⌘K / Ctrl+K opens the command palette from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "k" || !(e.metaKey || e.ctrlKey) || e.altKey) return;
      e.preventDefault();
      setOpen(false);
      setPalette((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4">
        <nav
          style={{ animationDelay: "0.2s" }}
          className={cn(
            "anim-fade-down pointer-events-auto flex items-center gap-1 rounded-full border px-2 py-1.5 transition-[background-color,border-color,box-shadow] duration-500",
            scrolled || open ? "border-line bg-canvas/80 shadow-card backdrop-blur-md" : "border-transparent bg-transparent",
          )}
        >
          <a href="#top" className="px-3 font-display text-lg leading-none text-ink" aria-label={t.backToTop}>
            BP
          </a>

          <ul className="hidden items-center md:flex">
            {items.map((l) => {
              const isActive = active === l.href.slice(1);
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={cn("relative block rounded-full px-3.5 py-1.5 text-sm transition-colors", isActive ? "text-ink" : "text-muted hover:text-ink")}
                  >
                    {isActive && (
                      <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-moss-soft" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                    )}
                    <span className="relative">{l.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {showContact && (
            <a href={site.cvPath} download className="btn btn-primary ml-1 hidden !px-4 !py-2 text-xs md:inline-flex">
              <Download className="size-3.5" /> {t.cv}
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setPalette(true);
            }}
            aria-label={t.search}
            aria-keyshortcuts="Meta+K Control+K"
            className="flex h-9 items-center gap-1.5 rounded-full px-2.5 text-muted transition-colors hover:bg-moss-soft hover:text-ink"
          >
            <Search className="size-4" />
            <kbd className="hidden font-mono text-[10px] tracking-[0.08em] lg:inline">{apple ? "⌘K" : "Ctrl K"}</kbd>
          </button>
          {showContact && (
            <Link
              href={t.otherLocale.href}
              hrefLang={t.otherLocale.code.toLowerCase()}
              aria-label={t.otherLocale.name}
              title={t.otherLocale.name}
              className="grid h-9 place-items-center rounded-full px-2.5 font-mono text-[11px] tracking-[0.1em] text-muted transition-colors hover:bg-moss-soft hover:text-ink"
            >
              {t.otherLocale.code}
            </Link>
          )}
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t.closeMenu : t.openMenu}
            aria-expanded={open}
            className="grid size-9 place-items-center rounded-full text-ink md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 flex flex-col justify-center bg-canvas px-8 md:hidden"
          >
            <ul className="space-y-2">
              {items.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.08 + i * 0.06 }}
                >
                  <a href={l.href} onClick={() => setOpen(false)} className="block font-display text-4xl text-ink">
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            {showContact && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-10 flex flex-wrap gap-3">
                <a href={site.cvPath} download className="btn btn-primary">
                  <Download className="size-4" /> {t.downloadCv}
                </a>
                <a href={`mailto:${site.email}`} className="btn btn-ghost">
                  {t.emailMe}
                </a>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {palette && <CommandPalette sections={items} showContact={showContact} onClose={closePalette} />}
    </>
  );
}
