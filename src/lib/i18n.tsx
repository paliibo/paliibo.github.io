"use client";

import { useLenis } from "lenis/react";
import { createContext, useCallback, useContext, type ReactNode } from "react";
import { es } from "@/data/locales/es";
import * as en from "@/data/profile";
import { ui, type Locale, type UIStrings } from "@/data/ui";

/** Literal types of the `as const` site data widened, so a translation can replace the strings. */
type Widen<T> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : T extends readonly (infer U)[] ? readonly Widen<U>[] : T extends object ? { -readonly [K in keyof T]: Widen<T[K]> } : T;

/** Everything a page shows that depends on the language. */
export type Content = {
  site: Widen<typeof en.site>;
  heroPhrases: string[];
  expertise: typeof en.expertise;
  projects: typeof en.projects;
  projectFilters: typeof en.projectFilters;
  skills: typeof en.skills;
  stats: typeof en.stats;
  jobs: typeof en.jobs;
  education: typeof en.education;
  openSource: typeof en.openSource;
  copy: typeof en.copy;
};

const english: Content = {
  site: en.site,
  heroPhrases: en.heroPhrases,
  expertise: en.expertise,
  projects: en.projects,
  projectFilters: en.projectFilters,
  skills: en.skills,
  stats: en.stats,
  jobs: en.jobs,
  education: en.education,
  openSource: en.openSource,
  copy: en.copy,
};

const contents: Record<Locale, Content> = { en: english, es };

const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export const useLocale = (): Locale => useContext(LocaleContext);
export const useContent = (): Content => contents[useContext(LocaleContext)];
export const useUI = (): UIStrings => ui[useContext(LocaleContext)];

/** Scrolls to an element: through Lenis when smooth scrolling is on, natively otherwise. */
export function useScrollTo() {
  const lenis = useLenis();
  return useCallback(
    (selector: string, immediate = false) => {
      const el = document.querySelector<HTMLElement>(selector);
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { offset: -88, immediate });
      else el.scrollIntoView({ block: "start" });
    },
    [lenis],
  );
}
