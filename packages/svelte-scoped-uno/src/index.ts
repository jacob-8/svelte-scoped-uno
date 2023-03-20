import type { Plugin } from 'vite'
import { type UserConfig, createGenerator } from 'unocss'
import { loadConfig } from '@unocss/config'
import { SvelteScopedUnocssOptions } from './types'
import { TransformClassesPlugin } from './transformClassesPlugin'
import { TransformDirectivesPlugin } from './transformDirectives'
import { GlobalStylesPlugin } from './globalStylesPlugin'

export * from './types.d.js'

export default function SvelteScopedUnoPlugin({
  configOrPath,
  options = {},
}: {
  configOrPath?: UserConfig | string
  options?: SvelteScopedUnocssOptions
} = { options: {} }): Plugin[] {
  const getUno = initUno(configOrPath);

  const plugins: Plugin[] = [
    GlobalStylesPlugin({ getUno }),
    TransformClassesPlugin({ getUno, options }),
    TransformDirectivesPlugin({ getUno }),
  ]
  return plugins;
}

async function initUno(configOrPath?: UserConfig | string) {
  const { config } = await loadConfig(process.cwd(), configOrPath)
  return createGenerator(config)
}