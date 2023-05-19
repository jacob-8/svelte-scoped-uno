import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { SvelteScopedUno } from 'svelte-preprocess-unocss';

export default defineConfig({
	plugins: [
		// it's unnessary to use SvelteScopedUno here as we are using the preprocessor, but I'm adding it to conveniently provide a reset and preflights to my demo app - you can toggle this behavior by setting `onlyGlobal` to `true`
		SvelteScopedUno({
			onlyGlobal: true,
			injectReset: "@unocss/reset/tailwind.css"
		}),
		sveltekit()
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
