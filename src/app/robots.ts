import type { MetadataRoute } from "next";
import { site } from "@/data/profile";
import { indexable } from "./layout";

export const dynamic = "force-static";

// Crawling stays allowed on purpose: a robot that cannot fetch the page never sees the noindex tag.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(indexable ? { sitemap: `${site.url}/sitemap.xml` } : {}),
  };
}
