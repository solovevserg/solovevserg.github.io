<script setup lang="ts">
const { t, tm, rt, locale } = useI18n()
const localePath = useLocalePath()
useScrollSpy()

useHead({
  title: 'Sergei Solovev — Lead Frontend Developer',
  meta: [{ name: 'description', content: 'Lead Frontend Developer, teacher and entrepreneur. Angular, TypeScript, RxJS.' }],
})

type StatItem = { value: string; label: string }
type ExpItem = { company: string; role: string; period: string; current: boolean; bullets: string[] }
type SkillGroup = { name: string; items: string[] }
type EduItem = { degree: string; field: string; school: string }

const stats = computed<StatItem[]>(() =>
  (tm('stats') as any[]).map(s => ({ value: rt(s.value), label: rt(s.label) }))
)

const expItems = computed<ExpItem[]>(() =>
  (tm('experience.items') as any[]).map(item => ({
    company: rt(item.company),
    role: rt(item.role),
    period: rt(item.period),
    current: item.current as boolean,
    bullets: (item.bullets as any[]).map(b => rt(b)),
  }))
)

const skillGroups = computed<SkillGroup[]>(() =>
  (tm('skills.groups') as any[]).map(g => ({
    name: rt(g.name),
    items: (g.items as any[]).map(i => rt(i)),
  }))
)

const eduItems = computed<EduItem[]>(() =>
  (tm('education.items') as any[]).map(e => ({
    degree: rt(e.degree),
    field: rt(e.field),
    school: rt(e.school),
  }))
)

const tagline = computed(() => (tm('hero.tagline') as any[]).map(l => rt(l)))
</script>

<template>
  <div>
    <!-- ═══════════════════════════════════════════ HERO (full-width) -->
    <section class="hero dot-bg">
      <div class="hero__content">
        <div class="hero__left">
        <div class="hero__eyebrow">
          <span class="hero__role-label">{{ t('hero.role') }}</span>
          <span class="hero__available">
            <span class="hero__dot" />
            {{ t('hero.available') }}
          </span>
        </div>

        <h1 class="hero__name">
          <span class="hero__name-line">Sergei</span>
          <span class="hero__name-line hero__name-line--accent">Solovev</span>
        </h1>

        <p class="hero__tagline">
          <span v-for="(line, i) in tagline" :key="i" class="hero__tagline-item">
            {{ line }}<template v-if="i < tagline.length - 1">&nbsp;</template>
          </span>
        </p>

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
        </div>
        </div><!-- /.hero__left -->

        <!-- Photo -->
        <div class="hero__photo-wrap" aria-hidden="true">
          <div class="hero__photo-frame">
            <img src="/img/avatar.jpg" alt="Sergei Solovev" class="hero__photo" />
          </div>
        </div>
      </div>

      <!-- Stats strip -->
      <div class="hero__stats">
        <div v-for="stat in stats" :key="stat.label" class="stat">
          <span class="stat__value">{{ stat.value }}</span>
          <span class="stat__label">{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ ABOUT -->
    <section id="about" class="section">
      <div class="container">
        <p class="section-title">{{ t('about.title') }}</p>
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8l6 6 6-6"/><path d="M3 4h18M3 12h18M3 20h18" opacity="0"/><rect x="3" y="5" width="18" height="14" rx="2"/></svg>
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
        <p class="section-title">{{ t('experience.title') }}</p>
        <div class="exp-list">
          <article v-for="item in expItems" :key="item.company" class="exp-card">
            <div class="exp-card__header">
              <div>
                <h3 class="exp-card__company">{{ item.company }}</h3>
                <p class="exp-card__role">{{ item.role }}</p>
              </div>
              <div class="exp-card__right">
                <span class="exp-card__period">{{ item.period }}</span>
                <span v-if="item.current" class="exp-card__badge">
                  <span class="badge-dot" />current
                </span>
              </div>
            </div>
            <ul class="exp-card__bullets">
              <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ SKILLS -->
    <section id="skills" class="section">
      <div class="container">
        <p class="section-title">{{ t('skills.title') }}</p>
        <div class="skills-grid">
          <div v-for="group in skillGroups" :key="group.name" class="skill-group">
            <h3 class="skill-group__name">{{ group.name }}</h3>
            <div class="skill-tags">
              <span v-for="item in group.items" :key="item" class="skill-tag">
                {{ item }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ EDUCATION -->
    <section id="education" class="section section--alt">
      <div class="container">
        <p class="section-title">{{ t('education.title') }}</p>
        <div class="edu-list">
          <div v-for="item in eduItems" :key="item.degree" class="edu-item">
            <div class="edu-item__degree">{{ item.degree }}</div>
            <div class="edu-item__field">{{ item.field }}</div>
            <div class="edu-item__school">{{ item.school }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ CONTACT (full-width) -->
    <section id="contact" class="contact">
      <div class="contact__inner">
        <p class="section-title">{{ t('contact.title') }}</p>
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
.hero {
  position: relative;
  min-height: calc(100dvh - var(--header-h));
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 55%, var(--bg) 100%);
  pointer-events: none;
}

.hero__content {
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 5rem 2rem 3rem;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 3rem;
  align-items: center;
}

.hero__left {
  min-width: 0;
}

/* ─── Photo ──────────────────────────────────────────────────── */
.hero__photo-wrap {
  flex-shrink: 0;
  position: relative;
}

.hero__photo-frame {
  position: relative;
  width: clamp(220px, 22vw, 340px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.hero__photo-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid var(--border-md);
  z-index: 1;
  pointer-events: none;
}

.hero__photo {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  object-position: center top;
  display: block;
  filter: grayscale(12%);
  transition: filter 0.4s;
}

.hero__photo-frame:hover .hero__photo {
  filter: grayscale(0%);
}

.hero__eyebrow {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.hero__role-label {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--accent);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero__available {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 100px;
  padding: 0.25rem 0.75rem;
}

.hero__dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--current-dot);
  box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
  50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0.05); }
}

