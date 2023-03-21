# svelte-scoped-uno

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/jacob-8/svelte-scoped-uno/tree/main/examples/sveltekit-vite-plugin)

## Setup

### Install package

```bash
npm i -D svelte-scoped-uno
```

All exports from `unocss` are reexported from `svelte-scoped-uno` so there's no need to install `unocss`. This will avoid any breaking changes from unocss affecting your project.

### Add the Vite Plugin:

```diff
// vite.config.ts
import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
+import { SvelteScopedUno } from 'svelte-scoped-uno'

export default defineConfig({
  plugins: [
+   SvelteScopedUno(),
    sveltekit(),
  ],
})
```

### Add UnoCSS config

```ts
// unocss.config.ts
import { defineConfig, presetUno } from 'svelte-scoped-uno'

export default defineConfig({
  presets: [
    presetUno(),
  ],
})
```

### Global styles

Add the global styles placeholder, `%svelte-scoped-uno.global%`, in the `<head>` of your root html file:
  - if you are simply using Vite + Svelte (not SvelteKit) placing it in the `<head>` after resets is sufficient.
  - **If** you are using SvelteKit then make sure to place it after any style resets but before `%sveltekit.head%`. Also add the following code to your `hooks.server.js` or `hooks.server.ts`:

```diff
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const response = await resolve(event, {
+    transformPageChunk: ({ html }) => html.replace('%svelte-scoped-uno.global%', 'svelte_scoped_uno_global_styles'),
  })
  return response
}
```

> We do this because importing styles at the top of your root `+layout.svelte` file will not give you any control over whether your global styles are loaded before or after component styles (and the order may flip between dev and prod), any styles you want utility classes to be able to override (resets, preflights, safelist, typography, etc...) must be placed in the head of `app.html` file before `%sveltekit.head%`. 
