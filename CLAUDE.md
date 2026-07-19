# Инструкции для Claude Code

## CSS / LESS

**Брейкпоинты** — только переменные из `vars.less` (`@bp-xs` `@bp-sm` `@bp-md` `@bp-lg`), никаких хардкодных пикселей.

**Mobile-scroll грид** — классы `.mobile-scroll-list` / `.mobile-scroll-item`. Desktop-стили (`display:grid`, `grid-template-columns`) — только внутри `@media (min-width: (@bp-sm + 1px))`, иначе scoped-специфичность Vue сломает мобильный скролл.

**Глобальные утилиты** (`global.less`) — переиспользуй переменные и стили, не дублируй

**Иконки** — компоненты из `components/icons/`. Новая иконка = новый компонент.

**`:global()` в scoped-стилях не использовать** — Vue+LESS схлопывают `:global(html.x) .y` до `html.x`, и правило садится не на тот элемент (ADR 0019). Нужен глобальный селектор — заводи отдельный не-scoped `<style>` с собственным префиксом классов.

**Обводной текст** — только `var(--font-display-outline)` (системный шрифт): у Inter 900 контуры кириллицы самопересекаются (ADR 0018). Залитый крупный текст — на Inter.

## Дизайн-система «Рубрикация» (ADR 0019)

- **Палитра** — обсидиан / кость / вермильон. Один акцент `--rubric`, вторичных цветов нет. Токены в `global.less`, старые имена (`--text`, `--accent`, …) оставлены алиасами.
- **Моторика** — `v-reveal` (+ `data-reveal="up|rise|left|rule|rule-y|frame"`), `SplitText` для заголовков, `v-magnetic`. Все директивы в `plugins/motion.ts`.
- **Скрытые стартовые состояния** — только под `html.has-js` (класс вешает инлайн-скрипт из `nuxt.config.ts`). Без JS контент обязан рендериться целиком.
- **Ворота анимаций** — `useMotionGate` придерживает проявления, пока играет интро-шторка.
- **`prefers-reduced-motion`** — проверять в каждом новом эффекте; интро, курсор и закрепление ленты при нём не запускаются.

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
