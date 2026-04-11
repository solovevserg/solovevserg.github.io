<script setup lang="ts">
const { t, tm, rt } = useTypo()
const localePath = useLocalePath()

const phrases = computed(() => (tm('hero.typewriter') as any[]).map((l) => rt(l)))
const typeText = ref(phrases.value[0] ?? '')

let stopped = false
const sleep = (ms: number) =>
    new Promise<void>((r) => {
        setTimeout(r, ms)
    })

async function runTypewriter() {
    let i = 0
    await sleep(3000)
    while (!stopped) {
        while (typeText.value.length > 0 && !stopped) {
            typeText.value = typeText.value.slice(0, -1)
            await sleep(30)
        }
        i = (i + 1) % phrases.value.length
        await sleep(350)
        const target = phrases.value[i]
        for (let c = 1; c <= target.length && !stopped; c++) {
            typeText.value = target.slice(0, c)
            await sleep(60)
        }
        await sleep(2000)
    }
}

onMounted(runTypewriter)
onUnmounted(() => {
    stopped = true
})
</script>

<template>
    <section class="hero dot-bg">
        <!-- Left panel -->
        <div class="hero__left">
            <div class="hero__left-inner">
                <h1 class="hero__name">
                    <span class="hero__name-line">{{ t('hero.name_first') }}</span>
                    <span class="hero__name-line hero__name-line--accent">{{
                        t('hero.name_last')
                    }}</span>
                </h1>

                <div class="hero__typewriter" aria-live="polite">
                    <span class="hero__type-prefix">_</span>
                    <span class="hero__type-text">{{ typeText }}</span>
                    <span class="hero__type-cursor" aria-hidden="true">|</span>
                </div>

                <div class="hero__actions">
                    <a
                        href="https://t.me/sergsol"
                        target="_blank"
                        rel="noopener"
                        class="btn btn--primary"
                    >
                        {{ t('hero.cta_contact') }}
                    </a>
                    <NuxtLink :to="localePath('/blog')" class="btn btn--ghost">
                        {{ t('hero.cta_blog') }}
                    </NuxtLink>
                </div>

                <div class="hero__socials">
                    <a
                        href="https://t.me/sergsol"
                        target="_blank"
                        rel="noopener"
                        class="social-link"
                    >
                        <IconTelegram :size="18" />
                        Telegram
                    </a>
                    <a
                        href="https://www.linkedin.com/in/solovevserg/"
                        target="_blank"
                        rel="noopener"
                        class="social-link"
                    >
                        <IconLinkedin :size="18" />
                        LinkedIn
                    </a>
                    <a
                        href="https://github.com/solovevserg"
                        target="_blank"
                        rel="noopener"
                        class="social-link"
                    >
                        <IconGithub :size="18" />
                        GitHub
                    </a>
                </div>
                <!-- /.hero__socials -->
            </div>
            <!-- /.hero__left-inner -->
        </div>
        <!-- /.hero__left -->

        <!-- Right: full-height photo -->
        <div class="hero__photo-wrap" aria-hidden="true">
            <NuxtPicture
                src="/img/avatar.jpg"
                :width="1200"
                :height="1600"
                sizes="sm:100vw md:75vw lg:60vw"
                format="avif,webp"
                preload
                :img-attrs="{
                    class: 'hero__photo',
                    alt: '',
                    fetchpriority: 'high',
                    loading: 'eager',
                }"
            />
            <div class="hero__photo-grad" />
        </div>

        <!-- Scroll hint -->
        <a href="#about" class="scroll-hint" aria-label="Scroll down">
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
        </a>
    </section>
</template>

