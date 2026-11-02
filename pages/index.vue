<script setup lang="ts">
useScrollSpy()
usePageSeo()

const { t, locale } = useI18n()

// JSON-LD @graph: WebSite + WebPage + Person, связаны по @id (ADR 0016, ADR 0020)
useHead(() => ({
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': [
                    {
                        '@type': 'WebSite',
                        '@id': 'https://sergsol.dev/#website',
                        url: 'https://sergsol.dev',
                        name: 'Sergei Solovev',
                        inLanguage: ['ru', 'en'],
                    },
                    {
                        '@type': 'WebPage',
                        '@id': 'https://sergsol.dev/#webpage',
                        url: 'https://sergsol.dev',
                        isPartOf: { '@id': 'https://sergsol.dev/#website' },
                        about: { '@id': 'https://sergsol.dev/#person' },
                        inLanguage: locale.value,
                    },
                    {
                        '@type': 'Person',
                        '@id': 'https://sergsol.dev/#person',
                        name: `${t('hero.name_first')} ${t('hero.name_last')}`,
                        url: 'https://sergsol.dev',
                        image: 'https://sergsol.dev/img/avatar.jpg',
                        jobTitle: 'Team Lead',
                        sameAs: [
                            'https://github.com/solovevserg',
                            'https://www.linkedin.com/in/solovevserg/',
                            'https://t.me/sergsol',
                        ],
                    },
                ],
            }),
        },
    ],
}))
</script>

<template>
    <div>
        <SectionHero />
        <SectionAbout />
        <LazySectionExperience />
        <LazySectionTeaching />
        <LazySectionEducation />
        <LazySectionSkills />
        <LazySectionFacts />
        <LazySectionContact />
    </div>
</template>
