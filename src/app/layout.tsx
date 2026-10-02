import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cantata_One, Catamaran, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { site } from "@/data/profile";

const cantata = Cantata_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cantata",
  display: "swap",
});

const catamaran = Catamaran({
  subsets: ["latin"],
  variable: "--font-catamaran",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Search indexing is opt-in: the site ships <meta name="robots" content="noindex, nofollow"> unless the
// build sets NEXT_PUBLIC_INDEXABLE=1 (the Pages workflow maps the repo variable INDEXABLE to it).
export const indexable = ["1", "true"].includes(process.env.NEXT_PUBLIC_INDEXABLE ?? "");

const title = `${site.name} — ${site.role}`;
const description = `${site.role} with ${site.years} years of experience building production SaaS for healthcare, fintech, logistics and education teams across the UK, EU and US. TypeScript across the stack: NestJS, React, Next.js, React Native and PostgreSQL.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s · ${site.name}` },
  description,
  keywords: [
    "Bohdan Palii",
    "Full-Stack Engineer",
    "TypeScript",
    "NestJS",
    "React",
    "Next.js",
    "React Native",
    "PostgreSQL",
    "Alicante",
    "Spain",
  ],
  authors: [{ name: site.name, url: site.github }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: indexable
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f0c" },
  ],
};

// Runs before paint so the persisted theme never flashes.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cantata.variable} ${catamaran.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain flex min-h-full flex-col bg-canvas text-ink">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
