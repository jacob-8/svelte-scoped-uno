import type { Plugin } from 'vite'
import { type UnoGenerator } from 'unocss'
import { transformDirectives } from "@unocss/transformer-directives";
import MagicString from 'magic-string'
import { SSUContext } from '.';

// From @unocss/transformer-directives - probably only need .css
const cssIdRE = /\.(css|postcss|sass|scss|less|stylus|styl)($|\?)/

export function TransformDirectivesPlugin({ ready, uno }: SSUContext): Plugin {
  return {
    name: 'svelte-scoped-uno:transform-directives',
    async configResolved() {
      await ready
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