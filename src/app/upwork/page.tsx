import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Hero } from "@/components/sections/Hero";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { Stats } from "@/components/sections/Stats";
import { Expertise } from "@/components/sections/Expertise";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { OpenSource } from "@/components/sections/OpenSource";
import { site } from "@/data/profile";

// Contact-free edition of the home page, linked from the Upwork profile. Upwork does not allow contact
// details on linked sites, so this page has no email, LinkedIn, CV download, contact section or JSON-LD.
// It is never indexed, so it cannot compete with the main page in search.
export const metadata: Metadata = {
  title: { absolute: `${site.name} — ${site.role}` },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function UpworkPage() {
  return (
    <>
      <ScrollProgress />
      <Nav showContact={false} />
      <main>
        <Hero showContact={false} />
        <TechMarquee />
        <Stats />
        <Expertise />
        <Projects />
        <Experience />
        <Skills />
        <OpenSource />
      </main>
      <Footer showContact={false} />
    </>
  );
}
