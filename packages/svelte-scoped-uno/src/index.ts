import type { Plugin } from 'vite'
import { type UserConfig, createGenerator } from 'unocss'
import { loadConfig } from '@unocss/config'
import { SSUContext, SvelteScopedUnocssOptions } from './types'
import { TransformClassesPlugin } from './transformClassesPlugin'
import { TransformDirectivesPlugin } from './transformDirectives'
import { GlobalStylesPlugin } from './globalStylesPlugin'

export * from './types.d.js'
export * from 'unocss'

export default function SvelteScopedUnoPlugin({
  configOrPath,
  options = {},
}: {
  configOrPath?: UserConfig | string
  options?: SvelteScopedUnocssOptions
} = { options: {} }): Plugin[] {
  const context = initUno(configOrPath);

  const plugins: Plugin[] = [
    GlobalStylesPlugin(context),
    TransformClassesPlugin(context, options),
    TransformDirectivesPlugin(context),
  ]
  return plugins;
}

function initUno(configOrPath?: UserConfig | string): SSUContext {
  const uno = createGenerator();
  let ready = reloadConfig();

  async function reloadConfig() {
    const { config } = await loadConfig(process.cwd(), configOrPath)
    uno.setConfig(config)
    return config;
  }

  return {
    uno,
    ready,
  }
}
