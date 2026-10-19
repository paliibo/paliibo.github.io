import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/data/profile";

// Required for `output: "export"`: the image is rendered once at build time.
export const dynamic = "force-static";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const chips = ["TypeScript", "NestJS", "React", "Next.js", "React Native", "PostgreSQL"];

export default async function Image() {
  const cantata = await readFile(join(process.cwd(), "src/assets/fonts/CantataOne-Regular.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f5f5ef",
          color: "#1d251f",
          border: "18px solid #333f34",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#6e7378" }}>
          <span>{site.location} · Remote across the EU</span>
          <span>github.com/paliibo</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Cantata One", fontSize: 118, lineHeight: 1, letterSpacing: -2 }}>{site.name}</div>
          <div style={{ marginTop: 22, fontSize: 40, color: "#333f34" }}>{site.role}</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {chips.map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                border: "2px solid rgba(51,63,52,0.35)",
                fontSize: 24,
                color: "#333f34",
                whiteSpace: "nowrap",
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Cantata One", data: cantata, style: "normal", weight: 400 }] },
  );
}
