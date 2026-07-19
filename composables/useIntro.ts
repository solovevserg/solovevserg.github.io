/**
 * Интро-шторка (ADR 0019).
 *
 * Решение «играть или нет» принимается синхронно инлайн-скриптом в <head>
 * (nuxt.config.ts) — он вешает класс `intro` на <html> до первой отрисовки,
 * по той же схеме, что и anti-FOUC темы (ADR 0007). Здесь только константы
 * и хелперы, чтобы условие не разъезжалось между скриптом и компонентом.
 */

export const INTRO_SESSION_KEY = 'intro-played'

/** Класс на <html>, выставляемый инлайн-скриптом. */
export const INTRO_CLASS = 'intro'

/** Полная длительность интро в мс — должна совпадать с CSS-таймлайном шторки. */
export const INTRO_DURATION = 2200

/** Играет ли интро прямо сейчас (читается уже после первой отрисовки). */
export const isIntroPlaying = () =>
    import.meta.client && document.documentElement.classList.contains(INTRO_CLASS)

/** Завершить интро: снять класс и запомнить показ на сеанс. */
export const finishIntro = () => {
    if (!import.meta.client) return
    document.documentElement.classList.remove(INTRO_CLASS)
    try {
        sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    } catch {
        // Приватный режим — интро просто проиграет ещё раз
    }
}
