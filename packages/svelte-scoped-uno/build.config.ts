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
    '@rollup/pluginutils',
    'svelte',
    'vite',
  ],
  // rollup: {
  //   emitCJS: true,
  // },
})
