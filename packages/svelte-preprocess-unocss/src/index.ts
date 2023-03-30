import type { PreprocessorGroup } from 'svelte/types/compiler/preprocess'
import MagicString from 'magic-string'
import { loadConfig } from '@unocss/config'
import { transformDirectives } from '@unocss/transformer-directives'
import { transformClasses, TransformClassesOptions, type UnoGenerator, type UserConfig, type UserConfigDefaults, createGenerator, presetUno } from 'svelte-scoped-uno'

export * from 'svelte-scoped-uno';

export interface SveltePreprocessUnocssOptions extends TransformClassesOptions {
  /**
   * Prefix for compiled class name. Distinct from the 'uno-' default used in svelte-scoped-uno for clarity.
   * @default 'spu-'
   */
  classPrefix?: string
  /**
   * Run @unocss/transformer-directives on style blocks
   * @default true
   */
  transformDirectives?: boolean
}

export function PreprocessUnocss(options: SveltePreprocessUnocssOptions = {}): PreprocessorGroup {
  if (!options.transformDirectives)
    options.transformDirectives = true
  if (!options.classPrefix)
    options.classPrefix = 'spu-'

  let uno: UnoGenerator
  return {
    markup: async ({ content, filename }) => {
      if (!uno)
        uno = await init(options.configOrPath)

      let code = content

      const result = await transformClasses({ code, id: filename || '', uno, options })

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

    style: async ({ content }) => {
      if (options.transformDirectives) {
        if (!uno)
        uno = await init(options.configOrPath)
        
        const s = new MagicString(content)
        await transformDirectives(s, uno, {})
        if (s.hasChanged())
          return { code: s.toString() }
      }
    },
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
