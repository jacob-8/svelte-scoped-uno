import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { PreprocessUnocss } from 'svelte-preprocess-unocss';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		PreprocessUnocss({
			classPrefix: 'me-',
		}),
	],

	kit: {
		adapter: adapter()
	},

	vitePlugin: {
		inspector: {
			showToggleButton: 'always',
		},
	},
};

export default config;
