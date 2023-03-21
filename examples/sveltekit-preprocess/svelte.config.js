import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import ScopedUno from 'svelte-preprocess-unocss';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		ScopedUno({
			classPrefix: 'me-',
		}),
	],

	kit: {
		adapter: adapter()
	},

	vitePlugin: {
		experimental: {
			inspector: {
        showToggleButton: 'always',
      },
		},
	},
};

export default config;
