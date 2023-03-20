import type { Plugin, ResolvedConfig } from 'vite'
import { generateGlobalCss, isServerHooksFile, checkTransformPageChunkHook, replaceGlobalStylesPlaceholder, replacePlaceholderWithPreflightsAndSafelist } from './global'
import { PLACEHOLDER_USER_SETS_IN_INDEX_HTML } from './constants'
import { SSUContext } from '.'

export function GlobalStylesPlugin({ ready, uno }: SSUContext): Plugin {
  let isSvelteKit: boolean
  let viteConfig: ResolvedConfig
  let unoCssFileReferenceId: string
  let unoCssHashedLinkTag: string

  return {
    name: 'svelte-scoped-uno:global-styles',

    async configResolved(_viteConfig) {
      viteConfig = _viteConfig
      await ready
      isSvelteKit = viteConfig.plugins.some(p => p.name.includes('sveltekit'))
    },

    // serve
    configureServer: checkTransformPageChunkHook,

    // serve
    transform(code, id) {
      if (isSvelteKit && viteConfig.command === 'serve' && isServerHooksFile(id))
        return replacePlaceholderWithPreflightsAndSafelist(uno, code)
    },

    // build
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

    // build
    renderStart() {
      const unoCssFileName = this.getFileName(unoCssFileReferenceId)
      const base = viteConfig.base ?? '/'
      unoCssHashedLinkTag = `<link href="${base}${unoCssFileName}" rel="stylesheet" />`
    },

    // build
    renderChunk(code, chunk) {
      if (isSvelteKit && chunk.moduleIds.some(id => isServerHooksFile(id)))
        return replaceGlobalStylesPlaceholder(code, unoCssHashedLinkTag)
    },


    // serve and build
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
