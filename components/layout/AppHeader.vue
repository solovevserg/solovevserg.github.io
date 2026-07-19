<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { isDark, toggle } = useTheme()
const { progress, sections } = useScrollSpy()

const route = useRoute()
const isHome = computed(() => route.name?.toString().startsWith('index'))

// ─── Полноэкранное меню ──────────────────────────────────────
const menuOpen = ref(false)
const toggleMenu = () => (menuOpen.value = !menuOpen.value)
const closeMenu = () => (menuOpen.value = false)

watch(() => route.fullPath, closeMenu)

watch(menuOpen, (open) => {
    if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
})

const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeMenu()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown)
    if (import.meta.client) document.body.style.overflow = ''
})

// ─── Навигация ───────────────────────────────────────────────
const menuLinks = computed(() => [
    ...sections.map((s, i) => ({
        key: s.id,
        num: chapterNum(i),
        label: t(s.labelKey),
        href: isHome.value ? `#${s.id}` : `${localePath('/')}#${s.id}`,
        external: false,
    })),
    {
        key: 'blog',
        num: chapterNum(sections.length),
        label: t('nav.blog'),
        href: localePath('/blog'),
        external: false,
    },
])

const menuSocials = [
    { label: 'Telegram', url: 'https://t.me/sergsol' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/solovevserg/' },
    { label: 'GitHub', url: 'https://github.com/solovevserg' },
    { label: 'Habr', url: 'https://habr.com/ru/users/SolovevSerg/articles/' },
]

// ─── Язык ────────────────────────────────────────────────────
const otherLocale = computed(() => locales.value.find((l) => l.code !== locale.value))
const otherLocalePath = computed(() =>
    otherLocale.value ? switchLocalePath(otherLocale.value.code) : '/'
)

// Ссылка остаётся настоящей (SSR, Ctrl+клик, краулеры), но при обычном клике
// язык переключается без перезагрузки — ADR 0014.
function switchLang(e: MouseEvent) {
    if (!otherLocale.value) return
    if (e.ctrlKey || e.metaKey || e.shiftKey) return
    e.preventDefault()
    setLocale(otherLocale.value.code)
}
</script>

<template>
    <header class="header">
        <div class="header__bar">
            <NuxtLink :to="localePath('/')" class="header__logo" @click="closeMenu">
                sergsol<span class="header__logo-dot">.</span>dev
            </NuxtLink>

            <div class="header__right">
                <NuxtLink :to="localePath('/blog')" class="header__link link-underline">
                    {{ t('nav.blog') }}
                </NuxtLink>

                <a
                    v-if="otherLocale"
                    :href="otherLocalePath"
                    class="ctrl"
                    :aria-label="otherLocale.name"
                    @click="switchLang"
                >
                    {{ otherLocale.code.toUpperCase() }}
                </a>

                <button
                    class="ctrl theme-toggle"
                    :aria-label="isDark ? 'Light mode' : 'Dark mode'"
                    @click="toggle"
                >
                    <IconSun class="theme-toggle__sun" />
                    <IconMoon class="theme-toggle__moon" />
                </button>

                <button
                    class="menu-btn"
                    :class="{ 'menu-btn--open': menuOpen }"
                    :aria-expanded="menuOpen"
                    aria-controls="site-menu"
                    :aria-label="menuOpen ? t('nav.close') : t('nav.menu')"
                    @click="toggleMenu"
                >
                    <span class="menu-btn__text">
                        <span class="menu-btn__word">{{ t('nav.menu') }}</span>
                        <span class="menu-btn__word menu-btn__word--alt">{{ t('nav.close') }}</span>
                    </span>
                    <span class="menu-btn__lines" aria-hidden="true"> <span /><span /> </span>
                </button>
            </div>
        </div>

        <!-- Всегда в DOM: иначе появление полосы дало бы скачок в 1px -->
        <div class="header__progress" aria-hidden="true">
            <span
                v-if="isHome"
                class="header__progress-fill"
                :style="{ transform: `scaleX(${progress / 100})` }"
            />
        </div>
    </header>

    <!-- Телепорт: меню не должно попадать в stacking context хедера с backdrop-filter -->
    <Teleport to="body">
        <Transition name="curtain">
            <div v-if="menuOpen" id="site-menu" class="menu">
                <div class="menu__inner">
                    <nav class="menu__nav" :aria-label="t('nav.menu')">
                        <a
                            v-for="(link, i) in menuLinks"
                            :key="link.key"
                            :href="link.href"
                            class="menu__link"
                            :style="{ '--i': i }"
                            @click="closeMenu"
                        >
                            <span class="menu__num">{{ link.num }}</span>
                            <span class="menu__mask">
                                <span class="menu__word">{{ link.label }}</span>
                                <span class="menu__word menu__word--ghost" aria-hidden="true">
                                    {{ link.label }}
                                </span>
                            </span>
                        </a>
                    </nav>

                    <div class="menu__aside">
                        <p class="menu__aside-label mono-label">{{ t('contact.title') }}</p>
                        <ul class="menu__socials">
                            <li v-for="s in menuSocials" :key="s.url">
                                <a
                                    :href="s.url"
                                    target="_blank"
                                    rel="noopener"
                                    class="menu__social link-underline"
                                >
                                    {{ s.label }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped lang="less">
// ─── Шапка ───────────────────────────────────────────────────
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
    height: var(--header-h);
    background: color-mix(in srgb, var(--bg) 72%, transparent);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    border-bottom: 1px solid var(--rule);
}

.header__bar {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: var(--max-w);
    margin: 0 auto;
    padding: 0 var(--gutter);
}

.header__logo {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    color: var(--fg);
    flex-shrink: 0;
}

.header__logo-dot {
    color: var(--rubric);
}

.header__right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
}

