import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import SvelteScopedUno from 'svelte-scoped-uno'

export default defineConfig({
  plugins: [
    SvelteScopedUno(),
    svelte(),
  ],
})
