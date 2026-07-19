/**
 * Директивы моторики (ADR 0019).
 *
 * `v-reveal`   — проявление при входе в вьюпорт (один общий IntersectionObserver).
 * `v-magnetic` — магнитное притяжение элемента к курсору.
 *
 * Плагин универсальный, не `.client`: иначе SSR не сможет разрешить директиву
 * и Vue выдаст предупреждение на каждый элемент. Браузерный код живёт в
 * `mounted`, который на сервере не выполняется, а `getSSRProps` отдаёт пустые
 * пропсы — в статическом HTML разметка остаётся чистой.
 */

type RevealValue = { delay?: number } | undefined
type MagneticValue = { strength?: number } | undefined

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default defineNuxtPlugin((nuxtApp) => {
    let observer: IntersectionObserver | null = null

    const getObserver = () => {
        if (observer) return observer
        observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue
                    revealElement(entry.target)
                    observer?.unobserve(entry.target)
                }
            },
            // Небольшой отступ снизу: элемент проявляется, когда он уже
            // уверенно вошёл в кадр, а не в момент касания края экрана.
            { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
        )
        return observer
    }

    if (import.meta.client && isIntroPlaying()) holdMotionGate()

    nuxtApp.vueApp.directive<HTMLElement, RevealValue>('reveal', {
        // Класс проставляется уже на сервере: иначе статический HTML
        // отрисовался бы видимым, а гидратация прятала бы содержимое —
        // на первом экране это заметная вспышка.
        getSSRProps: () => ({ class: 'reveal' }),

        mounted(el, binding) {
            // На клиентской навигации SSR-пропсов нет — вешаем здесь.
            // Это происходит до первой отрисовки элемента, вспышки нет.
            el.classList.add('reveal')

            if (prefersReducedMotion()) {
                el.classList.add('is-in')
                return
            }
            if (binding.value?.delay) {
                el.style.setProperty('--reveal-delay', `${binding.value.delay}ms`)
            }
            getObserver().observe(el)
        },

        unmounted(el) {
            observer?.unobserve(el)
            unqueueElement(el)
        },
    })

    nuxtApp.vueApp.directive<HTMLElement, MagneticValue>('magnetic', {
        getSSRProps: () => ({}),

        mounted(el, binding) {
            if (prefersReducedMotion()) return
            if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

            const strength = binding.value?.strength ?? 0.3
            const reset = () => {
                el.style.transform = ''
                el.style.willChange = ''
            }

            const onMove = (e: PointerEvent) => {
                const r = el.getBoundingClientRect()
                const dx = e.clientX - (r.left + r.width / 2)
                const dy = e.clientY - (r.top + r.height / 2)
                el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`
            }

            const onEnter = () => {
                el.style.willChange = 'transform'
            }

            el.addEventListener('pointerenter', onEnter)
            el.addEventListener('pointermove', onMove)
            el.addEventListener('pointerleave', reset)

            // Кнопка может быть удалена вместе с обработчиками — храним снятие
            // на самом элементе, чтобы unmounted не пересобирал замыкания.
            ;(el as any).__magneticCleanup = () => {
                el.removeEventListener('pointerenter', onEnter)
                el.removeEventListener('pointermove', onMove)
                el.removeEventListener('pointerleave', reset)
            }
        },

        unmounted(el) {
            ;(el as any).__magneticCleanup?.()
        },
    })
})
