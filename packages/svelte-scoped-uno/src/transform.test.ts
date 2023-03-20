import { createGenerator, presetUno } from 'unocss'
import { format as prettier } from 'prettier'
import prettierSvelte from 'prettier-plugin-svelte'
import { transformSvelteSFC } from './transform'
import { readFileSync, writeFileSync } from 'fs';

describe('transform', () => {
  const uno = createGenerator({
    presets: [
      presetUno(),
    ],
  })

  async function transform(code: string, { combine = true } = {}) {
    const transformed = (await transformSvelteSFC({ code, id: 'Foo.svelte', uno, options: { combine } }))?.code
    return prettier(transformed, {
      parser: 'svelte',
      plugins: [prettierSvelte],
    })
  }

  test('has classes + directives', async () => {
    const code = `
    <div class="bg-black bee-yellow" />
    <style>
      .bee-yellow {
        --at-apply: text-yellow-500;
      }
    </style>`
    expect(await transform(code)).toMatchInlineSnapshot(`
      "<div class=\\"uno-gbjd7t bee-yellow\\" />

      <style>
        :global(.uno-gbjd7t) {
          --un-bg-opacity: 1;
          background-color: rgba(0, 0, 0, var(--un-bg-opacity));
        }
        .bee-yellow {
          --un-text-opacity: 1;
          color: rgba(234, 179, 8, var(--un-text-opacity));
        }
      </style>
      "
    `)
  })

  test('component has classes + directives', async () => {
    const inputFile = readFileSync('./src/fixtures/input/RightToLeftDependent.svelte', 'utf-8');
    const result = await transform(inputFile);
    const outputFile = readFileSync('./src/fixtures/output/RightToLeftDependent.svelte', 'utf-8');
    expect(result).toEqual(outputFile)
    // uncomment to update:
    // writeFileSync('./src/fixtures/output/RightToLeftDependent.svelte', result, 'utf-8');
  })

  test('has only classes', async () => {
    const code = `<div class="bg-black" />`
    expect(await transform(code)).toMatchInlineSnapshot(`
      "<div class=\\"uno-gbjd7t\\" />

      <style>
        :global(.uno-gbjd7t) {
          --un-bg-opacity: 1;
          background-color: rgba(0, 0, 0, var(--un-bg-opacity));
        }
      </style>
      "
    `)
  })

  test('has only directives', async () => {
    const result = await transform(`
    <div class="foo" />
    <style global>
      .foo {
        --at-apply: text-red-500;
      }
    </style>`.trim())
    expect(result).toMatchInlineSnapshot(`
      "<div class=\\"foo\\" />

      <style global>
        .foo {
          --un-text-opacity: 1;
          color: rgba(239, 68, 68, var(--un-text-opacity));
        }
      </style>
      "
    `)
  })
})
