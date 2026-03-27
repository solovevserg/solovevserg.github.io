<script setup lang="ts">
const { t, tm, rt, locale } = useI18n()
const localePath = useLocalePath()
useScrollSpy()

useHead({
  title: 'Sergei Solovev — Lead Frontend Developer',
  meta: [{ name: 'description', content: 'Lead Frontend Developer, teacher and entrepreneur. Angular, TypeScript, RxJS.' }],
})

type StatItem = { value: string; label: string }
type ExpItem = { company: string; role: string; period: string; current: boolean; side: boolean; bullets: string[] }
type EduItem = {
  degree: string; field: string; school: string; tag: string
  period: string; current?: boolean; grade?: string; thesis?: string; activities?: string
}
type SkillKey = { name: string; level: 'expert' | 'advanced' | 'intermediate' }
type SkillGroup = { name: string; keys: SkillKey[]; items: string[] }
type TalkItem = { id: string; conf: string; title: string }

const stats = computed<StatItem[]>(() =>
  (tm('stats') as any[]).map(s => ({ value: rt(s.value), label: rt(s.label) }))
)

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

const skillGroups = computed<SkillGroup[]>(() =>
  (tm('skills.groups') as any[]).map(g => ({
    name: rt(g.name),
    keys: (g.keys as any[]).map(k => ({ name: rt(k.name), level: rt(k.level) as SkillKey['level'] })),
    items: (g.items as any[]).map(i => rt(i)),
  }))
)

const eduItems = computed<EduItem[]>(() =>
  (tm('education.items') as any[]).map(e => ({
    degree: rt(e.degree),
    field: rt(e.field),
    school: rt(e.school),
    tag: rt(e.tag),
    period: rt(e.period),
    current: !!e.current,
    grade: e.grade ? rt(e.grade) : undefined,
    thesis: e.thesis ? rt(e.thesis) : undefined,
    activities: e.activities ? rt(e.activities) : undefined,
  }))
)

type CourseItem = { org: string; badge: string; period: string; items: string[] }
type FactItem = { emoji: string; title: string; desc: string }

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

const factItems = computed<FactItem[]>(() =>
  (tm('facts.items') as any[]).map(f => ({
    emoji: rt(f.emoji),
    title: rt(f.title),
    desc: rt(f.desc),
  }))
)

// ─── Typewriter ───────────────────────────────────────────────
const typewriterPhrases = computed(() => (tm('hero.typewriter') as any[]).map(l => rt(l)))
const typeText = ref('')
const typeIndex = ref(0)
let typeTimer: ReturnType<typeof setTimeout> | null = null

const runTypewriter = () => {
  const phrases = typewriterPhrases.value
  if (!phrases.length) return
  const target = phrases[typeIndex.value]
  const cur = typeText.value

  if (cur.length < target.length) {
    typeText.value = target.slice(0, cur.length + 1)
    typeTimer = setTimeout(runTypewriter, 60)
  } else {
    typeTimer = setTimeout(() => {
      const erase = () => {
        if (typeText.value.length > 0) {
          typeText.value = typeText.value.slice(0, -1)
          typeTimer = setTimeout(erase, 30)
        } else {
          typeIndex.value = (typeIndex.value + 1) % phrases.length
          typeTimer = setTimeout(runTypewriter, 350)
        }
      }
      typeTimer = setTimeout(erase, 2000)
    }, 0)
  }
}


onMounted(() => {
  runTypewriter()
})

onUnmounted(() => {
  if (typeTimer) clearTimeout(typeTimer)
})
</script>

