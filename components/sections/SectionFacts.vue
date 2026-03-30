<script setup lang="ts">
type FactItem = { emoji: string; title: string; desc: string }
const { t, tm, rt } = useTypo()

const factItems = computed<FactItem[]>(() =>
  (tm('facts.items') as any[]).map(f => ({
    emoji: rt(f.emoji),
    title: rt(f.title),
    desc: rt(f.desc),
  }))
)
</script>

<template>
  <section id="facts" class="section section--alt">
    <div class="container">
      <SectionHeader num="/ 06" :title="t('facts.title')" />
      <div class="facts-grid mobile-scroll-list">
        <div v-for="fact in factItems" :key="fact.title" class="fact-card card-hover mobile-scroll-item">
          <span class="fact-card__emoji" aria-hidden="true">{{ fact.emoji }}</span>
          <h3 class="fact-card__title">{{ fact.title }}</h3>
          <p class="fact-card__desc">{{ fact.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
// ─── Fun Facts ────────────────────────────────────────────────
.facts-grid {
  gap: 1.5rem;

  @media (min-width: (@bp-sm + 1px)) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}

.fact-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 2rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &__emoji {
    font-size: 2rem;
    line-height: 1;
  }

  &__title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.01em;
  }

  &__desc {
    font-size: 0.9375rem;
    color: var(--text-muted);
    line-height: 1.65;
  }
}
</style>
