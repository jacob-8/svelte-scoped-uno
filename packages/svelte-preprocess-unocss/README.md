# svelte-preprocess-unocss

Run [svelte-scoped-uno](https://github.com/jacob-8/svelte-scoped-uno)
 as a svelte preprocessor instead of as a Vite plugin to enable styles preprocessing in pipelines that don't use Vite, such as `svelte-package`. 
 
 *Hopefully, someday `svelte-package` will heed applicable Vite plugins. Follow https://github.com/sveltejs/vite-plugin-svelte/issues/475 to see when this will be made possible. In the meantime this package was published to enable using `svelte-scoped-uno` in component libraries and other contexts that don't use Vite.*

## Installation

```
npm i -D svelte-preprocess-unocss
```

## Configuration

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/kit/vite';

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

Place Uno config options in a `unocss.config.ts` file. 

```ts
// unocss.config.ts
import { defineConfig, presetUno } from 'svelte-preprocess-unocss'

export default defineConfig({
  presets: [
    presetUno(),
  ],
})
```

All exports from `unocss` are reexported from `svelte-preprocess-unocss` so there's no need to install `unocss`. This will avoid any breaking changes from unocss affecting your project.
