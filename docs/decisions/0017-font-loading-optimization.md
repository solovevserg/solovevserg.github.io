# Оптимизация загрузки шрифтов: устранение FOUT/FOIT

- Статус: принято
- Дата: 2026-04-19

## Контекст

Сайт загружает два шрифта через Google Fonts:

- **Inter** — 7 начертаний (300–900), основной шрифт UI
- **JetBrains Mono** — 2 начертания (400, 500), моноширинный шрифт для кода и акцентов

Текущий способ подключения — `@import url(...)` в первой строке `assets/css/global.less`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
```

**Цепочка запросов при загрузке страницы:**

1. Браузер загружает HTML
2. Парсит HTML → находит `<link rel="stylesheet">` на скомпилированный CSS
3. Загружает CSS-файл → парсит → находит `@import url(fonts.googleapis.com/...)`
4. Делает запрос на Google Fonts CDN за CSS-файлом со ссылками на woff2
5. Разбирает полученный CSS → формирует список woff2-файлов для загрузки
6. Загружает woff2-файлы (один или несколько)
7. Только после этого браузер рисует текст кастомным шрифтом

`display=swap` в URL добавляет `font-display: swap`, поэтому текст не скрывается (нет FOIT),
но пользователь видит системный шрифт, а затем — резкую замену на Inter (FOUT — Flash of
Unstyled Text). На медленном соединении задержка составляет 300–800 мс, на мобильном > 1 с.

В `nuxt.config.ts` уже есть `<link rel="preconnect">` на `fonts.googleapis.com` и
`fonts.gstatic.com`, что сокращает DNS/TLS-фазу, но не устраняет многошаговую цепочку.

Проблема усугубляется тем, что `@import` внутри CSS-файла **рендер-блокирующий**: браузер не
может отобразить страницу, пока не разрешит весь граф импортов. Использование `<link rel="stylesheet">` в `<head>` вместо `@import` уже было бы улучшением, но корень проблемы —
внешний хост и многоэтапная цепочка запросов.

## Движущие факторы

- **FCP и LCP** — шрифт задерживает First Contentful Paint, если браузер не находит woff2 в кэше
- **FOUT** — видимое мерцание при замене системного шрифта на Inter (особенно заметно в заголовках
  с `font-weight: 900`)
- **Приватность** — запрос к Google серверам при каждой загрузке страницы (IP-адрес пользователя
  передаётся Google)
- **Надёжность** — зависимость от доступности Google Fonts CDN

## Рассматриваемые варианты

### Вариант A — Оставить Google Fonts, перенести `@import` в `<link>` + добавить `preload`

Удалить `@import` из CSS, добавить в `nuxt.config.ts`:

```ts
link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap',
    },
]
```

**Плюсы:** минимальные изменения; Google Fonts CDN по-прежнему кэшируется между сайтами.

**Минусы:** цепочка запросов остаётся (5 шагов); FOUT сохраняется; нельзя `preload` конкретный
woff2 без знания его хэша (Google меняет URL при обновлении шрифта).

---

### Вариант B — `@nuxtjs/google-fonts` _(не рекомендуется)_

Модуль автоматически скачивает шрифты в момент сборки, самостоятельно хостит их и генерирует
`@font-face`. Конфиг в `nuxt.config.ts`:

```ts
googleFonts: {
    families: {
        Inter: [300, 400, 500, 600, 700, 800, 900],
        'JetBrains Mono': [400, 500],
    },
    display: 'swap',
    preload: true,
    download: true,
}
```

**Плюсы:** шрифты хостятся локально; можно `preload`; CDN-зависимость устраняется.

**Минусы:** дополнительная зависимость ради задачи, которую можно решить однократной ручной
загрузкой файлов; часто возникают проблемы с кэшированием скачанных файлов в CI; модуль активно
не поддерживается (последний релиз — 2023 г.); добавляет все начертания без возможности
subsetting.

---

### Вариант C — Самохостинг с subsetting и `font-display: optional` _(рекомендуется)_

Скачать woff2-файлы вручную через [google-webfonts-helper](https://gwfh.mranftl.com/fonts),
применить Latin-subset (или Latin + Cyrillic там, где нужно), разместить в `public/fonts/`,
прописать `@font-face` в `global.less`.

Для основных начертаний Inter (400, 700) — `font-display: optional`, для остальных —
`font-display: swap`. `optional` означает: если шрифт не загружен в рамках первого
render-цикла — используется системный шрифт **без** замены (нет FOUT), шрифт всё равно
загружается и кэшируется для следующего визита.

```less
// assets/css/fonts.less

@font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-display: optional; // нет FOUT при первом визите, шрифт кэшируется для следующего
    src: url('/fonts/inter-400.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0100-024F, U+0400-04FF; // Latin + Cyrillic
}

@font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-display: optional;
    src: url('/fonts/inter-700.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0100-024F, U+0400-04FF;
}

// Веса 300, 500, 600, 800, 900 — менее критичны, swap допустим
@font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 300;
    font-display: swap;
    src: url('/fonts/inter-300.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0100-024F, U+0400-04FF;
}
// ... аналогично для 500, 600, 800, 900

