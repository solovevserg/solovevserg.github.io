<script setup lang="ts">
const { t } = useI18n()
const year = new Date().getFullYear()

const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}
</script>

<template>
    <footer class="footer">
        <div class="container footer__inner">
            <span class="footer__copy">
                © {{ year }} {{ t('footer.name') }} — {{ t('footer.rights') }}
            </span>

            <span class="footer__colophon">{{ t('footer.colophon') }}</span>

            <button v-magnetic="{ strength: 0.25 }" class="footer__top" @click="toTop">
                <span class="footer__top-label">{{ t('footer.to_top') }}</span>
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                >
                    <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
            </button>
        </div>
    </footer>
</template>

<style scoped lang="less">
.footer {
    border-top: 1px solid var(--rule);
    padding: 2.5rem 0;
    background: var(--bg);
}

.footer__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
}

.footer__copy,
.footer__colophon {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    color: var(--fg-2);
}

.footer__colophon {
    color: var(--fg-3);

    @media (max-width: @bp-md) {
        order: 3;
        flex-basis: 100%;
    }
}

.footer__top {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--fg-2);
    transition:
        color 0.4s var(--ease-out-quart),
        transform 0.45s var(--ease-out-expo);

    &:hover {
        color: var(--rubric);
    }
}

.footer__top-label {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
}
</style>
