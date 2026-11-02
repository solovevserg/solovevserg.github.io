# AI-friendly сайт: llms.txt, AI-краулеры в robots.txt, markdown-версии постов

- Статус: принято
- Дата: 2026-11-01

## Контекст

Сайт почти не виден для LLM-ботов: нет `llms.txt`, robots.txt не разграничивает AI-краулеров,
markdown-версий страниц нет. JSON-LD для блога/портфолио отсутствует (частично закрывается
ADR 0016). Сайт — SSG (`nuxt generate`), GitHub Pages, домен `sergsol.dev`; контент блога
синхронизируется из Telegram (ADR 0019), поэтому всё должно генерироваться при сборке, а не
хоститься вручную.

## Рассматриваемые варианты

### Вариант A — статические файлы в `public/`

Писать `llms.txt` / `robots.txt` руками.

**Плюсы:** ноль зависимостей.
**Минусы:** мгновенно устаревает — контент блога меняется дважды в день синком.

### Вариант B — `@mdream/nuxt`

HTML→markdown конвертер с генерацией `llms.txt`/`llms-full.txt` из отрендеренных страниц.

**Плюсы:** markdown-версии любых страниц «из коробки».
**Минусы:** тяжеловесная зависимость ради одного фида; API модуля нестабилен.

### Вариант C — готовые модули + минимальный кастом _(принято)_

- `@nuxtjs/robots` — robots.txt с явными группами AI-краулеров;
- `/llms.txt`, `/llms-full.txt`, markdown-версии постов — свой скрипт при сборке (см. ниже);
- JSON-LD — вручную через `useHead` по сниппетам ADR 0016.

## Принятое решение

### 1. `nuxt-llms` — опробован и отклонён

Модуль даёт каркас `/llms.txt`, но на текущем стеке не работает: рантайм-хендлеры импортируют
`nuxt/server` (API Nuxt 4) — на Nuxt 3.21 `/llms-full.txt` падает с 404, а без хуков его
содержимое и так пустое (модуль только собирает секции из конфига). Удалён.

### 2. Свой генератор: `scripts/export-blog-md.mjs`

Привязан к npm-скрипту `generate` и пишет три вещи в `public/`:

- `blog/<slug>.md` — markdown-версии постов (контент — обычные `.md` в
  `content/<locale>/blog/`, слаг страницы = имя файла по ADR 0019, так что это чистое
  копирование): `/blog/<slug>.md` — статика на GitHub Pages;
- `llms.txt` — карта сайта для LLM: страницы + каждый пост с описанием + ссылка на полный текст;
- `llms-full.txt` — полный текст всех постов одним файлом.

### 3. `@nuxtjs/robots` v6

Явная группа с `Allow: /` для AI-краулеров (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
Claude-Web, anthropic-ai, PerplexityBot, Google-Extended, CCBot, Bytespider). По RFC 9309 у
каждого бота отдельная группа: попав в неё, бот игнорирует группу `*`, поэтому `Allow`
дублируется в её собственной группе. Версия 6 обязательна: v5 тянет `nuxt-site-config` v3 и
конфликтует с `@nuxtjs/sitemap` v8 (site-config v4) — падает пререндер
(`locales.find is not a function`).

### 4. JSON-LD без модуля `nuxt-schema-org`

Актуальные версии `nuxt-schema-org` (v6/v7) требуют unhead v2/v3, а установленный
`@nuxt/content` v2 тянет unhead v1 (`@vueuse/head`) — peer-конфликт. Миграция на
`@nuxt/content` v3 не входит в задачу. Поэтому JSON-LD — вручную через `useHead` по готовым
сниппетам ADR 0016: `@graph` (WebSite/WebPage/Person) на главной, `BlogPosting` +
`BreadcrumbList` на постах, `BreadcrumbList` на списках, `CreativeWork` в портфолио.

### 5. webMCP — отклонено

WebMCP (экспериментальная спецификация exposing-инструментов агентам через JS-рантайм
страницы) не применим: сайт статический, рантайма нет; спецификация не стабилизирована,
поддержки ботами нет. Если понадобится — отдельный ADR при появлении стабильного стандарта.

## Последствия

**Положительные:**

- LLM-боты получают карту сайта (`llms.txt`) и полный текст (`llms-full.txt`) при каждой сборке
- AI-краулеры явно допущены; обычная SEO-статика не задета
- Посты потребимы и постранично (`/blog/<slug>.md`)
- Поисковики получают BlogPosting/BreadcrumbList/CreativeWork (плюс ADR 0016)

**Отрицательные / риски:**

- Скрипт-генератор — свой код: формат `llms.txt` придётся поддерживать вручную (спецификация
  простая, меняется редко).
- Слаг поста обязан совпадать с именем файла (уже так — ADR 0019).
- `llms.txt` двуязычным не делаем: контент блога только ru, описание сайта — из `locales/ru.json`.
- Тестовый пост для проверки сборки удалять перед деплоем.

## Ссылки

- [llms.txt](https://llmstxt.org/)
- [nuxt-llms](https://github.com/HugoRCD/nuxt-llms)
- [Nuxt Robots — AI Directives](https://nuxtseo.com/docs/robots/guides/ai-directives)
- [RFC 9309 — robots exclusion protocol](https://www.rfc-editor.org/rfc/rfc9309)
- [WebMCP proposal](https://github.com/WebMachineLearning/webmcp)
