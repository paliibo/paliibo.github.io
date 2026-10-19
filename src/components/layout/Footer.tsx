import { site } from "@/data/profile";

type FooterProps = {
  /** Show the LinkedIn link. Off on the contact-free /upwork page. */
  showContact?: boolean;
};

export function Footer({ showContact = true }: FooterProps) {
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted sm:flex-row sm:px-8">
        <p>
          © {new Date().getFullYear()} {site.name}. Built with Next.js, Tailwind CSS and Motion.
        </p>
        <nav className="flex gap-6">
          <a href={site.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
            GitHub
          </a>
          {showContact && (
            <a href={site.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
              LinkedIn
            </a>
          )}
          <a href="#top" className="transition-colors hover:text-ink">
            Back to top ↑
          </a>
        </nav>
      </div>
    </footer>
  );
}
