import type { CSSProperties } from "react";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Expertise } from "@/components/sections/Expertise";
import { Hero } from "@/components/sections/Hero";
import { OpenSource } from "@/components/sections/OpenSource";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Stats } from "@/components/sections/Stats";
import { TechMarquee } from "@/components/sections/TechMarquee";
import type { Locale } from "@/data/ui";
import { getRepoActivity } from "@/lib/github";
import { LocaleProvider } from "@/lib/i18n";

type HomePageProps = {
  locale?: Locale;
  /** Off on the contact-free /upwork page: no email, LinkedIn, CV download or Contact section. */
  showContact?: boolean;
};

/** The one page of the site, in the given language. The routes (/, /es, /upwork) only choose its options. */
export async function HomePage({ locale = "en", showContact = true }: HomePageProps) {
  // Commit activity of the public repositories, read from GitHub while the site is being built.
  const activity = await getRepoActivity();
  // The section index shows a total ("02 / 06"); without Contact there are five numbered sections.
  const style = showContact ? undefined : ({ "--section-total": '"05"' } as CSSProperties);

  return (
    <LocaleProvider locale={locale}>
      <ScrollProgress />
      <Nav showContact={showContact} />
      <main style={style}>
        <Hero showContact={showContact} />
        <TechMarquee />
        <Stats />
        <Expertise />
        <Projects />
        <Experience />
        <Skills />
        <OpenSource activity={activity} />
        {showContact && <Contact />}
      </main>
      <Footer showContact={showContact} />
    </LocaleProvider>
  );
}
