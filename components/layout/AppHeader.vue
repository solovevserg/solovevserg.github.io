<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n()
const localePath = useLocalePath()
const { isDark, toggle } = useTheme()
const { progress, activeLabelKey, sections } = useScrollSpy()

const menuOpen = ref(false)
const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const closeMenu = () => { menuOpen.value = false }

const route = useRoute()
watch(() => route.fullPath, closeMenu)

watch(menuOpen, (val) => {
  if (import.meta.client) {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})

// Close mobile menu when viewport grows beyond nav breakpoint
onMounted(() => {
  const onResize = () => {
    if (window.innerWidth > 1280) closeMenu()
  }
  window.addEventListener('resize', onResize)
  onUnmounted(() => window.removeEventListener('resize', onResize))
})

const otherLocale = computed(() => locales.value.find(l => l.code !== locale.value))
const isHome = computed(() => route.name?.toString().startsWith('index'))

// Section anchor links — always shown; on non-home pages link back to home with anchor
const sectionLinks = computed(() =>
  sections.map(s => ({
    id: s.id,
    labelKey: s.labelKey,
    label: t(s.labelKey),
    href: isHome.value ? `#${s.id}` : `${localePath('/')}#${s.id}`,
  }))
)

const blogLink = computed(() => ({ label: t('nav.blog'), path: '/blog' }))
</script>

<template>
  <header class="header">
    <div class="header__bar">
      <NuxtLink :to="localePath('/')" class="header__logo" @click="closeMenu">
        <span class="logo-bracket">{</span>sergsol<span class="logo-bracket">}</span>
      </NuxtLink>

      <!-- Section anchor nav (left) — always visible, links home when not on landing -->
      <nav class="header__nav header__nav--left">
        <a
          v-for="link in sectionLinks"
          :key="link.id"
          :href="link.href"
          class="header__nav-link"
          :class="{ 'header__nav-link--active': isHome && activeLabelKey === link.labelKey }"
        >{{ link.label }}</a>
      </nav>

      <!-- Right side: blog link + controls -->
      <div class="header__right">
        <NuxtLink :to="localePath(blogLink.path)" class="header__nav-link">
          {{ blogLink.label }}
        </NuxtLink>

        <button
          v-if="otherLocale"
          class="ctrl-btn"
          @click="setLocale(otherLocale.code)"
        >{{ otherLocale.code.toUpperCase() }}</button>

        <button class="ctrl-btn" @click="toggle" :aria-label="isDark ? 'Light mode' : 'Dark mode'">
          <IconSun v-if="isDark" />
          <IconMoon v-else />
        </button>

        <button
          class="burger"
          :class="{ 'burger--open': menuOpen }"
          @click="toggleMenu"
          aria-label="Menu"
        >
          <span class="burger__line" />
          <span class="burger__line" />
        </button>
      </div>
    </div>

    <!-- Scroll progress bar — always in DOM to prevent 2px layout shift -->
    <div class="progress-bar" aria-hidden="true">
      <div
        v-if="isHome"
        class="progress-bar__fill"
        :style="{ width: `${progress}%` }"
      />
    </div>

  </header>

  <!-- Mobile fullscreen menu — teleported to body to escape backdrop-filter stacking context -->
  <Teleport to="body">
    <Transition name="curtain">
      <div v-if="menuOpen" class="mobile-menu">
        <nav class="mobile-nav">
          <a
            v-for="(link, i) in sectionLinks"
            :key="link.id"
            :href="link.href"
            class="mobile-nav__link"
            @click="closeMenu"
          >
            <span class="mobile-nav__num">0{{ i + 1 }}</span>
            <span class="mobile-nav__label">{{ link.label }}</span>
          </a>
          <NuxtLink
            :to="localePath(blogLink.path)"
            class="mobile-nav__link"
            @click="closeMenu"
          >
            <span class="mobile-nav__num">0{{ sectionLinks.length + 1 }}</span>
            <span class="mobile-nav__label">{{ blogLink.label }}</span>
          </NuxtLink>
        </nav>

      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="less">
// ─ Header ─────────────────────────────────────────────────────
.header {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: var(--header-h);
  z-index: 100;
  background: var(--header-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;

  &__bar {
    flex: 1;
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__logo {
    font-family: var(--font-mono);
    font-size: 1.05rem;
    font-weight: 500;
    color: var(--text);
    margin-right: 1.5rem;
    letter-spacing: -0.02em;
    flex-shrink: 0;
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: 2rem;

    @media (max-width: @bp-lg) {
      display: none;
    }
  }

  &__right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;

    > .header__nav-link {
      margin-right: 0.75rem;

      @media (max-width: @bp-lg) {
        display: none;
      }
    }
  }

  &__nav-link {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-muted);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 0;
      width: 0; height: 1px;
      background: var(--accent);
      transition: width 0.25s ease;
    }

    &:hover,
    &.router-link-active,
    &--active {
      color: var(--text);
      &::after { width: 100%; }
    }
  }
}

.logo-bracket { color: var(--accent); }

// ─ Controls ───────────────────────────────────────────────────
.ctrl-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--border);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;

  &:hover {
    color: var(--text);
    border-color: var(--border-md);
    background: var(--bg-subtle);
  }
}

// ─ Progress bar ───────────────────────────────────────────────
.progress-bar {
  height: 2px;
  width: 100%;
  background: transparent;
  flex-shrink: 0;

  &__fill {
    height: 100%;
    background: var(--accent);
    transition: width 0.08s linear;
    border-radius: 0 2px 2px 0;
    will-change: width;
  }
}

// ─ Burger ─────────────────────────────────────────────────────
.burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px; height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border);
  padding: 0 9px;

  &__line {
    display: block;
    width: 100%; height: 1.5px;
    background: var(--text-muted);
    border-radius: 2px;
    transform-origin: center;
    transition: transform 0.3s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.2s;
  }

  &--open .burger__line:nth-child(1) { transform: translateY(3.5px) rotate(45deg); }
  &--open .burger__line:nth-child(2) { transform: translateY(-3.5px) rotate(-45deg); }

  @media (max-width: @bp-lg) {
    display: flex;
  }
}

// ─ Mobile fullscreen curtain ──────────────────────────────────
:global(.mobile-menu) {
  position: fixed;
  inset: 0;
  top: var(--header-h);
  background: var(--bg);
  z-index: 99;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 2.5rem;
  overflow-y: auto;
}

:global(.mobile-nav) {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

:global(.mobile-nav__link) {
  display: flex;
  align-items: baseline;
  gap: 1.25rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
  color: var(--text-muted);
  text-decoration: none;
}

:global(.mobile-nav__link:hover),
:global(.mobile-nav__link.router-link-active) { color: var(--text); }

:global(.mobile-nav__num) {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--accent);
  flex-shrink: 0;
}

:global(.mobile-nav__label) {
  font-size: clamp(2rem, 8vw, 3rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
}

// ─ Transitions ────────────────────────────────────────────────
:global(.curtain-enter-active),
:global(.curtain-leave-active) {
  transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
}
:global(.curtain-enter-from),
:global(.curtain-leave-to) { transform: translateY(-100%); }

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
