# FOUC фона и анимация фото на prod

- Статус: предложено
- Дата: 2026-04-18

## Контекст и постановка задачи

На продакшн-версии сайта (GitHub Pages, SSG) наблюдаются два взаимосвязанных визуальных артефакта при загрузке страницы:

1. **FOUC фонового цвета** — сайт отображается с серым фоном (~0.2–0.3с), затем меняется на правильный тёмный или светлый. Серый цвет — промежуточное состояние CSS-перехода между browser default (белый) и темой.
2. **Плавное появление фотографии** — фото героя появляется с fade-in анимацией вместо мгновенной отрисовки.

**Оба артефакта воспроизводятся только на prod (GitHub Pages), не в dev (`nuxt dev`).** Причина этого разрыва: Vite в dev-режиме инжектирует стили мгновенно через JS, поэтому переходы не успевают сработать на первом рендере. На prod CSS загружается как отдельный файл с сети.

Существующий anti-FOUC скрипт (ADR 0007) **не решает эту проблему**, так как устранял только FOUC переключения темы (неверный `data-theme`). Новый FOUC — другого рода: браузер отображает страницу с browser-default стилями до загрузки CSS-файла, а затем CSS-переходы анимируют изменение.

## Диагностика

### Причина 1 — FOUC фона

Порядок загрузки на prod:

```
1. Браузер получает HTML → парсит <head>
2. Anti-FOUC script выполняется → data-theme="dark" (или "light") установлен
3. <link rel="stylesheet"> встречается → начинается загрузка CSS (render-blocking в теории)
4. Браузер может показать промежуточный рендер с browser defaults:
   html { background: transparent } → рендерится поверх белого окна = белый/серый фон
5. CSS загружен → применяется:
   html { background: var(--bg); transition: background 0.3s; }
6. Браузер видит изменение background (transparent → #0c0c0e) и запускает transition
7. Пользователь видит: серый (midpoint перехода) → тёмный фон
```

На медленном или холодном соединении (CDN cache miss) step 4 занимает достаточно времени, чтобы браузер отрисовал промежуточный кадр.

Дополнительный усилитель: глобальный wildcard transition в `global.less`:

```less
*,
*::before,
*::after {
    transition:
        border-color 0.2s,
        color 0.2s,
        background-color 0.25s,
        // ← срабатывает на всех элементах при загрузке CSS
        opacity 0.2s;
}
```

### Причина 2 — Анимация фото

`@nuxt/image` устанавливает `opacity: 0` на `<img>` до загрузки изображения и переключает на `opacity: 1` по событию `load`. Глобальный `* { transition: opacity 0.2s }` из `global.less` анимирует это переключение как fade-in.

Без глобального `opacity` перехода изображение появлялось бы мгновенно (или с placeholder-blur, если бы он был настроен). Именно добавление/наличие `opacity 0.2s` в wildcard делает анимацию заметной.

## Движущие факторы

- Устранить оба артефакта на prod
- Не потерять плавный переход при ручном **переключении** темы (`background 0.3s`)
- Сохранить SSG-совместимость
- Минимальные изменения кодовой базы

## Рассмотренные варианты

### Вариант A — Inline CSS с базовыми переменными фона в `<head>` _(рекомендуемый для FOUC фона)_

Добавить `<style>` тег непосредственно в `<head>` с минимальными переменными фона — до загрузки внешнего CSS-файла. Браузер применит их немедленно, без сетевого запроса.