<template>
  <div>
    <!-- ═══════════════════════════════════════════ HERO (full-width) -->
    <section
      class="hero dot-bg"
    >
      <!-- Left panel -->
      <div class="hero__left">
        <div class="hero__left-inner">

          <h1 class="hero__name">
            <span class="hero__name-line">{{ t('hero.name_first') }}</span>
            <span class="hero__name-line hero__name-line--accent">{{ t('hero.name_last') }}</span>
          </h1>

          <div class="hero__typewriter" aria-live="polite">
            <span class="hero__type-prefix">_</span>
            <span class="hero__type-text">{{ typeText }}</span>
            <span class="hero__type-cursor" aria-hidden="true">|</span>
          </div>

          <div class="hero__actions">
            <a href="https://t.me/sergsol" target="_blank" rel="noopener" class="btn btn--primary">
              {{ t('hero.cta_contact') }}
            </a>
            <NuxtLink :to="localePath('/blog')" class="btn btn--ghost">
              {{ t('hero.cta_blog') }}
            </NuxtLink>
          </div>

          <div class="hero__socials">
            <a href="https://github.com/solovevserg" target="_blank" rel="noopener" class="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/solovevserg/" target="_blank" rel="noopener" class="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            <a href="https://t.me/sergsol" target="_blank" rel="noopener" class="social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Telegram
            </a>
          </div><!-- /.hero__socials -->

        </div><!-- /.hero__left-inner -->
      </div><!-- /.hero__left -->

      <!-- Right: full-height photo -->
      <div class="hero__photo-wrap" aria-hidden="true">
        <img
          src="/img/avatar.jpg"
          alt=""
          class="hero__photo"
        />
        <div class="hero__photo-grad" />
      </div>

      <!-- Scroll hint -->
      <a href="#about" class="scroll-hint" aria-label="Scroll down">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </a>
    </section>

    <!-- ═══════════════════════════════════════════ ABOUT -->
    <section id="about" class="section">
      <div class="container">
        <header class="section-header">
          <span class="section-num">/ 01</span>
          <h2 class="section-heading">{{ t('about.title') }}</h2>
        </header>
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

    <!-- ═══════════════════════════════════════════ EXPERIENCE -->
    <section id="experience" class="section section--alt">
      <div class="container">
        <header class="section-header">
          <span class="section-num">/ 02</span>
          <h2 class="section-heading">{{ t('experience.title') }}</h2>
        </header>
        <div class="exp-list">
          <article v-for="item in expItems" :key="item.company" class="exp-card">
            <div class="exp-card__top">
              <span class="exp-card__period">{{ item.period }}</span>
              <span v-if="item.current" class="exp-card__badge">
                <span class="badge-dot" />current
              </span>
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
            <article v-for="item in sideItems" :key="item.company" class="side-card">
              <div class="side-card__meta">
                <span class="side-card__period">{{ item.period }}</span>
                <span v-if="item.current" class="exp-card__badge">
                  <span class="badge-dot" />current
                </span>
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

    <!-- ═══════════════════════════════════════════ TEACHING -->
    <section id="teaching" class="section">
      <div class="container">
        <header class="section-header">
          <span class="section-num">/ 03</span>
          <h2 class="section-heading">{{ t('teaching.title') }}</h2>
        </header>

        <!-- Talks -->
        <p class="teaching-sub">{{ t('teaching.talks_title') }}</p>
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
        <p class="teaching-sub teaching-sub--spaced">{{ t('teaching.courses_title') }}</p>
        <div class="courses-grid">
          <div v-for="course in courseItems" :key="course.org" class="course-card">
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
          <a href="https://github.com/solovevserg/studies" target="_blank" rel="noopener" class="repo-link">
            <div class="repo-link__body">
              <span class="repo-link__label">{{ t('teaching.github_cta') }}</span>
              <span class="repo-link__url">github.com/solovevserg/studies</span>
            </div>
            <svg class="repo-link__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ EDUCATION -->
    <section id="education" class="section section--alt">
      <div class="container">
        <header class="section-header">
          <span class="section-num">/ 04</span>
          <h2 class="section-heading">{{ t('education.title') }}</h2>
        </header>
        <div class="edu-list">
          <div v-for="item in eduItems" :key="item.degree" class="edu-card">
            <div class="edu-card__header">
              <div class="edu-card__tag">{{ item.tag }}</div>
              <div class="edu-card__meta">
                <span class="exp-card__period">{{ item.period }}</span>
                <span v-if="item.current" class="exp-card__badge">
                  <span class="badge-dot" />current
                </span>
              </div>
            </div>
            <div class="edu-card__content">
              <p class="edu-card__school">{{ item.school }}</p>
              <p class="edu-card__field">
                {{ item.field }}
                <span v-if="item.thesis" class="thesis-hint">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <span class="thesis-hint__tooltip"><em class="thesis-hint__label">{{ t('education.thesis_label') }}</em> {{ item.thesis }}</span>
                </span>
              </p>
              <p class="edu-card__degree">{{ item.degree }}</p>
              <p v-if="item.grade" class="edu-card__grade">
                <span class="edu-card__grade-label">GPA</span> {{ item.grade }}/5
              </p>
              <p v-if="item.activities" class="edu-card__activities">{{ item.activities }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ SKILLS -->
    <section id="skills" class="section">
      <div class="container">
        <header class="section-header">
          <span class="section-num">/ 05</span>
          <h2 class="section-heading">{{ t('skills.title') }}</h2>
        </header>
        <div class="skills-grid">
          <div v-for="group in skillGroups" :key="group.name" class="skill-group">
            <h3 class="skill-group__name">{{ group.name }}</h3>
            <div class="skill-keys">
              <div v-for="key in group.keys" :key="key.name" class="skill-key">
                <span class="skill-key__name">{{ key.name }}</span>
                <span class="skill-key__dots" aria-hidden="true">
                  <span class="skill-key__dot" :class="{ 'skill-key__dot--filled': true }" />
                  <span class="skill-key__dot" :class="{ 'skill-key__dot--filled': key.level === 'advanced' || key.level === 'expert' }" />
                  <span class="skill-key__dot" :class="{ 'skill-key__dot--filled': key.level === 'expert' }" />
                </span>
                <span class="skill-key__level">{{ t(`skills.levels.${key.level}`) }}</span>
              </div>
            </div>
            <div v-if="group.items.length" class="skill-tags">
              <span v-for="item in group.items" :key="item" class="skill-tag">{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ FUN FACTS -->
    <section id="facts" class="section section--alt">
      <div class="container">
        <header class="section-header">
          <span class="section-num">/ 06</span>
          <h2 class="section-heading">{{ t('facts.title') }}</h2>
        </header>
        <div class="facts-grid">
          <div v-for="fact in factItems" :key="fact.title" class="fact-card">
            <span class="fact-card__emoji" aria-hidden="true">{{ fact.emoji }}</span>
            <h3 class="fact-card__title">{{ fact.title }}</h3>
            <p class="fact-card__desc">{{ fact.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ CONTACT (full-width) -->
    <section id="contact" class="contact">
      <div class="container">
        <header class="section-header">
          <span class="section-num">/ 07</span>
          <h2 class="section-heading">{{ t('contact.title') }}</h2>
        </header>
        <h2 class="contact__heading">{{ t('contact.subtitle') }}</h2>
        <div class="contact__links">
          <a href="https://t.me/sergsol" target="_blank" rel="noopener" class="contact-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            {{ t('contact.telegram') }}
          </a>
          <a href="https://www.linkedin.com/in/solovevserg/" target="_blank" rel="noopener" class="contact-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            {{ t('contact.linkedin') }}
          </a>
          <a href="https://github.com/solovevserg" target="_blank" rel="noopener" class="contact-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            {{ t('contact.github') }}
          </a>
          <a href="https://hh.ru/resume/78b19b1dff097442f70039ed1f666643556a49" target="_blank" rel="noopener" class="contact-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            {{ t('contact.hh') }}
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ─── Hero ──────────────────────────────────────────────────── */
/* ─── Hero ───────────────────────────────────────────────────── */
.hero {
  position: relative;
  height: calc(100dvh - var(--header-h));
  display: flex;
  align-items: stretch;
  overflow: hidden;
}

/* bottom fade into next section */
.hero::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 80px;
  background: linear-gradient(to bottom, transparent, var(--bg));
  pointer-events: none;
  z-index: 3;
}

/* ─── Left panel ─────────────────────────────────────────────── */
.hero__left {
  position: relative;
  z-index: 2;
  width: min(56%, 700px);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding-left: max(2rem, calc((100vw - 1280px) / 2 + 2rem));
  padding-right: 4rem;
  padding-top: 2rem;
  padding-bottom: 2.5rem;
}

.hero__left-inner {
  width: 100%;
  max-width: 520px;
}


/* ─── Photo ──────────────────────────────────────────────────── */
.hero__photo-wrap {
  position: absolute;
  right: 0; top: 0; bottom: 0;
  width: 60%;
  overflow: hidden;
}

.hero__photo {
  width: 100%;
  height: 110%;
  object-fit: cover;
  object-position: center 80%;
  display: block;
  transform: scale(1.55);
  transform-origin: center 80%;
}

/* oval mask: фото проявляется в центре, тает по краям */
.hero__photo-grad {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 75% 88% at 62% 46%, transparent 30%, var(--bg) 72%),
    linear-gradient(to right, var(--bg) 0%, transparent 28%);
  pointer-events: none;
}


/* ─── Name ───────────────────────────────────────────────────── */
.hero__name {
  display: flex;
  flex-direction: column;
  font-size: clamp(3.8rem, 8vw, 7.5rem);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.04em;
  margin-bottom: 1.5rem;
}

.hero__name-line--accent {
  color: transparent;
  -webkit-text-stroke: 1.5px var(--text);
}

/* ─── Typewriter ─────────────────────────────────────────────── */
.hero__typewriter {
  display: flex;
  align-items: center;
  gap: 0;
  min-height: 2.2rem;
  margin-bottom: 2.5rem;
  font-family: var(--font-mono);
  font-size: clamp(0.85rem, 1.6vw, 1.05rem);
  color: var(--text-muted);
}

.hero__type-prefix {
  color: var(--accent);
  margin-right: 0.5em;
  font-weight: 600;
}

.hero__type-text {
  color: var(--text);
  font-weight: 400;
}

.hero__type-cursor {
  color: var(--accent);
  margin-left: 1px;
  animation: blink 1s step-end infinite;
  font-weight: 300;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

/* ─── Actions ────────────────────────────────────────────────── */
.hero__actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: transform 0.15s, box-shadow 0.15s;
}

.btn:active { transform: scale(0.98); }

.btn--primary {
  background: var(--accent);
  color: #fff;
}
.btn--primary:hover { box-shadow: var(--accent-glow); }

.btn--ghost {
  background: var(--bg-subtle);
  color: var(--text);
  border: 1px solid var(--border);
}
.btn--ghost:hover { border-color: var(--border-md); }

/* ─── Socials ────────────────────────────────────────────────── */
.hero__socials {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}
.social-link:hover { color: var(--text); }

/* ─── Scroll hint ────────────────────────────────────────────── */
.scroll-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px; height: 40px;
  border: 1px solid var(--border);
  border-radius: 50%;
  color: var(--text-muted);
  background: var(--bg-card);
  animation: bounce 2.5s ease-in-out infinite;
}

.scroll-hint:hover { color: var(--accent); border-color: var(--accent); }

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(6px); }
}

