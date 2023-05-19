# svelte-scoped-uno

## 0.1.2

### Patch Changes

- update reset resolving for @unocss/resets to handle pnpm and npm

## 0.1.1

### Patch Changes

- fix misplaced dependency

## 0.1.0

### Minor Changes

- 89f3a80: sync with code being merged back into UnoCSS, improve --at-apply to handle all use cases
- use `injectReset` instead of `addReset` which is now deprecated

## 0.0.3

### Patch Changes

- fix: include @unocss/preset-icons as dependency to make icons work

## 0.0.2

### Patch Changes

- breaking: change from default to named exports to easily allow for usage of Vite plugin from within svelte-preprocess-unocss if wanting to conveniently use the global reset, preflights, and safelist for a library demo app
