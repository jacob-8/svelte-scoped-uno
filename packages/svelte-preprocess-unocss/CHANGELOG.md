# svelte-preprocess-unocss

## 0.1.3

### Patch Changes

- temp tailwindreset until fixed
- Updated dependencies
  - svelte-scoped-uno@0.1.3

## 0.1.2

### Patch Changes

- update reset resolving for @unocss/resets to handle pnpm and npm
- Updated dependencies
  - svelte-scoped-uno@0.1.2

## 0.1.1

### Patch Changes

- fix misplaced dependency
- Updated dependencies
  - svelte-scoped-uno@0.1.1

## 0.1.0

### Minor Changes

- 89f3a80: sync with code being merged back into UnoCSS, improve --at-apply to handle all use cases
- use `injectReset` instead of `addReset` which is now deprecated

### Patch Changes

- Updated dependencies [89f3a80]
  - svelte-scoped-uno@0.1.0

## 0.0.3

### Patch Changes

- fix: --at-apply works again
- fix: include @unocss/preset-icons as dependency to make icons work
- Updated dependencies
  - svelte-scoped-uno@0.0.3

## 0.0.2

### Patch Changes

- breaking: change from default to named exports to easily allow for usage of Vite plugin from within svelte-preprocess-unocss if wanting to conveniently use the global reset, preflights, and safelist for a library demo app
- Updated dependencies [ece27e5]
  - svelte-scoped-uno@0.0.2
