#!/usr/bin/env node
/**
 * Синхронизация постов из Telegram-канала в блог (content/ru/blog).
 * Node 20+, зависимости — только richtypo (уже есть в package.json).
 *
 * Запуск:
 *   npm run blog:sync          # с токеном из .env (node --env-file)
 *   TG_DRY_RUN=1 ...           # показать, что будет записано, без записи файлов
 *
 * Кэш сырых апдейтов (.telegram-sync-cache.json) пишется ДО обработки и
 * сохраняется джобой через actions/cache: при падении скрипта чиним и
 * перезапускаем — апдейты не теряются даже если Telegram их подтвердил.
 *
 * См. ADR docs/decisions/0019-telegram-blog-sync.md
 */
import { readFile, writeFile, mkdir, readdir, access } from 'node:fs/promises'
import { constants as fsConstants } from 'node:fs'
import richtypo from 'richtypo'
import {
    dashesBasic,
    degreeSigns,
    ellipses,
    hyphenatedWords,
    numberUnits,
    shortWords,
} from 'richtypo/rules/common'

const TOKEN = process.env.TG_BOT_TOKEN
const CHANNEL = (process.env.TG_CHANNEL || 'phi_code').replace(/^@/, '')
const DRY_RUN = process.env.TG_DRY_RUN === '1' || process.argv.includes('--dry')
const STATE_FILE = '.telegram-sync-state.json'
const CACHE_FILE = '.telegram-sync-cache.json'
const CACHE_TTL_DAYS = 30
const CONTENT_DIR = 'content/ru/blog'
const IMG_DIR = 'public/images/blog'
const SITE_URL = 'https://sergsol.dev'

if (!TOKEN) {
    console.error('Ошибка: TG_BOT_TOKEN не задан (см. .env или секрет репозитория)')
    process.exit(1)
}

const API = (method) => `https://api.telegram.org/bot${TOKEN}/${method}`
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function api(method, params = {}) {
    const res = await fetch(API(method), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(params),
    })
    const json = await res.json()
    if (!json.ok) {
        throw new Error(`Telegram ${method} ${json.error_code}: ${json.description}`)
    }
    return json.result
}

// ---------------------------------------------------------------------------
// Entities → Markdown. Оффсеты Telegram — UTF-16 code units; строки JS тоже
// UTF-16, поэтому slice() корректен для кириллицы без дополнительных вычислений.
// ---------------------------------------------------------------------------

