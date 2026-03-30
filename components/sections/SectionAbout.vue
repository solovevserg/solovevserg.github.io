<script setup lang="ts">
type StatItem = { value: string; label: string }
const { t, tm, rt } = useTypo()
const stats = computed<StatItem[]>(() => (tm('stats') as any[]).map(s => ({ value: rt(s.value), label: rt(s.label) })))
</script>

<template>
  <section id="about" class="section">
    <div class="container">
      <SectionHeader num="/ 01" :title="t('about.title')" />
      <!-- Stats row -->
      <div class="about-stats">
        <div v-for="stat in stats" :key="stat.label" class="about-stat">
          <span class="about-stat__value">{{ stat.value }}</span>
          <span class="about-stat__label">{{ stat.label }}</span>
        </div>
      </div>

      <div class="about-grid">
        <p class="about-bio">{{ t('about.bio') }}</p>
        <dl class="about-meta">
          <div class="meta-row">
            <dt>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </dt>
            <dd>{{ t('about.location') }}</dd>
          </div>
          <div class="meta-row">
            <dt>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </dt>
            <dd>
              <a href="https://t.me/sergsol" target="_blank" rel="noopener" class="link">@sergsol</a>
            </dd>
          </div>
          <div class="meta-row">
            <dt>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </dt>
            <dd>{{ t('about.languages') }}</dd>
          </div>
          <div class="meta-row">
            <dt>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </dt>
            <dd>{{ t('about.edu_short') }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
// ─── About stats ──────────────────────────────────────────────
.about-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.about-stat {
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1.5rem;
  border-right: 1px solid var(--border);

  &:last-child { border-right: none; }

  &__value {
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: var(--text);
    line-height: 1;
  }

  &__label {
    font-size: 0.78rem;
    color: var(--text-muted);
    margin-top: 0.3rem;
  }

  @media (max-width: 768px) {
    &:nth-child(2)   { border-right: none; }
    &:nth-child(n+3) { border-top: 1px solid var(--border); }
  }
}

// ─── About grid ───────────────────────────────────────────────
.about-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 4rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.about-bio {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--text);
}

.about-meta {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.meta-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;

  dt {
    color: var(--text-muted);
    padding-top: 2px;
    flex-shrink: 0;
  }

  dd {
    font-size: 0.9375rem;
    color: var(--text-muted);
    line-height: 1.4;
  }
}

.link {
  color: var(--accent);
  &:hover { text-decoration: underline; }
}
</style>
