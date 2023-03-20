import { describe, expect, test } from 'vitest'
import { createGenerator, presetUno } from 'unocss'
import { format as prettier } from 'prettier'
import parserCSS from 'prettier/parser-postcss'
import { _transformDirectives } from './transformDirectives'

describe('apply', () => {
  const uno = createGenerator({
    presets: [
      presetUno(),
    ],
  })

  async function transform(code: string) {
    const transformed = await _transformDirectives({ code, uno })
    return prettier(transformed, {
      parser: 'css',
      plugins: [parserCSS],
    })
  }

  test('handles --at-apply', async () => {
    const style = `
      .custom-class {
        --at-apply: hidden;
      }
    `.trim()
    expect(await transform(style)).toMatchInlineSnapshot(`
      ".custom-class {
        display: none;
      }
      "
    `)
  })

  test('handles complex', async () => {
    const code = `
      .custom-class {
        --at-apply: flex rtl:mr-1;
      }
    `.trim()
    expect(await transform(code)).toMatchInlineSnapshot(`
      ".custom-class {
        display: flex;
      }
      [dir=\\"rtl\\"] .custom-class {
        margin-right: 0.25rem;
      }
      "
    `)
  })
})