function escapeMd(s) {
    return s
        .replace(/\\/g, '\\\\')
        .replace(/([`*_\[\]~])/g, '\\$1')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/^#/gm, '\\#')
}

function wrapEntity(entity, raw, resolveLink) {
    switch (entity.type) {
        case 'bold':
            return `**${raw}**`
        case 'italic':
            return `_${raw}_`
        case 'underline':
            return `<u>${raw}</u>`
        case 'strikethrough':
            return `~~${raw}~~`
        case 'code':
            return `\`${raw}\``
        case 'pre':
            return `\`\`\`${entity.language || ''}\n${raw}\n\`\`\``
        case 'text_link': {
            // ссылки на другие посты канала ведём на сайт
            const m = raw && entity.url.match(/^https?:\/\/t\.me\/[^/]+\/(\d+)/i)
            const internal = m && resolveLink?.(Number(m[1]))
            return `[${raw}](${internal || entity.url})`
        }
        case 'url':
            return `[${raw}](${raw.startsWith('http') ? raw : `https://${raw}`})`
        case 'blockquote':
        case 'expandable_blockquote':
            return raw
                .split('\n')
                .map((line) => `> ${line}`)
                .join('\n')
        // spoiler, custom_emoji, mention, hashtag и т.д. — оставляем как есть
        default:
            return raw
    }
}

export function entitiesToMarkdown(text, entities = [], resolveLink) {
    if (!text) return ''
    const out = []
    let pos = 0
    for (const entity of [...entities].sort((a, b) => a.offset - b.offset)) {
        if (entity.offset < pos) continue // вложенные/перекрывающиеся сущности
        out.push(escapeMd(text.slice(pos, entity.offset)))
        out.push(
            wrapEntity(
                entity,
                text.slice(entity.offset, entity.offset + entity.length),
                resolveLink
            )
        )
        pos = entity.offset + entity.length
    }
    out.push(escapeMd(text.slice(pos)))
    return out
        .join('')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
}

// ---------------------------------------------------------------------------
// Заголовок = первое предложение (включая !, ? и …); оно вырезается из тела,
// чтобы не дублироваться под заголовком страницы.
// ---------------------------------------------------------------------------

function truncateTitle(s) {
    if (s.length <= 80) return s
    const cut = s.slice(0, 77)
    return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 0))}…`
}

export function splitFirstSentence(text) {
    if (!text) return { title: null, rest: '', cutLen: 0 }
    const m = text.match(/^[\p{Extended_Pictographic}\p{Emoji_Component}\s]*[\s\S]*?[.!?…]+(\s|$)/u)
    if (m) {
        const cutLen = m[0].length
        const sentence = text.slice(0, cutLen).replace(/\s+/g, ' ').trim()
        return { title: truncateTitle(sentence) || null, rest: text.slice(cutLen), cutLen }
    }
    // знака конца нет — заголовком становится первая строка
    const nl = text.indexOf('\n')
    const cutLen = nl === -1 ? text.length : nl
    const line = text.slice(0, cutLen).replace(/\s+/g, ' ').trim()
    return { title: truncateTitle(line) || null, rest: text.slice(cutLen), cutLen }
}

// Сдвигаем entities после вырезания заголовка; попавшие в вырезанную часть — теряем
function shiftEntities(entities, cutLen) {
    return entities
        .map((e) => ({ ...e, offset: e.offset - cutLen, length: e.length }))
        .filter((e) => e.offset >= 0)
}

export function extractTags(text) {
    return [...new Set([...(text || '').matchAll(/#([\p{L}\p{N}_]+)/gu)].map((m) => m[1]))].slice(
        0,
        8
    )
}

function firstParagraph(markdown, maxLen = 160) {
    const text = markdown
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/<video[^>]*>(?:<\/video>)?/g, ' ')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[#>*_~`]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    if (text.length <= maxLen) return text
    return `${text.slice(0, maxLen - 1).replace(/\s+\S*$/, '')}…`
}

// ---------------------------------------------------------------------------
// Постпроцессинг markdown: списки («- », «* », «1.», «1)») и типографика
// (неразрывные пробелы через richtypo — те же правила, что в useTypo).
// ---------------------------------------------------------------------------

function normalizeLists(md) {
    return md.replace(/^(\s*)[*+-]\s+/gm, '$1- ').replace(/^(\s*)(\d+)\)\s+/gm, '$1$2. ')
}

function applyTypo(md) {
    const stash = []
    const protect = (s) => `\u0000${stash.push(s) - 1}\u0000`
    const guarded = md
        .replace(/```[\s\S]*?```/g, protect)
        .replace(/`[^`\n]+`/g, protect)
        .replace(/!\[[^\]]*\]\([^)]*\)/g, protect)
        .replace(/\[[^\]]*\]\([^)]*\)/g, protect)
        .replace(/<[^>\n]+>/g, protect)

    let out = richtypo(
        [shortWords, numberUnits, degreeSigns, ellipses, hyphenatedWords, dashesBasic],
        guarded
    )
    out = out.replace(/&nbsp;/g, ' ').replace(/<nobr>(.*?)<\/nobr>/g, '$1')
    return out.replace(/\u0000(\d+)\u0000/g, (_, i) => stash[Number(i)])
}

// ---------------------------------------------------------------------------
// Фронтматтер (без библиотек — строки всегда в одинарных кавычках)
// ---------------------------------------------------------------------------

const yq = (s) => `'${String(s).replace(/'/g, "''")}'`

