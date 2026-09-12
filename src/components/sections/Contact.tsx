"use client";

import { Check, Copy, Download, Mail } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/Icons";
import { IconLink } from "@/components/ui/IconLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/profile";

const RING_TEXT = "OPEN TO WORK · ALICANTE, SPAIN · REMOTE ACROSS THE EU · RELOCATION · ";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable: the mailto link still works */
    }
  };

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden border-t border-line py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 -z-10 size-[36rem] rounded-full bg-[radial-gradient(circle,var(--glow),transparent_62%)] blur-2xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12">
        <Reveal className="flex justify-center lg:col-span-4 lg:justify-start">
          <div className="relative size-64 sm:size-80">
            <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 size-full" aria-hidden>
              <defs>
                <path id="ring" d="M100,100 m-90,0 a90,90 0 1,1 180,0 a90,90 0 1,1 -180,0" />
              </defs>
              <text className="fill-muted font-mono" fontSize="9" letterSpacing="2.4" textLength="565" lengthAdjust="spacing">
                <textPath href="#ring">{RING_TEXT}</textPath>
              </text>
            </svg>
            <Image src={site.photo} alt="Portrait of Bohdan Palii" width={460} height={460} className="absolute left-[13%] top-[13%] size-[74%] rounded-full object-cover" />
          </div>
        </Reveal>

        <div className="lg:col-span-8">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              <span className="text-moss">06</span>
              <span className="mx-2">—</span>
              Contact
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.6rem,6.5vw,5.5rem)] leading-[1] tracking-tight text-ink">Let&apos;s build something that ships.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">
              {site.availability} English C1, Ukrainian native. The fastest way to reach me is email.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href={`mailto:${site.email}`} className="btn btn-primary">
                <Mail className="size-4" /> {site.email}
              </a>
            </Magnetic>
            <button type="button" onClick={copy} className="btn btn-ghost" aria-live="polite">
              {copied ? <Check className="size-4 text-moss" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy email"}
            </button>
            <a href={site.cvPath} download className="btn btn-ghost">
              <Download className="size-4" /> CV (PDF)
            </a>
            <div className="flex items-center gap-2">
              <IconLink href={site.linkedin} label="LinkedIn">
                <LinkedInIcon />
              </IconLink>
              <IconLink href={site.github} label="GitHub">
                <GitHubIcon />
              </IconLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
