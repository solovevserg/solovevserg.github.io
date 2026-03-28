<script setup lang="ts">
useScrollSpy()
usePageSeo()

const { t } = useI18n()
useHead(() => ({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: `${t('hero.name_first')} ${t('hero.name_last')}`,
      url: 'https://sergsol.dev',
      image: 'https://sergsol.dev/img/avatar.jpg',
      jobTitle: 'Lead Frontend Developer',
      sameAs: [
        'https://github.com/solovevserg',
        'https://www.linkedin.com/in/solovevserg/',
        'https://t.me/sergsol',
      ],
    }),
  }],
}))
</script>

<template>
  <div>
    <SectionHero />
    <SectionAbout />
    <SectionExperience />
    <SectionTeaching />
    <SectionEducation />
    <SectionSkills />
    <SectionFacts />
    <SectionContact />
  </div>
</template>
