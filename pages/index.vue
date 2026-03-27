<script setup lang="ts">
useScrollSpy()
useHead({
  title: 'Sergei Solovev — Lead Frontend Developer',
  meta: [{ name: 'description', content: 'Lead Frontend Developer, teacher and entrepreneur. Angular, TypeScript, RxJS.' }],
})
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
