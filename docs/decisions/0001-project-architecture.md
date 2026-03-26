# Архитектура персонального сайта на Nuxt.js

* Статус: принято
* Дата: 2026-03-26

## Контекст и постановка задачи

Необходимо создать персональный сайт с поддержкой двух языков (ru/en), включающий лендинг-страницу, блог и раздел портфолио. Предыдущая версия была построена на Eleventy. Требуется современный стек с удобным управлением контентом и хорошей производительностью.

## Движущие факторы

* Поддержка i18n «из коробки» или с минимальными усилиями
* Удобное ведение блога через Markdown-файлы без CMS
* SSG (Static Site Generation) для хостинга на GitHub Pages
* Активная экосистема и поддержка сообщества

## Рассмотренные варианты

* **Nuxt.js + @nuxtjs/i18n + Nuxt Content** — выбранный вариант
* Eleventy — предыдущий стек, менее удобен для Vue-разработчика
* Next.js — React-экосистема, избыточна для персонального сайта
* Astro — хорош для статики, но слабее в интерактивных сценариях

## Принятое решение

Выбран **Nuxt.js (v3)** с модулями `@nuxtjs/i18n` и `@nuxt/content`.

**Обоснование:** Nuxt 3 предоставляет SSG, встроенный роутинг, файловую систему для страниц, а модули i18n и Content покрывают все ключевые требования без кастомных решений.

### Положительные следствия

* Файловый роутинг упрощает добавление страниц
* Блог ведётся через Markdown — не нужна база данных или CMS
* Единая кодовая база для двух языков
* Легко деплоится на GitHub Pages через `nuxt generate`

### Отрицательные следствия

* Более тяжёлый бандл по сравнению с Eleventy
* Требуется настройка `baseURL` для GitHub Pages

---

## Структура проекта

```
solovevserg.github.io/
├── docs/
│   └── decisions/          # ADR-файлы (этот каталог)
├── content/
│   ├── en/
│   │   ├── blog/           # Статьи блога на английском (.md)
│   │   └── projects/       # Описания проектов портфолио (.md)
│   └── ru/
│       ├── blog/           # Статьи блога на русском (.md)
│       └── projects/       # Описания проектов портфолио (.md)
├── pages/
│   ├── index.vue           # Лендинг (главная страница)
│   ├── blog/
│   │   ├── index.vue       # Список статей
│   │   └── [slug].vue      # Отдельная статья
│   └── portfolio/
│       ├── index.vue       # Список проектов
│       └── [slug].vue      # Отдельный проект
├── components/
│   ├── layout/
│   │   ├── AppHeader.vue
│   │   └── AppFooter.vue
│   └── ui/                 # Переиспользуемые UI-компоненты
├── layouts/
│   └── default.vue
├── locales/
│   ├── en.json             # Переводы UI-строк
│   └── ru.json
├── public/
│   └── img/
├── assets/
│   └── css/
│       └── global.css
├── nuxt.config.ts
├── package.json
└── tsconfig.json
```

---

## Используемые технологии

| Технология | Версия | Назначение |
|---|---|---|
| Nuxt.js | 3.x | Основной фреймворк (SSG/SSR) |
| Vue.js | 3.x | UI-компоненты (включён в Nuxt) |
| @nuxt/content | 2.x | Блог и портфолио через Markdown |
| @nuxtjs/i18n | 8.x | Мультиязычность (ru/en) |
| TypeScript | 5.x | Типизация |
| Tailwind CSS | 3.x | Стилизация (опционально) |

---

## Шаги по созданию сайта

### Этап 1 — Инициализация проекта
- [ ] `npx nuxi@latest init .` — создание Nuxt 3 проекта
- [ ] Установка зависимостей: `@nuxt/content`, `@nuxtjs/i18n`
- [ ] Настройка `nuxt.config.ts`: modules, i18n, content, generate

### Этап 2 — Базовый layout и роутинг
- [ ] Создание `layouts/default.vue` с хедером и футером
- [ ] Компонент `AppHeader.vue` с навигацией и переключателем языка
- [ ] Компонент `AppFooter.vue`
- [ ] Настройка локалей в `locales/en.json` и `locales/ru.json`

### Этап 3 — Главная страница (лендинг)
- [ ] `pages/index.vue` — секции: hero, about, skills, contacts
- [ ] Адаптивная вёрстка
- [ ] OGP-метатеги через `useHead`

### Этап 4 — Блог
- [ ] Создание `pages/blog/index.vue` — список статей
- [ ] Создание `pages/blog/[slug].vue` — страница статьи
- [ ] Добавление тестовых Markdown-статей в `content/ru/blog/` и `content/en/blog/`
- [ ] Фронтматтер-схема: `title`, `date`, `description`, `tags`

### Этап 5 — Портфолио
- [ ] Создание `pages/portfolio/index.vue` (заглушка или список)
- [ ] Создание `pages/portfolio/[slug].vue`
- [ ] Добавление проектов в `content/ru/projects/` и `content/en/projects/`

### Этап 6 — SEO и деплой
- [ ] Настройка sitemap через `@nuxtjs/sitemap`
- [ ] Настройка GitHub Actions для автодеплоя (`nuxt generate` → ветка `gh-pages` или папка `dist/`)
- [ ] Проверка `robots.txt` и OGP-превью

## Ссылки

* [Nuxt 3 Docs](https://nuxt.com/docs)
* [Nuxt Content](https://content.nuxt.com)
* [Nuxt i18n](https://i18n.nuxtjs.org)
* [MADR Template](https://adr.github.io/madr/)
