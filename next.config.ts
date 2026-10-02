import type { NextConfig } from "next";

// GitHub Pages project sites live under /<repo>; user sites (owner.github.io) and custom domains
// live at the root. The deploy workflow sets NEXT_PUBLIC_BASE_PATH accordingly; locally it is empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";

const nextConfig: NextConfig = {
  // Static export: deploys to GitHub Pages, Vercel, Netlify or any static host.
  output: "export",
  basePath: basePath || undefined,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
