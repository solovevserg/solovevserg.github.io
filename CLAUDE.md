# Инструкции для Claude Code

## CSS / LESS

**Брейкпоинты** — только переменные из `vars.less` (`@bp-xs` `@bp-sm` `@bp-md` `@bp-lg`), никаких хардкодных пикселей.

**Mobile-scroll грид** — классы `.mobile-scroll-list` / `.mobile-scroll-item`. Desktop-стили (`display:grid`, `grid-template-columns`) — только внутри `@media (min-width: (@bp-sm + 1px))`, иначе scoped-специфичность Vue сломает мобильный скролл.

**Глобальные утилиты** (`global.less`) — переиспользуй, не дублируй:
`.card-hover` · `.label-caps` · `.mono-period` · `.section--alt` · `.mobile-scroll-list/item`
`var(--accent)` · `var(--bg/bg-card/bg-subtle)` · `var(--text/text-muted)` · `var(--border/border-md)` · `var(--radius)` · `var(--font-mono)` · `var(--accent-glow)`

**Иконки** — компоненты из `components/icons/`. Новая иконка = новый компонент.

## Архитектура

- **Nuxt 3 SSG** — `nuxt generate`, GitHub Pages
- **Тема** — `composables/useTheme.ts` + `plugins/theme.client.ts`. `data-theme` на `<html>`, тёмная по умолчанию. `@nuxtjs/color-mode` пробовали — отклонено из-за гидратационных ошибок (ADR 0006).
- **i18n** — `@nuxtjs/i18n`, локали `locales/ru.json` и `locales/en.json`
- **Изображения** — `<NuxtPicture>` с `format="avif,webp"`, `placeholder`, `preload` для LCP
- **Стили** — LESS в scoped SFC + `global.less` для утилит
