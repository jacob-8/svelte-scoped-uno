import type { Plugin } from 'vite'
import { type UnoGenerator, type UserConfig, createGenerator } from 'unocss'
import { loadConfig } from '@unocss/config'
import { transformDirectives } from "@unocss/transformer-directives";
import MagicString from 'magic-string'

export async function _transformDirectives({ code, uno }: { code: string; uno: UnoGenerator }): Promise<string> {
  const s = new MagicString(code)
  await transformDirectives(s, uno, {});
  if (s.hasChanged()) return s.toString()
  return code
}

const cssIdRE = /\.(css|postcss|sass|scss|less|stylus|styl)($|\?)/

export function TransformDirectivesPlugin({
  configOrPath,
}: {
  configOrPath?: UserConfig | string
}): Plugin {
  let uno: UnoGenerator

  return {
    name: 'svelte-scoped-uno:transform-directives',
    async configResolved(_viteConfig) {
      uno = await init(configOrPath)
    },

    transform(code, id) {
      if (!!id.match(cssIdRE))
        return _transformDirectives({ code, uno })
    },
  }
}

async function init(configOrPath?: UserConfig | string) {
  const { config } = await loadConfig(process.cwd(), configOrPath)
  return createGenerator(config)
}