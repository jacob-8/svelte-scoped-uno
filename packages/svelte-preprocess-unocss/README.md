# svelte-preprocess-unocss

Run [svelte-scoped-uno](https://github.com/jacob-8/svelte-scoped-uno)
 as a svelte preprocessor instead of as a Vite plugin to enable styles preprocessing in pipelines that don't use Vite, such as `svelte-package`. 
 
 *Hopefully, someday `svelte-package` will heed applicable Vite plugins. Follow https://github.com/sveltejs/vite-plugin-svelte/issues/475 to see when this will be made possible. In the meantime this package was published to enable using `svelte-scoped-uno` in component libraries and other contexts that don't use Vite.*

## Setup

### Install package

- `npm i -D svelte-preprocess-unocss`

### Add Preprocessor

```diff
// svelte.config.js
import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/kit/vite';

+import { PreprocessUnocss } from 'svelte-preprocess-unocss'

+// If wanting to keep classes distinct during dev, turn your build/package script into `cross-env NODE_ENV=production svelte-kit sync && svelte-package`. Requires `cross-env` as a `devDependency`.
+const mode = process.env.NODE_ENV
+const prod = mode === 'production'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    preprocess(),
+   PreprocessUnocss({
+     classPrefix: 'sk-', // default: 'spu-'
+     combine: prod,
+   }),
  ],

  kit: {
    adapter: adapter(),
  },
}

export default config
```

### Add UnoCSS config

```ts
// unocss.config.ts
import { defineConfig, presetUno } from 'svelte-preprocess-unocss'

export default defineConfig({
  presets: [
    presetUno(),
  ],
})
```

All exports from `unocss` are re-exported from `svelte-preprocess-unocss` so there's no need to install `unocss`. This will avoid any breaking changes from unocss affecting your project.

## Known Issues

Don't use `--at-apply` on classes that need global scoping like `dark:___` as the .dark selector will be placed outside the global selector. For example, this will NOT work:

```css
:global(.my-box) {
  --at-apply: dark:bg-red-700;
}
```

Instead just apply the class directly, like this:

```html
<div class="dark:bg-red-700"></div>
```