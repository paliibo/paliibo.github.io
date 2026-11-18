"use client";

import { ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { RepoActivity } from "@/lib/github";
import { useContent, useUI } from "@/lib/i18n";

/** Commits per week as a strip of bars: a quiet week is a tick on the baseline. */
function ActivityGraph({ activity, label }: { activity: RepoActivity; label: string }) {
  const max = Math.max(...activity.weeks, 1), H = 24;
  return (
    <div>
      <svg viewBox={`0 0 ${activity.weeks.length * 4} ${H}`} preserveAspectRatio="none" role="img" aria-label={label} className="h-6 w-full">
        {activity.weeks.map((n, i) => {
          const h = n ? Math.max(2.5, (n / max) * H) : 1;
          return <rect key={i} x={i * 4} y={H - h} width="3" height={h} rx="0.6" className={n ? "fill-moss" : "fill-line-strong"} />;
        })}
      </svg>
      <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">{label}</p>
    </div>
  );
}

type OpenSourceProps = {
  /** Commit activity per repository name, read from GitHub at build time; a missing one shows no graph. */
  activity?: Record<string, RepoActivity>;
};

export function OpenSource({ activity = {} }: OpenSourceProps) {
  const { openSource, site } = useContent();
  const t = useUI().openSource;

  return (
    <section id="open-source" className="scroll-mt-24 border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="05"
            eyebrow={t.eyebrow}
            title={t.title}
            description={t.description}
          />
          <Reveal delay={0.1}>
            <a href={site.github} target="_blank" rel="noreferrer" className="btn btn-ghost">
              <GitHubIcon className="size-4" /> github.com/{site.githubHandle}
            </a>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {openSource.map((repo, i) => (
            <Reveal key={repo.name} delay={(i % 3) * 0.08}>
              <article className="group flex h-full flex-col gap-4 rounded-3xl border border-line bg-surface p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-moss hover:shadow-card">
                <h3 className="font-display text-2xl text-ink">{repo.name}</h3>
                <p className="leading-relaxed text-ink-2">{repo.description}</p>
                <p className="mt-auto font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{repo.stack}</p>
                {activity[repo.name] && <ActivityGraph activity={activity[repo.name]} label={t.activity(activity[repo.name].commits, activity[repo.name].weeks.length)} />}
                <div className="flex gap-2 border-t border-line pt-4 text-sm">
                  <a href={repo.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-ink">
                    <GitHubIcon className="size-4" /> {t.repo}
                  </a>
                  {repo.live && (
                    <a href={repo.live} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1.5 text-moss transition-colors hover:text-ink">
                      {t.liveDemo} <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
