<script setup lang="ts">
type EduItem = { degree: string; field: string; school: string; city: string; tag: string; period: string; current?: boolean; grade?: string; thesis?: string; activities?: string }
const { t, tm, rt } = useTypo()

const eduItems = computed<EduItem[]>(() =>
  (tm('education.items') as any[]).map(e => ({
    degree: rt(e.degree),
    field: rt(e.field),
    school: rt(e.school),
    city: rt(e.city),
    tag: rt(e.tag),
    period: rt(e.period),
    current: !!e.current,
    grade: e.grade ? rt(e.grade) : undefined,
    thesis: e.thesis ? rt(e.thesis) : undefined,
    activities: e.activities ? rt(e.activities) : undefined,
  }))
)

// Split text into [everything before last word, last word]
// so last word + icon can be wrapped in white-space: nowrap
function splitLastWord(text: string): [string, string] {
  const i = text.lastIndexOf(' ')
  return i === -1 ? ['', text] : [text.slice(0, i), text.slice(i + 1)]
}

// Mobile bottom sheet for thesis (tooltip goes off-screen on mobile)
const activeThesis = ref<string | null>(null)
function toggleThesis(item: EduItem) {
  activeThesis.value = activeThesis.value === item.thesis ? null : (item.thesis ?? null)
}
watch(activeThesis, (val) => {
  if (import.meta.client) document.body.style.overflow = val ? 'hidden' : ''
})

const eduGroups = computed(() => {
  const map = new Map<string, EduItem[]>()
  for (const item of eduItems.value) {
    const list = map.get(item.school) ?? []
    list.push(item)
    map.set(item.school, list)
  }
  return Array.from(map.entries()).map(([school, items]) => ({ school, city: items[0].city, items }))
})
</script>

<template>
  <section id="education" class="section section--alt">
    <div class="container">
      <SectionHeader num="/ 04" :title="t('education.title')" />
      <div class="edu-timeline">
        <div v-for="group in eduGroups" :key="group.school" class="edu-group">

          <!-- Left: org name (desktop anchor) -->
          <div class="edu-group__sidebar">
            <h3 class="edu-group__org">{{ group.school }}</h3>
            <p class="edu-group__city">{{ group.city }}</p>
          </div>

          <!-- Right: timeline track -->
          <div class="edu-group__track">
            <div v-for="item in group.items" :key="item.degree" class="edu-item">

              <!-- Date sits at dot level -->
              <div class="edu-item__dateline">
                <span class="edu-item__period">{{ item.period }}</span>
                <BadgeCurrent v-if="item.current" />
              </div>

              <p class="edu-item__field">
                <template v-if="item.thesis">{{ splitLastWord(item.field)[0] }} <span class="thesis-tail">{{ splitLastWord(item.field)[1] }}&nbsp;<span class="thesis-hint" @click.stop="toggleThesis(item)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span class="thesis-hint__tooltip"><em class="thesis-hint__label">{{ t('education.thesis_label') }}</em>{{ item.thesis }}</span></span></span></template>
                <template v-else>{{ item.field }}</template>
              </p>

              <p class="edu-item__degree">{{ item.degree }}</p>

              <p v-if="item.grade" class="edu-item__grade">
                {{ t('education.grade_label') }}: <span class="edu-item__grade-label">{{ item.grade }}/5</span>
              </p>

              <p v-if="item.activities" class="edu-item__activities">{{ item.activities }}</p>

            </div>
          </div>

        </div>
      </div>
    </div>
  </section>

  <!-- Mobile thesis bottom sheet -->
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="activeThesis" class="thesis-sheet" @click="activeThesis = null">
        <div class="thesis-sheet__panel" @click.stop>
          <p class="thesis-sheet__label">{{ t('education.thesis_label') }}</p>
          <p class="thesis-sheet__text">{{ activeThesis }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="less">
// ─── Timeline container ───────────────────────────────────────
.edu-timeline {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

// ─── Group: two-column on desktop ─────────────────────────────
.edu-group {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 4rem;
  align-items: start;

  &__sidebar {
    position: sticky;
    top: calc(var(--header-h) + 2rem);
  }

  &__org {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
    line-height: 1.2;
  }

  &__city {
    margin-top: 0.35rem;
    font-size: 0.78rem;
    color: var(--text-muted);
    font-family: var(--font-mono);
  }

  &__track {
    border-left: 1.5px solid var(--border-md);
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;

    &__sidebar { position: static; }

    &__org {
      font-size: 0.82rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
      padding-left: 1rem;
      border-left: 2px solid var(--accent);
    }
  }
}

// ─── Timeline item ────────────────────────────────────────────
.edu-item {
  position: relative;
  padding: 0 0 2.5rem 2.5rem;

  &:last-child { padding-bottom: 0; }

  // Dot centered on the border-left line
  &::before {
    content: '';
    position: absolute;
    left: -5px;
    top: 0.22rem;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--bg-card);
    border: 2px solid var(--accent);
    z-index: 1;
  }

  // Date row — sits right at dot level
  &__dateline {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.6rem;
  }

  &__period {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--accent);
  }

  &__field {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.02em;
    line-height: 1.3;
    margin-bottom: 0.25rem;
  }

  &__degree {
    font-size: 0.8rem;
    color: var(--text-muted);
    font-family: var(--font-mono);
  }

  &__grade {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.5rem;
    font-size: 0.78rem;
    color: var(--text-muted);
  }

  &__grade-label {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    background: var(--accent-dim);
    color: var(--accent);
    padding: 0.1em 0.45em;
    border-radius: 4px;
  }

  &__activities {
    margin-top: 0.4rem;
    font-size: 0.72rem;
    color: var(--text-xmuted);
    line-height: 1.5;

    @media (max-width: 768px) { display: none; }
  }
}