.hero__name {
  display: flex;
  flex-direction: column;
  font-size: clamp(4.5rem, 13vw, 10rem);
  font-weight: 900;
  line-height: 0.88;
  letter-spacing: -0.04em;
  margin-bottom: 1.75rem;
}

.hero__name-line--accent {
  color: transparent;
  -webkit-text-stroke: 1.5px var(--text);
}

.hero__tagline {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0;
  margin-bottom: 2.5rem;
  max-width: 560px;
}

.hero__tagline-item {
  font-size: clamp(1rem, 2.5vw, 1.35rem);
  font-weight: 300;
  color: var(--text-muted);
  margin-right: 0.35em;
}

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

/* ─── Stats strip ───────────────────────────────────────────── */
.hero__stats {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--border);
  margin-top: auto;
}

.stat {
  display: flex;
  flex-direction: column;
  padding: 1.5rem 2rem;
  border-right: 1px solid var(--border);
}
.stat:last-child { border-right: none; }

.stat__value {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--text);
  line-height: 1;
}

.stat__label {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
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
  gap: 1px;
}

.exp-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  transition: border-color 0.2s;
}

.section--alt .exp-card {
  background: var(--bg-subtle);
}

.exp-card:hover { border-color: var(--border-md); }

.exp-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.exp-card__company {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.02em;
}

.exp-card__role {
  font-size: 0.85rem;
  color: var(--accent);
  margin-top: 0.2rem;
}

.exp-card__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
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
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--current-dot);
  background: rgba(34,197,94,0.1);
  border-radius: 100px;
  padding: 0.15rem 0.6rem;
}

.badge-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--current-dot);
}

.exp-card__bullets {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.exp-card__bullets li {
  font-size: 0.875rem;
  color: var(--text-muted);
  padding-left: 1rem;
  position: relative;
}

.exp-card__bullets li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--text-xmuted);
}

/* ─── Skills ────────────────────────────────────────────────── */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.skill-group__name {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.875rem;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.3rem 0.75rem;
  cursor: default;
  transition: border-color 0.2s, background 0.2s;
}

.skill-tag:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-dim);
}

/* ─── Education ─────────────────────────────────────────────── */
.edu-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.edu-item {
  padding: 1.25rem 1.5rem;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: 0 var(--radius) var(--radius) 0;
}

.edu-item__degree {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.25rem;
}

.edu-item__field {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
}

.edu-item__school {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
}

/* ─── Contact ───────────────────────────────────────────────── */
.contact {
  background: var(--bg-card);
  border-top: 1px solid var(--border);
  padding: 5rem 0;
}

.contact__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
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
@media (max-width: 900px) {
  .hero__content { grid-template-columns: 1fr; }
  .hero__photo-wrap { display: none; }
}

@media (max-width: 768px) {
  .hero__name { font-size: clamp(3.5rem, 15vw, 6rem); }
  .hero__stats { grid-template-columns: repeat(2, 1fr); }
  .stat:nth-child(2) { border-right: none; }
  .stat:nth-child(3) { border-right: 1px solid var(--border); }
  .about-grid { grid-template-columns: 1fr; gap: 2rem; }
  .skills-grid { grid-template-columns: 1fr; }
  .exp-card__header { flex-direction: column; }
  .exp-card__right { align-items: flex-start; }
  .hero__content { padding: 3rem 1.5rem 2rem; }
  .stat { padding: 1.25rem 1.5rem; }
}

@media (max-width: 480px) {
  .hero__stats { grid-template-columns: repeat(2, 1fr); }
  .hero__name { font-size: clamp(3rem, 16vw, 5rem); }
}
</style>