/* ─── About stats ────────────────────────────────────────────── */
.about-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 3rem;
}

.about-stat {
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1.5rem;
  border-right: 1px solid var(--border);
}
.about-stat:last-child { border-right: none; }

.about-stat__value {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--text);
  line-height: 1;
}

.about-stat__label {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 0.3rem;
}

/* ─── About ─────────────────────────────────────────────────── */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 4rem;
  align-items: start;
}

.about-bio {
  font-size: 1.1rem;
  line-height: 1.75;
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
}

.meta-row dt {
  color: var(--text-muted);
  padding-top: 2px;
  flex-shrink: 0;
}

.meta-row dd {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.4;
}

.link { color: var(--accent); }
.link:hover { text-decoration: underline; }

/* ─── Section header typography ──────────────────────────────── */
.section-header {
  margin-bottom: 4rem;
}

.section-num {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--accent);
  letter-spacing: 0.1em;
  display: block;
  margin-bottom: 0.6rem;
}

.section-heading {
  font-size: clamp(2.4rem, 5.5vw, 4rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 0.92;
  color: var(--text);
}

/* ─── Alt section background ────────────────────────────────── */
.section--alt {
  background: var(--bg-card);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

/* ─── Experience ────────────────────────────────────────────── */
.exp-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.exp-card {
  padding: 3rem 0;
  border-bottom: 1px solid var(--border);
  transition: none;
}

.exp-card:first-child {
  border-top: 1px solid var(--border);
}

.exp-card:last-child {
  border-bottom: none;
}

.exp-card__top {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1.25rem;
}

.exp-card__period {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.exp-card__badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.68rem;
  font-weight: 500;
  color: var(--current-dot);
  background: rgba(34,197,94,0.1);
  border-radius: 100px;
  padding: 0.15rem 0.65rem;
}

.badge-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--current-dot);
}

