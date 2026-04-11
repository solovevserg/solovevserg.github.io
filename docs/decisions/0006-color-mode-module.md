# Внедрение @nuxtjs/color-mode вместо кастомного решения

- Статус: отклонено — реализация вызвала гидратационные ошибки и нестабильное поведение
- Дата: 2026-03-30

## Контекст и постановка задачи

На сайте реализована поддержка тёмной и светлой темы. Текущая реализация состоит из трёх артефактов:

| Файл                              | Назначение                                                  |
| --------------------------------- | ----------------------------------------------------------- |
| `composables/useTheme.ts`         | Реактивное состояние `isDark`, методы `toggle()` и `init()` |
| `plugins/theme.client.ts`         | Инициализация темы при старте приложения                    |
| `components/layout/AppHeader.vue` | Кнопка переключения темы                                    |

**Как работает сейчас:**

1. При старте: `init()` читает `localStorage('theme')`, если не задано — читает `window.matchMedia('(prefers-color-scheme: dark)').matches` один раз
2. Применяет тему через `document.documentElement.dataset.theme = 'light' | 'dark'`
3. Сохраняет выбор в `localStorage` с ключом `'theme'`
4. CSS: тёмная тема в `:root` (по умолчанию), светлая — в `:root[data-theme="light"]`

**Выявленные проблемы:**

### 1. Отсутствие реактивного слежения за системной темой

`init()` вызывается один раз и **не устанавливает слушатель** на изменение системных настроек:

```typescript
// composables/useTheme.ts — нет addEventListener
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const dark = saved === 'light' ? false : saved === 'dark' ? true : prefersDark
apply(dark) // ← только разовое чтение, без подписки на изменения
```

Если пользователь изменит тему ОС (например, в macOS при автоматическом переключении день/ночь или через системные настройки), сайт **не отреагирует** без перезагрузки страницы.

### 2. Неявная логика тёмной темы по умолчанию

Тёмная тема задана через `:root { ... }` без атрибута, светлая — через `:root[data-theme="light"]`. Логика инвертирована: при ошибке скрипта или до его выполнения тема всегда тёмная, а не соответствующая системной. Это затрудняет поддержку и нарушает принцип явного > неявного.

### 3. Дублирование функциональности экосистемы Nuxt

Логика управления темой — задача уровня фреймворка. Кастомный composable + plugin воспроизводит функциональность, которая уже решена в официальном экосистемном модуле.

## Движущие факторы

- **Реактивность системной темы** — сайт должен мгновенно реагировать на смену темы ОС, включая автоматическое переключение день/ночь
- **Режим «следовать системе»** — пользователь должен иметь возможность не выбирать тему явно, доверив это ОС
- **Снижение объёма кастомного кода** — меньше кода = меньше багов
- **SSG-совместимость** — тема должна применяться до первой отрисовки (no FOUC)

## Рассмотренные варианты

### Вариант A — Добавить `matchMedia` слушатель в текущий `useTheme`

Минимальное изменение: добавить `addEventListener('change', ...)` в `init()`:

```typescript
const mq = window.matchMedia('(prefers-color-scheme: dark)')
mq.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) apply(e.matches) // только если нет явного выбора
})
```

**Плюсы:**

- Минимальная трудоёмкость (5 строк)
- Не меняет остальную архитектуру

**Минусы:**

- Нет режима «следовать системе» — после явного выбора пользователя слежение отключается и вернуть его нельзя без сброса localStorage
- Остаётся кастомный код вместо стандартного решения экосистемы
- Не решает проблему неявной тёмной темы по умолчанию в CSS
- Гидратация SSR: возможен кратковременный FOUC (flash of unstyled content)

---

### Вариант B — Только CSS-медиазапрос, без JS _(отклонён)_

Заменить `[data-theme="light"]` на `@media (prefers-color-scheme: light)` в CSS, убрать весь JS.

```css
:root {
    /* тёмная тема */
}
@media (prefers-color-scheme: light) {
    :root {
        /* светлая тема */
    }
}
```

**Плюсы:**

- Нулевой JS для управления темой
- Нативная реакция на смену темы ОС

**Минусы:**

- Невозможно дать пользователю **выбор**: нет кнопки переключения, нет сохранения
- Полностью теряется существующая функциональность хедера

---

### Вариант C — `@nuxtjs/color-mode` _(выбранный)_

Официальный модуль Nuxt для управления цветовой схемой.

**Установка:**

```bash
npm install @nuxtjs/color-mode
```

**Конфигурация `nuxt.config.ts`:**

```typescript
modules: ['@nuxtjs/color-mode', ...],
colorMode: {
  preference: 'dark',        // тема по умолчанию если нет системной и нет сохранённой
  fallback: 'dark',          // fallback когда preference=system, но ОС не сообщает тему
  dataValue: 'theme',        // <html data-theme="dark|light"> — совместимость с текущим CSS
  storageKey: 'theme',       // сохраняем в тот же ключ localStorage — без потери настроек пользователей
},
```

**Как работает:**

1. Модуль добавляет инлайн-скрипт в `<head>` ещё до первой отрисовки → нет FOUC
2. `useColorMode()` возвращает:
    - `preference` — явный выбор пользователя: `'dark'` | `'light'` | `'system'`
    - `value` — реальная применяемая тема: `'dark'` | `'light'` (никогда не `'system'`)
