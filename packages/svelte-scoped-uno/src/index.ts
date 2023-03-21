import type { Plugin } from 'vite'
import { type UserConfig, createGenerator } from 'unocss'
import { loadConfig } from '@unocss/config'
import { SSUContext, SvelteScopedUnocssOptions } from './types'
import { TransformClassesPlugin } from './transformClassesPlugin'
import { TransformDirectivesPlugin } from './transformDirectives'
import { GlobalStylesPlugin } from './globalStylesPlugin'

export * from './types.d.js'
export * from 'unocss'
export { transformClasses } from './transformClasses'

export function SvelteScopedUno(options: SvelteScopedUnocssOptions = {}): Plugin[] {
  const context = initUno(options.configOrPath);

  const plugins: Plugin[] = [
    GlobalStylesPlugin(context, options.addReset),
  ]

  if (!options.onlyGlobal) {
    plugins.push(TransformClassesPlugin(context, options))
    plugins.push(TransformDirectivesPlugin(context))
  }

  return plugins;
}

export function initUno(configOrPath?: UserConfig | string): SSUContext {
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