function buildFrontmatter(fields) {
    const lines = ['---']
    lines.push(`title: ${yq(fields.title)}`)
    lines.push(`date: ${yq(fields.date)}`)
    if (fields.description) lines.push(`description: ${yq(fields.description)}`)
    if (fields.image) lines.push(`image: ${yq(fields.image)}`)
    if (fields.tags?.length) {
        lines.push('tags:')
        for (const tag of fields.tags) lines.push(`    - ${tag}`)
    }
    lines.push(`telegram_message_id: ${fields.telegramMessageId}`)
    lines.push(`telegram_url: ${yq(fields.telegramUrl)}`)
    if (fields.updatedAt) lines.push(`updated_at: ${yq(fields.updatedAt)}`)
    lines.push('---', '')
    return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Индекс существующих постов: telegram_message_id → { file, slug }
// Посты без telegram_message_id (написанные вручную) синком не трогаются.
// ---------------------------------------------------------------------------

async function fileExists(path) {
    try {
        await access(path, fsConstants.F_OK)
        return true
    } catch {
        return false
    }
}

async function buildPostIndex() {
    const index = new Map()
    let files = []
    try {
        files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith('.md'))
    } catch {
        return index // каталога ещё нет
    }
    for (const file of files) {
        const content = await readFile(`${CONTENT_DIR}/${file}`, 'utf8')
        const m = content.match(/^telegram_message_id:\s*(\d+)/m)
        if (m) index.set(Number(m[1]), { file, slug: file.replace(/\.md$/, '') })
    }
    return index
}

// ---------------------------------------------------------------------------
// Медиа
// ---------------------------------------------------------------------------

async function downloadMedia(fileId, dirPath, baseName) {
    const file = await api('getFile', { file_id: fileId })
    const ext =
        file.file_path && file.file_path.includes('.') ? file.file_path.split('.').pop() : 'bin'
    const dest = `${dirPath}/${baseName}.${ext}`
    const publicPath = dest.replace(/^public/, '')
    if (DRY_RUN || (await fileExists(dest))) return publicPath
    const url = `https://api.telegram.org/file/bot${TOKEN}/${file.file_path}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Не удалось скачать медиа ${fileId}: HTTP ${res.status}`)
    await mkdir(dirPath, { recursive: true })
    await writeFile(dest, Buffer.from(await res.arrayBuffer()))
    await sleep(500) // вежливость к Telegram API
    return publicPath
}

// ---------------------------------------------------------------------------
// Кэш сырых апдейтов (для actions/cache — в git не коммитится)
// ---------------------------------------------------------------------------

async function readCache() {
    return readFile(CACHE_FILE, 'utf8')
        .then(JSON.parse)
        .then((data) => data.updates || [])
        .catch(() => [])
}

async function writeCache(entries) {
    await writeFile(CACHE_FILE, JSON.stringify({ updates: entries }, null, 4) + '\n')
}

async function writeState(offset) {
    await writeFile(
        STATE_FILE,
        JSON.stringify({ offset, updated: new Date().toISOString() }, null, 4) + '\n'
    )
}

// ---------------------------------------------------------------------------
// Обработка сообщений
// ---------------------------------------------------------------------------

