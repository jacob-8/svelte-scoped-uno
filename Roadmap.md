# Roadmap

- update temp-s-p-u (from unocss fork) with link to updated preprocessor
- close UnoCSS PRs and update notices there about this package
- improve package example
- look into odd issue in stackblitz
- add issue to UnoCSS to deal with empty class having just a semicolon when using transformer:
```css
.my-button {
  --at-apply: dark:bg-red-700 dark:hover:bg-red-600;
}
```
- rewrite defineConfig with restricted type for uno.config.ts, don't allow transformers
- add linting
- solve release.yml actions build issue
- how to easily add preflights in packaged libraries that are consumed by apps not using svelte-scoped-uno - is there a way to write preflights into each location where they are needed (.shadow for example)
- Do we want to port across a version of the [UnoCSS Inspector that works in a scoped context](https://github.com/unocss/unocss/issues/1718). PR's welcome! You would need to study how the `unocss:global` global does it by adding tokens to the tasks array via `tasks.push(extract(code, filename))`
- If you update the config during dev, you'll need to restart your server to see the updated changes, this could be solved by using Uno's ConfigHMRPlugin