import { describe, expect, test } from 'vitest'
import { createGenerator } from '@unocss/core'
import presetUno from '@unocss/preset-uno'
import presetIcons from '@unocss/preset-icons'
import { format as prettier } from 'prettier'
import prettierSvelte from 'prettier-plugin-svelte'

import { transformSvelteSFC } from './transform'

describe('transform', () => {
  const safelistClassToSkip = 'mr-7'
  const uno = createGenerator({
    presets: [
      presetUno(),
      presetIcons({
        prefix: 'i-',
        extraProperties: {
          'display': 'inline-block',
          'vertical-align': 'middle',
        },
      }),
    ],
    shortcuts: [
      { shortcut: 'w-5' },
      { logo: 'i-logos:svelte-icon w-6em' },
    ],
    safelist: [safelistClassToSkip],
  })

  async function transform(code: string, { combine = true, format = true } = {}) {
    const transformed = (await transformSvelteSFC({ code, id: 'Foo.svelte', uno, options: { combine } }))?.code
    if (transformed && format) {
      return prettier(transformed, {
        parser: 'svelte',
        plugins: [prettierSvelte],
      })
    }
    return transformed
  }

  test('simple', async () => {
    const code = '<div class="bg-red-500" />'
    expect(await transform(code)).toMatchInlineSnapshot(`
      "<div class=\\"uno-orrz3z\\" />

      <style>
        :global(.uno-orrz3z) {
          --un-bg-opacity: 1;
          background-color: rgba(239, 68, 68, var(--un-bg-opacity));
        }
      </style>
      "
    `)
    expect(await transform(code, { combine: false })).toMatchInlineSnapshot(`
      "<div class=\\"_bg-red-500_7dkb0w\\" />

      <style>
        :global(._bg-red-500_7dkb0w) {
          --un-bg-opacity: 1;
          background-color: rgba(239, 68, 68, var(--un-bg-opacity));
        }
      </style>
      "
    `)
  })

  test('does not change shortcut names', async () => {
    const code = `
    <div class="shortcut mb-1 foo" />
    <div class:shortcut />
    `.trim()
    expect(await transform(code)).toMatchInlineSnapshot(`
      "<div class=\\"uno-2se4c1 shortcut foo\\" />
      <div class:shortcut />

      <style>
        :global(.uno-2se4c1) {
          margin-bottom: 0.25rem;
        }
        :global(.shortcut) {
          width: 1.25rem;
        }
      </style>
      "
    `)
    expect(await transform(code, { combine: false })).toMatchInlineSnapshot(`
      "<div class=\\"_mb-1_7dkb0w shortcut foo\\" />
      <div class:shortcut />

      <style>
        :global(._mb-1_7dkb0w) {
          margin-bottom: 0.25rem;
        }
        :global(.shortcut) {
          width: 1.25rem;
        }
      </style>
      "
    `)
  })

  test('wraps parent and child dependent classes like rtl: and space-x-1 with :global() wrapper', async () => {
    const code = '<div class="mb-1 text-sm rtl:right-0 space-x-1" />'
    expect(await transform(code)).toMatchInlineSnapshot(`
      "<div class=\\"uno-795nkx\\" />

      <style>
        :global([dir=\\"rtl\\"] .uno-795nkx) {
          right: 0;
        }
        :global(.uno-795nkx) {
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
        :global(.uno-795nkx > :not([hidden]) ~ :not([hidden])) {
          --un-space-x-reverse: 0;
          margin-left: calc(0.25rem * calc(1 - var(--un-space-x-reverse)));
          margin-right: calc(0.25rem * var(--un-space-x-reverse));
        }
      </style>
      "
    `)
    expect(await transform(code, { combine: false })).toMatchInlineSnapshot(`
      "<div
        class=\\"_mb-1_7dkb0w _rtl:right-0_7dkb0w _space-x-1_7dkb0w _text-sm_7dkb0w\\"
      />

      <style>
        :global([dir=\\"rtl\\"] ._rtl\\\\:right-0_7dkb0w) {
          right: 0;
        }
        :global(._mb-1_7dkb0w) {
          margin-bottom: 0.25rem;
        }
        :global(._space-x-1_7dkb0w > :not([hidden]) ~ :not([hidden])) {
          --un-space-x-reverse: 0;
          margin-left: calc(0.25rem * calc(1 - var(--un-space-x-reverse)));
          margin-right: calc(0.25rem * var(--un-space-x-reverse));
        }
        :global(._text-sm_7dkb0w) {
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
      </style>
      "
    `)
  })

  test('handles class directives, including shorthand syntax; uses same hash for multiple occurrences of same class(es)', async () => {
    const result = await transform(`
    <div class="flex"/>
    <div class:flex={bar} />
    <div class:flex />
    <div class:flex/>
    <div class:flex>
    <div class:flex class="bar" />
    `.trim(), { format: false })
    expect(result).toMatchInlineSnapshot(`
      "<div class=\\"uno-oo7fkj\\"/>
          <div class:uno-oo7fkj={bar} />
          <div class:uno-oo7fkj={flex} />
          <div class:uno-oo7fkj={flex}/>
          <div class:uno-oo7fkj={flex}>
          <div class:uno-oo7fkj={flex} class=\\"bar\\" />
      <style>:global(.uno-oo7fkj){display:flex;}</style>"
    `)
  })

  test('order of utility classes does not affect output', async () => {
    const order1CSS = await transform('<div class="flex bg-blue-400 my-awesome-class font-bold"></div>')
    const order2CSS = await transform('<div class="my-awesome-class bg-blue-400  font-bold flex"></div>')
    expect(order1CSS).toBe(order2CSS)
  })

  test(':global() properly handles @media queries', async () => {
    const result = await transform(`
    <div class="dark:hover:sm:space-x-1" />`.trim())
    expect(result).toMatchInlineSnapshot(`
      "<div class=\\"uno-1eyzu3\\" />

      <style>
        @media (min-width: 640px) {
          :global(.dark .uno-1eyzu3:hover > :not([hidden]) ~ :not([hidden])) {
            --un-space-x-reverse: 0;
            margin-left: calc(0.25rem * calc(1 - var(--un-space-x-reverse)));
            margin-right: calc(0.25rem * var(--un-space-x-reverse));
          }
        }
      </style>
      "
    `)
  })

  test('does not place :global() around animate-bounce keyframe digits', async () => {
    const result = await transform('<div class="animate-bounce" />')
    expect(result).toMatchInlineSnapshot(`
      "<div class=\\"uno-swfyci\\" />

      <style>
        :global(.uno-swfyci) {
          animation: bounce 1s linear infinite;
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
      </style>
      "
    `)
  })

  test('shortcut with icon', async () => {
    const result = await transform(`
    <span class="logo" />`.trim())
    expect(result).toMatchSnapshot()
  })

  test('handles backticks and single quotes', async () => {
    const backticks = await transform('<span class=`font-bold` />', { format: false })
    expect(backticks).toMatchInlineSnapshot(`
      "<span class=\`uno-k2ufqh\` />
      <style>:global(.uno-k2ufqh){font-weight:700;}</style>"
    `)
    const singleQuotes = await transform(`
    <span class='font-bold' />`.trim())
    expect(singleQuotes).toMatchInlineSnapshot(`
      "<span class=\\"uno-k2ufqh\\" />

      <style>
        :global(.uno-k2ufqh) {
          font-weight: 700;
        }
      </style>
      "
    `)
  })

  test('handles classes in inline conditionals', async () => {
    // people should probably write this as `class:text-red-600={err} class:text-green-600={!err} etc...` but people commonly use inline conditionals complex situations as demoed in this test and we should support them if we want this to be an easy migration from other Tailwind based tools.
    const result = await transform(`
    <span class="font-bold {bar ? 'text-red-600' : 'text-(green-500 blue-400) font-semibold boo'} underline foo {baz ? 'italic ' : ''}">Hello</span>`.trim())
    expect(result).toMatchInlineSnapshot(`
      "<span
        class=\\"uno-r4l94t {bar ? 'uno-ffvc5a' : 'uno-24bnl1 boo'} foo {baz
          ? 'uno-br1nw8'
          : ''}\\">Hello</span
      >

      <style>
        :global(.uno-24bnl1) {
          font-weight: 600;
          --un-text-opacity: 1;
          color: rgba(96, 165, 250, var(--un-text-opacity));
          color: rgba(34, 197, 94, var(--un-text-opacity));
        }
        :global(.uno-r4l94t) {
          font-weight: 700;
          text-decoration-line: underline;
        }
        :global(.uno-br1nw8) {
          font-style: italic;
        }
        :global(.uno-ffvc5a) {
          --un-text-opacity: 1;
          color: rgba(220, 38, 38, var(--un-text-opacity));
        }
      </style>
      "
    `)
  })

  test('no tokens found returns undefined', async () => {
    const result = await transform(`
    <div class="foo" />
    <style global>
      .foo {
        color: red;
      }
    </style>`.trim())
    expect(result).toMatchInlineSnapshot('undefined')
  })

  test('in dev, when it only hashes but does not combine, handles classes that fail when coming at the beginning of a shortcut name', async () => {
    const code = '<div class="mb-1 !mt-2 md:mr-3 space-x-1" />'
    expect(await transform(code)).toMatchInlineSnapshot(`
      "<div class=\\"uno-8mjgqp\\" />

      <style>
        :global(.uno-8mjgqp) {
          margin-top: 0.5rem !important;
          margin-bottom: 0.25rem;
        }
        :global(.uno-8mjgqp > :not([hidden]) ~ :not([hidden])) {
          --un-space-x-reverse: 0;
          margin-left: calc(0.25rem * calc(1 - var(--un-space-x-reverse)));
          margin-right: calc(0.25rem * var(--un-space-x-reverse));
        }
        @media (min-width: 768px) {
          :global(.uno-8mjgqp) {
            margin-right: 0.75rem;
          }
        }
      </style>
      "
    `)
    expect(await transform(code, { combine: false })).toMatchInlineSnapshot(`
      "<div class=\\"_!mt-2_7dkb0w _mb-1_7dkb0w _md:mr-3_7dkb0w _space-x-1_7dkb0w\\" />

      <style>
        :global(._\\\\!mt-2_7dkb0w) {
          margin-top: 0.5rem !important;
        }
        :global(._mb-1_7dkb0w) {
          margin-bottom: 0.25rem;
        }
        :global(._space-x-1_7dkb0w > :not([hidden]) ~ :not([hidden])) {
          --un-space-x-reverse: 0;
          margin-left: calc(0.25rem * calc(1 - var(--un-space-x-reverse)));
          margin-right: calc(0.25rem * var(--un-space-x-reverse));
        }
        @media (min-width: 768px) {
          :global(._md\\\\:mr-3_7dkb0w) {
            margin-right: 0.75rem;
          }
        }
      </style>
      "
    `)
  })

  test('skips generation for classes in safelist as they are set globally and compilation would remove them', async () => {
    const code = `<div class="bg-red-500 ${safelistClassToSkip}" />`
    const output = await transform(code)
    expect(output).toContain(safelistClassToSkip)
    expect(output).toMatchInlineSnapshot(`
      "<div class=\\"uno-orrz3z mr-7\\" />

      <style>
        :global(.uno-orrz3z) {
          --un-bg-opacity: 1;
          background-color: rgba(239, 68, 68, var(--un-bg-opacity));
        }
      </style>
      "
    `)
  })

  test('does not add styles to a commented out style tag', async () => {
    const code = `<div class="hidden" />
      <!-- <style></style> -->`
    const output = await transform(code)
    expect(output).toMatchInlineSnapshot(`
      "<div class=\\"uno-ssrvwc\\" />

      <!-- <style></style> -->
      <style>
        :global(.uno-ssrvwc) {
          display: none;
        }
      </style>
      "
    `);
  })

  test('everything', async () => {
    const code = `
<div class="bg-red-500 sm:text-xl dark:hover:bg-green-500 transform scale-5" />
<div class:logo class="foo bar" />
<div class:text-orange-400={foo} class="shortcut" />

<div class="text-center sm:text-left rtl:sm:text-right space-x-1 rtl:space-x-reverse foo">
  <div class="text-sm hover:text-red" />
  <Button class="hover:text-red text-sm" />
</div>
    `.trim()
    expect(await transform(code)).toMatchSnapshot()
    expect(await transform(code, { combine: false })).toMatchSnapshot()
  })


  // BUG: When this plugin is run on a component library first, and then in a project second, make sure to use different hashing prefixes because when `uno.parseToken()` checks a previously hashed class like `.uno-ssrvwc` it will add it to uno's cache of non-matches, then when `uno.generate()` runs it will not output the result of that shortcut. I don't know the proper solution to this and I don't think clearing uno's cache of non-matches is right. To see this bug run the following test:
  test.skip('BUG: when a hashed style already exists (from an imported component library that was already processed), and style is found again it will not be output', async () => {
    const result = await transform(`
    <div class="uno-ssrvwc hidden" />`.trim())
    expect(result).toMatchInlineSnapshot(`
      "<div class=\\"uno-ssrvwc\\" />

      <style>
        :global(.uno-ssrvwc) {
          display: none;
        }
      </style>
      "
    `)
  })
})
