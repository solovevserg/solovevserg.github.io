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

    const words = text.trim().split(/\s+/)
    // orphans склеивает два последних слова — для длинной пары («Technical University»)
    // это даёт неразрывный блок, который ломает узкие колонки
    if (words.length >= 5 && words.slice(-2).join('').length <= 16) {
        rules.unshift(orphans)
    }

    return richtypo(rules, text)
        .replace(/&nbsp;/g, '\u00A0')
        .replace(/<nobr>(.*?)<\/nobr>/g, '$1')
        .replace(/(^|\s)им\.\s+/g, '$1им.\u00A0')
}

export function useTypo() {
    const i18n = useI18n()
    const { locale } = i18n

    const t = (...args: Parameters<typeof i18n.t>): string =>
        applyTypo(i18n.t(...args) as string, locale.value)

    const rt = (message: any, ...rest: any[]): string =>
        applyTypo((i18n.rt as Function)(message, ...rest), locale.value)

    return { ...i18n, t, rt }
}
