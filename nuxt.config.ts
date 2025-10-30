// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

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
	],
	shadcn: {
		prefix: 'UI',
		componentDir: './components/ui',
	},
	colorMode: {
		classSuffix: '',
	},
	eslint: {
		config: {
			standalone: false,
		},
	},
	css: ['@/assets/css/main.css'],
	vite: {
		plugins: [
			tailwindcss(),
		],
	},
});
