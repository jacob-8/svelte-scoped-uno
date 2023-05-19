# Roadmap

Roadmap put on hold until https://github.com/unocss/unocss/pull/2552 is resolved as this code is being brought into UnoCSS.

- look into odd issue in stackblitz
- update temp-s-p-u (from unocss fork) with link to updated preprocessor
- ~~solve release.yml actions build issue~~

## UnoCSS questions
- rewrite defineConfig with restricted type for uno.config.ts, don't allow transformers

## UnoCSS improvements
- is there a way to write preflights into each location just where they are needed (.shadow for example) to avoid needing to use uno:preflights in a component library's components
- Add a version of the [UnoCSS Inspector that works in a scoped context](https://github.com/unocss/unocss/issues/1718). PR's welcome! You would need to study how the `unocss:global` global does it by adding tokens to the tasks array via `tasks.push(extract(code, filename))`
- If you update the config during dev, you'll need to restart your server to see the updated changes, this could be solved by using Uno's ConfigHMRPlugin