---
title: Hello, World
description: First blog post — launching the new website built on Nuxt 3.
date: 2026-03-26
tags: [personal, nuxt]
---

This is my first blog post. The site is built with **Nuxt.js 3** with bilingual support and static site generation.

## What this blog will be about

I'll write about development, tools, and technologies I use in my work: Angular, TypeScript, SPA architecture, and team processes.

## Tech stack

The site is powered by Nuxt 3 + `@nuxt/content` for articles and `@nuxtjs/i18n` for localization. Deployed via GitHub Pages.

The configuration is minimal — all content lives in Markdown:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxtjs/i18n'],
  nitro: {
    prerender: { crawlLinks: true },
  },
  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
  },
})
```

### Why SSG?

A static site loads fast, requires no server, and is hosted for free on GitHub Pages. For a blog and portfolio that's more than enough.

## What's next

I plan to write about Angular, RxJS, and my experience leading engineering teams. Stay tuned.