async function upsertPost(msgs, index, stats) {
    const primary = msgs.find((m) => m.caption) || msgs[0]
    const existing = index.get(primary.message_id)

    // При правке уже скачанные фото берём из существующего файла: в окно
    // getUpdates приходят не все части альбома, а file_id старых частей недоступен
    let existingImages = []
    let oldContent = null
    if (existing) {
        oldContent = await readFile(`${CONTENT_DIR}/${existing.file}`, 'utf8')
        const oldBody = oldContent
            .split(/^---\n/m)
            .slice(2)
            .join('---\n')
        existingImages = oldBody.match(/^!\[Фото \d+\]\(\/images\/blog\/[^)]+\)$/gm) || []
    }

    const rawText = primary.text ?? primary.caption ?? ''
    const entities = primary.entities ?? primary.caption_entities ?? []
    const { title: extractedTitle, rest, cutLen } = splitFirstSentence(rawText)
    const title =
        extractedTitle || `Заметка от ${new Date(primary.date * 1000).toLocaleDateString('ru-RU')}`

    // ссылки на другие посты канала → ссылки на сайт
    const resolveLink = (id) => {
        const entry = index.get(id)
        return entry ? `${SITE_URL}/blog/${entry.slug}` : null
    }

    const unsupportedKeys = ['audio', 'voice', 'video_note', 'sticker', 'poll', 'document']
    const unsupported = msgs.some((m) => unsupportedKeys.some((k) => m[k]))

    // медиа: фото, gif (animation), видео
    const mediaDir = `${IMG_DIR}/${msgs[0].message_id}`
    const bodyParts = []

    if (existingImages.length) {
        bodyParts.push(existingImages.join('\n\n'))
    } else {
        const photos = msgs.filter((m) => Array.isArray(m.photo))
        for (const [i, m] of photos.entries()) {
            const fileId = m.photo[m.photo.length - 1].file_id // максимальный размер
            const path = await downloadMedia(fileId, mediaDir, `photo-${i + 1}`)
            bodyParts.push(`![Фото ${i + 1}](${path})`)
        }
        let n = 0
        for (const m of msgs.filter((x) => x.animation)) {
            const path = await downloadMedia(m.animation.file_id, mediaDir, `anim-${++n}`)
            bodyParts.push(`<video src="${path}" autoplay loop muted playsinline></video>`)
        }
        n = 0
        for (const m of msgs.filter((x) => x.video)) {
            const path = await downloadMedia(m.video.file_id, mediaDir, `video-${++n}`)
            bodyParts.push(`<video src="${path}" controls playsinline preload="metadata"></video>`)
        }
    }

    const textMd = rest.trim()
        ? entitiesToMarkdown(rest, shiftEntities(entities, cutLen), resolveLink)
        : ''
    if (textMd) bodyParts.push(textMd)

    const body = applyTypo(normalizeLists(bodyParts.join('\n\n')))

    if (!body.trim()) {
        if (unsupported) console.warn(`  ⚠ Пропущен пост ${primary.message_id}: медиа без текста`)
        stats.skipped++
        return
    }
    if (unsupported) {
        console.warn(
            `  ⚠ Пост ${primary.message_id}: вложение неподдерживаемого типа проигнорировано, текст сохранён`
        )
    }

    const isEdit = Boolean(primary.edit_date)
    const dateIso = new Date(primary.date * 1000).toISOString()

    // первое фото — для карточки в списке и og:image
    const image =
        existingImages[0]?.match(/\((\/[^)]+)\)/)?.[1] ||
        (msgs.some((m) => Array.isArray(m.photo))
            ? `/images/blog/${msgs[0].message_id}/photo-1.jpg`
            : null)

    await mkdir(CONTENT_DIR, { recursive: true })

    if (existing) {
        // Правка: перезаписываем тело, сохраняем имя файла (slug) и дату
        const filePath = `${CONTENT_DIR}/${existing.file}`
        const oldTitle = oldContent.match(/^title: '(.*)'$/m)?.[1]?.replace(/''/g, "'")
        const fields = {
            title: title || oldTitle,
            date: oldContent.match(/^date: '(.*)'$/m)?.[1] || dateIso,
            description: firstParagraph(textMd || title || ''),
            image,
            tags: extractTags(rawText),
            telegramMessageId: primary.message_id,
            telegramUrl: `https://t.me/${CHANNEL}/${primary.message_id}`,
            updatedAt: new Date(primary.edit_date * 1000).toISOString(),
        }
        if (DRY_RUN) {
            console.log(`  (dry run) обновил бы ${filePath}`)
        } else {
            await writeFile(filePath, buildFrontmatter(fields) + '\n' + body + '\n')
            stats.edited++
        }
        console.log(`  ✎ Правка поста ${primary.message_id} → ${existing.file}`)
    } else {
        // Новый пост (в т.ч. правка ещё не синхронизированного — создаём)
        const day = dateIso.slice(0, 10)
        const titleSlug = slugifyTitle(title)
        let slug = `${day}-${titleSlug || `post-${primary.message_id}`}`
        if (index.size) {
            let n = 2
            const taken = new Set([...index.values()].map((v) => v.slug))
            while (taken.has(slug))
                slug = `${day}-${titleSlug || `post-${primary.message_id}`}-${n++}`
        }
        const fields = {
            title,
            date: dateIso,
            description: firstParagraph(textMd || title || ''),
            image,
            tags: extractTags(rawText),
            telegramMessageId: primary.message_id,
            telegramUrl: `https://t.me/${CHANNEL}/${primary.message_id}`,
        }
        const file = `${slug}.md`
        if (DRY_RUN) {
            console.log(`  (dry run) создал бы ${CONTENT_DIR}/${file}`)
        } else {
            await writeFile(`${CONTENT_DIR}/${file}`, buildFrontmatter(fields) + '\n' + body + '\n')
            index.set(primary.message_id, { file, slug })
            stats[isEdit ? 'createdFromEdit' : 'created']++
        }
        console.log(
            `  + ${isEdit ? 'Новый (из правки)' : 'Новый'} пост ${primary.message_id} → ${file}`
        )
    }
}

