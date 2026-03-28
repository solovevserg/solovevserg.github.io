<script setup lang="ts">
type ExpItem = { company: string; role: string; period: string; current: boolean; side: boolean; bullets: string[] }
const { t, tm, rt } = useI18n()

const allExpItems = computed<ExpItem[]>(() =>
  (tm('experience.items') as any[]).map(item => ({
    company: rt(item.company),
    role: rt(item.role),
    period: rt(item.period),
    current: item.current as boolean,
    side: !!item.side,
    bullets: (item.bullets as any[]).map(b => rt(b)),
  }))
)
const expItems = computed(() => allExpItems.value.filter(i => !i.side))
const sideItems = computed(() => allExpItems.value.filter(i => i.side))
</script>

<template>
  <section id="experience" class="section section--alt">
    <div class="container">
      <SectionHeader num="/ 02" :title="t('experience.title')" />
      <div class="exp-list">
        <article v-for="item in expItems" :key="item.company" class="exp-card">
          <div class="exp-card__top">
            <span class="mono-period">{{ item.period }}</span>
            <BadgeCurrent v-if="item.current" />
          </div>
          <div class="exp-card__body">
            <div class="exp-card__title-row">
              <h3 class="exp-card__company">{{ item.company }}</h3>
              <p class="exp-card__role">{{ item.role }}</p>
            </div>
            <ul class="exp-card__bullets">
              <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
            </ul>
          </div>
        </article>
      </div>

      <!-- Side projects -->
      <div class="side-block">
        <p class="side-block__label">{{ t('experience.side_title') }}</p>
        <p class="side-block__sub">{{ t('experience.side_subtitle') }}</p>
        <div class="side-list">
          <article v-for="item in sideItems" :key="item.company" class="side-card card-hover">
            <div class="side-card__meta">
              <span class="mono-period">{{ item.period }}</span>
              <BadgeCurrent v-if="item.current" />
            </div>
            <h4 class="side-card__company">{{ item.company }}</h4>
            <p class="side-card__role">{{ item.role }}</p>
            <ul class="side-card__bullets">
              <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
// ─── Experience ───────────────────────────────────────────────
.exp-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.exp-card {
  padding: 3rem 0;
  border-bottom: 1px solid var(--border);
  transition: none;

  &:first-child { border-top: 1px solid var(--border); }
  &:last-child  { border-bottom: none; }

  &__top {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    margin-bottom: 1.25rem;
  }

  &__body {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 2rem;
    align-items: start;
  }

  &__title-row {
    position: sticky;
    top: calc(var(--header-h) + 1.5rem);
  }

  &__company {
    font-size: clamp(1.4rem, 2.5vw, 1.75rem);
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 0.4rem;
  }

  &__role {
    font-size: 0.85rem;
    color: var(--accent);
    line-height: 1.4;
  }

  &__bullets {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    li {
      font-size: 0.925rem;
      color: var(--text-muted);
      padding-left: 1.25rem;
      position: relative;
      line-height: 1.55;

      &::before {
        content: '→';
        position: absolute;
        left: 0;
        color: var(--accent);
        font-size: 0.75rem;
        top: 0.18em;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 2rem 0;

    &__body {
      grid-template-columns: 1fr;
      gap: 1.25rem;
    }

    &__title-row { position: static; }
  }
}

// ─── Side projects ────────────────────────────────────────────
.side-block {
  margin-top: 3.5rem;
  padding-top: 3rem;
  border-top: 1px dashed var(--border-md);

  &__label {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 0.3rem;
  }

  &__sub {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-bottom: 1.75rem;
  }
}

.side-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    gap: 0.875rem;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    margin: -8px -2rem 0;
    padding: 8px 0 0.75rem;
    scroll-padding-left: 2rem;

    &::-webkit-scrollbar { display: none; }
    &::before, &::after  { content: ''; flex: 0 0 2rem; }
  }
}

.side-card {
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg);

  &__meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  &__company {
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 0.2rem;
  }

  &__role {
    font-size: 0.8rem;
    color: var(--accent);
    margin-bottom: 0.875rem;
  }

  &__bullets {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    li {
      font-size: 0.825rem;
      color: var(--text-muted);
      padding-left: 1rem;
      position: relative;
      line-height: 1.45;

      &::before {
        content: '→';
        position: absolute;
        left: 0;
        color: var(--text-xmuted);
        font-size: 0.7rem;
        top: 0.2em;
      }
    }
  }

  @media (max-width: 768px) {
    flex: 0 0 78vw;
    max-width: 320px;
    scroll-snap-align: start;
  }
}
</style>
