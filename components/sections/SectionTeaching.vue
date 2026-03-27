<script setup lang="ts">
type TalkItem = { id: string; conf: string; title: string }
type CourseItem = { org: string; badge: string; period: string; items: string[] }
const { t, tm, rt } = useI18n()

const talkItems = computed<TalkItem[]>(() =>
  (tm('teaching.talks') as any[]).map(i => ({
    id: rt(i.id),
    conf: rt(i.conf),
    title: rt(i.title),
  }))
)
const activeTalkId = ref('')
const currentTalkId = computed(() => activeTalkId.value || talkItems.value[0]?.id || '')
const embedUrl = computed(() => `https://www.youtube.com/embed/${currentTalkId.value}?rel=0`)

const courseItems = computed<CourseItem[]>(() =>
  (tm('teaching.courses') as any[]).map(c => ({
    org: rt(c.org),
    badge: rt(c.badge),
    period: rt(c.period),
    items: (c.items as any[]).map(i => rt(i)),
  }))
)
</script>

<template>
  <section id="teaching" class="section">
    <div class="container">
      <SectionHeader num="/ 03" :title="t('teaching.title')" />

      <!-- Talks -->
      <p class="teaching-sub label-caps">{{ t('teaching.talks_title') }}</p>
      <div class="talks">
        <div class="talks__list">
          <button
            v-for="(talk, i) in talkItems"
            :key="talk.id"
            class="talk-item"
            :class="{ 'talk-item--active': currentTalkId === talk.id }"
            @click="activeTalkId = talk.id"
          >
            <span class="talk-item__num">0{{ i + 1 }}</span>
            <div class="talk-item__info">
              <span class="talk-item__conf">{{ talk.conf }}</span>
              <span class="talk-item__title">{{ talk.title }}</span>
            </div>
            <svg class="talk-item__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
        <div class="talks__player">
          <div class="talks__frame-wrap">
            <iframe
              :src="embedUrl"
              title="Talk video"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>
        </div>
      </div>

      <!-- Courses grid -->
      <p class="teaching-sub teaching-sub--spaced label-caps">{{ t('teaching.courses_title') }}</p>
      <div class="courses-grid">
        <div v-for="course in courseItems" :key="course.org" class="course-card card-hover">
          <div class="course-card__head">
            <span class="course-card__badge">{{ course.org }}</span>
            <span class="course-card__period">{{ course.period }}</span>
          </div>
          <ul class="course-card__list">
            <li v-for="item in course.items" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>

      <!-- GitHub CTA -->
      <div class="teaching-cta">
        <a href="https://github.com/solovevserg/studies" target="_blank" rel="noopener" class="repo-link card-hover">
          <div class="repo-link__body">
            <span class="repo-link__label">{{ t('teaching.github_cta') }}</span>
            <span class="repo-link__url">github.com/solovevserg/studies</span>
          </div>
          <svg class="repo-link__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.teaching-sub {
  margin-bottom: 1.25rem;
}

.teaching-sub--spaced {
  margin-top: 3.5rem;
}

.teaching-cta {
  margin-top: 3rem;
  display: flex;
  justify-content: center;
}

.repo-link {
  display: inline-flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-card);
  color: var(--text);
}

.repo-link:hover .repo-link__arrow {
  transform: translate(2px, -2px);
}

.repo-link__body {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.repo-link__label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.01em;
}

.repo-link__url {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
}

.repo-link__arrow {
  flex-shrink: 0;
  color: var(--accent);
  transition: transform 0.2s;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.course-card {
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-card);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.course-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.course-card__badge {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.course-card__period {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.course-card__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-top: 0.25rem;
}

.course-card__list li {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.5;
  padding-left: 1rem;
  position: relative;
}

.course-card__list li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--text-xmuted);
}

/* ─ Talks ─────────────────────────────────────────────────── */
.talks {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 1.5rem;
  align-items: start;
}

.talks__list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.talk-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  text-align: left;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem 1.1rem;
  cursor: pointer;
  color: inherit;
  font-family: inherit;
  transition: border-color 0.2s, background 0.2s, transform 0.2s;
}

.talk-item:hover {
  border-color: var(--border-md);
  background: var(--bg-subtle);
  transform: translateX(3px);
}

.talk-item--active {
  border-color: var(--accent);
  background: var(--accent-dim);
}

.talk-item__num {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  flex-shrink: 0;
  width: 1.6rem;
}

.talk-item--active .talk-item__num { color: var(--accent); }

.talk-item__info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
  min-width: 0;
}

.talk-item__conf {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
}

.talk-item__title {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.talk-item--active .talk-item__title { color: var(--text); }

.talk-item__arrow {
  flex-shrink: 0;
  color: var(--text-xmuted);
  transition: color 0.2s;
}

.talk-item--active .talk-item__arrow,
.talk-item:hover .talk-item__arrow { color: var(--accent); }

.talks__player {
  position: sticky;
  top: calc(var(--header-h) + 1.5rem);
}

.talks__frame-wrap {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  border-radius: var(--radius);
  overflow: hidden;
  background: #000;
  border: 1px solid var(--border);
}

.talks__frame-wrap iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

@media (max-width: 860px) {
  .talks { grid-template-columns: 1fr; }
  .talks__player { position: static; order: -1; }
}
@media (max-width: 768px) {
  .courses-grid {
    display: flex; flex-direction: row; overflow-x: auto;
    gap: 0.875rem; scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch; scrollbar-width: none;
    margin: -8px -2rem 0; padding: 8px 0 0.75rem;
    scroll-padding-left: 2rem;
  }
  .courses-grid::-webkit-scrollbar { display: none; }
  .courses-grid::before, .courses-grid::after { content: ''; flex: 0 0 2rem; }
  .course-card { flex: 0 0 78vw; max-width: 320px; scroll-snap-align: start; }
}
</style>
