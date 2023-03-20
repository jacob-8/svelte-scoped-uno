import type { Plugin, ResolvedConfig } from 'vite'
import { createFilter } from '@rollup/pluginutils'
import { type UnoGenerator, type UserConfig, createGenerator } from 'unocss'
import { loadConfig } from '@unocss/config'
import { transformSvelteSFC } from './transform'
import { generateGlobalCss, isServerHooksFile, checkTransformPageChunkHook, replaceGlobalStylesPlaceholder, replacePlaceholderWithPreflightsAndSafelist } from './global'
import { PLACEHOLDER_USER_SETS_IN_INDEX_HTML } from './constants'
import { SvelteScopedUnocssOptions } from './types'
import { TransformDirectivesPlugin } from './transformDirectives'

export * from './transform'
export * from './types.d.js'

const defaultSvelteScopedInclude = [/\.svelte$/, /\.svelte\.md$/, /\.svx$/]
const defaultExclude = [/\.svelte-kit\/generated/, /node_modules/]

export default function SvelteScopedUnoPlugin({
  configOrPath,
  options = {},
}: {
  configOrPath?: UserConfig | string
  options?: SvelteScopedUnocssOptions
} = { options: {} }): Plugin[] {
  const plugins: Plugin[] = [
    SvelteScopedUno({ configOrPath, options }),
    TransformDirectivesPlugin({ configOrPath }),
  ]
  return plugins;
}

export function SvelteScopedUno({
  configOrPath,
  options = {},
}: {
  configOrPath?: UserConfig | string
  options?: SvelteScopedUnocssOptions
} = { options: {} }): Plugin {

  let uno: UnoGenerator
  let viteConfig: ResolvedConfig
  let filter = createFilter(defaultSvelteScopedInclude, defaultExclude)
  let isSvelteKit: boolean
  let unoCssFileReferenceId: string
  let unoCssHashedLinkTag: string

  return {
    name: 'svelte-scoped-uno',
    enforce: 'pre',

    // both
    async configResolved(_viteConfig) {
      viteConfig = _viteConfig
      uno = await init(configOrPath)
      filter = createFilter(
        uno.config.include || defaultSvelteScopedInclude,
        uno.config.exclude || defaultExclude,
      )
      isSvelteKit = viteConfig.plugins.some(p => p.name.includes('sveltekit'))
    },

    transform(code, id) {
      if (isSvelteKit && viteConfig.command === 'serve' && isServerHooksFile(id))
        return replacePlaceholderWithPreflightsAndSafelist(uno, code)

      if (filter(id))
        return transformSvelteSFC({ code, id, uno, options: { classPrefix: options.classPrefix, hashFn: options.hashFn, combine: viteConfig.command === 'build' } })
    },

    handleHotUpdate(ctx) {
      const read = ctx.read
      if (filter(ctx.file)) {
        ctx.read = async () => {
          const code = await read()
          return (await transformSvelteSFC({ code, id: ctx.file, uno, options: { classPrefix: options.classPrefix, hashFn: options.hashFn, combine: false } }))?.code || code
        }
      }
    },

    configureServer: checkTransformPageChunkHook,

    async buildStart() {
      if (viteConfig.command === 'build') {
        const css = await generateGlobalCss(uno)
        unoCssFileReferenceId = this.emitFile({
          type: 'asset',
          name: 'uno.css',
          source: css,
        })
      }
    },

    renderStart() {
      const unoCssFileName = this.getFileName(unoCssFileReferenceId)
      const base = viteConfig.base ?? '/'
      unoCssHashedLinkTag = `<link href="${base}${unoCssFileName}" rel="stylesheet" />`
    },

    renderChunk(code, chunk) {
      if (isSvelteKit && chunk.moduleIds.some(id => isServerHooksFile(id)))
        return replaceGlobalStylesPlaceholder(code, unoCssHashedLinkTag)
    },

    async transformIndexHtml(html) {
      // SvelteKit (as of 1.2.0) ignores this hook, so we use the `renderChunk` and `transform` hooks instead for SvelteKit, but if they ever support running this hook inside their hooks.server.js file we can simplify to just using this hook.
      if (!isSvelteKit) {
        if (viteConfig.command === 'build')
          return html.replace(PLACEHOLDER_USER_SETS_IN_INDEX_HTML, unoCssHashedLinkTag)

        if (viteConfig.command === 'serve') {
          const css = await generateGlobalCss(uno)
          return html.replace(PLACEHOLDER_USER_SETS_IN_INDEX_HTML, `<style>${css}</style>`)
        }
      }
    },
  }
}

async function init(configOrPath?: UserConfig | string) {
  const { config } = await loadConfig(process.cwd(), configOrPath)
  return createGenerator(config)
}