// Генерация AI-фидов при сборке (ADR 0020):
// 1. public/blog/<slug>.md — markdown-версии постов (чистый текст для LLM)
// 2. public/llms.txt — карта сайта для LLM-ботов (https://llmstxt.org)
// 3. public/llms-full.txt — полный текст блога одним файлом
// Запускается перед `nuxt generate` (см. package.json); на GitHub Pages это статика.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const contentDir = join(root, 'content')
const publicDir = join(root, 'public')
const DOMAIN = 'https://sergsol.dev'

const readLocale = (code) => {
    try {
        return JSON.parse(readFileSync(join(root, 'locales', `${code}.json`), 'utf-8'))
    } catch {
        return {}
    }
}
const ru = readLocale('ru')
const siteTitle = 'Sergei Solovev — Team Lead / Frontend'
const siteDescription = ru?.about?.bio ?? ''

// ── Сбор списка постов из content/<locale>/blog/*.md ─────────────────────────
const posts = []
const locales = readdirSync(contentDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)

for (const locale of locales) {
    let files = []
    try {
        files = readdirSync(join(contentDir, locale, 'blog'))
    } catch {
        continue // локаль без блога
    }
    for (const file of files) {
        if (!file.endsWith('.md')) continue
        const raw = readFileSync(join(contentDir, locale, 'blog', file), 'utf-8')
        const slug = file.replace(/\.md$/, '')
        // frontmatter — простые строковые поля до первой закрывающей ---
        const fm = {}
        const head = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
        if (head) {
            for (const line of head[1].split(/\r?\n/)) {
                const m = line.match(/^(\w+):\s*(.+)$/)
                if (m) fm[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
            }
        }
        posts.push({ locale, slug, raw, title: fm.title ?? slug, description: fm.description })
    }
}
posts.sort((a, b) => (b.slug > a.slug ? 1 : -1))

// ── 1. Markdown-версии постов → public/blog/ ─────────────────────────────────
const blogOut = join(publicDir, 'blog')
mkdirSync(blogOut, { recursive: true })
for (const post of posts) {
    writeFileSync(join(blogOut, `${post.slug}.md`), post.raw)
}

// ── 2. llms.txt — карта сайта для LLM ────────────────────────────────────────
const llms = [`# ${siteTitle}`, '', `> ${siteDescription}`, '']
llms.push('## Страницы', '')
llms.push(`- [Главная](${DOMAIN}/): опыт, навыки, образование, контакты`)
llms.push(`- [Блог](${DOMAIN}/blog): посты из Telegram-канала «Философский код»`)
llms.push(`- [Портфолио](${DOMAIN}/portfolio): проекты`)
llms.push('')
llms.push('## Посты (markdown для LLM)', '')
for (const post of posts) {
    const parts = [`- [${post.title}](${DOMAIN}/blog/${post.slug}.md)`]
    if (post.description) parts.push(`: ${post.description}`)
    llms.push(parts.join(''))
}
llms.push('')
llms.push('## Полный текст', '')
llms.push(`- [Все посты одним файлом](${DOMAIN}/llms-full.txt)`)
writeFileSync(join(publicDir, 'llms.txt'), llms.join('\n'))

// ── 3. llms-full.txt — полный текст блога ────────────────────────────────────
const full = [`# ${siteTitle} — блог`, '', `> ${siteDescription}`, '']
for (const post of posts) {
    const body = post.raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '') // без frontmatter
    full.push(`---`, '', `# ${post.title}`, '', body.trim(), '')
}
writeFileSync(join(publicDir, 'llms-full.txt'), full.join('\n'))

console.log(
    `[export-blog-md] posts: ${posts.length}; wrote public/blog/*.md, llms.txt, llms-full.txt`
)
