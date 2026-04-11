# Рефакторинг качества кода

- Статус: реализовано
- Дата: 2026-03-28

## Контекст

Аудит кодовой базы выявил четыре категории проблем, устранение которых снижает объём кода, повышает
согласованность и упрощает дальнейшую поддержку.

## Найденные проблемы и действия

### 1. Дублирование SVG-иконок

**Проблема.** Иконки Telegram, LinkedIn и GitHub вручную вставлены в двух местах каждая:
`SectionHero.vue` (секция socials) и `SectionContact.vue` (кнопки контактов). При изменении пути
SVG нужно синхронно редактировать несколько файлов.

**Решение.** Создать три компонента в `components/icons/`:

- `IconTelegram.vue`
- `IconLinkedin.vue`
- `IconGithub.vue`

Каждый принимает проп `size` (по умолчанию 20) и рендерит `<svg>` с `currentColor`.
Заменить все вхождения в SectionHero и SectionContact на эти компоненты.

**Затронутые файлы:** `SectionHero.vue`, `SectionContact.vue` — минус ~60 строк.

---

### 2. Дублирование CSS: mobile horizontal scroll

**Проблема.** В четырёх секциях идентичный блок (~14 строк каждый):

```less
@media (max-width: 768px) {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    gap: 0.875rem;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    margin: -8px -2rem 0;
    padding: 8px 0 0.75rem;
    scroll-padding-left: 2rem;
    &::-webkit-scrollbar {
        display: none;
    }
    &::before,
    &::after {
        content: '';
        flex: 0 0 2rem;
    }
}
```

И идентичный snap для дочерних карточек:

```less
@media (max-width: 768px) {
    flex: 0 0 78vw;
    max-width: 320px;
    scroll-snap-align: start;
}
```

Файлы: `SectionSkills.vue` (`.skills-grid` / `.skill-group`),
`SectionExperience.vue` (`.side-list` / `.side-card`),
`SectionTeaching.vue` (`.courses-grid` / `.course-card`),
`SectionFacts.vue` (`.facts-grid` / `.fact-card`).

**Решение.** Добавить в `assets/css/global.less` два утилитарных класса:

- `.mobile-scroll-list` — для контейнера
- `.mobile-scroll-item` — для дочерней карточки

Добавить классы в разметку каждой секции. Удалить дублирующийся CSS из scoped-стилей.

**Затронутые файлы:** `global.less` +28 строк, четыре секции −56 строк суммарно.

---

### 3. Локальные TypeScript-интерфейсы в каждом компоненте

**Проблема.** Семь компонентов определяют типы в теле `<script setup>`:

| Компонент         | Типы                     |
| ----------------- | ------------------------ |
| SectionAbout      | `StatItem`               |
| SectionSkills     | `SkillGroup`             |
| SectionExperience | `ExpItem`                |
| SectionEducation  | `EduItem`                |
| SectionTeaching   | `TalkItem`, `CourseItem` |
| SectionFacts      | `FactItem`               |

**Решение.** Создать `types/index.ts`, экспортировать все интерфейсы.
Заменить локальные объявления на `import type { ... } from '~/types'`.

**Затронутые файлы:** новый `types/index.ts`, семь компонентов — по 1–2 строки замены.

---

### 4. Нестандартный брейкпоинт в SectionEducation

**Проблема.** `SectionEducation.vue` использует `@media (max-width: 860px)` — единственный
нестандартный брейкпоинт в проекте. Остальные секции используют 768px и 1024px.

**Решение.** Заменить `860px` → `768px` для единообразия.

**Затронутые файлы:** `SectionEducation.vue` — 1 строка.

---

## Чек-лист реализации

- [x] Создать `components/icons/IconTelegram.vue`
- [x] Создать `components/icons/IconLinkedin.vue`
- [x] Создать `components/icons/IconGithub.vue`
- [x] Заменить SVG в `SectionHero.vue` на icon-компоненты
- [x] Заменить SVG в `SectionContact.vue` на icon-компоненты
- [x] Добавить `.mobile-scroll-list` / `.mobile-scroll-item` в `global.less`
- [x] Рефакторить `SectionSkills.vue`
- [x] Рефакторить `SectionExperience.vue`
- [x] Рефакторить `SectionTeaching.vue`
- [x] Рефакторить `SectionFacts.vue`
- [x] Создать `types/index.ts`
- [x] Обновить импорты типов в компонентах
- [x] Исправить `860px` → `768px` в `SectionEducation.vue`

## Последствия

**Положительные:**

- Суммарно удалено ~100 строк дублирующегося кода
- Изменение SVG-иконки — правка одного файла вместо двух
- Мобильное поведение карточек изменяется в одном месте
- Типы централизованы и можно использовать повторно

**Отрицательные / риски:**

- Нет. Изменения чисто структурные, поведение не меняется.
