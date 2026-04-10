# Перенос типографической обработки текстов на этап сборки

* Статус: предложено
* Дата: 2026-04-10

## Контекст и постановка задачи

В ADR 0002 принято решение использовать composable `useTypo()` — runtime-обёртку над `richtypo`, которая обрабатывает каждый вызов `t()` / `rt()` на лету. Это работает, но имеет недостатки:

1. **Runtime overhead** — `richtypo` применяет цепочку регулярных выражений к каждой строке при каждом рендере компонента. На SSG-сайте это overhead при пререндере каждой страницы и повторно при гидрации на клиенте.
2. **Двойная обработка** — при `nuxt generate` текст обрабатывается серверным пререндером, а затем ещё раз при клиентской гидрации (хотя результат идентичен).
3. **Связанность** — каждый компонент, которому нужна типографика, импортирует `useTypo()` вместо стандартного `useI18n()`. Сейчас это 8 компонентов. При росте проекта количество таких импортов растёт линейно.
4. **Дебаг** — строка в `locales/ru.json` не совпадает с тем, что рендерится в DOM. Отладка требует знания о промежуточной трансформации.

Предлагается перенести обработку `richtypo` на этап сборки: трансформировать JSON-файлы локалей до того, как Nuxt их загрузит.

## Движущие факторы

- SSG-сайт: весь контент известен на этапе сборки, runtime-обработка текста избыточна
- Хочется убрать `useTypo()` из компонентов и вернуться к стандартному `useI18n()`
- Исходные JSON должны оставаться чистыми и редактируемыми
- Решение должно работать и в `nuxt dev` (hot reload), и в `nuxt generate`

## Рассмотренные варианты

### Вариант A — Vite-плагин (трансформация при загрузке модуля)

Написать Vite-плагин, который перехватывает загрузку файлов `locales/*.json` и применяет `richtypo` к значениям перед тем, как модуль попадёт в бандл.

```ts
// plugins/vite-typo.ts
import { Plugin } from 'vite'
import richtypo from 'richtypo'
import { shortWords, orphans, numberUnits, dashesBasic, ellipses, degreeSigns, hyphenatedWords } from 'richtypo/rules/common'

function processValue(value: unknown): unknown {
  if (typeof value === 'string') return applyTypo(value)
  if (Array.isArray(value)) return value.map(processValue)
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, processValue(v)])
    )
  }
  return value
}

export default function viteTypoPlugin(): Plugin {
  return {
    name: 'vite-typo',
    transform(code, id) {
      if (!/locales\/[a-z]{2}\.json$/.test(id)) return null
      const json = JSON.parse(code)
      const processed = processValue(json)
      return `export default ${JSON.stringify(processed)}`
    },
  }
}
```

В `nuxt.config.ts`:
```ts
vite: {
  plugins: [viteTypoPlugin()],
}
```

**Плюсы:**
- Обработка происходит один раз при загрузке модуля (сборка или dev-сервер)
- Не нужны промежуточные файлы — исходные JSON остаются единственным источником правды
- Hot reload работает автоматически — Vite перезагружает модуль при изменении JSON
- Компоненты используют стандартный `useI18n()`, `useTypo()` удаляется
- Нулевой runtime overhead

**Минусы:**
- Нужно учитывать, что `@nuxtjs/i18n` с `lazy: true` загружает JSON через собственный механизм — необходимо проверить совместимость с `transform` хуком Vite
- Типографические правила применяются ко всем строкам без исключения (включая технические — nav labels, периоды). Может потребоваться механизм исключений (например, ключи, начинающиеся с `_raw_`)

---

### Вариант B — Pre-build скрипт с отдельной директорией

Скрипт `scripts/apply-typo.ts` читает `locales/*.json`, обрабатывает через `richtypo` и пишет результат в `locales-build/*.json`. Nuxt настраивается на `langDir: 'locales-build/'`.

```ts
// scripts/apply-typo.ts
import fs from 'fs'
import path from 'path'

const SRC = 'locales'
const DEST = 'locales-build'

for (const file of fs.readdirSync(SRC).filter(f => f.endsWith('.json'))) {
  const raw = JSON.parse(fs.readFileSync(path.join(SRC, file), 'utf-8'))
  const processed = processValue(raw) // та же рекурсивная обработка
  fs.mkdirSync(DEST, { recursive: true })
  fs.writeFileSync(path.join(DEST, file), JSON.stringify(processed, null, 2))
}
```