.exp-card__body {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 2rem;
  align-items: start;
}

.exp-card__title-row {
  position: sticky;
  top: calc(var(--header-h) + 1.5rem);
}

.exp-card__company {
  font-size: clamp(1.4rem, 2.5vw, 1.75rem);
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 0.4rem;
}

.exp-card__role {
  font-size: 0.85rem;
  color: var(--accent);
  line-height: 1.4;
}

.exp-card__bullets {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.exp-card__bullets li {
  font-size: 0.925rem;
  color: var(--text-muted);
  padding-left: 1.25rem;
  position: relative;
  line-height: 1.55;
}

.exp-card__bullets li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--accent);
  font-size: 0.75rem;
  top: 0.18em;
}

/* ─── Side projects block ───────────────────────────────────── */
.side-block {
  margin-top: 3.5rem;
  padding-top: 3rem;
  border-top: 1px dashed var(--border-md);
}

.side-block__label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.3rem;
}

.side-block__sub {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 1.75rem;
}

.side-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.side-card {
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg);
  transition: border-color 0.2s;
}

.side-card:hover { border-color: var(--border-md); }

.side-card__meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.side-card__period {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
}

.side-card__company {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.2rem;
}

.side-card__role {
  font-size: 0.8rem;
  color: var(--accent);
  margin-bottom: 0.875rem;
}

