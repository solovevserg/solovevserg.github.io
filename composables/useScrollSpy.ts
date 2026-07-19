export const SCROLL_SECTIONS = [
    { id: 'about', labelKey: 'about.title' },
    { id: 'experience', labelKey: 'experience.title' },
    { id: 'teaching', labelKey: 'teaching.title' },
    { id: 'education', labelKey: 'education.title' },
    { id: 'skills', labelKey: 'skills.title' },
    { id: 'facts', labelKey: 'facts.title' },
    { id: 'contact', labelKey: 'contact.title' },
] as const

/** Номер главы в рубрикации: 01…07 (ADR 0019). */
export const chapterNum = (index: number) => String(index + 1).padStart(2, '0')

// Слушатель вешается один на всё приложение: композабл вызывают и хедер,
// и рельса глав, и страница — считать позиции трижды за скролл незачем.
let listeners = 0
let detach: (() => void) | null = null

export const useScrollSpy = () => {
    const progress = useState('scroll-progress', () => 0)
    const activeLabelKey = useState('scroll-active-label', () => '')
    const activeIndex = useState('scroll-active-index', () => -1)

    const update = () => {
        const scrollY = window.scrollY
        const docH = document.documentElement.scrollHeight - window.innerHeight
        progress.value = docH > 0 ? Math.min(100, (scrollY / docH) * 100) : 0

        const offset = 80
        let index = -1
        SCROLL_SECTIONS.forEach((s, i) => {
            const el = document.getElementById(s.id)
            if (el && el.getBoundingClientRect().top <= offset) index = i
        })
        activeIndex.value = index
        activeLabelKey.value = index >= 0 ? SCROLL_SECTIONS[index].labelKey : ''
    }

    onMounted(() => {
        listeners++
        if (listeners === 1) {
            let ticking = false
            const onScroll = () => {
                if (ticking) return
                ticking = true
                requestAnimationFrame(() => {
                    update()
                    ticking = false
                })
            }
            window.addEventListener('scroll', onScroll, { passive: true })
            window.addEventListener('resize', onScroll, { passive: true })
            detach = () => {
                window.removeEventListener('scroll', onScroll)
                window.removeEventListener('resize', onScroll)
            }
        }
        update()
    })

    onUnmounted(() => {
        listeners--
        if (listeners === 0) {
            detach?.()
            detach = null
        }
    })

    return { progress, activeLabelKey, activeIndex, sections: SCROLL_SECTIONS }
}
