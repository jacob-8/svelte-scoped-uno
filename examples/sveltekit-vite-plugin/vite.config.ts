import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import SvelteScopedUno from 'svelte-scoped-uno'

export default defineConfig({
  plugins: [
    SvelteScopedUno({
      addReset: 'tailwind',
    }),
    sveltekit(),
  ],
})
