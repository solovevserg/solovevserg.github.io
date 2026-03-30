# sergsol.dev

Source code of **[sergsol.dev](https://sergsol.dev)** — personal portfolio and blog of Sergei Solovev, lead developer, leader and phylosopher.

## Stack

- **[Nuxt 3](https://nuxt.com/)** — SSG via `nuxt generate`
- **[@nuxt/image](https://image.nuxt.com/)** — automatic WebP/AVIF conversion, srcset, blur placeholder
- **[@nuxt/content](https://content.nuxt.com/)** — Markdown blog with Shiki syntax highlighting
- **[@nuxtjs/i18n](https://i18n.nuxtjs.org/)** — Bilingual (RU / EN), `prefix_except_default` strategy
- **Vue 3** Composition API — no UI framework, all styles hand-written in LESS
- **GitHub Actions** → **GitHub Pages** — automated deploy on push to `master`

## Project structure

```
├── assets/css/
│   ├── global.less    # Utility classes, design tokens, base styles
│   └── vars.less      # Breakpoint variables (@bp-sm, @bp-md, …)
├── components/
│   ├── icons/         # SVG icon components (Telegram, LinkedIn, GitHub, Habr, HH)
│   ├── layout/        # AppHeader, AppFooter
│   ├── sections/      # Landing page sections
│   └── shared/        # SectionHeader, BadgeCurrent, …
├── composables/       # useScrollSpy, useTheme
├── content/           # Blog posts (Markdown)
│   ├── en/blog/
│   └── ru/blog/
├── docs/decisions/    # Architecture Decision Records (ADR)
├── locales/           # i18n strings
│   ├── en.json
│   └── ru.json
├── pages/
│   ├── index.vue      # Landing page (all sections)
│   └── blog/          # Blog list + post pages
├── plugins/           # theme.client.ts — theme initialisation
├── public/            # Static assets (images, favicon)
└── .github/workflows/ # CI/CD
```

## Getting started

```bash
npm install
npm run dev
```

## Build & preview

```bash
npm run generate   # SSG → .output/public
npm run preview    # Serve the generated output
```

## Deploy

Push to `master` — GitHub Actions runs `nuxt generate` and deploys `.output/public` to GitHub Pages automatically.

Manual trigger is also available via **Actions → Deploy to GitHub Pages → Run workflow**.

> Make sure **Settings → Pages → Source** is set to **GitHub Actions**.

## Content

### Blog posts

Add a Markdown file to `content/en/blog/` or `content/ru/blog/`:

```md
---
title: Post title
description: Short description for SEO and card preview.
date: 2026-01-01
tags: [angular, typescript]
---

Post body...
```

### Localization

All UI strings live in `locales/ru.json` and `locales/en.json`. The structure mirrors the page sections: `hero`, `about`, `experience`, `skills`, `education`, `teaching`, `facts`, `contact`.

## License

MIT