В `package.json`:
```json
{
  "scripts": {
    "typo": "tsx scripts/apply-typo.ts",
    "dev": "npm run typo && nuxt dev",
    "generate": "npm run typo && nuxt generate"
  }
}
```

**Плюсы:**
- Максимально простая и прозрачная реализация
- Можно инспектировать `locales-build/*.json` для отладки
- Не зависит от внутренних механизмов Vite или `@nuxtjs/i18n`

**Минусы:**
- Два набора файлов — `locales-build/` нужно добавить в `.gitignore`
- В dev-режиме при изменении `locales/*.json` нужно перезапускать скрипт вручную или добавлять file watcher (chokidar)
- `langDir` в конфиге указывает на генерируемую директорию — может запутать контрибьюторов

---

### Вариант C — Nuxt module hook (`i18n:registerModule` / `build:before`)

Написать Nuxt-модуль, который в хуке `build:before` или через интеграцию с `@nuxtjs/i18n` подменяет содержимое локалей.

```ts
// modules/typo.ts
import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  setup(_, nuxt) {
    nuxt.hook('build:before', () => {
      // прочитать и обработать locales/*.json
      // записать в .nuxt/locales-processed/*.json
      // обновить i18n.langDir
    })
  },
})
```

**Плюсы:**
- Идиоматичный Nuxt-подход — модуль в `modules/`
- Обработанные файлы в `.nuxt/` — чистое рабочее дерево
- Можно интегрироваться с `builder:watch` для dev-режима

**Минусы:**
- Зависит от внутренних хуков `@nuxtjs/i18n`, которые могут измениться между версиями
- Сложнее в реализации и отладке, чем Vite-плагин или скрипт
- Нужно понять, в какой момент жизненного цикла `@nuxtjs/i18n` читает файлы и можно ли их подменить

---

### Вариант D — Оставить текущий runtime-подход (useTypo)

Сохранить текущую реализацию из ADR 0002.

**Плюсы:**
- Уже работает, протестировано
- Нет риска регрессии

**Минусы:**
- Все перечисленные в разделе «Контекст» проблемы остаются

## Рекомендация

**Вариант A (Vite-плагин)** — оптимальный баланс между простотой и интеграцией.

Обоснование:
1. **Один источник правды** — нет промежуточных файлов, в отличие от варианта B.
2. **Dev и build** — Vite автоматически перезапускает `transform` при изменении файла. Не нужен отдельный watcher (в отличие от B) и не нужны хуки `@nuxtjs/i18n` (в отличие от C).
3. **Минимальная связанность** — плагин оперирует на уровне Vite (загрузка модулей), а не на уровне конкретного фреймворка. Переживёт обновления `@nuxtjs/i18n`.
4. **Удаление `useTypo()`** — 8 компонентов возвращаются к стандартному `useI18n()`. Composable и зависимость `richtypo` перемещаются в devDependencies (используется только при сборке).

Если при проверке выяснится, что `@nuxtjs/i18n` с `lazy: true` загружает JSON минуя стандартный `transform` Vite (через собственный virtual module), следует переключиться на **вариант C** (Nuxt-модуль) как запасной.

## План реализации

1. Создать `plugins/vite-typo.ts` — Vite-плагин с рекурсивной обработкой JSON-значений через `richtypo`
2. Подключить плагин в `nuxt.config.ts` → `vite.plugins`
3. Проверить, что `@nuxtjs/i18n` подхватывает трансформированные строки (dev + generate)
4. Если `transform` не срабатывает для lazy-loaded JSON — реализовать вариант C (Nuxt-модуль)
5. Заменить `useTypo()` → `useI18n()` в 8 компонентах
6. Удалить `composables/useTypo.ts`
7. Перенести `richtypo` из `dependencies` в `devDependencies`
8. Проверить все страницы на обоих локалях — визуальное сравнение до/после

## Последствия

**Положительные:**
- Нулевой runtime overhead: типографика применяется один раз при сборке
- Компоненты становятся проще — стандартный `useI18n()` без обёрток
- `richtypo` уходит из production-бандла (devDependency)
- Единый источник правды — исходные `locales/*.json`

**Отрицательные / риски:**
- Типографика применяется ко всем строкам без исключения. Если какие-то ключи не должны обрабатываться, нужен механизм исключений (конвенция именования или whitelist)
- При обновлении `@nuxtjs/i18n` может измениться механизм загрузки JSON — потребуется адаптация плагина
- Строки в DOM по-прежнему отличаются от исходного JSON (как и сейчас), но теперь промежуточный результат можно увидеть через отладку Vite-плагина
