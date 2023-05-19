# Svelte Scoped UnoCSS

A spin-off from [UnoCSS](https://github.com/unocss/unocss) that allows for full-featured scoped utility classes by component. 

**Update**: This code is in the process of being merged into UnoCSS: https://github.com/unocss/unocss/pull/2552 - you'll find the [docs](https://deploy-preview-2552--unocss.netlify.app/integrations/svelte-scoped#svelte-scoped) for that version to be more full-featured though of course use the install instructions from here.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/fork/github/jacob-8/svelte-scoped-uno/tree/main/examples/sveltekit-vite-plugin)

## Install

Read the [svelte-scoped-uno setup instructions](./packages/svelte-scoped-uno/README.md) to scope utility classes by component.

Alternatively, use [svelte-preprocess-unocess](./packages/svelte-preprocess-unocss/README.md) in contexts where Vite plugins don't work, like `svelte-package`. Anything discussed below regarding a global stylesheet will have no bearing on this package.

## Example Projects

- `SvelteKit` example in [examples/sveltekit-vite-plugin](./examples/sveltekit-vite-plugin)
- `Vite-Svelte` example in [examples/svelte-vite-plugin](./examples/svelte-vite-plugin).
- `SvelteKit Library` example in [examples/sveltekit-preprocess](./examples/sveltekit-preprocess)

## Purpose

Place utility styles right inside of each component's style block instead of in a global `uno.css` file. Class names will be compiled to unique names so they will conflict nowhere and work everywhere. So classes that depend are interdependent with other components will just work. You can use `rtl:mr-1` or `dark:text-white` which rely on `dir="rtl"` or `.dark` being defined in a parent component. You can pass classes to children components as long as you pass them using a prop named `class`, e.g. `class="text-lg bg-red-100"`. Spacing out children `<Button>` components using `.space-x-2` will also work.

Read more about [Why?](./Why.md)

## Output

### Basic example

Before:

```html
<div class="w-full mb-1" />
``` 

After: 

```html
<div class="uno-3hashz" />
<style>
  :global(.uno-3hashz) {
    width: full;
    margin-right: .25rem;
  }
</style>
```


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

### Summary

```html
<span class:logo />
<!-- This would work if logo is set as a shortcut in the plugin settings and it is a variable in this component -->

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
<span class:uno-0hashz={logo} />

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

  :global(.uno-0hashz) {
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

## Resets

By default UnoCSS leaves style resetting up to each user but they do provide some convenient [reset options](https://github.com/unocss/unocss#style-resetting). Since that SvelteKit provides no convenient `main.ts` sort of location where styles can be guaranteed to come first you either must manually place these into the head of `app.html` as seen in [`sveltekit-preprocess's app.html`](./examples/sveltekit-preprocess/src/app.html) file or you easily add them at the beginning of svelte-scoped-uno's global styles using the `injectReset` option.

```diff
// vite.config.ts
// ...
  plugins: [
    SvelteScopedUno({
+     injectReset: "@unocss/reset/tailwind.css"
    }),
    sveltekit(),
  ],
```

## Preflights, Safelist

**Preflights** and **safelist** classes will be added to the global styles import in your `<head>` tag as outlined in the [svelte-scoped-uno setup instructions](./packages/svelte-scoped-uno/README.md). 

- If you use a particularly heavy class in many locations, consider adding it to your safelist so it will only be declared once, in the global styles.

## Presets support

Do to the unique nature of having a few necessary styles in a global stylesheet and everything else contained in each component where needed (kind of like Svelte itself), **presets** need to be handled on a case-by-case basis:

- All of the presets that add basic utilities will work (uno, mini, wind, etc...)
- [`@unocss/preset-typography`](https://github.com/unocss/unocss/tree/main/packages/preset-typography) adds a large amount of complex styles to the `.prose` class which `svelte-scoped` will not properly surround with `:global()` wrappers so add the `prose` class to your safelist is using this preset. All other classes from this preset like `prose-pink` will work fine like any other utility class as it just adds color variables. 
- [`@unocss/preset-icons`](https://github.com/unocss/unocss/tree/main/packages/preset-icons) works
- [`@unocss/web-fonts`](https://github.com/unocss/unocss/tree/main/packages/preset-icons) works
- [@unocss/preset-rem-to-px](https://github.com/unocss/unocss/tree/main/packages/preset-rem-to-px) works (it only modifies styles generation so it and all like it will work)
- [@unocss/preset-attributify](https://github.com/unocss/unocss/tree/main/packages/preset-attributify) and [@unocss/preset-tagify](https://github.com/unocss/unocss/tree/main/packages/preset-tagify) don't work as `svelte-scoped` uses its own extraction and compilation pipeline
- For other presets, if they don't rely on traditional `class="..."` usage they will probably not work. If they add  complicated styles like see in typography's `.prose` then you probably need to place certain class names into your safelist.

## Notes

- In development, individual classes will be retained and hashed in place for ease of toggling on and off in your browser's developer tools. `class="mb-1 mr-1"` will turn into something like `class="_mb-1_9hwi32 _mr-1_84jfy4`. In production, these will be compiled into a single class name using your desired prefix, `uno-` by default, and a hash based on the filename + class names, e.g. `class="uno-84dke3`.

## Known Issues

- It should ignore `class="mr-1"` type of strings defined inside comments but it doesn't
- Classes referenced in explanatory markdown documentation that is parsed by MDSvex will be transformed contrary to expectation (and styles will be needlessly added). This package should ignore code blocks (whether inline surrounded by single backticks and multiple lines surrounded by three backticks)

## Credit

- A big thank you to [Anthony Fu](https://github.com/antfu) and all who have contributed to the [UnoCSS](https://github.com/unocss) project upon which this plugin sits. This plugin was originally the `svelte-scoped` mode of the UnoCSS Vite plugin, but was extracted into a separate plugin as it was not able to benefit from much of the UnoCSS ecosystem without specialized code due to using component scoping. It was becoming too difficult too maintain in that location and was diverging more and more from the standard UnoCSS use case.
- Special thanks to [@fehnomenal](https://github.com/fehnomenal) on his help with placing the necessary global styles (preflights, safelists, `.prose`, etc) into the `<head>` tag before Svelte component styles are added.