// UnoCSS config options can also be placed in vite.config.ts, but make sure to at least have a blank unocss.config.ts if you are having trouble getting the UnoCSS VSCode extension to work

import { defineConfig, presetIcons, presetTypography, presetUno, presetWebFonts } from 'svelte-scoped-uno'
import { presetForms } from '@julr/unocss-preset-forms'

export default defineConfig({
  shortcuts: [
    { logo: 'i-logos:svelte-icon w-7em h-7em transform transition-300' },
    { "styled-input": 'rounded-md border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50' },
  ],
  presets: [
    presetUno(),
    presetForms(),
    presetIcons({
      prefix: 'i-',
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // these will extend the default theme
        // sans: 'Roboto',
        mono: ['Fira Code', 'Fira Mono:400,700'],
      },
    }),
  ],
  safelist: ['bg-orange-300', 'prose', 'styled-input'],
})
