import type { UnoGenerator, UserConfig } from "unocss";

export interface SSUContext {
  uno: UnoGenerator<{}>;
  ready: Promise<UserConfig<{}>>;
}

export interface TransformClassesOptions extends SvelteScopedUnocssOptions {
  /**
   * Add hash and combine recognized tokens (optimal for production); set false in dev mode for easy dev tools toggling to allow for design adjustments in the browser
   * @default true
   */
  combine?: boolean
}

export interface SvelteScopedUnocssOptions {
  /**
   * Prefix for compiled class name
   * @default 'uno-'
   */
  classPrefix?: string
  /**
   * Hash function
   */
  hashFn?: (str: string) => string
}