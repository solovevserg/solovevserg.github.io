/**
 * Ворота анимаций (ADR 0019).
 *
 * Пока играет интро-шторка, элементы под ней уже пересекают вьюпорт —
 * IntersectionObserver сработал бы «вхолостую», и к моменту подъёма шторки
 * первый экран оказался бы уже проявленным. Ворота придерживают выдачу
 * класса `is-in` до конца интро и затем разом проявляют накопленную очередь.
 *
 * Состояние — модульный синглтон: ворота живут ровно один клиентский сеанс
 * и не должны попадать в SSR-пейлоад.
 */

let open = true
const queued = new Set<Element>()

/** Придержать проявление. Вызывается до монтирования — из plugins/motion.ts. */
export const holdMotionGate = () => {
    open = false
}

/** Открыть ворота и проявить всё, что накопилось за время интро. */
export const openMotionGate = () => {
    if (open) return
    open = true
    for (const el of queued) el.classList.add('is-in')
    queued.clear()
}

/** Проявить элемент сейчас либо поставить в очередь до открытия ворот. */
export const revealElement = (el: Element) => {
    if (open) el.classList.add('is-in')
    else queued.add(el)
}

/** Снять элемент с учёта (размонтирование до открытия ворот). */
export const unqueueElement = (el: Element) => {
    queued.delete(el)
}
