/**
 * Which content variant this build renders.
 *
 *   default     the standard portfolio
 *   healthcare  healthcare-focused variant (src/data/variants/healthcare.ts)
 *
 * Build-time only: nothing on the page shows it, and only the chosen variant is bundled
 * (next.config.ts aliases src/data/variants/active.ts to it). Choose it with:
 *   - locally:  pnpm dev:healthcare / pnpm build:healthcare   (or NEXT_PUBLIC_VARIANT=healthcare pnpm dev)
 *   - deploy:   set the GitHub repository variable VARIANT=healthcare and re-run the Pages workflow;
 *               delete the variable (or set it to default) to go back
 *   - in code:  change DEFAULT_VARIANT below and push
 */
export type Variant = "default" | "healthcare";

const DEFAULT_VARIANT: Variant = "default";

const variants: readonly Variant[] = ["default", "healthcare"];
const requested = process.env.NEXT_PUBLIC_VARIANT as Variant | undefined;

export const variant: Variant = requested && variants.includes(requested) ? requested : DEFAULT_VARIANT;
