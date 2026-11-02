// BreadcrumbList JSON-LD для поисковых хлебных крошек (ADR 0016, ADR 0020).
// items — геттер, чтобы разметка реагировала на смену локали/данных.
export function useBreadcrumbJsonLd(items: () => { name: string; url?: string }[]) {
    useHead(() => ({
        script: [
            {
                type: 'application/ld+json',
                innerHTML: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'BreadcrumbList',
                    itemListElement: items().map((item, i) => ({
                        '@type': 'ListItem',
                        position: i + 1,
                        name: item.name,
                        item: item.url,
                    })),
                }),
            },
        ],
    }))
}
