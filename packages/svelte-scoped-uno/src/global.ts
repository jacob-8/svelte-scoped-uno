import type { UnoGenerator } from '@unocss/core'
import type { ViteDevServer } from 'vite'
import { DEV_GLOBAL_STYLES_DATA_TITLE, GLOBAL_STYLES_PLACEHOLDER, PLACEHOLDER_USER_SETS_IN_INDEX_HTML } from './constants'

/**
 * It would be nice to parse the svelte config to learn if user set a custom hooks.server name but both of the following methods have problems:
 * - const svelteConfigRaw = readFileSync('./svelte.config.js', 'utf-8') // manual parsing could fail if people import hooks name from elsewhere or use unstandard syntax
 * - ({ default: svelteConfig } = await import(`${viteConfig.root}/svelte.config.js`)) // throws import errors when vitePreprocess is included in svelte.config.js on Windows (related to path issues)
 */
export function isServerHooksFile(path: string) {
  return path.includes('hooks') && path.includes('server')
}

export function replaceGlobalStylesPlaceholder(code: string, stylesTag: string) {
  const captureQuoteMark = '(["\'`])'
  const matchCapturedQuoteMark = '\\1'
  const QUOTES_WITH_PLACEHOLDER_RE = new RegExp(captureQuoteMark + GLOBAL_STYLES_PLACEHOLDER + matchCapturedQuoteMark)

  const escapedStylesTag = stylesTag.replaceAll(/`/g, '\\`')
  return code.replace(QUOTES_WITH_PLACEHOLDER_RE, `\`${escapedStylesTag}\``)
  // preset-web-fonts doesn't heed the minify option and sends through newlines (\n) that break if we use regular quotes here, always using a backtick here is easier than removing newlines, which are actually kind of useful in dev mode. I might consider turning minify off altogether in dev mode.
}

export async function replacePlaceholderWithPreflightsAndSafelist(uno: UnoGenerator, code: string) {
  const css = await generateGlobalCss(uno)
  return {
    code: replaceGlobalStylesPlaceholder(code, `<style type="text/css" data-title="${DEV_GLOBAL_STYLES_DATA_TITLE}">${css}</style>`),
  }
}

export async function generateGlobalCss(uno: UnoGenerator): Promise<string> {
  const { css } = await uno.generate('', { preflights: true, safelist: true, minify: true })
  return css
}

export function checkTransformPageChunkHook(server: ViteDevServer) {
  server.middlewares.use((req, res, next) => {
    const originalWrite = res.write

    res.write = function (chunk, ...rest) {
      const str = (chunk instanceof Buffer) ? chunk.toString() : ((Array.isArray(chunk) || 'at' in chunk) ? Buffer.from(chunk).toString() : (`${chunk}`))

      if (str.includes('<head>') && !str.includes(DEV_GLOBAL_STYLES_DATA_TITLE)) {
        server.config.logger.error(`You have not setup the svelte-scoped-uno global styles for SvelteKit correctly. You need to have a transformPageChunk hook in your server hooks file with: \`html.replace('${PLACEHOLDER_USER_SETS_IN_INDEX_HTML}', '${GLOBAL_STYLES_PLACEHOLDER}')\`. You can see an example of the usage at https://github.com/jacob-8/svelte-scoped-uno/tree/main/examples/sveltekit-vite-plugin.`
          , { timestamp: true })
      }

      return originalWrite.call(this, chunk, ...rest)
    }

    next()
  })
}
