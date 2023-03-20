import type { Plugin, ResolvedConfig } from 'vite'
import { createFilter } from '@rollup/pluginutils'
import { SvelteScopedUnocssOptions } from './types'
import { transformClasses } from './transformClasses'
import { SSUContext } from '.'

const defaultSvelteScopedInclude = [/\.svelte$/, /\.svelte\.md$/, /\.svx$/]
const defaultExclude = [/\.svelte-kit\/generated/, /node_modules/]

export function TransformClassesPlugin({ ready, uno }: SSUContext, options: SvelteScopedUnocssOptions = {}): Plugin {
  let filter = createFilter(defaultSvelteScopedInclude, defaultExclude)
  let viteConfig: ResolvedConfig

  return {
    name: 'svelte-scoped-uno:transform-classes',
    enforce: 'pre',

    async configResolved(_viteConfig) {
      viteConfig = _viteConfig
      const config = await ready
      filter = createFilter(
        config.include || defaultSvelteScopedInclude,
        config.exclude || defaultExclude,
      )
    },

    transform(code, id) {
      if (filter(id))
        return transformClasses({ code, id, uno, options: { classPrefix: options.classPrefix, hashFn: options.hashFn, combine: viteConfig.command === 'build' } })
    },

    handleHotUpdate(ctx) {
      const read = ctx.read
      if (filter(ctx.file)) {
        ctx.read = async () => {
          const code = await read()
          return (await transformClasses({ code, id: ctx.file, uno, options: { classPrefix: options.classPrefix, hashFn: options.hashFn, combine: false } }))?.code || code
        }
      }
    },
  }
}
