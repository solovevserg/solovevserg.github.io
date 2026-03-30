export default defineNuxtConfig({
  devServer: {
    port: 3000, // Optional: default is 3000
    host: '0.0.0.0' // Exposes the server to the local network
  },

  devtools: { enabled: false },

  components: [{ path: '~/components', pathPrefix: false }],

  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/image',
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
  ],

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    dataValue: 'theme',
    storageKey: 'theme',
  },

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
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { property: 'og:type',         content: 'website' },
        { property: 'og:image',        content: 'https://sergsol.dev/img/avatar.jpg' },
        { property: 'og:image:width',  content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card',        content: 'summary_large_image' },
        { name: 'twitter:image',       content: 'https://sergsol.dev/img/avatar.jpg' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
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
