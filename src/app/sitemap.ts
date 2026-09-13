import type { MetadataRoute } from "next";
import { site } from "@/data/profile";
import { indexable } from "./layout";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexable) return [];
  return [{ url: site.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
