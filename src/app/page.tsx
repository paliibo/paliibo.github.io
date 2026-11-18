import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";
import { site, skills } from "@/data/profile";

// The Spanish version lives at /es (src/app/es/page.tsx).
export const metadata: Metadata = { alternates: { canonical: "/", languages: { en: "/", es: "/es" } } };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  url: site.url,
  sameAs: [site.github, site.linkedin],
  address: { "@type": "PostalAddress", addressLocality: "Alicante", addressCountry: "ES" },
  knowsAbout: skills.flatMap((group) => group.keywords).slice(0, 40),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomePage />
    </>
  );
}
