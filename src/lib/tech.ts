import type { Project } from "@/data/profile";

/**
 * Matches a technology name from one place (a Stack chip, a node of the hero diagram) against the
 * stack lists of the projects, which spell things slightly differently: "Next.js (SSR)" and "Next.js",
 * "AWS (S3, ECS, RDS, CloudFront)" and "AWS S3", "OpenAI API" and "OpenAI".
 *
 * Every name is reduced to a set of keys: the name without its parenthetical, each item inside the
 * parentheses, and each side of a slash. Two names match when they share a key.
 */
export function techKeys(name: string): string[] {
  const inside = [...name.matchAll(/\(([^)]*)\)/g)].flatMap((m) => m[1].split(","));
  const base = name.replace(/\s*\([^)]*\)/g, "");
  const keys = new Set<string>();
  for (const part of [base, ...inside]) {
    for (const piece of part.split("/")) {
      const key = piece.trim().toLowerCase().replace(/\s+api$/, "");
      if (!key) continue;
      keys.add(key);
      // "AWS S3" is both AWS and S3.
      if (key.startsWith("aws ")) {
        keys.add("aws");
        keys.add(key.slice(4));
      }
    }
  }
  return [...keys];
}

export function usesTech(project: Project, techs: readonly string[]): boolean {
  const wanted = new Set(techs.flatMap(techKeys));
  return project.stack.some((item) => techKeys(item).some((key) => wanted.has(key)));
}

export function projectsUsing(projects: readonly Project[], techs: readonly string[]): Project[] {
  return projects.filter((p) => usesTech(p, techs));
}
