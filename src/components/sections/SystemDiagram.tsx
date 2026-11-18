"use client";

import { useReducedMotion } from "motion/react";
import { useMemo } from "react";
import { heroDiagram } from "@/data/profile";
import type { DiagramEdge, DiagramNode } from "@/data/variants/types";
import { useContent, useScrollTo, useUI } from "@/lib/i18n";
import { projectsUsing } from "@/lib/tech";
import { setTechFilter } from "@/lib/workBus";
import { ActivityLog } from "./ActivityLog";

const W = 136;
const H = 52;

const DEFAULT_NODES: DiagramNode[] = [
  { id: "web", x: 16, y: 24, label: "Next.js", sub: "web app" },
  { id: "mobile", x: 16, y: 124, label: "Expo", sub: "iOS · Android" },
  { id: "redis", x: 16, y: 324, label: "Redis", sub: "cache · locks" },
  { id: "api", x: 212, y: 74, label: "NestJS API", sub: "REST · WS · RBAC", hot: true },
  { id: "db", x: 212, y: 324, label: "PostgreSQL", sub: "pgvector · PostGIS" },
  { id: "queue", x: 408, y: 24, label: "Queue", sub: "BullMQ · Pub/Sub" },
  { id: "workers", x: 408, y: 124, label: "Workers", sub: "Cloud Run · Tasks" },
  { id: "llm", x: 408, y: 224, label: "LLM", sub: "OpenAI · Anthropic" },
  { id: "integrations", x: 408, y: 324, label: "Integrations", sub: "Stripe · EHR · Twilio" },
];

// Every edge is a path a "packet" travels along (SMIL animateMotion, no JS on the hot path).
const DEFAULT_EDGES: DiagramEdge[] = [
  { id: "sd-web-api", d: "M152 50 C182 50 182 100 212 100", dur: 2.6, begin: -0.2 },
  { id: "sd-mobile-api", d: "M152 150 C182 150 182 100 212 100", dur: 2.6, begin: -1.5 },
  { id: "sd-api-queue", d: "M348 100 C378 100 378 50 408 50", dur: 2.2, begin: -0.8 },
  { id: "sd-queue-workers", d: "M476 76 L476 124", dur: 1.4, begin: -1.2 },
  { id: "sd-workers-llm", d: "M476 176 L476 224", dur: 1.4, begin: -0.5 },
  { id: "sd-workers-integrations", d: "M544 150 C574 150 574 350 544 350", dur: 2.6, begin: -2.1 },
  { id: "sd-api-db", d: "M280 126 L280 324", dur: 2.4, begin: -1.0 },
  { id: "sd-workers-db", d: "M408 150 C370 150 390 350 348 350", dur: 2.8, begin: -2.4 },
  { id: "sd-db-redis", d: "M212 350 L152 350", dur: 1.6, begin: -0.9 },
];

const NODES = heroDiagram?.nodes ?? DEFAULT_NODES;
const EDGES = heroDiagram?.edges ?? DEFAULT_EDGES;

/** What a node stands for when it is used as a filter: its label and each item of its subtitle. */
const nodeTechs = (n: DiagramNode) => [n.label, ...n.sub.split(" · ")];

export function SystemDiagram() {
  const reduce = useReducedMotion();
  const { projects } = useContent();
  const t = useUI().diagram;
  const scrollTo = useScrollTo();

  // A node with projects behind it is a filter: it leads to the Work section showing those projects.
  const used = useMemo(() => new Map(NODES.map((n) => [n.id, projectsUsing(projects, nodeTechs(n)).length])), [projects]);
  const pick = (n: DiagramNode) => {
    setTechFilter({ label: n.label, techs: nodeTechs(n) });
    scrollTo("#work");
  };

  return (
    <div className="rounded-3xl border border-line bg-surface/80 p-4 shadow-card backdrop-blur-sm sm:p-5">
      <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
        <span className="truncate">
          {heroDiagram?.caption ?? t.caption} <span className="normal-case tracking-normal opacity-70">· {t.hint}</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-2">
          <span className="live-dot size-1.5 rounded-full bg-moss" />
          {t.live}
        </span>
      </div>

      <svg viewBox="0 0 580 400" className="mt-4 w-full" role="group" aria-label={heroDiagram?.ariaLabel ?? t.aria}>
        <defs>
          <marker id="sd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="fill-line-strong" />
          </marker>
        </defs>

        {EDGES.map((e) => (
          <path key={e.id} id={e.id} d={e.d} fill="none" strokeWidth="1.2" markerEnd="url(#sd-arrow)" className="edge-flow stroke-line-strong" />
        ))}

        {!reduce &&
          EDGES.map((e) => (
            <g key={`${e.id}-packet`}>
              <circle r="7" className="fill-moss" opacity="0.18">
                <animateMotion dur={`${e.dur}s`} begin={`${e.begin}s`} repeatCount="indefinite">
                  <mpath href={`#${e.id}`} />
                </animateMotion>
              </circle>
              <circle r="3" className="fill-moss">
                <animateMotion dur={`${e.dur}s`} begin={`${e.begin}s`} repeatCount="indefinite">
                  <mpath href={`#${e.id}`} />
                </animateMotion>
              </circle>
            </g>
          ))}

        {NODES.map((n) => {
          const count = used.get(n.id) ?? 0;
          const link =
            count > 0
              ? {
                  role: "button",
                  tabIndex: 0,
                  "data-diagram-node": "",
                  onClick: () => pick(n),
                  onKeyDown: (e: React.KeyboardEvent) => {
                    if (e.key !== "Enter" && e.key !== " ") return;
                    e.preventDefault();
                    pick(n);
                  },
                }
              : {};
          return (
          <g key={n.id} transform={`translate(${n.x} ${n.y})`} className={count > 0 ? "group/node cursor-pointer outline-none" : undefined} {...link}>
            {count > 0 && <title>{t.nodeTitle(n.label, count)}</title>}
            <rect
              width={W}
              height={H}
              rx="12"
              className={`fill-surface transition-[stroke] duration-200 group-hover/node:stroke-moss group-focus-visible/node:stroke-moss ${n.hot ? "stroke-moss" : "stroke-line-strong"}`}
              strokeWidth={n.hot ? 1.4 : 1}
            />
            {n.hot && (
              <circle cx={W - 14} cy="14" r="3" className="fill-moss">
                <animate attributeName="opacity" values="1;0.25;1" dur="1.8s" repeatCount="indefinite" />
              </circle>
            )}
            <text x="14" y="22" className="fill-ink font-sans" fontSize="13" fontWeight="600">
              {n.label}
            </text>
            <text x="14" y="40" className="fill-muted font-mono" fontSize="9.5">
              {n.sub}
            </text>
          </g>
          );
        })}
      </svg>

      <div className="relative mt-3 border-t border-line pt-3">
        <ActivityLog lines={heroDiagram?.log} />
      </div>
    </div>
  );
}
