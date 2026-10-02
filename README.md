# Bohdan Palii — portfolio

Personal site of a Full-Stack Engineer (TypeScript · NestJS · React · Next.js · React Native · PostgreSQL).
Static Next.js 16 export with Tailwind CSS 4, Motion and Lenis. The palette, serif and content mirror the CV.

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm verify     # lint + typecheck + build
```

`pnpm build` writes a fully static site to `out/`.

## Content

Everything on the page comes from [`src/data/profile.ts`](src/data/profile.ts): projects, employment, skills, open-source repos, contact details.
The CV served by the "Download CV" buttons is `public/Bohdan_Palii_CV.pdf`; the portrait is `public/bohdan-palii.png`.


## Deploy

**GitHub Pages (default).** Every push to `main` runs [`.github/workflows/pages.yml`](.github/workflows/pages.yml): lint, typecheck, `next build`, then `actions/deploy-pages`. One-time setup: *Settings → Pages → Source: GitHub Actions*. The workflow works out the URL by itself:

| Repository name | Site URL | Base path |
|---|---|---|
| `paliibo.github.io` | `https://paliibo.github.io/` | none |
| anything else, e.g. `portfolio` | `https://paliibo.github.io/portfolio/` | `/portfolio` |
| custom domain | value of the repo variable `SITE_URL` | none |

For a custom domain: add it under *Settings → Pages → Custom domain* (GitHub manages the certificate), then set the repository variable `SITE_URL=https://your-domain.com` so Open Graph, `robots.txt` and `sitemap.xml` point at it.

**Search engines.** The site is *not indexable by default*: every build ships `<meta name="robots" content="noindex, nofollow">`, an empty sitemap and no sitemap line in `robots.txt` (crawling itself stays allowed so robots can read the tag). To go public in search, set the repository variable `INDEXABLE=1` (or `NEXT_PUBLIC_INDEXABLE=1` for any other host) and redeploy.

**Anywhere else.** `pnpm build` writes the site to `out/`; upload that folder (Vercel and Netlify detect the Next.js static export automatically). Set `NEXT_PUBLIC_SITE_URL` at build time.

## Structure

```
src/app            layout, page, global styles, OG image, favicon
src/components     layout (nav, footer), ui primitives, page sections
src/data           profile.ts — the only place content lives
```
