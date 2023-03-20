# Svelte Scoped UnoCSS

Compiles `<div class="w-full mb-1" />` into: 

```html
<div class="uno-3hashz" />
<style>
  :global(.uno-3hashz) {
    width: full;
    right: .25rem;
  }
</style>
```

## Why?

### Scoping utility classes by component unleashes creativity

A global css file that only includes used utilities is great for small and medium apps, but there will come a point in a large project's life when every time you start to write a class like `.md:max-w-[50vw]` that you know is only going to be used once you start to cringe as you feel the size of your global style sheet getting larger and larger. This inhibits creativity. Sure, you could use `@apply md:max-w-[50vw]` in the style block but that gets tedious, and styles in context are so useful. Furthermore, if you would like to include a great variety of icons in your project, you will begin to feel the weight of adding them to the global stylesheet. When each component bears the weight of its own styles and icons you can continue to expand your project without building an evergrowing global stylesheet.

Another benefit is that if used to build a component library, your library won't need to match the particular Uno, Windi, Tailwind setup/version of your sites. This allows for easier of upgrades of all parts of your ecosystem, because they work well together but aren't dependent on each other. You also won't need to include a global stylesheet alongside your components for them to be used properly. You only need to pay attention to global theme variables and style resets.

### Completely isolated styles are impractical

There is a problem with purely isolated styles. Many styles are dependent on elements and styles set in a parent or child component, such as `dark:`, `rtl:`, and `.space-x-1`. The issue of how to easily pass styles down to children components is still being wrestled with in the Svelte world. Fortunately `svelte-scoped` mode solves all of these problems as each utility class (or set of classes) is scoped based on filename + class name(s) hashes and made global. Because they are global they will have influence everywhere and because their names are unique they will conflict nowhere.

## Usage

place utility styles right inside of each component's style block instead of in a global `uno.css` file. Class names will be compiled to unique names so they will conflict nowhere and work everywhere. So classes that depend are interdependent with other components will just work. You can use `rtl:mr-1` or `dark:text-white` which rely on `dir="rtl"` or `.dark` being defined in a parent component. You can pass classes to children components as long as you pass them using a prop named `class`, e.g. `class="text-lg bg-red-100"`. Spacing out children `<Button>` components using `.space-x-2` will also work.

Anything (preflights, safelist, typography) for which we want utility classes to override must be placed into the head of `app.html` **before** `%sveltekit.head%`. To do this add `%unocss.global%` to your `app.html` after any style resets but before `%sveltekit.head%`.

**If** you are using SvelteKit (and not plain Vite+Svelte) then also add the following code to your `hooks.server.js` or `hooks.server.ts` and the UnoCSS Vite plugin will take care of the rest:

```js
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%unocss.global%', '__UnoCSS_Svelte_Scoped_global_styles__'), // this line
  })
  return response
}
```

Support for `class:foo` and `class:foo={bar}` is already included. There is no need to add the `extractorSvelte` when using `svelte-scoped` mode.

```ts
// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite'
import UnoCSS from 'unocss/vite'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    UnoCSS({
      mode: 'svelte-scoped', // must be placed here
      /* options can be placed here or in uno.config.ts */
    }),
    sveltekit(),
  ],
}
```

