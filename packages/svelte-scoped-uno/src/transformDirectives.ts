import type { Plugin } from 'vite'
import { type UnoGenerator } from 'unocss'
import { transformDirectives } from "@unocss/transformer-directives";
import MagicString from 'magic-string'

const cssIdRE = /\.(css|postcss|sass|scss|less|stylus|styl)($|\?)/

export function TransformDirectivesPlugin({
  getUno,
}: {
  getUno: Promise<UnoGenerator>,
}): Plugin {
  let uno: UnoGenerator

  return {
    name: 'svelte-scoped-uno:transform-directives',
    async configResolved() {
      uno = await getUno
    },

    transform(code, id) {
      if (!!id.match(cssIdRE))
        return _transformDirectives({ code, uno })
    },
  }
}

export async function _transformDirectives({ code, uno }: { code: string; uno: UnoGenerator }): Promise<string> {
  const s = new MagicString(code)
  await transformDirectives(s, uno, {});
  if (s.hasChanged()) return s.toString()
  return code
}