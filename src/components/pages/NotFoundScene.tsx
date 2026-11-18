"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Chameleon } from "@/components/sections/Chameleon";
import { useUI } from "@/lib/i18n";

/** The 404 page: the hero's chameleon, digesting the page that is not there. */
export function NotFoundScene() {
  const t = useUI().notFound;
  const perchRef = useRef<HTMLDivElement>(null);

  return (
    <main id="top" className="relative flex min-h-svh flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_70%_40%,#000,transparent)]" />
        <div className="absolute -right-40 top-10 size-[44rem] rounded-full bg-[radial-gradient(circle,var(--glow),transparent_62%)] blur-2xl" />
      </div>

      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 pt-5 sm:px-8">
        <Link href="/" className="px-1 font-display text-lg leading-none text-ink" aria-label={t.back}>
          BP
        </Link>
        <ThemeToggle />
      </header>

      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 pb-24 pt-10 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{t.eyebrow}</p>
          {/* The bitten-off digits: the outline style of the hero surname. */}
          <p aria-hidden className="text-outline mt-4 font-display text-[clamp(6rem,22vw,15rem)] leading-[0.85] tracking-[-0.02em]">
            4<span className="opacity-25">0</span>4
          </p>
          <h1 className="mt-6 font-display text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.04] tracking-tight text-ink">{t.title}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">{t.text}</p>
          <Link href="/" className="btn btn-primary relative z-20 mt-9">
            <ArrowLeft className="size-4" /> {t.back}
          </Link>
        </div>

        <div className="lg:col-span-5">
          {/* Room above the branch for the bugs to fly in; the chameleon sits on the perch below it. */}
          <div className="h-24 lg:h-56" />
          <div ref={perchRef} className="aspect-[135/60] max-h-[210px] w-full" />
        </div>
      </div>

      <Chameleon perchRef={perchRef} mood="full" />
    </main>
  );
}
