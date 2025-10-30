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
	],
	shadcn: {
		prefix: 'UI',
		componentDir: './components/ui',
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
