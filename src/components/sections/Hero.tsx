"use client";

import { ArrowDown, Download, Mail } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useState, type CSSProperties } from "react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/Icons";
import { IconLink } from "@/components/ui/IconLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { heroPhrases, site } from "@/data/profile";
import { useVisibleInterval } from "@/lib/useVisibleInterval";
import { easeOutExpo } from "@/lib/utils";
import { SystemDiagram } from "./SystemDiagram";

// Entrance animations are plain CSS keyframes (see globals.css) so the hero is
// visible and moving as soon as the HTML paints, before React hydrates.
const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

type HeroProps = {
  /** Show the CV download and the LinkedIn/email links. Off on the contact-free /upwork page. */
  showContact?: boolean;
};

export function Hero({ showContact = true }: HeroProps) {
  const reduce = useReducedMotion();
  const [phrase, setPhrase] = useState(0);

  const nextPhrase = useCallback(() => setPhrase((p) => (p + 1) % heroPhrases.length), []);
  useVisibleInterval(nextPhrase, 2600, !reduce);

  return (
    <section id="top" className="relative overflow-hidden">
      {/* backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_75%_35%,#000,transparent)]" />
        <div className="absolute -right-40 top-10 size-[44rem] rounded-full bg-[radial-gradient(circle,var(--glow),transparent_62%)] blur-2xl" />
      </div>

      <div className="mx-auto grid min-h-svh max-w-7xl items-center gap-14 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-12 lg:pb-24 lg:pt-36">
        <div className="lg:col-span-7">
          <p className="anim-fade-up inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.2em] text-muted" style={delay(0.05)}>
            <span className="live-dot size-2 rounded-full bg-moss" />
            Open to new roles · {site.location} · {site.timezone}
          </p>

          <h1 className="mt-6 font-display text-[clamp(3.6rem,11.5vw,9.5rem)] leading-[0.9] tracking-[-0.02em] text-ink">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="anim-rise block" style={delay(0.15)}>
                {site.firstName}
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="anim-rise text-outline block" style={delay(0.27)}>
                {site.lastName}
              </span>
            </span>
          </h1>

          <p className="anim-fade-up mt-8 max-w-xl text-lg leading-relaxed text-ink-2 sm:text-xl" style={delay(0.45)}>
            {site.role} with {site.years} years of shipping production SaaS for healthcare, fintech, logistics and education teams across the UK, EU and US.
          </p>

          <p className="anim-fade-up mt-3 flex flex-wrap items-baseline gap-x-2 text-lg text-ink-2 sm:text-xl" style={delay(0.55)}>
            <span>I build</span>
            <span className="relative inline-grid overflow-hidden font-medium text-ink">
              <AnimatePresence initial={false}>
                <motion.span
                  key={phrase}
                  className="whitespace-nowrap [grid-area:1/1]"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: easeOutExpo }}
                >
                  {heroPhrases[phrase]}
                </motion.span>
              </AnimatePresence>
            </span>
          </p>

          <div className="anim-fade-up mt-10 flex flex-wrap items-center gap-3" style={delay(0.7)}>
            <Magnetic>
              <a href="#work" className="btn btn-primary">
                See selected work <ArrowDown className="size-4" />
              </a>
            </Magnetic>
            {showContact && (
              <Magnetic>
                <a href={site.cvPath} download className="btn btn-ghost">
                  <Download className="size-4" /> Download CV
                </a>
              </Magnetic>
            )}
            <div className="flex items-center gap-2 sm:ml-2">
              <IconLink href={site.github} label="GitHub">
                <GitHubIcon />
              </IconLink>
              {showContact && (
                <>
                  <IconLink href={site.linkedin} label="LinkedIn">
                    <LinkedInIcon />
                  </IconLink>
                  <IconLink href={`mailto:${site.email}`} label="Email">
                    <Mail className="size-[18px]" />
                  </IconLink>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="anim-fade-up lg:col-span-5" style={delay(0.5)}>
          <SystemDiagram />
        </div>
      </div>

      <div aria-hidden className="anim-fade-up absolute bottom-8 left-5 hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted sm:left-8 lg:flex" style={delay(1.2)}>
        <span className="scroll-hint block h-10 w-px bg-moss" />
        scroll
      </div>
    </section>
  );
}