.header__link {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--fg-2);
    margin-right: 0.5rem;

    &:hover {
        color: var(--fg);
    }

    @media (max-width: @bp-xs) {
        display: none;
    }
}

// ─── Кнопки-контролы ─────────────────────────────────────────
.ctrl {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    border: 1px solid var(--rule);
    font-family: var(--font-mono);
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    color: var(--fg-2);
    transition:
        color 0.35s var(--ease-out-quart),
        border-color 0.35s var(--ease-out-quart);

    &:hover {
        color: var(--fg);
        border-color: var(--fg);
    }
}

// ─── Кнопка меню ─────────────────────────────────────────────
.menu-btn {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    height: 34px;
    padding: 0 0.75rem;
    border: 1px solid var(--rule);
    transition: border-color 0.35s var(--ease-out-quart);

    &:hover {
        border-color: var(--fg);
    }
}

// Подпись перещёлкивается «барабаном»: МЕНЮ ↔ ЗАКРЫТЬ
.menu-btn__text {
    position: relative;
    display: block;
    height: 0.75rem;
    overflow: hidden;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--fg);

    @media (max-width: @bp-xs) {
        display: none;
    }
}

.menu-btn__word {
    display: block;
    height: 0.75rem;
    line-height: 0.75rem;
    transition: transform 0.5s var(--ease-out-expo);
}

.menu-btn--open .menu-btn__word {
    transform: translateY(-0.75rem);
}

.menu-btn__lines {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    width: 15px;

    > span {
        display: block;
        height: 1px;
        background: var(--fg);
        transform-origin: center;
        transition: transform 0.45s var(--ease-out-expo);
    }
}

.menu-btn--open .menu-btn__lines > span:nth-child(1) {
    transform: translateY(2.5px) rotate(45deg);
}
.menu-btn--open .menu-btn__lines > span:nth-child(2) {
    transform: translateY(-2.5px) rotate(-45deg);
}

// ─── Полоса прогресса ────────────────────────────────────────
.header__progress {
    height: 1px;
    width: 100%;
    flex-shrink: 0;
    background: transparent;
}

