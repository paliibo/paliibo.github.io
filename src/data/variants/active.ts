/**
 * The variant the build renders. At build time next.config.ts aliases "@/data/variants/active" to
 * src/data/variants/<variant>.ts (see src/data/variant.ts), so only that variant's content ships in
 * the bundle. This file is what TypeScript and ESLint see, and the fallback: the default variant.
 */
export { overrides } from "./default";
