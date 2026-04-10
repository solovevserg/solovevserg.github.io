# Инструкции для Claude Code

## CSS / LESS

**Брейкпоинты** — только переменные из `vars.less` (`@bp-xs` `@bp-sm` `@bp-md` `@bp-lg`), никаких хардкодных пикселей.

**Mobile-scroll грид** — классы `.mobile-scroll-list` / `.mobile-scroll-item`. Desktop-стили (`display:grid`, `grid-template-columns`) — только внутри `@media (min-width: (@bp-sm + 1px))`, иначе scoped-специфичность Vue сломает мобильный скролл.

**Глобальные утилиты** (`global.less`) — переиспользуй переменные и стили, не дублируй

**Иконки** — компоненты из `components/icons/`. Новая иконка = новый компонент.

## Архитектура

- **Nuxt 3 SSG** — `nuxt generate`, GitHub Pages
- **Тема** — `composables/useTheme.ts` + `plugins/theme.client.ts`. `data-theme` на `<html>`, тёмная по умолчанию. `@nuxtjs/color-mode` пробовали — отклонено из-за гидратационных ошибок (ADR 0006).
- **i18n** — `@nuxtjs/i18n`, локали `locales/ru.json` и `locales/en.json`
- **Изображения** — `<NuxtPicture>` с `format="avif,webp"`, `placeholder`, `preload` для LCP
- **Стили** — LESS в scoped SFC + `global.less` для утилит

## ADR (Architecture Decision Records)

- Хранятся в `docs/decisions/`, нумерация `0001-*.md`, `0002-*.md` и т.д.
- При реализации решения из ADR — обновить статус с «предложено» на «принято». При отказе — на «отклонено» с указанием причины.
- Новый ADR = следующий свободный номер. Формат: статус, дата, контекст, варианты, решение, последствия.
