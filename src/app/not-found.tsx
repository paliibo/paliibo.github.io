import type { Metadata } from "next";
import { NotFoundScene } from "@/components/pages/NotFoundScene";

export const metadata: Metadata = { title: "404 — page not found", robots: { index: false, follow: false } };

// Rendered inside the root layout and exported as 404.html, which static hosts serve for unknown paths.
export default function NotFound() {
  return <NotFoundScene />;
}
