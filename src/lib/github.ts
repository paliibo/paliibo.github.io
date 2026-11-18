import { openSource, site } from "@/data/profile";

/**
 * Commit activity of the public repositories, fetched from the GitHub API when the site is built
 * (the home page is a server component, so this runs during `next build`; see components/pages/HomePage.tsx).
 * If GitHub cannot be reached the cards simply show no graph.
 */
export const ACTIVITY_WEEKS = 52;
export type RepoActivity = { /** Commits per week, oldest first. */ weeks: number[]; commits: number };

const WEEK = 7 * 24 * 60 * 60 * 1000;

async function repoActivity(repo: string, now: number): Promise<RepoActivity | null> {
  const token = process.env.GITHUB_TOKEN; // optional: only raises the rate limit
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "portfolio-build", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  // Midnight UTC, so the URL (and with it the build's fetch cache) is stable for the day.
  const since = new Date(Math.floor((now - ACTIVITY_WEEKS * WEEK) / 86_400_000) * 86_400_000).toISOString();
  const weeks = new Array<number>(ACTIVITY_WEEKS).fill(0);
  let commits = 0;
  for (let page = 1; page <= 5; page++) {
    const res = await fetch(`https://api.github.com/repos/${site.githubHandle}/${repo}/commits?per_page=100&page=${page}&since=${since}`, {
      headers,
      cache: "force-cache",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const list = (await res.json()) as { commit: { author: { date: string } } }[];
    for (const item of list) {
      const age = Math.floor((now - Date.parse(item.commit.author.date)) / WEEK);
      if (age < 0 || age >= ACTIVITY_WEEKS) continue;
      weeks[ACTIVITY_WEEKS - 1 - age]++;
      commits++;
    }
    if (list.length < 100) break;
  }
  return { weeks, commits };
}

let cached: Promise<Record<string, RepoActivity>> | null = null;

/** Activity per repository name; repositories that could not be read are left out. */
export function getRepoActivity(): Promise<Record<string, RepoActivity>> {
  cached ??= (async () => {
    const now = Date.now();
    const entries = await Promise.all(openSource.map(async (repo) => [repo.name, await repoActivity(repo.name, now).catch(() => null)] as const));
    return Object.fromEntries(entries.filter((entry): entry is readonly [string, RepoActivity] => entry[1] !== null));
  })();
  return cached;
}