.header__progress-fill {
    display: block;
    height: 100%;
    background: var(--rubric);
    transform-origin: left center;
    transition: transform 0.1s linear;
    will-change: transform;
}
</style>

<style lang="less">
// ─── Полноэкранное меню ──────────────────────────────────────
// Не scoped: телепортированный в body узел вне области действия scope-id.
.menu {
    position: fixed;
    inset: 0;
    z-index: 99;
    display: flex;
    align-items: center;
    overflow-y: auto;
    background: var(--bg);
    padding: calc(var(--header-h) + 3rem) var(--gutter) 3rem;
}

.menu__inner {
    width: 100%;
    max-width: var(--max-w);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: end;
    gap: 3rem;
}

@media (max-width: 768px) {
    .menu__inner {
        grid-template-columns: 1fr;
        gap: 2.5rem;
    }
}

.menu__nav {
    display: flex;
    flex-direction: column;
}

.menu__link {
    display: flex;
    align-items: baseline;
    gap: 1.25rem;
    padding: 0.25rem 0;
    color: var(--fg-2);
}

.menu__num {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: var(--rubric);
    flex-shrink: 0;
    /* Появление номера следом за словом */
    animation: menu-fade 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(0.3s + var(--i) * 0.05s);
}

/* Барабан: при наведении строка уезжает вверх, снизу приходит рубричный дубль */
.menu__mask {
    position: relative;
    display: block;
    overflow: hidden;
    /* Иначе flex-элемент не сжимается ниже min-content и самая длинная
       строка меню («Передача знаний») уезжает за край экрана */
    min-width: 0;
}

.menu__word {
    display: block;
    /* Нижняя граница подобрана по самой длинной главе на 390px */
    font-size: clamp(1.5rem, 6.2vw, 4.5rem);
    font-weight: 900;
    /* Не меньше содержимого строки Inter (≈1.21em): при более плотном
       интерлиньяже глифы вылезают за свой line-box, и бревис «Й» у дубля,
       стоящего на top: 100%, проступает из-под маски */
    line-height: 1.22;
    letter-spacing: -0.04em;
    text-transform: uppercase;
    color: var(--fg);
    transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
    animation: menu-rise 0.85s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(0.22s + var(--i) * 0.05s);
}

.menu__word--ghost {
    position: absolute;
    top: 100%;
    left: 0;
    color: var(--rubric);
    animation: none;
}

.menu__link:hover .menu__word,
.menu__link:focus-visible .menu__word {
    transform: translateY(-100%);
}

@keyframes menu-rise {
    from {
        transform: translateY(105%);
    }
}

@keyframes menu-fade {
    from {
        opacity: 0;
    }
}

/* ─── Контакты в меню ──────────────────────────────────────── */
.menu__aside {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    animation: menu-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
}

.menu__socials {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

@media (max-width: 768px) {
    .menu__socials {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1.25rem;
    }
}

.menu__social {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    color: var(--fg-2);

    &:hover {
        color: var(--fg);
    }
}

/* ─── Занавес ──────────────────────────────────────────────── */
.curtain-enter-active,
.curtain-leave-active {
    transition: clip-path 0.8s cubic-bezier(0.83, 0, 0.17, 1);
}
.curtain-enter-from {
    clip-path: inset(0 0 100% 0);
}
.curtain-leave-to {
    clip-path: inset(100% 0 0 0);
}
.curtain-enter-to,
.curtain-leave-from {
    clip-path: inset(0 0 0 0);
}

@media (prefers-reduced-motion: reduce) {
    .menu__word,
    .menu__num,
    .menu__aside {
        animation: none;
    }
}
</style>

<style lang="less">
// ─── Переключатель темы — на CSS, без ожидания гидратации (ADR 0007) ──
.theme-toggle__moon {
    display: none;
}

html[data-theme='light'] {
    .theme-toggle__sun {
        display: none;
    }
    .theme-toggle__moon {
        display: block;
    }
}
</style>
