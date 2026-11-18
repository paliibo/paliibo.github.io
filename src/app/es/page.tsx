import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";
import { es } from "@/data/locales/es";

// The Spanish version of the home page. Content comes from src/data/locales/es.ts, interface strings
// from src/data/ui.ts. The root layout corrects <html lang> to "es" for this path before paint.
const title = `${es.site.name} — ${es.site.role}`;
const description = es.site.summary;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/es", languages: { en: "/", es: "/es" } },
  openGraph: { locale: "es_ES", title, description, url: "/es" },
  twitter: { title, description },
};

export default function HomeEs() {
  return <HomePage locale="es" />;
}