// ---------------------------------------------------------------------------
// Slug: YYYY-MM-DD-<транслитерированный заголовок>
// ---------------------------------------------------------------------------

const TRANSLIT = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
}

function slugifyTitle(s, maxLen = 60) {
    let slug = s
        .toLowerCase()
        .split('')
        .map((ch) => TRANSLIT[ch] ?? ch)
        .join('')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    if (slug.length > maxLen) {
        // обрезаем по границе слова, а не посередине
        slug = slug.slice(0, maxLen)
        const lastDash = slug.lastIndexOf('-')
        if (lastDash > maxLen * 0.5) slug = slug.slice(0, lastDash)
    }
    return slug.replace(/-+$/g, '') || null
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    console.log(`Синхронизация Telegram @${CHANNEL} → ${CONTENT_DIR}${DRY_RUN ? ' (dry run)' : ''}`)

    const state = await readFile(STATE_FILE, 'utf8')
        .then(JSON.parse)
        .catch(() => ({ offset: 0 }))
    const index = await buildPostIndex()

    // Сырые апдейты кэшируются ДО обработки: очередной вызов getUpdates
    // подтверждает предыдущую порцию, поэтому всё полученное немедленно
    // попадает в кэш-файл; джоба сохраняет его через actions/cache даже при
    // падении. Повторная обработка безопасна (посты ищутся по message_id).
    const stats = { created: 0, createdFromEdit: 0, edited: 0, skipped: 0 }
    let offset = state.offset

    // 1. Свежие апдейты
    const fresh = []
    for (;;) {
        const batch = await api('getUpdates', {
            offset,
            limit: 100,
            timeout: 0,
            allowed_updates: ['channel_post', 'edited_channel_post'],
        })
        if (!batch.length) break
        fresh.push(...batch)
        offset = Math.max(...batch.map((u) => u.update_id)) + 1
        if (DRY_RUN) break // следующий вызов подтвердил бы апдейты — dry run их не расходует
    }

    // 2. Кэш прошлых прогонов + дедупликация по update_id
    const fetchedAt = new Date().toISOString()
    const cutoff = Date.now() - CACHE_TTL_DAYS * 86400000
    const cached = (await readCache()).filter((e) => Date.parse(e.fetched_at || 0) > cutoff)
    const byId = new Map()
    for (const entry of [
        ...cached,
        ...fresh.map((update) => ({ update, fetched_at: fetchedAt })),
    ]) {
        byId.set(entry.update.update_id, entry)
    }
    const all = [...byId.values()].sort((a, b) => a.update.update_id - b.update.update_id)

    if (!all.length) {
        console.log('Нет новых постов и правок.')
        if (!DRY_RUN) {
            await writeState(offset)
            await writeCache([])
        }
        return
    }

    // 3. Фиксируем кэш до обработки
    if (!DRY_RUN) await writeCache(all)

    const mine = all
        .map((e) => e.update.channel_post || e.update.edited_channel_post)
        .filter((m) => m && m.chat?.username?.toLowerCase() === CHANNEL.toLowerCase())
    const foreign = all.length - mine.length
    if (foreign > 0) console.log(`  · ${foreign} апдейт(ов) из других чатов пропущено`)

    // Группируем альбомы (media_group_id), остальное — одиночные сообщения
    const groups = new Map() // key → { msgs: [], order }
    for (const msg of mine) {
        const key = msg.media_group_id || `single-${msg.message_id}`
        if (!groups.has(key)) groups.set(key, { msgs: [], order: msg.message_id })
        const g = groups.get(key)
        g.msgs.push(msg)
        g.order = Math.min(g.order, msg.message_id)
    }
    const ordered = [...groups.values()].sort((a, b) => a.order - b.order)
    for (const { msgs } of ordered) {
        msgs.sort((a, b) => a.message_id - b.message_id)
        await upsertPost(msgs, index, stats)
    }

    // 4. Всё обработано — фиксируем offset и очищаем кэш
    if (!DRY_RUN) {
        await writeState(offset)
        await writeCache([])
    }
    console.log(
        `Готово: +${stats.created} новых, +${stats.createdFromEdit} из правок, ` +
            `${stats.edited} правок, ${stats.skipped} пропущено.`
    )
}

main().catch((err) => {
    console.error('Ошибка синхронизации:', err.message)
    process.exit(1)
})
