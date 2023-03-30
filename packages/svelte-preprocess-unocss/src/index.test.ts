import { readFileSync, writeFileSync } from 'fs';
import { preprocess } from 'svelte/compiler';
import { PreprocessUnocss } from './index.js';
import { format as prettier } from 'prettier'
import prettierSvelte from 'prettier-plugin-svelte'
import { presetIcons, presetUno } from 'svelte-scoped-uno';

describe('preprocessor', () => {
  async function transform(code: string): Promise<string> {
    const result = await preprocess(code, [PreprocessUnocss({
      configOrPath: {
        shortcuts: [
          { logo: 'i-logos:svelte-icon w-7em h-7em transform transition-300' },
        ],
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
      },
    })]);
    return prettier(result.code, {
      parser: 'svelte',
      plugins: [prettierSvelte],
    }).trim()
  }

  test('--at-apply directives', async () => {
    const code = `<div />
    <style>
      div {
        --at-apply: bg-red-100;
      }
    </style>`.trim();
    const result = await transform(code);
    expect(result).toMatchInlineSnapshot(`
      "<div />

      <style>
        div {
          --un-bg-opacity: 1;
          background-color: rgba(254, 226, 226, var(--un-bg-opacity));
        }
      </style>"
    `);
  });

  // TODO: solve this
  test('dark does not work using --at-apply as seen in the output, that needs written inline', async () => {
    const inputFile = readFileSync('./src/fixtures/input/Button.svelte', 'utf-8');
    const result = await transform(inputFile);
    writeFileSync('./src/fixtures/output/Button.svelte', result, 'utf-8');
  });

  test('icons', async () => {
    const component = `<span class="i-logos:svelte-icon" />`;
    const result = await transform(component);
    expect(result).not.toEqual(component);
  });

  test('shortcuts', async () => {
    const component = `<span class="logo" />`;
    const result = await transform(component);
    expect(result).toMatchInlineSnapshot(`
      "<span class=\\"logo\\" />

      <style>
        :global(.logo) {
          background: url(\\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 256 308' display='inline-block' vertical-align='middle' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='%23FF3E00' d='M239.682 40.707C211.113-.182 154.69-12.301 113.895 13.69L42.247 59.356a82.198 82.198 0 0 0-37.135 55.056a86.566 86.566 0 0 0 8.536 55.576a82.425 82.425 0 0 0-12.296 30.719a87.596 87.596 0 0 0 14.964 66.244c28.574 40.893 84.997 53.007 125.787 27.016l71.648-45.664a82.182 82.182 0 0 0 37.135-55.057a86.601 86.601 0 0 0-8.53-55.577a82.409 82.409 0 0 0 12.29-30.718a87.573 87.573 0 0 0-14.963-66.244'/%3E%3Cpath fill='%23FFF' d='M106.889 270.841c-23.102 6.007-47.497-3.036-61.103-22.648a52.685 52.685 0 0 1-9.003-39.85a49.978 49.978 0 0 1 1.713-6.693l1.35-4.115l3.671 2.697a92.447 92.447 0 0 0 28.036 14.007l2.663.808l-.245 2.659a16.067 16.067 0 0 0 2.89 10.656a17.143 17.143 0 0 0 18.397 6.828a15.786 15.786 0 0 0 4.403-1.935l71.67-45.672a14.922 14.922 0 0 0 6.734-9.977a15.923 15.923 0 0 0-2.713-12.011a17.156 17.156 0 0 0-18.404-6.832a15.78 15.78 0 0 0-4.396 1.933l-27.35 17.434a52.298 52.298 0 0 1-14.553 6.391c-23.101 6.007-47.497-3.036-61.101-22.649a52.681 52.681 0 0 1-9.004-39.849a49.428 49.428 0 0 1 22.34-33.114l71.664-45.677a52.218 52.218 0 0 1 14.563-6.398c23.101-6.007 47.497 3.036 61.101 22.648a52.685 52.685 0 0 1 9.004 39.85a50.559 50.559 0 0 1-1.713 6.692l-1.35 4.116l-3.67-2.693a92.373 92.373 0 0 0-28.037-14.013l-2.664-.809l.246-2.658a16.099 16.099 0 0 0-2.89-10.656a17.143 17.143 0 0 0-18.398-6.828a15.786 15.786 0 0 0-4.402 1.935l-71.67 45.674a14.898 14.898 0 0 0-6.73 9.975a15.9 15.9 0 0 0 2.709 12.012a17.156 17.156 0 0 0 18.404 6.832a15.841 15.841 0 0 0 4.402-1.935l27.345-17.427a52.147 52.147 0 0 1 14.552-6.397c23.101-6.006 47.497 3.037 61.102 22.65a52.681 52.681 0 0 1 9.003 39.848a49.453 49.453 0 0 1-22.34 33.12l-71.664 45.673a52.218 52.218 0 0 1-14.563 6.398'/%3E%3C/svg%3E\\")
            no-repeat;
          background-size: 100% 100%;
          background-color: transparent;
          display: inline-block;
          vertical-align: middle;
          width: 1em;
          height: 1em;
          width: 7em;
          height: 7em;
          transform: translateX(var(--un-translate-x))
            translateY(var(--un-translate-y)) translateZ(var(--un-translate-z))
            rotate(var(--un-rotate)) rotateX(var(--un-rotate-x))
            rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z))
            skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x))
            scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z));
          transition-property: color, background-color, border-color, outline-color,
            text-decoration-color, fill, stroke, opacity, box-shadow, transform,
            filter, backdrop-filter;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }
      </style>"
    `);
  })
});
