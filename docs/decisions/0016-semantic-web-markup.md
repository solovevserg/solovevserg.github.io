# Семантическая разметка: расширенный JSON-LD, семантический HTML5 и ARIA

- Статус: предложено
- Дата: 2026-04-18

## Контекст

ADR 0003 внедрил базовый JSON-LD `Person` и OGP-теги. Остальная разметка использует семантические
HTML5-элементы точечно: `<section>`, `<article>` присутствуют, но без согласованной иерархии
заголовков и машиночитаемых атрибутов. В результате:

- Поисковики и агрегаторы (Google, Яндекс, LinkedIn Scraper) не распознают опыт работы,
  образование и проекты как структурированные сущности — нет Rich Snippets для этих разделов.
- `<section>` без `aria-label`/`aria-labelledby` не несут семантики для ассистивных технологий.
- Страницы блога и портфолио не имеют JSON-LD схем (`BlogPosting`, `CreativeWork`,
  `BreadcrumbList`).
- Иерархия заголовков нарушена в нескольких секциях: `<h3>` без предшествующего `<h2>`.

Сайт — SSG (`nuxt generate`), домен `sergsol.dev`. Все изменения статичны и бесплатны в рантайме.

## Движущие факторы

- Rich Snippets в Google по запросу имени: блок «Работал в T-Bank», «Образование», «Проекты»
- Корректная индексация страниц блога и портфолио как отдельных документов
- Соответствие WCAG 2.1 AA (ориентиры ARIA, иерархия заголовков)
- Нулевые накладные расходы: SSG не добавляет серверный рантайм

## Рассматриваемые варианты

### Вариант A — Только расширенный JSON-LD (без изменений HTML)

Добавить JSON-LD схемы `WorkExperience`, `EducationalOrganization`, `ItemList` в `useHead` на
`pages/index.vue`, схемы `BlogPosting` и `CreativeWork` — на страницах блога и портфолио.
HTML-разметка остаётся как есть.

**Плюсы:** минимальный риск регрессий, не затрагивает шаблоны.

**Минусы:** не решает проблему ARIA-ориентиров; нарушенная иерархия заголовков остаётся;
поисковик не может сопоставить JSON-LD с визуальными элементами страницы без `id`-привязок.

---

### Вариант B — Только семантический HTML5 и ARIA (без JSON-LD)

Исправить иерархию заголовков (`h1`→`h2`→`h3`), добавить `aria-label` на `<section>`,
`role="list"` где нужен, `<main>` в `app.vue` / `layouts/default.vue`.

**Плюсы:** решает доступность; улучшает читаемость outline.

**Минусы:** не добавляет структурированных данных для Rich Snippets; поисковики по-прежнему не
видят машиночитаемые сущности.

---

### Вариант C — Комплексный подход: JSON-LD + семантический HTML5 + ARIA _(рекомендуется)_

Три взаимодополняющих слоя:

1. **Семантический HTML5** — исправить иерархию заголовков, явные `<main>`, `<nav>`, `<footer>`;
   секциям добавить `aria-labelledby` (ссылка на `id` заголовка секции).

2. **Расширенный JSON-LD** — в `pages/index.vue` добавить `@graph` с набором связанных сущностей
   (`WebSite`, `WebPage`, `Person` с `hasOccupation`, массив `WorkExperience`, `alumniOf`);
   в `pages/blog/[slug].vue` — `BlogPosting`; в `pages/portfolio/[slug].vue` — `CreativeWork`;
   везде — `BreadcrumbList`.

3. **ARIA-ориентиры** — `role="navigation"` на `<nav>`, `role="banner"` / `role="contentinfo"` на
   `<header>` / `<footer>`, `role="main"` на `<main>`; скрытые `<h2 class="sr-only">` для секций
   без видимого заголовка уровня 2 (если такие останутся).

**Плюсы:**

- JSON-LD `@graph` позволяет связывать сущности по `@id`, Google лучше строит Knowledge Panel
- `BlogPosting` с `datePublished` / `author` открывает путь к Rich Results для статей
- ARIA устраняет барьеры для скринридеров
- Все изменения статичны: генерируются при `nuxt generate`

