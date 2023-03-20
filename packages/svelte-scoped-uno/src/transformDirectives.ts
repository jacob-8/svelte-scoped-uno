import { type UnoGenerator } from "unocss";
import { transformDirectives } from "@unocss/transformer-directives";
import MagicString from 'magic-string'

const negativeLookbehindForComment = /(?<!<!--\s*)/
const styleTagContents = /(<style[^>]*>)([\s\S]*?)<\/style\s*>/
const styleTag = new RegExp(negativeLookbehindForComment.source + styleTagContents.source);

export default async function ({ code, uno }: { code: string; uno: UnoGenerator }): Promise<string> {
  const styleTagContents = code.match(styleTag)?.[2]
  if (!styleTagContents) return code;

  const s = new MagicString(styleTagContents)
  await transformDirectives(s, uno, {});
  if (s.hasChanged()) {
    const transformedStyles = s.toString()
    return code.replace(styleTag, `$1${transformedStyles}</style>`)
  }
  return code
}