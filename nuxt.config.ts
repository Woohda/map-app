// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

import './app/utils/env/env';

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
		'nuxt-auth-utils',
	],
	runtimeConfig: {
		session: {
			password: '',
			name: 'session',
			cookie: {
				maxAge: 60 * 24 * 7, // 7 days
			},
		},
	},
	shadcn: {
		prefix: '',
		componentDir: '@/components/ui',
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
	vite: {
		plugins: [tailwindcss()],
	},
});
