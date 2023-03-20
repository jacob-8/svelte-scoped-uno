- improve passing options
- rewrite defineConfig with restricted type for uno.config.ts, don't allow transformers
- add reset options
- publish to npm
- add stackblitz links
- add changelog
- use in kitbook

- improve package example
- close UnoCSS PRs and update notices there about this package

- add issue to UnoCSS to deal with empty class having just a semicolon when using transformer:
```css
.my-button {
  --at-apply: dark:bg-red-700 dark:hover:bg-red-600;
}
```

- add linting
- [UnoCSS Inspector doesn't work yet](https://github.com/unocss/unocss/issues/1718). PR's welcome! You would need to study how the `unocss:global` global does it by adding tokens to the tasks array via `tasks.push(extract(code, filename))`
- If you update the config during dev, you'll need to restart your server to see the updated changes, this could be solved by using Uno's ConfigHMRPlugin