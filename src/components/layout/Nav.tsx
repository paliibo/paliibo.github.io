"use client";

import { Download, Menu, X } from "lucide-react";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "@/data/profile";
import { cn, easeOutExpo } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#stack", label: "Stack" },
  { href: "#open-source", label: "Open source" },
  { href: "#contact", label: "Contact" },
];

// Used by the contact-free page (/upwork), which has no #contact section.
const linksWithoutContact = links.filter((l) => l.href !== "#contact");

type NavProps = {
  /** Show the Contact link, CV download and email button. Off on the contact-free /upwork page. */
  showContact?: boolean;
};

export function Nav({ showContact = true }: NavProps) {
  const items = showContact ? links : linksWithoutContact;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  // Section spy: whichever section crosses the middle of the viewport is "active".
  useEffect(() => {
    const sections = items
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  // Lock the page while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) lenis?.stop();
    else lenis?.start();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, lenis]);

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
          <a href="#top" className="px-3 font-display text-lg leading-none text-ink" aria-label="Back to top">
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
              <Download className="size-3.5" /> CV
            </a>
          )}
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
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
                  <Download className="size-4" /> Download CV
                </a>
                <a href={`mailto:${site.email}`} className="btn btn-ghost">
                  Email me
                </a>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
