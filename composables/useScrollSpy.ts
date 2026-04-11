export const SCROLL_SECTIONS = [
    { id: 'about', labelKey: 'about.title' },
    { id: 'experience', labelKey: 'experience.title' },
    { id: 'teaching', labelKey: 'teaching.title' },
    { id: 'education', labelKey: 'education.title' },
    { id: 'skills', labelKey: 'skills.title' },
    { id: 'facts', labelKey: 'facts.title' },
    { id: 'contact', labelKey: 'contact.title' },
] as const

export const useScrollSpy = () => {
    const progress = useState('scroll-progress', () => 0)
    const activeLabelKey = useState('scroll-active-label', () => '')

    const update = () => {
        const scrollY = window.scrollY
        const docH = document.documentElement.scrollHeight - window.innerHeight
        progress.value = docH > 0 ? (scrollY / docH) * 100 : 0

        const offset = 80
        let active = ''
        for (const s of SCROLL_SECTIONS) {
            const el = document.getElementById(s.id)
            if (el && el.getBoundingClientRect().top <= offset) {
                active = s.labelKey
            }
        }
        activeLabelKey.value = active
    }

    onMounted(() => {
        window.addEventListener('scroll', update, { passive: true })
        update()
    })

    onUnmounted(() => {
        window.removeEventListener('scroll', update)
    })

    return { progress, activeLabelKey, sections: SCROLL_SECTIONS }
}
