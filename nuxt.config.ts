// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

import env from './lib/env/env';
// import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/image',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    'vue-yandex-maps/nuxt',
  ],
  typescript: {
    tsConfig: {
      compilerOptions: {
        allowArbitraryExtensions: true,
      },
    },
  },
  alias: {
    '~': path.resolve(__dirname, 'app'),
    '~server': path.resolve(__dirname, 'server'),
    '~stores': path.resolve(__dirname, 'stores'),
    '~lib': path.resolve(__dirname, 'lib'),
    '~prisma': path.resolve(__dirname, 'prisma'),
    '~public': path.resolve(__dirname, 'public'),
  },
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },
  yandexMaps: {
    apikey: env.YANDEX_MAPS_API_KEY,
    servicesApikeys: {
      router: env.YANDEX_MAPS_ROUTER_API_KEY,
    },
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storage: 'localStorage',
  },
  experimental: {
    componentIslands: true,
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  css: ['@/assets/css/main.css'],
  fonts: {
    provider: 'local',
    families: [
      {
        name: 'Tektur',
        src: '/fonts/Tektur-Regular.ttf',
        provider: 'local',
        global: true,
        weight: 'normal',
        style: 'normal',
        display: 'swap',
      },
      {
        name: 'Space-Mono',
        src: '/fonts/SpaceMono-Regular.ttf',
        provider: 'local',
        global: true,
        weight: 'normal',
        style: 'normal',
        display: 'swap',
      },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
    css: {
      devSourcemap: true,
    },
    build: {
      sourcemap: true,
    },
    // resolve: {
    // // fix for vite/prisma build issue
    // alias: {
    // '.prisma/client/index-browser': fileURLToPath(
    // new URL('./node_modules/@prisma/client/index-browser.js', import.meta.url),
    // ),
    // },
    // },
  },
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      'autoprefixer': {},
    },
  },
});
