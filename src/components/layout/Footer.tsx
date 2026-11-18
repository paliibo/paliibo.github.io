"use client";

import { useBugsFixed } from "@/lib/bugs";
import { useContent, useUI } from "@/lib/i18n";

type FooterProps = {
  /** Show the email and LinkedIn links. Off on the contact-free /upwork page. */
  showContact?: boolean;
};

export function Footer({ showContact = true }: FooterProps) {
  const { site } = useContent();
  const t = useUI().footer;
  // Bugs fed to the chameleon in the hero, kept between visits.
  const bugs = useBugsFixed();

  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted sm:flex-row sm:px-8">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} {site.name}
          {bugs > 0 && (
            <span className="font-mono text-xs">
              {" "}
              · {t.bugs(bugs)}
              {bugs >= 10 && <span className="text-moss"> · {t.hunter}</span>}
            </span>
          )}
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {showContact && (
            <a href={`mailto:${site.email}`} className="text-ink-2 transition-colors hover:text-ink">
              {site.email}
            </a>
          )}
          <a href={site.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
            GitHub
          </a>
          {showContact && (
            <a href={site.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
              LinkedIn
            </a>
          )}
          <a href="#top" className="transition-colors hover:text-ink">
            {t.backToTop}
          </a>
        </nav>
      </div>
    </footer>
  );
}
