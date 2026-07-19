export default defineNuxtConfig({
    devServer: {
        port: 3000, // Optional: default is 3000
        host: '0.0.0.0', // Exposes the server to the local network
    },

    devtools: { enabled: false },

    components: [{ path: '~/components', pathPrefix: false }],

    modules: ['@nuxt/image', '@nuxt/content', '@nuxtjs/i18n', '@nuxtjs/sitemap'],

    image: {
        formats: ['avif', 'webp'],
        quality: 80,
        screens: { sm: 480, md: 768, lg: 1024, xl: 1280, '2xl': 1920 },
    },

    css: ['~/assets/css/global.less'],

    vite: {
        css: {
            preprocessorOptions: {
                less: {
                    additionalData: `@import "assets/css/vars.less";`,
                },
            },
        },
    },

    app: {
        head: {
            htmlAttrs: { lang: 'ru' },
            script: [
                {
                    // Выполняется до первой отрисовки и решает три вещи (ADR 0007, 0019):
                    //  1. has-js  — разрешает скрытые стартовые состояния анимаций;
                    //               без JS контент рендерится статично и целиком
                    //  2. theme   — тема применяется до CSS, без вспышки
                    //  3. intro   — шторка стоит с первого кадра, иначе успел бы
                    //               мигнуть контент под ней
                    innerHTML: `(function(){var d=document.documentElement;d.classList.add('has-js');try{var t=localStorage.getItem('theme');if(!t)t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';d.dataset.theme=t}catch(e){}try{var p=location.pathname,h=p==='/'||p==='/en'||p==='/en/';if(h&&!window.matchMedia('(prefers-reduced-motion:reduce)').matches&&!sessionStorage.getItem('intro-played'))d.classList.add('intro')}catch(e){}})()`,
                    tagPriority: 'critical',
                },
            ],
            style: [
                {
                    // Фон до загрузки внешнего CSS: иначе браузер успевает
                    // отрисовать кадр с дефолтным белым и анимирует переход
                    // в тёмный (ADR 0015, вариант A). Значения дублируют
                    // --bg из global.less — при смене палитры править обе точки.
                    innerHTML: `:root{background:#08080a}:root[data-theme=light]{background:#eceae4}`,
                    tagPriority: 'critical',
                },
            ],
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { property: 'og:type', content: 'website' },
                { property: 'og:image', content: 'https://sergsol.dev/img/avatar.jpg' },
                { property: 'og:image:width', content: '1200' },
                { property: 'og:image:height', content: '630' },
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:image', content: 'https://sergsol.dev/img/avatar.jpg' },
            ],
            link: [
                {
                    rel: 'preload',
                    as: 'font',
                    type: 'font/woff2',
                    href: '/fonts/inter-latin.woff2',
                    crossorigin: '',
                },
                {
                    rel: 'preload',
                    as: 'font',
                    type: 'font/woff2',
                    href: '/fonts/inter-cyrillic.woff2',
                    crossorigin: '',
                },
                {
                    rel: 'preload',
                    as: 'font',
                    type: 'font/woff2',
                    href: '/fonts/jetbrains-mono-latin.woff2',
                    crossorigin: '',
                },
                {
                    rel: 'preload',
                    as: 'font',
                    type: 'font/woff2',
                    href: '/fonts/jetbrains-mono-cyrillic.woff2',
                    crossorigin: '',
                },
            ],
        },
    },

    i18n: {
        locales: [
            { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
            { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
        ],
        defaultLocale: 'ru',
        strategy: 'prefix_except_default',
        langDir: 'locales/',
        lazy: true,
        detectBrowserLanguage: false,
    },

    content: {
        highlight: {
            theme: {
                default: 'github-dark',
                light: 'github-light',
            },
            langs: ['typescript', 'javascript', 'html', 'css', 'json', 'bash', 'vue'],
        },
    },

    nitro: {
        prerender: {
            crawlLinks: true,
        },
    },

    site: {
        url: 'https://sergsol.dev',
    },

    compatibilityDate: '2024-11-01',
})