.side-card__bullets {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.side-card__bullets li {
  font-size: 0.825rem;
  color: var(--text-muted);
  padding-left: 1rem;
  position: relative;
  line-height: 1.45;
}

.side-card__bullets li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--text-xmuted);
  font-size: 0.7rem;
  top: 0.2em;
}

/* ─── Skills ────────────────────────────────────────────────── */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.skill-group {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-group__name {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0;
}

.skill-keys {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.skill-key {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.skill-key__name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
  flex: 1;
  min-width: 0;
}

.skill-key__dots {
  display: flex;
  gap: 3px;
  flex-shrink: 0;
}

.skill-key__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--border-md);
}

.skill-key__dot--filled {
  background: var(--accent);
}

.skill-key__level {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  flex-shrink: 0;
  width: 6.5rem;
  text-align: right;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border);
}

.skill-tag {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted);
  background: var(--bg-subtle);
  border-radius: 4px;
  padding: 0.2rem 0.6rem;
  cursor: default;
}

/* ─── Education ─────────────────────────────────────────────── */
.edu-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.edu-card {
  padding: 1.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  cursor: default;
}

.edu-card:hover {
  border-color: var(--accent);
  transform: translateY(-3px);
  box-shadow: 0 0 0 1px var(--accent), var(--accent-glow);
}

.edu-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.edu-card__meta {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.edu-card__tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px; height: 44px;
  border-radius: 10px;
  background: var(--accent-dim);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

.edu-card__period {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  text-align: right;
}

.edu-card__content {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}

.edu-card__school {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.edu-card__field {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.edu-card__degree {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
  margin-top: 0.1rem;
}

.edu-card__grade {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.5rem;
  font-size: 0.78rem;
  color: var(--text-muted);
}

.edu-card__grade-label {
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

.edu-card__thesis {
  margin-top: 0.6rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.55;
  border-left: 2px solid var(--accent-dim);
  padding-left: 0.75rem;
}

.edu-card__activities {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-xmuted);
  line-height: 1.5;
}

/* ─── Thesis tooltip ─────────────────────────────────────────── */
.thesis-hint {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 0.3em;
  vertical-align: middle;
  color: var(--text-muted);
  cursor: default;
}

.thesis-hint svg {
  display: block;
  flex-shrink: 0;
}

.thesis-hint__tooltip {
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
}

.thesis-hint__label {
  display: block;
  font-size: 0.7rem;
  font-style: normal;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 0.25rem;
}

.thesis-hint__tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--border-md);
}

.thesis-hint:hover .thesis-hint__tooltip,
.thesis-hint:focus-within .thesis-hint__tooltip {
  display: block;
}

/* ─── Fun Facts ─────────────────────────────────────────────── */
.facts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.fact-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 2rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.fact-card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-dim);
}

