import type { UnoGenerator, UserConfig } from "unocss";

export interface SSUContext {
  uno: UnoGenerator<{}>;
  ready: Promise<UserConfig<{}>>;
}

export interface TransformClassesOptions extends Omit<SvelteScopedUnocssOptions, 'addReset'> {
  /**
   * Add hash and combine recognized tokens (optimal for production); set false in dev mode for easy dev tools toggling to allow for design adjustments in the browser
   * @default true
   */
  combine?: boolean
}

export interface SvelteScopedUnocssOptions {
  /**
   * UnoCSS config or path to config file. If not provided, will load config unocss.config.ts/js. It's recommended to use the separate config file if you are having trouble with the UnoCSS extension in VSCode.
   */
  configOrPath?: UserConfig | string
  /**
   * Add Tailwind reset to the beginning of the global stylesheet
   * @default null
   */
  addReset?: 'tailwind' | null
  /**
   * Prefix for compiled class name
   * @default 'uno-'
   */
  classPrefix?: string
  /**
   * Used to generate hash for compiled class names
   */
  hashFn?: (str: string) => string
}