There is a `SvelteKit scoped` example project in the [examples/sveltekit-scoped](https://github.com/unocss/unocss/tree/main/examples/sveltekit-scoped#readme) directory with more detailed explanation of how this mode works. 

There is a `Vite-Svelte scoped` example in the [examples/vite-svelte-scoped](https://github.com/unocss/unocss/tree/main/examples/vite-svelte-scoped#readme) directory.

### Resets, Preflights, Safelist, and Presets support

Because importing styles in your root `+layout.svelte` file (e.g. `import uno.css`) will not give you any control over whether your global styles are loaded before or after component styles (and the order may flip between dev and prod), any styles you want utility classes to be able to override (resets, preflights, safelist, typography, etc...) must be placed in the head of `app.html` file before `%sveltekit.head%`. 

**Resets** in UnoCSS are discussed [here](https://github.com/unocss/unocss#style-resetting), but note that SvelteKit provides no convenient `main.ts` sort of location where styles can be guaranteed to come first so for now you must manually place these into the head of `app.html` as seen in this example repo's [`app.html`](./src/app.html) file.

**Preflights** and **safelist** classes will be added to the global styles import that you should have already placed before `%sveltekit.head%` if you read the setup instructions in [Svelte/SvelteKit Scoped Mode](/packages/vite/README.md#sveltesveltekit-scoped-mode). Note that safelist classes will not be compiled into local component styles as they will be placed into the global stylesheet. 

- If you use a particularly heavy class in many locations, consider adding it to your safelist so it will only be declared once, in the global styles.
- If you are building individual library components that need to be consumed by themselves without a global stylesheet you can also add either `uno:preflights` or `uno:safelist` to your style tag, e.g. `<style uno:preflights uno:safelist>...</style>`, to have them placed at the beginning of that component's style tag.

**Presets** need to be handled on a case-by-case basis:
- All of the presets that add basic utilities will work (uno, mini, wind, etc...)
- [`@unocss/preset-typography`](https://github.com/unocss/unocss/tree/main/packages/preset-typography) adds a large amount of complex styles to the `.prose` class which `svelte-scoped` will not properly surround with `:global()` wrappers so the `prose` class must be added to your safelist. Simple classes like `prose-pink` will work fine like any other utility class as it just adds color variables. 
- [`@unocss/preset-icons`](https://github.com/unocss/unocss/tree/main/packages/preset-icons) works
- [`@unocss/web-fonts`](https://github.com/unocss/unocss/tree/main/packages/preset-icons) works
- [@unocss/preset-rem-to-px](https://github.com/unocss/unocss/tree/main/packages/preset-rem-to-px) works (it only modifies styles generation so it and all like it will work)
- [@unocss/preset-attributify](https://github.com/unocss/unocss/tree/main/packages/preset-attributify) doesn't work as `svelte-scoped` uses its own extraction and compilation pipeline
- [@unocss/preset-tagify](https://github.com/unocss/unocss/tree/main/packages/preset-tagify) doesn't work
- For other presets, if they don't rely on traditional `class="..."` usage they will probably not work. If they add  complicated styles like see in typography's `.prose` then you probably need to place certain class names into your safelist.

### Parent dependent classes

```html
<div class="ltr:left-0 rtl:right-0"></div>
```

turns into:

```html
<div class="uno-3hashz"></div>

<style>
  :global([dir="ltr"] .uno-3hashz) {
    left: 0rem;
  }
  :global([dir="rtl"] .uno-3hashz) {
    right: 0rem;
  }
</style>
```

### Children affecting classes

If an element in your component wants to add space between 3 children elements of which some are in separate components you can now do that:

```html
<div class="space-x-1">
  <div>Status</div>
  <Button>FAQ</Button>
  <Button>Login</Button>
</div>
```

turns into:

```html
<div class="uno-7haszz">
  <div>Status</div>
  <Button>FAQ</Button>
  <Button>Login</Button>
</div>

<style>
  :global(.uno-7haszz > :not([hidden]) ~ :not([hidden])) {
    --un-space-x-reverse: 0;
    margin-left: calc(0.25rem * calc(1 - var(--un-space-x-reverse)));
    margin-right: calc(0.25rem * var(--un-space-x-reverse));
  }
</style>
```

### Nested Component styles

You can add the `class` prop to a component which which places them on to an element using `class="{$$props.class} foo bar"`.

```html
<Button class="px-2 py-1">Login</Button>
```

turns into:

```html
<Button class="uno-4hshza">Login</Button>

<style>
  :global(.uno-4hshza) {
    padding-left:0.5rem;
    padding-right:0.5rem;
    padding-top:0.25rem;
    padding-bottom:0.25rem;
  }
</style>
```

### Conditional `class:` syntax

Class names added using Svelte's class directive feature, `class:text-sm={bar}`, will also be compiled. No need to add `extractorSvelte`. Custom extractors will not be used by this mode.

```html
<div class:text-sm={bar}>World</div>
```

turns into:

```html
<div class:uno-2hashz={bar}>World</div>

<style>
  :global(.uno-2hashz) {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
</style>
```

The class directive shorthand usage of `class:text-sm` where `text-sm` is both a class and a variable is also supported. The plugin will change `class:text-sm` into `class:uno-2hshza={text-sm}`.

### Usage Summary

```html
<span class:logo />
<!-- This would work if logo is set as a shortcut in the plugin settings and it is a variable in this component. Note that it's class name will not be changed -->

<div class="bg-red-100 text-lg">Hello</div>

<div class:text-sm={bar}>World</div>
<div class:text-sm>World</div>

<div class="fixed flex top:0 ltr:left-0 rtl:right-0 space-x-1 foo">
  <div class="px-2 py-1">Logo</div>
  <Button class="py-1 px-2">Login</Button>
</div>

<style>
  div {
    --at-apply: text-blue-500 underline;
  }
  .foo {
    color: red;
  }
</style>
```

will be transformed into this:

```html
<span class:logo />

<div class="uno-1hashz">Hello</div>

<div class:uno-2hashz={bar}>World</div>
<div class:uno-2hashz={text-sm}>World</div>

<div class="uno-3hashz foo">
  <div class="uno-4hashz">Logo</div>
  <Button class="uno-4hashz">Login</Button>
</div>

<style>
  :global(.uno-1hashz) {
    --un-bg-opacity: 1;
    background-color: rgba(254, 226, 226, var(--un-bg-opacity));
    font-size: 1.125rem;
    line-height: 1.75rem;
  }

  :global(.uno-2hashz) {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  :global(.uno-3hashz) {
    position: fixed;
    display: flex;
  }
  :global([dir="ltr"] .uno-3hashz) {
    left: 0rem;
  }
  :global([dir="rtl"] .uno-3hashz) {
    right: 0rem;
  }
  :global(.uno-3hashz > :not([hidden]) ~ :not([hidden])) {
    --un-space-x-reverse: 0;
    margin-left: calc(0.25rem * calc(1 - var(--un-space-x-reverse)));
    margin-right: calc(0.25rem * var(--un-space-x-reverse));
  }

  :global(.uno-4hashz) {
    padding-left:0.5rem;
    padding-right:0.5rem;
    padding-top:0.25rem;
    padding-bottom:0.25rem;
  }

  :global(.logo) {
    /* logo styles will be put here... */
  }
  
  div {
    --un-text-opacity: 1;
    color: rgba(59, 130, 246, var(--un-text-opacity));
    text-decoration-line: underline;
  }

  .foo {
    color: red;
  }
</style>
```

When this reaches the Svelte compiler, it will remove the :global() wrappers, and add it's own scoping hash just to the `div` and `.foo` rules.

## Example Project
To try this out in the example project here, install and then run dev.

- Includes usage example of `@unocss/transformer-directives`'s `--at-apply: text-lg underline` ability
- Includes `@unocss/preset-typography` usage

## Notes

- In development, individual classes will be retained and hashed in place for ease of toggling on and off in your browser's developer tools. `class="mb-1 mr-1"` will turn into something like `class="_mb-1_9hwi32 _mr-1_84jfy4`. In production, these will be compiled into a single class name using your desired prefix, `uno-` by default, and a hash based on the filename + class names, e.g. `class="uno-84dke3`.
- Vite plugins can't yet be used to preprocess files emitted by `svelte-package` as it does not use Vite. Follow https://github.com/sveltejs/vite-plugin-svelte/issues/475 to see when this will be made possible. In the meantime[svelte-preprocess-unocess](./packages/svelte-preprocess-unocss/README.md) was published to enable using `svelte-scoped-uno` in component libraries and other context that don't use Vite.

## Known Issues

- Should ignore `class="mr-1"` type of strings defined inside comments
- Classes referenced in explanatory markdown documentation that is parsed by MDSvex will be transformed contrary to expectation (and styles will be needlessly added). This package should ignore code blocks (whether inline surrounded by single backticks and multiple lines surrounded by three backticks)
- Placing `dark:` prefixed styles in a component with `<style global></style>` will not work. Not sure if this is relevant anymore with the move away from using `<style global>` in that `vite-preprocess` doesn't support this feature.

## Credit

- A big thank you to Anthony Fu @antfu and all who have contributed to the UnoCSS project upon which this plugin sits. 
  - This plugin was originally the `svelte-scoped` mode of the UnoCSS Vite plugin, but was extracted into a separate plugin as it was not able to benefit from much of the UnoCSS ecosystem without specialized code due to using SFC scoping. It was becoming too difficult too maintain in that location and was diverging more and more from the standard UnoCSS use case.
- Special thanks to @fehnomenal on his help with placing the necessary global styles (preflights, safelists, .prose, etc) into the `<head>` tag before Svelte component styles are added.