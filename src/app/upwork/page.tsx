import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";
import { site } from "@/data/profile";

// Contact-free version of the home page, linked from the Upwork profile. Upwork does not allow contact
// details on linked sites, so this page has no email, LinkedIn, CV download, contact section, language
// switch or JSON-LD. It is never indexed, so it cannot compete with the main page in search.
export const metadata: Metadata = {
  title: { absolute: `${site.name} — ${site.role}` },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function UpworkPage() {
  return <HomePage showContact={false} />;
}
