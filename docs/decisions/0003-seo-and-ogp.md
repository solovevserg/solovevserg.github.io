# SEO-улучшения лендинга: метатеги, OGP, JSON-LD

* Статус: принято
* Дата: 2026-03-28

## Контекст и постановка задачи

Текущее состояние SEO лендинга минимально: в `nuxt.config.ts` прописаны только `charset`, `viewport` и `og:site_name`, а в `pages/index.vue` — один `<title>` и один `<meta name="description">` без локализации. Отсутствуют:

- полный набор Open Graph тегов (включая `og:image`);
- Twitter/X Card теги;
- `canonical` URL;
- `hreflang` alternate-ссылки для ru/en;
- структурированные данные JSON-LD (`Person`);
- локализованные `title` и `description` для каждого языка.

Сайт уже имеет домен `sergsol.dev`, модуль `@nuxtjs/sitemap` подключён, изображение `public/img/avatar.jpg` доступно.

## Движущие факторы

- Карточка при шаринге ссылки в мессенджерах/соцсетях должна отображать фото, имя и описание
- Корректная индексация двуязычного сайта поисковиками (Google, Яндекс)
- Хорошая позиция в результатах поиска по имени «Sergei Solovev» / «Сергей Соловьёв»
- Нулевые накладные расходы в рантайме — всё выводится при `nuxt generate` (SSG)

## Рассмотренные варианты

### Вариант A — Только глобальные теги в `nuxt.config.ts`

Прописать все OGP-теги статически в `app.head`:

```ts
meta: [
  { property: 'og:image', content: 'https://sergsol.dev/img/avatar.jpg' },
  { property: 'og:title', content: 'Sergei Solovev' },
  ...
]
```

**Плюсы:** один файл, просто.

**Минусы:** невозможно локализовать `og:title` и `og:description`; при появлении страниц блога теги будут одинаковыми на всех страницах.

---

### Вариант B — `useHead` + `useI18n` на каждой странице (без общего composable)

В каждой странице (`pages/index.vue`, `pages/blog/[slug].vue`, ...) вручную формировать полный набор метатегов через `useHead`.

**Плюсы:** полный контроль на каждой странице.

**Минусы:** дублирование кода (OGP-набор одинаков по структуре, меняются только данные); легко забыть тег при добавлении новой страницы.

---

### Вариант C — Composable `useSeoMeta` + локализованные данные *(выбранный)*

Использовать встроенный в Nuxt 3 хелпер `useSeoMeta` совместно с `useI18n` и `useRequestURL`. Общие статические теги (image, type, site_name) остаются в `nuxt.config.ts`, а динамические (title, description, url, hreflang) — в composable `usePageSeo`, вызываемом на каждой странице.

**Плюсы:**
- `useSeoMeta` — идиоматичный Nuxt 3 API, безопасен по типам, устраняет дублирование
- Локализация через `useI18n` покрывает ru/en из коробки
- Один composable → единое место добавления новых тегов

**Минусы:** незначительное усложнение по сравнению с вариантом A.

---

### Вариант D — Модуль `nuxt-seo` (nuxt-site-config + @nuxtjs/og-image)

Установить экосистему Harlan Wilton: `nuxt-seo` генерирует OGP-изображения на лету через `@nuxtjs/og-image` (edge function или prerender).

**Плюсы:** автоматические OG-изображения с текстом.

**Минусы:** избыточно — портфолио использует реальную фотографию, а не генерированный баннер; добавляет тяжёлую зависимость.

## Принятое решение

**Принят Вариант C** — `useSeoMeta` + composable `usePageSeo` + статические базовые теги в `nuxt.config.ts`.

### Что нужно сделать

#### 1. Подготовить OGP-изображение

Файл `public/img/avatar.jpg` уже существует. Для OGP рекомендуемый размер — **1200 × 630 px** (соотношение 1.91:1). Необходимо:

- убедиться, что `avatar.jpg` не меньше 600 px по ширине;
- при необходимости создать отдельный файл `public/img/og-cover.jpg` (1200×630) с портретом на тематическом фоне.

Тег будет ссылаться на `https://sergsol.dev/img/og-cover.jpg` (или `avatar.jpg`, если размер подходит).

#### 2. Глобальные статические теги — `nuxt.config.ts`