.fact-card__emoji {
  font-size: 2rem;
  line-height: 1;
}

.fact-card__title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
}

.fact-card__desc {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.65;
}

/* ─── Contact ───────────────────────────────────────────────── */
.contact {
  background: var(--bg-card);
  border-top: 1px solid var(--border);
  padding: 7rem 0;
}

.contact__heading {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  max-width: 600px;
  margin-bottom: 2.5rem;
  line-height: 1.2;
}

.contact__links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-muted);
  background: var(--bg);
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}

.contact-link:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-dim);
}

/* ─── Responsive ────────────────────────────────────────────── */
/* ─── Tablet: photo shrinks, text takes ~65% ─────────────────── */
@media (max-width: 1024px) {
  .hero__left {
    width: min(60%, 580px);
    padding-right: 2rem;
  }
  /* враппер шире — объект центрирован, есть запас для градиента */
  .hero__photo-wrap {
    width: 75%;
    left: auto;
  }
  .hero__photo {
    object-position: center 75%;
  }
  .hero__photo-grad {
    background:
      radial-gradient(ellipse 72% 88% at 55% 48%, transparent 30%, var(--bg) 70%),
      linear-gradient(to right, var(--bg) 0%, transparent 30%);
  }
  .hero__name { font-size: clamp(3.2rem, 9vw, 6rem); }
}

/* ─── Mobile: photo becomes background, text full-width ──────── */
@media (max-width: 768px) {
  .hero__left {
    width: 100%;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    align-items: flex-end;
    padding-bottom: 5rem;
    background: transparent; /* фото просвечивает сквозь панель */
  }
  .hero__left-inner { max-width: 100%; }

  /* фото на весь экран как фон */
  .hero__photo-wrap {
    width: 100%;
    opacity: 1;
  }

  /* тёмный градиент снизу для читаемости текста */
  .hero__photo-grad {
    background:
      linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, var(--bg) 85%),
      linear-gradient(to bottom, var(--bg) 0%, transparent 20%);
  }

  .hero__name { font-size: clamp(3rem, 14vw, 5.5rem); }
  .hero__typewriter { font-size: 0.85rem; }

  .about-grid { grid-template-columns: 1fr; gap: 2rem; }
  .skills-grid { grid-template-columns: repeat(2, 1fr); }
  .exp-card { padding: 2rem 0; }
  .exp-card__body { grid-template-columns: 1fr; gap: 1.25rem; }
  .exp-card__title-row { position: static; }
  .section-heading { font-size: clamp(2rem, 10vw, 2.8rem); }
  .side-list { grid-template-columns: 1fr; }
  .edu-list { grid-template-columns: 1fr; }
  .facts-grid { grid-template-columns: 1fr; }
  .edu-card__activities { display: none; }
  .about-stats { grid-template-columns: repeat(2, 1fr); }
  .about-stat:nth-child(2) { border-right: none; }
  .about-stat:nth-child(3) { border-top: 1px solid var(--border); border-right: 1px solid var(--border); }
}

@media (max-width: 480px) {
  .skills-grid { grid-template-columns: 1fr; }
  .hero__name { font-size: clamp(2.8rem, 16vw, 4.5rem); }
  .hero__left { padding-left: 1.25rem; padding-right: 1.25rem; }
  .hero__photo-wrap { object-position: center 60%; }
}

/* ─ Teaching ────────────────────────────────────────────────── */
.teaching-sub {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
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
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.repo-link:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-dim);
  transform: translateY(-2px);
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
  transition: border-color 0.2s, transform 0.2s;
}

.course-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
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

@media (max-width: 768px) {
  .courses-grid { grid-template-columns: 1fr; }
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
  .talks {
    grid-template-columns: 1fr;
  }
  .talks__player {
    position: static;
    order: -1;
  }
}
</style>
