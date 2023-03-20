# svelte-preprocess-unocss

Run `svelte-scoped-uno` as a svelte preprocessor instead of as a Vite plugin to enable styles preprocessing in pipelines that don't use Vite, such as `svelte-package`.

## Installation

```
npm i -D svelte-preprocess-unocss
```

## Configuration

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-auto'
import preprocess from 'vite-preprocess'

import ScopedUno from 'svelte-preprocess-unocss'

// If wanting to keep classes distinct during dev, turn your build/package script into `cross-env NODE_ENV=production svelte-kit sync && svelte-package`. Requires `cross-env` as a `devDependency`.
const mode = process.env.NODE_ENV
const prod = mode === 'production'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    preprocess(),
    ScopedUno({
      options: {
        classPrefix: 'sk-', // default: 'spu-'
        combine: prod, // default: true
      },
    }),
  ],

  kit: {
    adapter: adapter(),
  },
}

export default config
```

Place Uno config options in a `unocss.config.ts` file

```ts
// unocss.config.ts
import { defineConfig, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      prefix: 'i-',
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
})
```