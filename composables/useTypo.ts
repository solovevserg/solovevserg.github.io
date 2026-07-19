import richtypo from 'richtypo'
import {
    dashesBasic,
    degreeSigns,
    ellipses,
    hyphenatedWords,
    numberUnits,
    orphans,
    shortWords,
} from 'richtypo/rules/common'

function applyTypo(text: string, locale: string): string {
    const rules = [shortWords, numberUnits, degreeSigns, ellipses, hyphenatedWords, dashesBasic]

    if (text.trim().split(/\s+/).length >= 5) {
        rules.unshift(orphans)
    }

    return richtypo(rules, text)
        .replace(/&nbsp;/g, '\u00A0')
        .replace(/<nobr>(.*?)<\/nobr>/g, '$1')
}

export function useTypo() {
    const i18n = useI18n()
    const { locale } = i18n

    // `Parameters<typeof i18n.t>` разрешался в последнюю перегрузку vue-i18n
    // (key, plural, options) — TypeScript требовал три аргумента на каждый
    // вызов `t('key')`. Сужаем сигнатуру до фактически используемой.
    const t = (key: string, named?: Record<string, unknown>): string =>
        applyTypo((named ? i18n.t(key, named) : i18n.t(key)) as string, locale.value)

    const rt = (message: any, ...rest: any[]): string =>
        applyTypo((i18n.rt as Function)(message, ...rest), locale.value)

    return { ...i18n, t, rt }
}