3. При `preference === 'system'` модуль **устанавливает слушатель `matchMedia.addEventListener('change', ...)`** → мгновенная реакция на смену темы ОС
4. Сохраняет выбор в `localStorage[storageKey]`

**Обновление `AppHeader.vue`:**

```typescript
// было:
const { isDark, toggle } = useTheme()

// станет:
const colorMode = useColorMode()
// colorMode.preference: 'dark' | 'light' | 'system'
// colorMode.value: 'dark' | 'light' (разрешённое)
```

Кнопка получает новую опцию «следовать системе»:

```html
<!-- Три состояния: dark → light → system → dark ... -->
<button @click="cycleMode">
    <IconSun v-if="colorMode.value === 'light'" />
    <IconMoon v-else-if="colorMode.preference === 'dark'" />
    <IconMonitor v-else />
    <!-- system -->
</button>
```

Или оставить два состояния (dark/light), игнорируя `system` — обратная совместимость UX.

**Обновление CSS в `global.less`:**

```less
// было: тёмная в :root, светлая в :root[data-theme="light"]
:root {
    --bg: #0c0c0e;
    ...;
}
:root[data-theme='light'] {
    --bg: #f5f5f3;
    ...;
}

// станет: обе темы явно через атрибут
:root[data-theme='dark'] {
    --bg: #0c0c0e;
    ...;
}
:root[data-theme='light'] {
    --bg: #f5f5f3;
    ...;
}
```

Одновременно следует добавить CSS-медиазапрос как базовый fallback на случай, если JS не отработал:

```less
@media (prefers-color-scheme: dark) {
    :root {
        --bg: #0c0c0e;
        ...;
    }
}
@media (prefers-color-scheme: light) {
    :root {
        --bg: #f5f5f3;
        ...;
    }
}
```

**Плюсы:**

- Реальное слежение за системной темой через `matchMedia` listener
- Режим «следовать системе» (preference = 'system')
- Inline-скрипт в head → нет FOUC при SSG
- Удаляются `composables/useTheme.ts` и `plugins/theme.client.ts`
- `@nuxt/content` highlight уже настроен под dark/light — переезд без изменений в config

**Минусы:**

- Требует обновления CSS: тёмная тема выносится из `:root` в `:root[data-theme="dark"]`
- Дополнительная зависимость (хотя официальная)
- Нужно обновить `AppHeader.vue` и `error.vue`

## Принятое решение

**Принят Вариант C** (`@nuxtjs/color-mode`) как наиболее полное решение, закрывающее все выявленные проблемы при минимальных поддерживаемых рисках.

Ключевой аргумент: система «следовать системной теме» невозможна без нативного слушателя `matchMedia`, и реализовывать её самостоятельно — воспроизведение логики модуля.

### Чек-лист реализации

#### Шаг 1 — Установка и конфигурация

- [ ] `npm install @nuxtjs/color-mode`
- [ ] Добавить `'@nuxtjs/color-mode'` в `modules` (`nuxt.config.ts`)
- [ ] Настроить `colorMode: { preference: 'dark', fallback: 'dark', dataValue: 'theme', storageKey: 'theme' }`
- [ ] Удалить `composables/useTheme.ts`
- [ ] Удалить `plugins/theme.client.ts`

#### Шаг 2 — CSS

- [ ] В `global.less`: перенести тёмную тему из `:root` в `:root[data-theme="dark"]`
- [ ] Добавить CSS-fallback через `@media (prefers-color-scheme: ...)` для случая без JS
- [ ] Проверить `error.vue` — там тоже есть `:root[data-theme="light"]` — должно остаться совместимым

#### Шаг 3 — Компоненты

- [ ] `AppHeader.vue`: заменить `useTheme()` на `useColorMode()`, обновить логику кнопки
- [ ] `error.vue`: удалить `onMounted(init)` и импорт `useTheme`
- [ ] Опционально: добавить третье состояние кнопки «system» (иконка монитора)

#### Шаг 4 — Верификация

- [ ] Проверить: при первом заходе без `localStorage` тема соответствует системной
- [ ] Проверить: смена темы ОС в реальном времени отражается на сайте (если `preference === 'system'`)
- [ ] Проверить: явно выбранная тема (dark/light) не меняется при смене темы ОС
- [ ] Проверить: повторный заход сохраняет последнюю выбранную тему
- [ ] Проверить: нет FOUC (flash before hydration)
- [ ] Проверить: `@nuxt/content` syntax highlighting переключается между `github-dark` и `github-light`

## Последствия

**Положительные:**

- Системная тема меняется мгновенно без перезагрузки страницы
- Пользователь может явно выбрать `system` и навсегда «отпустить» управление темой ОС
- Удаляется ~40 строк кастомного кода (composable + plugin)
- Inline-скрипт модуля устраняет потенциальный FOUC при SSG

**Отрицательные / риски:**

- Небольшая (~5 КБ) дополнительная зависимость
- CSS требует рефакторинга: тёмная тема становится явной (`:root[data-theme="dark"]`)
- Пользователи с сохранённым `'theme': 'dark'` в localStorage сохранят свой выбор (ключ совпадает)

## Ссылки

- [@nuxtjs/color-mode](https://color-mode.nuxtjs.org/)
- [MDN — prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [MDN — MediaQueryList: change event](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/change_event)