```typescript
// nuxt.config.ts — app.head
style: [
    {
        innerHTML: `:root{background:#0c0c0e}:root[data-theme=light]{background:#f5f5f3}`,
        tagPriority: 'critical',
    },
]
```

Порядок исполнения:

```
1. Anti-FOUC script → data-theme="dark" установлен
2. Inline <style> → html { background: #0c0c0e } применён немедленно
3. <link rel="stylesheet"> → загружается с сети, но фон уже правильный
4. Когда внешний CSS грузится, background не изменяется → transition не срабатывает
```

**Плюсы:**

- Полностью предотвращает FOUC — фон правильный с первого кадра
- Не трогает существующие transitions — смена темы остаётся плавной
- ~70 байт inline CSS

**Минусы:**

- Дублирование значений `#0c0c0e` и `#f5f5f3` — нужно синхронизировать с `global.less` при изменении палитры
- Не решает анимацию фото

---

### Вариант B — Убрать `opacity` из глобального wildcard transition _(для анимации фото)_

```less
// global.less — изменить:
*,
*::before,
*::after {
    transition:
        border-color 0.2s,
        color 0.2s,
        background-color 0.25s;
    // opacity убран
}
```

Без `opacity 0.2s` в wildcard, `@nuxt/image` не сможет анимировать появление фото через глобальный переход.

**Плюсы:**

- Фото появляется мгновенно (или через собственный placeholder, если он настроен)
- Устраняет непредвиденные opacity-анимации на других элементах при загрузке

**Минусы:**

- Потеря plавных `opacity`-переходов там, где они были желательны (например, hover на иконках)
- Придётся явно прописывать `transition: opacity 0.2s` в компонентах, где нужен плавный opacity

---

### Вариант C — Класс `no-transition` в anti-FOUC script _(альтернатива для FOUC фона)_

Расширить anti-FOUC script: сразу блокировать все transitions, снять блок после первого рендера через двойной `requestAnimationFrame`.

```javascript
// в nuxt.config.ts → app.head.script[0].innerHTML:
;(function () {
    try {
        var t = localStorage.getItem('theme')
        if (!t) t = window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'
        document.documentElement.dataset.theme = t
        document.documentElement.classList.add('no-transition')
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                document.documentElement.classList.remove('no-transition')
            })
        })
    } catch (e) {}
})()
```

```less
// global.less
html.no-transition,
html.no-transition *,
html.no-transition *::before,
html.no-transition *::after {
    transition: none !important;
}
```

**Плюсы:**

- Устраняет ВСЕ нежелательные transitions при загрузке
- Решает FOUC фона и потенциально анимацию фото одновременно

**Минусы:**

- `requestAnimationFrame` выполняется после загрузки JS-бандла — если JS грузится медленно, класс снимется поздно, что может привести к кратковременному "зависанию" переходов
- Сложнее в отладке
- Более инвазивное изменение anti-FOUC script

---

### Вариант D — CSS `@starting-style` (Houdini / CSS4)

Использовать `@starting-style` для явного задания начального состояния элемента, чтобы браузер не анимировал первое появление:

```css
html {
    transition: background 0.3s;
    @starting-style {
        background: var(--bg);  // начальное = конечному, нет анимации
    }
}
```

**Плюсы:** Семантически правильное решение.
**Минусы:** `@starting-style` поддерживается Chrome 117+, Firefox 129+, Safari 17.5+ — для части пользователей артефакт сохранится. Не решает opacity-анимацию фото.

---

### Вариант E — Принять текущее поведение

**Плюсы:** Ничего менять не нужно.
**Минусы:** FOUC заметен на быстрой прокрутке хроники и при первом визите (cold cache). Снижает perceived performance.

## Рекомендуемое решение

**Комбинация Варианта A + Варианта B:**

1. **Вариант A** — добавить inline `<style>` в `<head>` с базовыми переменными `background` для обеих тем. Это исправляет FOUC фона без изменения логики transitions.

2. **Вариант B** — убрать `opacity 0.2s` из глобального wildcard `*`. Там, где анимация opacity нужна (например, dropdown, hover-эффекты), прописать `transition: opacity 0.2s` явно в компоненте.

Вариант C является запасным, если A не даст полного результата (например, у части пользователей переход всё ещё срабатывает из-за перерасчёта стилей при гидрации).

### Чек-лист реализации

#### Вариант A (inline style):

- [ ] Добавить `app.head.style` в `nuxt.config.ts` с inline CSS для `background`
- [ ] Убедиться что `tagPriority: 'critical'` ставит тег **до** `<link rel="stylesheet">`
- [ ] Проверить на prod (после деплоя): нет серого flash при холодном кэше

#### Вариант B (убрать `opacity` из `*`):

- [ ] Удалить `opacity 0.2s` из блока `*,*::before,*::after` в `global.less`
- [ ] Найти все компоненты, где opacity-переход нужен явно, и добавить им `transition: opacity 0.2s`
- [ ] Проверить: фото в SectionHero появляется мгновенно
- [ ] Проверить: hover-эффекты с opacity не нарушены

## Последствия

**Положительные:**

- FOUC фона устранён для всех пользователей на prod
- Фото героя отрисовывается мгновенно
- Плавное переключение темы через кнопку сохраняется

**Отрицательные / риски:**

- Цвета `#0c0c0e` / `#f5f5f3` продублированы в inline `<style>` — риск рассинхронизации с `global.less` при смене палитры
- Явные `transition: opacity` придётся расставить вручную в компонентах по мере обнаружения

## Ссылки

- ADR 0007 — первоначальное решение FOUC темы (anti-FOUC script)
- ADR 0004 — оптимизация загрузки изображений
- [CSS render-blocking — web.dev](https://web.dev/articles/render-blocking-resources)