**Минусы:**

- Трудозатратнее: затрагивает компоненты секций, composable `usePageSeo`, страницы блога/портфолио
- JSON-LD опыта работы требует корректного парсинга дат из строк локализации (нужны ISO-даты
  в локалях рядом с человекочитаемыми периодами)

---

### Вариант D — RDFa / Microdata-атрибуты прямо в HTML

Добавить `itemscope`, `itemtype`, `itemprop` атрибуты на HTML-элементы (Microdata) или `typeof`,
`property` (RDFa).

**Плюсы:** сущности привязаны к визуальным элементам напрямую; нет дублирования данных.

**Минусы:** JSON-LD — рекомендованный Google формат (2024); Microdata загромождает шаблоны;
сложнее поддерживать при рефакторинге компонентов; RDFa практически не используется для веб-сайтов.

## Принятое решение

Предлагается **Вариант C** — поэтапная реализация.

### Этап 1 — Семантический HTML5 и ARIA

#### 1.1 `app.vue` / `layouts/default.vue`

Обернуть контент в `<main id="main-content">`:

```vue
<template>
    <div>
        <AppHeader />
        <main id="main-content">
            <slot />
        </main>
        <AppFooter />
    </div>
</template>
```

#### 1.2 Иерархия заголовков

Каждая секция лендинга:

```html
<section id="experience" aria-labelledby="experience-heading">
    <h2 id="experience-heading" class="section-title">…</h2>
    <article>
        <h3>T-Bank</h3>
    </article>
</section>
```

`SectionHeader.vue` должен рендерить `<h2>` (сейчас — `<p>` или нет явного тега), принимать `id`
для ` `.

#### 1.3 `AppHeader.vue` / `AppFooter.vue`

```html
<header role="banner" aria-label="Навигация по сайту">…</header>
<footer role="contentinfo">…</footer>
```

### Этап 2 — Расширенный JSON-LD

#### 2.1 Главная страница: `@graph`

```ts
// pages/index.vue
useHead(() => ({
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': [
                    {
                        '@type': 'WebSite',
                        '@id': 'https://sergsol.dev/#website',
                        url: 'https://sergsol.dev',
                        name: 'Sergei Solovev',
                        inLanguage: ['ru', 'en'],
                    },
                    {
                        '@type': 'WebPage',
                        '@id': 'https://sergsol.dev/#webpage',
                        url: 'https://sergsol.dev',
                        isPartOf: { '@id': 'https://sergsol.dev/#website' },
                        about: { '@id': 'https://sergsol.dev/#person' },
                        inLanguage: locale.value,
                    },
                    {
                        '@type': 'Person',
                        '@id': 'https://sergsol.dev/#person',
                        name: 'Sergei Solovev',
                        url: 'https://sergsol.dev',
                        image: 'https://sergsol.dev/img/avatar.jpg',
                        jobTitle: 'Lead Frontend Developer',
                        hasOccupation: {
                            '@type': 'Occupation',
                            name: 'Lead Frontend Developer',
                            occupationLocation: { '@type': 'Country', name: 'Russia' },
                        },
                        alumniOf: [
                            {
                                '@type': 'CollegeOrUniversity',
                                name: 'МФТИ (НИУ)',
                                url: 'https://mipt.ru',
                            },
                        ],
                        worksFor: {
                            '@type': 'Organization',
                            name: 'T-Bank',
                            url: 'https://www.tbank.ru',
                        },
                        sameAs: [
                            'https://github.com/solovevserg',
                            'https://www.linkedin.com/in/solovevserg/',
                            'https://t.me/sergsol',
                        ],
                    },
                ],
            }),
        },
    ],
}))
```

#### 2.2 Страница блога: `BlogPosting`

