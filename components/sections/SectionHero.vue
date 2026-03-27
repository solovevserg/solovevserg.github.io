<script setup lang="ts">
const { t, tm, rt } = useI18n()
const localePath = useLocalePath()

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
  <section class="hero dot-bg">
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
</template>

<style scoped>
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

/* oval mask */
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

/* ─── Responsive ─────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .hero__left {
    width: min(60%, 580px);
    padding-right: 2rem;
  }
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

@media (max-width: 768px) {
  .hero__left {
    width: 100%;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    align-items: flex-end;
    padding-bottom: 5rem;
    background: transparent;
  }
  .hero__left-inner { max-width: 100%; }

  .hero__photo-wrap {
    width: 100%;
    opacity: 1;
  }

  .hero__photo-grad {
    background:
      linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, var(--bg) 85%),
      linear-gradient(to bottom, var(--bg) 0%, transparent 20%);
  }

  .hero__name { font-size: clamp(3rem, 14vw, 5.5rem); }
  .hero__typewriter { font-size: 0.85rem; }
}

@media (max-width: 480px) {
  .hero__name { font-size: clamp(2.8rem, 16vw, 4.5rem); }
  .hero__left { padding-left: 1.25rem; padding-right: 1.25rem; }
  .hero__photo-wrap { object-position: center 60%; }
}
</style>
