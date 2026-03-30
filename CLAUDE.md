# Инструкции для Claude Code

## CSS и LESS — обязательные правила

### Переменные брейкпоинтов
Всегда используй переменные из `assets/css/vars.less` — они автоматически доступны во всех `.less` файлах через Vite `additionalData`.

**Никогда не пиши `768px`, `1024px` и т.д. напрямую.** Используй переменные:
```less
@media (max-width: @bp-sm) { ... }
```

### Мобильный горизонтальный скролл
Для карточных гридов, которые на мобильном превращаются в горизонтальный скролл, используй глобальные утилитарные классы из `assets/css/global.less`:

- `.mobile-scroll-list` — на контейнер-грид
- `.mobile-scroll-item` — на каждый дочерний элемент

```html
<div class="my-grid mobile-scroll-list">
  <div class="my-card mobile-scroll-item">...</div>
</div>
```

**Важно:** Desktop-only стили грида (`display: grid`, `grid-template-columns`) **обязательно** оборачивай в `@media (min-width: (@bp-sm + 1px))`. Иначе scoped-специфичность Vue перекроет глобальный `.mobile-scroll-list` на мобильном:

```less
// ПРАВИЛЬНО
.my-grid {
  gap: 1.5rem;

  @media (min-width: (@bp-sm + 1px)) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}

// НЕПРАВИЛЬНО — display: grid перекроет mobile-scroll-list
.my-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
```

### Глобальные CSS-классы и переменные (`assets/css/global.less`)
Переиспользуй существующие утилиты и дизайн-токены, не создавай дублирующий CSS:

| Класс / переменная | Назначение |
|---|---|
| `.card-hover` | Hover-эффект для карточек (подъём + тень) |
| `.label-caps` | Маленький заголовок в капслоке (mono, 0.7rem) |
| `.mono-period` | Монотипный текст с разделителями |
| `.section-heading` | Заголовок секции (`clamp` размер) |
| `.section-num` | Номер секции (акцентный цвет, mono) |
| `.mobile-scroll-list` | Горизонтальный скролл на мобильном |
| `.mobile-scroll-item` | Элемент горизонтального скролла |
| `.section--alt` | Фон секции (bg-card + border) |
| `var(--accent)` | Акцентный цвет |
| `var(--bg)`, `var(--bg-card)`, `var(--bg-subtle)` | Фоны |
| `var(--text)`, `var(--text-muted)` | Цвета текста |
| `var(--border)`, `var(--border-md)` | Границы |
| `var(--radius)` | Радиус скругления |
| `var(--font-mono)` | Моноширинный шрифт |
| `var(--accent-glow)` | Box-shadow с акцентным свечением |

### Иконки
Используй готовые компоненты из `components/icons/`. При необходимости добавить иконку, сначала создай для нее компонент.

## Архитектура проекта

- **Nuxt 3 SSG** — `nuxt generate`, хостинг на GitHub Pages
- **i18n** — `@nuxtjs/i18n`, локали в `locales/ru.json` и `locales/en.json`
- **Изображения** — `<NuxtPicture>` с `format="avif,webp"`, `placeholder`, `preload` для LCP
- **Стили** — LESS в scoped SFC + `assets/css/global.less` для глобальных утилит
- **Брейкпоинты** — переменные из `assets/css/vars.less`, без хардкода пикселей
