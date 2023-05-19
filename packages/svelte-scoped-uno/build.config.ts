import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    // {
    //   builder: 'mkdist',
    //   input: './src',
    //   outDir: './dist'
    // },
  ],
  clean: true,
  declaration: true,
  externals: [
    '@unocss/core',
    '@unocss/config',
    '@unocss/preset-uno',
    '@unocss/reset',
    'css-tree',
    '@rollup/pluginutils',
    'svelte',
    'vite',
  ],
  rollup: {
    emitCJS: true,
  },
  replace: {
    'import.meta.vitest': 'undefined',
  },
})
