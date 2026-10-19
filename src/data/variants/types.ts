import type { ExpertiseArea, ExpertiseIcon, Job, Project, SkillGroup } from "../profile";

/** What a variant can change on top of the standard content in src/data/profile.ts. */
export interface VariantOverrides {
  /** CV served by every "Download CV" button (file in public/). */
  cvFile?: string;
  site?: { years?: number; yearsSuffix?: string; intro?: string; summary?: string; note?: string | null };
  heroPhrases?: string[];
  /** Expertise cards in this order; areas not listed keep their standard order after these. */
  expertiseOrder?: ExpertiseIcon[];
  expertise?: Partial<Record<ExpertiseIcon, Partial<ExpertiseArea>>>;
  /** Projects in this order (by id); projects not listed keep their standard order after these. */
  projectOrder?: string[];
  /** Show only these projects, in this order (ids from the standard list or addProjects). */
  onlyProjects?: string[];
  /** Projects that exist only in this variant. */
  addProjects?: Project[];
  /** Per-project overrides, keyed by project id. */
  projects?: Record<string, Partial<Project>>;
  /** Replaces the employment history. */
  jobs?: Job[];
  /** Hides the dated employment timeline in the Experience section. */
  hideTimeline?: boolean;
  /** Overrides stat values, keyed by stat label. */
  statValues?: Record<string, number>;
  /** Section copy. */
  copy?: { projectsDescription?: string; experienceTitle?: string; experienceDescription?: string };
  /** Replaces the hero system diagram. */
  diagram?: Diagram;
  /** Replaces the whole skills list. */
  skills?: SkillGroup[];
  /** Extra keywords appended to a skill group, keyed by category. */
  extraSkills?: Record<string, string[]>;
}

export interface DiagramNode {
  id: string;
  x: number;
  y: number;
  label: string;
  sub: string;
  hot?: boolean;
}

export interface DiagramEdge {
  id: string;
  /** SVG path the animated packet travels along (viewBox 580 × 400). */
  d: string;
  dur: number;
  begin: number;
}

export interface Diagram {
  caption: string;
  ariaLabel: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  /** Lines cycled in the activity log under the diagram. */
  log: string[];
}
