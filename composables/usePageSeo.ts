interface PageSeoOptions {
    title?: string
    description?: string
    /** Путь к картинке от корня сайта (напр. '/images/blog/4/photo-1.jpg') — для og:image */
    image?: string
}

export function usePageSeo(options?: PageSeoOptions) {
    const { t, locale } = useI18n()

    const fullName = `${t('hero.name_first')} ${t('hero.name_last')}`

    const title = options?.title
        ? `${options.title} — ${fullName}`
        : `${fullName} — ${t('hero.role')}`

    const description = options?.description ?? t('about.bio')
    const image = options?.image ? `https://sergsol.dev${options.image}` : undefined

    useSeoMeta({
        title,
        ogTitle: title,
        ogSiteName: fullName,
        description,
        ogDescription: description,
        ...(image ? { ogImage: image, twitterImage: image } : {}),
        ogImageAlt: fullName,
        twitterTitle: title,
        twitterDescription: description,
        twitterImageAlt: fullName,
    })

    // hreflang + canonical + og:locale — handled by @nuxtjs/i18n
    const i18nHead = useLocaleHead({ addSeoAttributes: true })
    useHead(() => ({
        htmlAttrs: i18nHead.value.htmlAttrs ?? {},
        link: i18nHead.value.link ?? [],
        meta: i18nHead.value.meta ?? [],
    }))
}