// ─── Thesis tail (last word + icon, kept on same line) ────────
.thesis-tail {
  white-space: nowrap;
}

// ─── Thesis tooltip ───────────────────────────────────────────
.thesis-hint {
  position: relative;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  color: var(--text-muted);
  cursor: default;

  svg { display: block; flex-shrink: 0; }

  &__tooltip {
    display: none;
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    width: 260px;
    background: var(--bg-card);
    border: 1px solid var(--border-md);
    border-radius: var(--radius);
    padding: 0.65rem 0.85rem;
    font-size: 0.78rem;
    font-style: italic;
    color: var(--text-muted);
    line-height: 1.55;
    box-shadow: var(--shadow-sm);
    white-space: normal;
    z-index: 10;
    pointer-events: none;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
      border-top-color: var(--border-md);
    }
  }

  &__label {
    display: block;
    font-size: 0.7rem;
    font-style: normal;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 0.25rem;
  }

  @media (hover: hover) {
    &:hover .thesis-hint__tooltip,
    &:focus-within .thesis-hint__tooltip { display: block; }
  }
}
</style>

<style>
/* ─── Thesis bottom sheet (mobile) ───────────────────────── */
.thesis-sheet {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: flex-end;
  padding: 0 0.75rem 0.75rem;
}
.thesis-sheet__panel {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border-md);
  border-radius: 16px;
  padding: 1.25rem 1.5rem 1.75rem;
  box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.thesis-sheet__label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
}
.thesis-sheet__text {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
  font-style: italic;
}

.sheet-enter-active { transition: opacity 0.25s ease; }
.sheet-leave-active  { transition: opacity 0.25s ease; }
.sheet-enter-active .thesis-sheet__panel,
.sheet-leave-active  .thesis-sheet__panel {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-enter-from,
.sheet-leave-to { opacity: 0; }
.sheet-enter-from .thesis-sheet__panel,
.sheet-leave-to  .thesis-sheet__panel { transform: translateY(100%); }
</style>
