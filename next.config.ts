import type { NextConfig } from "next";
import { variant } from "./src/data/variant";

// GitHub Pages project sites live under /<repo>; user sites (owner.github.io) and custom domains
// live at the root. The deploy workflow sets NEXT_PUBLIC_BASE_PATH accordingly; locally it is empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";

const nextConfig: NextConfig = {
  // Static export: deploys to GitHub Pages, Vercel, Netlify or any static host.
  output: "export",
  basePath: basePath || undefined,
  images: { unoptimized: true },
  reactStrictMode: true,
  // Content variant (src/data/variant.ts): bundle only the chosen variant's content.
  turbopack: {
    resolveAlias: { "@/data/variants/active": `./src/data/variants/${variant}.ts` },
  },
};

export default nextConfig;
