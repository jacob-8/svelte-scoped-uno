import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { SvelteScopedUno } from 'svelte-scoped-uno'

export default defineConfig({
  plugins: [
    SvelteScopedUno({
      injectReset: "@unocss/reset/tailwind.css"
    }),
    sveltekit(),
  ],
})