<style scoped lang="less">
// ─── Hero ─────────────────────────────────────────────────────
.hero {
    position: relative;
    height: calc(100vh - var(--header-h));
    height: calc(100svh - var(--header-h));
    display: flex;
    align-items: stretch;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 80px;
        background: linear-gradient(to bottom, transparent, var(--bg));
        pointer-events: none;
        z-index: 3;
    }

    &__left {
        position: relative;
        z-index: 2;
        width: min(58%, 820px);
        flex-shrink: 0;
        display: flex;
        align-items: center;
        padding-left: clamp(2rem, calc((100vw - 1280px) / 2 + 2rem), 14rem);
        padding-right: 4rem;
        padding-top: 2rem;
        padding-bottom: 2.5rem;

        @media (max-width: @bp-md) {
            width: min(60%, 580px);
            padding-right: 2rem;
        }

        @media (max-width: @bp-sm) {
            width: 100%;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
            align-items: flex-end;
            padding-bottom: 5rem;
            background: transparent;
        }

        @media (max-width: @bp-xs) {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
        }
    }

    &__left-inner {
        width: 100%;
        max-width: 620px;

        @media (max-width: @bp-sm) {
            max-width: 100%;
        }
    }

    &__photo-wrap {
        position: absolute;
        right: 0;
        top: calc(-1 * var(--header-h));
        bottom: 0;
        width: 60%;
        overflow: hidden;

        @media (max-width: @bp-md) {
            width: 75%;
            left: auto;
        }

        @media (max-width: @bp-sm) {
            width: 100%;
            opacity: 1;
        }

        @media (max-width: @bp-xs) {
            object-position: center 60%;
        }

        :deep(picture) {
            display: contents;
        }

        :deep(.hero__photo) {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center -5%;
            display: block;
        }
    }

    &__photo-grad {
        position: absolute;
        inset: 0;
        background:
            radial-gradient(ellipse 75% 88% at 62% 46%, transparent 30%, var(--bg) 72%),
            linear-gradient(to right, var(--bg) 0%, transparent 28%);
        pointer-events: none;

        @media (max-width: @bp-md) {
            background:
                radial-gradient(ellipse 72% 88% at 55% 48%, transparent 30%, var(--bg) 70%),
                linear-gradient(to right, var(--bg) 0%, transparent 30%);
        }

        @media (max-width: @bp-sm) {
            background:
                linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 0%, var(--bg) 85%),
                linear-gradient(to bottom, var(--bg) 0%, transparent 20%);
        }
    }

    &__name {
        display: flex;
        flex-direction: column;
        font-size: clamp(3.8rem, 8vw, 7.5rem);
        font-weight: 900;
        line-height: 0.9;
        letter-spacing: -0.04em;
        margin-bottom: 1.5rem;

        @media (max-width: @bp-md) {
            font-size: clamp(3.2rem, 9vw, 6rem);
        }
        @media (max-width: @bp-sm) {
            font-size: clamp(3rem, 14vw, 5.5rem);
        }
        @media (max-width: @bp-xs) {
            font-size: clamp(2.8rem, 16vw, 4.5rem);
        }
    }

    &__name-line--accent {
        color: transparent;
        -webkit-text-stroke: 1.5px var(--text);
    }

    &__typewriter {
        display: flex;
        align-items: center;
        gap: 0;
        min-height: 2.2rem;
        margin-bottom: 2.5rem;
        font-family: var(--font-mono);
        font-size: clamp(0.85rem, 1.6vw, 1.05rem);
        color: var(--text-muted);

        @media (max-width: @bp-sm) {
            font-size: 0.85rem;
        }
    }

    &__type-prefix {
        color: var(--accent);
        margin-right: 0.5em;
        font-weight: 600;
    }

    &__type-text {
        color: var(--text);
        font-weight: 400;
    }

    &__type-cursor {
        color: var(--accent);
        margin-left: 1px;
        animation: blink 1s step-end infinite;
        font-weight: 300;
    }

    &__actions {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        margin-bottom: 2.5rem;
    }

    &__socials {
        display: flex;
        gap: 1.25rem;
        flex-wrap: wrap;
    }
}

@keyframes blink {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
}

// ─── Buttons ──────────────────────────────────────────────────
.btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    transition:
        transform 0.15s,
        box-shadow 0.15s;

    &:active {
        transform: scale(0.98);
    }

    &--primary {
        background: var(--accent);
        color: #fff;
        &:hover {
            box-shadow: var(--accent-glow);
        }
    }

    &--ghost {
        background: var(--bg-subtle);
        color: var(--text);
        border: 1px solid var(--border);
        &:hover {
            border-color: var(--border-md);
        }
    }
}

// ─── Socials ──────────────────────────────────────────────────
.social-link {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8rem;
    color: var(--text-muted);
    &:hover {
        color: var(--text);
    }
}

// ─── Scroll hint ──────────────────────────────────────────────
.scroll-hint {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 4;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 1px solid var(--border);
    border-radius: 50%;
    color: var(--text-muted);
    background: var(--bg-card);
    animation: bounce 2.5s ease-in-out infinite;

    &:hover {
        color: var(--accent);
        border-color: var(--accent);
    }
}

@keyframes bounce {
    0%,
    100% {
        transform: translateX(-50%) translateY(0);
    }
    50% {
        transform: translateX(-50%) translateY(6px);
    }
}
</style>