@font-face {
    font-family: 'JetBrains Mono';
    font-style: normal;
    font-weight: 400;
    font-display: swap; // моноширинный шрифт менее заметен при замене
    src: url('/fonts/jetbrains-mono-400.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0100-024F; // Latin достаточно для кода
}

@font-face {
    font-family: 'JetBrains Mono';
    font-style: normal;
    font-weight: 500;
    font-display: swap;
    src: url('/fonts/jetbrains-mono-500.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0100-024F;
}
```

`<link rel="preload">` для критичных файлов — в `nuxt.config.ts`:

```ts
link: [
    {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: '/fonts/inter-400.woff2',
        crossorigin: '',
    },
    {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: '/fonts/inter-700.woff2',
        crossorigin: '',
    },
]
```

**Размытый системный фолбэк** — чтобы минимизировать сдвиг при переключении на Inter, можно
настроить метрики системного шрифта через `size-adjust`, `ascent-override`, `descent-override`:

```less
@font-face {
    font-family: 'Inter Fallback';
    src: local('Arial');
    ascent-override: 90%;
    descent-override: 22%;
    line-gap-override: 0%;
    size-adjust: 107%;
}
```

И использовать `'Inter Fallback'` между `'Inter'` и `system-ui` в `--font-sans`.

**Плюсы:**

- Шрифт загружается с того же origin — нет DNS/TLS-оверхеда на сторонний домен
- `preload` работает сразу для конкретного woff2 (хэш не меняется)
- `font-display: optional` устраняет FOUT для основных начертаний
- Нет зависимости от Google CDN и передачи IP пользователя
- Subsetting сокращает размер файлов: Latin-only Inter 400 ≈ 30 КБ против 95 КБ полного

**Минусы:**

- Файлы шрифтов добавляются в репозиторий (~400–600 КБ суммарно для всех начертаний)
- При обновлении шрифта нужно повторить ручную загрузку
- `font-display: optional` означает, что при первом визите страница может отображаться системным
  шрифтом; при повторном — Inter (из кэша). Это приемлемо для портфолио, где LCP важнее
  консистентности шрифта при первом посещении

---

### Вариант D — Системные шрифты (без кастомных)

Убрать Inter и JetBrains Mono, перейти на системный стек:

```css
--font-sans: system-ui, -apple-system, 'Segoe UI', sans-serif;
--font-mono: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
```

**Плюсы:** полное устранение FOUT; нулевая загрузка шрифтов; мгновенный рендер.

**Минусы:** Inter — часть визуальной идентичности сайта; системные шрифты различаются между
платформами (macOS vs Windows vs Linux), что нарушает консистентность дизайна. Отклонено.

## Принятое решение

Предлагается **Вариант C** — самохостинг с subsetting.

### Чек-лист реализации

#### Шаг 1 — Загрузка и подготовка файлов

- [ ] Скачать woff2 через [google-webfonts-helper](https://gwfh.mranftl.com/fonts):
    - Inter: начертания 300, 400, 500, 600, 700, 800, 900 (Latin + Cyrillic subset)
    - JetBrains Mono: начертания 400, 500 (Latin subset)
- [ ] Разместить в `public/fonts/` (имена: `inter-300.woff2`, `inter-400.woff2`, ...,
      `jetbrains-mono-400.woff2`, `jetbrains-mono-500.woff2`)

#### Шаг 2 — CSS

- [ ] Создать `assets/css/fonts.less` с `@font-face` для всех начертаний
- [ ] Удалить `@import url('https://fonts.googleapis.com/...')` из `global.less`
- [ ] Добавить `@import './fonts.less'` в `global.less` (или в `nuxt.config.ts` → `css:`)
- [ ] Добавить `@font-face` для `'Inter Fallback'` с `size-adjust`/`ascent-override`
- [ ] Обновить `--font-sans` в `global.less`: `'Inter', 'Inter Fallback', system-ui, sans-serif`

#### Шаг 3 — Preload в `nuxt.config.ts`

- [ ] Убрать `preconnect` на `fonts.googleapis.com` и `fonts.gstatic.com`
- [ ] Добавить `<link rel="preload">` для `inter-400.woff2` и `inter-700.woff2`

#### Шаг 4 — Верификация

- [ ] DevTools → Network → Fonts: убедиться, что woff2 загружается с `/fonts/`, не с Google
- [ ] DevTools → Rendering → «Flash of unstyled content»: FOUT устранён для 400/700
- [ ] Lighthouse (Mobile): FCP не ухудшился, шрифт не блокирует рендер
- [ ] Проверить кириллические символы на странице (если есть) — вошли ли в unicode-range

## Последствия

**Положительные:**

- Цепочка запросов сокращается с 5 шагов до 1: `preload` + загрузка woff2 с того же origin
- FOUT исчезает для основных начертаний Inter (400, 700) благодаря `font-display: optional`
- Шрифт начинает загружаться параллельно с HTML (до разбора CSS) благодаря `rel="preload"`
- Устраняется зависимость от Google CDN: сайт работает без внешних шрифтовых сервисов
- Улучшается FCP: браузер не ждёт ответа от `fonts.googleapis.com`

**Отрицательные / риски:**

- Размер репозитория увеличится на ~400–600 КБ (woff2-файлы)
- При первом визите `font-display: optional` может оставить системный шрифт, если woff2 не успел
  загрузиться в первый render-цикл (обычно 100 мс). На последующих визитах шрифт уже в кэше.
- При обновлении версии Inter нужно повторять загрузку файлов вручную

## Ссылки

- [google-webfonts-helper](https://gwfh.mranftl.com/fonts) — скачать woff2 с subsetting
- [web.dev — Avoid flash of invisible text](https://web.dev/articles/avoid-invisible-text)
- [web.dev — font-display](https://web.dev/articles/font-display)
- [MDN — CSS font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)
- [web.dev — Preload critical assets](https://web.dev/articles/preload-critical-assets)
- [Calibrate font fallbacks](https://screenspan.net/fallback) — подбор `size-adjust` и override-метрик
- [Nuxt 3 — useHead / link preload](https://nuxt.com/docs/api/composables/use-head)
