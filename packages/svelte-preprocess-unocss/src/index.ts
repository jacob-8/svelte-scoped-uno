import type { PreprocessorGroup } from 'svelte/types/compiler/preprocess'
import MagicString from 'magic-string'
import { type UnoGenerator, type UserConfig, type UserConfigDefaults, createGenerator } from '@unocss/core'
import { loadConfig } from '@unocss/config'
import presetUno from '@unocss/preset-uno'
import { transformDirectives } from '@unocss/transformer-directives'
import { transformSvelteSFC, SvelteScopedUnocssOptions } from 'svelte-scoped-uno'

// unbuild throws an odd error unknown when trying to extend TransformSFCOptions here so I'm duplicating it's options
export interface SveltePreprocessUnocssOptions extends SvelteScopedUnocssOptions {
  /**
   * Add hash and combine recognized tokens (optimal for production); set false in dev mode for easy dev tools toggling to allow for design adjustments in the browser
   * @default true
   */
  combine?: boolean
  /**
   * Run @unocss/transformer-directives on style blocks
   * @default true
   */
  transformDirectives?: boolean
}

export default function SveltePreprocessUnocss({
  configOrPath,
  options = {},
}: {
  configOrPath?: UserConfig | string
  options: SveltePreprocessUnocssOptions
}): PreprocessorGroup {
  if (!options.transformDirectives)
    options.transformDirectives = true

  let uno: UnoGenerator
  return {
    markup: async ({ content, filename }) => {
      if (!uno)
        uno = await init(configOrPath)

      let code = content

      const result = await transformSvelteSFC({ code, id: filename || '', uno, options })

      if (result?.code)
        code = result.code

      if (result?.map) {
        return {
          code,
          map: result.map,
        }
      }
      else {
        return {
          code,
        }
      }
    },

    // style: async ({ content }) => {
    //   if (options.transformDirectives) {
    //     if (!uno)
    //       uno = await init(configOrPath)

    //     const s = new MagicString(content)
    //     await transformDirectives(s, uno, {
    //       varStyle: '--at-',
    //     })
    //     if (s.hasChanged())
    //       return { code: s.toString() }
    //   }
    // },
  }
}

async function init(configOrPath?: UserConfig | string) {
  const defaults: UserConfigDefaults = {
    presets: [
      presetUno(),
    ],
  }
  const { config } = await loadConfig(process.cwd(), configOrPath)
  return createGenerator(config, defaults)
}
