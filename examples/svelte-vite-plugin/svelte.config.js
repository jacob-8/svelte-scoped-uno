import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  vitePlugin: {
    experimental: {
      inspector: {
        showToggleButton: 'always',
      },
    },
  },
}

export default config
