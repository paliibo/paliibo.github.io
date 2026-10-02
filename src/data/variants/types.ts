import type { ExpertiseArea, ExpertiseIcon, Job, Project } from "../profile";

/** What a variant can change on top of the standard content in src/data/profile.ts. */
export interface VariantOverrides {
  /** CV served by every "Download CV" button (file in public/). */
  cvFile?: string;
  site?: { years?: number; intro?: string; summary?: string; note?: string | null };
  heroPhrases?: string[];
  /** Expertise cards in this order; areas not listed keep their standard order after these. */
  expertiseOrder?: ExpertiseIcon[];
  expertise?: Partial<Record<ExpertiseIcon, Partial<ExpertiseArea>>>;
  /** Projects in this order (by id); projects not listed keep their standard order after these. */
  projectOrder?: string[];
  /** Per-project overrides, keyed by project id. */
  projects?: Record<string, Partial<Project>>;
  /** Replaces the employment history. */
  jobs?: Job[];
  /** Extra keywords appended to a skill group, keyed by category. */
  extraSkills?: Record<string, string[]>;
}