```ts
// pages/blog/[slug].vue
useHead(() => ({
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: post.value.title,
                description: post.value.description,
                datePublished: post.value.date, // ISO 8601: "2026-03-15"
                dateModified: post.value.updatedAt ?? post.value.date,
                author: { '@id': 'https://sergsol.dev/#person' },
                publisher: { '@id': 'https://sergsol.dev/#website' },
                url: `https://sergsol.dev/blog/${post.value.slug}`,
                inLanguage: locale.value,
            }),
        },
    ],
}))
```

#### 2.3 `BreadcrumbList` — composable

```ts
// composables/useBreadcrumbJsonLd.ts
export function useBreadcrumbJsonLd(items: { name: string; url: string }[]) {
    useHead({
        script: [
            {
                type: 'application/ld+json',
                innerHTML: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'BreadcrumbList',
                    itemListElement: items.map((item, i) => ({
                        '@type': 'ListItem',
                        position: i + 1,
                        name: item.name,
                        item: item.url,
                    })),
                }),
            },
        ],
    })
}
```

Использование на странице статьи:

```ts
useBreadcrumbJsonLd([
    { name: 'Главная', url: 'https://sergsol.dev' },
    { name: 'Блог', url: 'https://sergsol.dev/blog' },
    { name: post.value.title, url: `https://sergsol.dev/blog/${post.value.slug}` },
])
```

#### 2.4 ISO-даты опыта работы

В `locales/ru.json` и `locales/en.json` рядом с человекочитаемыми периодами добавить поля
`startDate` / `endDate` в ISO 8601 для использования в JSON-LD (не в UI).

### Чек-лист реализации

- [ ] Добавить `<main id="main-content">` в layout
- [ ] Исправить `SectionHeader.vue`: рендерить `<h2>` с prop `id`
- [ ] Добавить `aria-labelledby` на все `<section>` секций лендинга
- [ ] Добавить `role="banner"` / `role="contentinfo"` в `AppHeader.vue` / `AppFooter.vue`
- [ ] Аудит иерархии заголовков (DevTools → Accessibility → Heading Outline)
- [ ] Заменить `Person` JSON-LD на `@graph` в `pages/index.vue`
- [ ] Добавить `BlogPosting` JSON-LD в `pages/blog/[slug].vue`
- [ ] Создать `composables/useBreadcrumbJsonLd.ts` и подключить на страницах блога/портфолио
- [ ] Добавить ISO-даты в локалях (скрытые поля, не в UI)
- [ ] Валидация: [Google Rich Results Test](https://search.google.com/test/rich-results),
      [Schema Markup Validator](https://validator.schema.org/),
      [axe DevTools](https://www.deque.com/axe/) для ARIA

## Последствия

**Положительные:**

- Google Knowledge Panel по запросу имени обогащается данными об организациях и должностях
- Статьи блога могут получить Rich Result с датой и автором в выдаче
- Навигация скринридером по ориентирам (`<main>`, `<nav>`, `<header>`) работает корректно
- `BreadcrumbList` отображается в хлебных крошках поисковой выдачи

**Отрицательные / риски:**

- Данные опыта работы дублируются: в локалях (для UI) и в JSON-LD (для поисковиков). При смене
  работодателя нужно обновлять оба места — риск расхождения. Митигация: ISO-даты хранятся в тех же
  локалях, composable читает их напрямую.
- `SectionHeader.vue` сейчас рендерит нумерацию (`/ 02`) вместе с заголовком — при переходе на
  `<h2>` нужно убедиться, что нумерация не дублируется в `aria-label`.
- JSON-LD `@graph` сложнее тестировать вручную — обязательна валидация через Rich Results Test
  после каждого изменения.

## Ссылки

- [Schema.org — Person](https://schema.org/Person)
- [Schema.org — BlogPosting](https://schema.org/BlogPosting)
- [Schema.org — BreadcrumbList](https://schema.org/BreadcrumbList)
- [Google — Understand how structured data works](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Google — Rich Results Test](https://search.google.com/test/rich-results)
- [WCAG 2.1 — Landmark Regions](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/)
- [Nuxt 3 — useHead](https://nuxt.com/docs/api/composables/use-head)
