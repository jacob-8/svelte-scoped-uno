import { describe, expect, test } from 'vitest'
import { createGenerator, presetUno } from 'unocss'
import { format as prettier } from 'prettier'
import prettierSvelte from 'prettier-plugin-svelte'
import transformDirectives from './transformDirectives'

describe('apply', () => {
  const uno = createGenerator({
    presets: [
      presetUno(),
    ],
  })

  async function transform(code: string) {
    const transformed = await transformDirectives({ code, uno })
    return prettier(transformed, {
      parser: 'svelte',
      plugins: [prettierSvelte],
    })
  }

  test('handles --at-apply', async () => {
    const style = `
    <style>
      .custom-class {
        --at-apply: hidden;
      }
      </style>
    `.trim()
    expect(await transform(style)).toMatchInlineSnapshot(`
      "<style>
        .custom-class {
          display: none;
        }
      </style>
      "
    `)
  })

  test('handles complex', async () => {
    const code = `
      <style>
      .custom-class {
        --at-apply: flex rtl:mr-1;
      }
      </style>
    `.trim()
    expect(await transform(code)).toMatchInlineSnapshot(`
      "<style>
        .custom-class {
          display: flex;
        }
        [dir=\\"rtl\\"] .custom-class {
          margin-right: 0.25rem;
        }
      </style>
      "
    `)
  })
})