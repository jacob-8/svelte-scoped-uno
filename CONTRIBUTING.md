# Contributing Guide

## Setup

Install [pnpm](https://pnpm.io/) with:

```bash
npm i -g pnpm
```

Install packages:

```bash
pnpm install
```

## Developing

If you want to edit the `svelte-scoped-uno` Vite plugin or the `svelte-preprocess-unocss` preprocessor run this command first:

```bash
pnpm stub
```

Then you can start a dev server on one of the examples with any of these:

```bash
pnpm try:sveltekit # uses svelte-scoped-uno
pnpm try:svelte # uses svelte-scoped-uno
pnpm try:library # uses svelte-preprocess-unocss
```

Restart the dev server when you make changes to the plugin or preprocessor to see them reflected in the example project.

## Submitting a Pull Request

If your PR makes a change that should be noted in one or more packages' changelogs, generate a changeset by running `pnpm changeset` and following the prompts. Changesets that add features should be `minor` and those that fix bugs should be `patch`. Please prefix changeset messages with one of these:
-  `feat:`
-  `fix:`
-  `chore:`