```ts
app: {
  head: {
    htmlAttrs: { lang: 'ru' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { property: 'og:site_name',   content: 'Sergei Solovev' },
      { property: 'og:type',        content: 'website' },
      { property: 'og:image',       content: 'https://sergsol.dev/img/og-cover.jpg' },
      { property: 'og:image:width',  content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt',    content: 'Sergei Solovev' },
      { name: 'twitter:card',        content: 'summary_large_image' },
      { name: 'twitter:image',       content: 'https://sergsol.dev/img/og-cover.jpg' },
    ],
  },
},
```

#### 3. Composable `usePageSeo` — локализованные теги

```ts
// composables/usePageSeo.ts
export function usePageSeo(options?: { title?: string; description?: string }) {
  const { t, locale } = useI18n()
  const url = useRequestURL()

  const title = options?.title ?? `${t('hero.name_first')} ${t('hero.name_last')} — Lead Frontend Developer`
  const description = options?.description ?? t('about.bio')

  useSeoMeta({
    title,
    ogTitle: title,
    description,
    ogDescription: description,
    ogUrl: url.href,
    twitterTitle: title,
    twitterDescription: description,
  })

  // hreflang alternate links
  useHead({
    link: [
      { rel: 'alternate', hreflang: 'ru',    href: `https://sergsol.dev/` },
      { rel: 'alternate', hreflang: 'en',    href: `https://sergsol.dev/en/` },
      { rel: 'alternate', hreflang: 'x-default', href: `https://sergsol.dev/` },
      { rel: 'canonical', href: url.href },
    ],
  })
}
```

Использование в `pages/index.vue`:

```ts
usePageSeo()
```

Использование в `pages/blog/[slug].vue`:

```ts
usePageSeo({ title: post.title, description: post.description })
```

#### 4. JSON-LD Person — структурированные данные

Добавить в `pages/index.vue` (или в отдельный компонент `SeoJsonLd.vue`):

```ts
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Sergei Solovev',
      url: 'https://sergsol.dev',
      image: 'https://sergsol.dev/img/avatar.jpg',
      jobTitle: 'Lead Frontend Developer',
      worksFor: { '@type': 'Organization', name: 'T-Bank' },
      sameAs: [
        'https://github.com/solovevserg',
        'https://linkedin.com/in/solovevserg',
        'https://t.me/solovevserg',
      ],
    }),
  }],
})
```

#### 5. Sitemap

`@nuxtjs/sitemap` уже подключён. Убедиться, что в `nuxt.config.ts` настроен `site.url` (уже есть: `https://sergsol.dev`) и sitemap корректно включает обе локали.

### Чек-лист реализации

- [ ] Создать/ресайзить `public/img/og-cover.jpg` (1200×630)
- [ ] Обновить `nuxt.config.ts`: добавить OGP image, twitter:card теги
- [ ] Создать `composables/usePageSeo.ts`
- [ ] Обновить `pages/index.vue`: заменить `useHead` на `usePageSeo()`
- [ ] Добавить JSON-LD в `pages/index.vue`
- [ ] Обновить `pages/blog/[slug].vue`: добавить `usePageSeo({ title, description })`
- [ ] Проверить sitemap через `/_sitemap.xml` после `nuxt generate`
- [ ] Валидация: [Open Graph Debugger (Facebook)](https://developers.facebook.com/tools/debug/), [Twitter Card Validator](https://cards-dev.twitter.com/validator), [Google Rich Results Test](https://search.google.com/test/rich-results)

## Последствия

**Положительные:**
- Карточки при шаринге в Telegram, Twitter/X, LinkedIn, ВКонтакте будут показывать фото, имя и описание
- Поисковики получат однозначный canonical и hreflang, что устранит дублирование ru/en страниц
- JSON-LD Person улучшает Knowledge Panel в Google по запросу имени

**Отрицательные / риски:**
- Без OGP-изображения правильного размера ряд соцсетей покажет карточку без фото — нужно подготовить файл до деплоя
- `useRequestURL()` на статике возвращает URL сборки, а не финальный домен — нужно убедиться, что `NUXT_PUBLIC_SITE_URL` или `site.url` выставлены корректно при `nuxt generate`
- hreflang на SPA-роутах не индексируется без SSR/SSG — корректно только при `nuxt generate` (текущий режим)

## Ссылки

* [Nuxt 3 — useSeoMeta](https://nuxt.com/docs/api/composables/use-seo-meta)
* [Open Graph Protocol](https://ogp.me/)
* [Schema.org — Person](https://schema.org/Person)
* [Google — hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
* [@nuxtjs/sitemap](https://nuxtseo.com/sitemap/getting-started/introduction)
