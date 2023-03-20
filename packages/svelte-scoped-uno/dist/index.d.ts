import { Plugin } from 'vite';
import { UnoGenerator, UserConfig } from 'unocss';
export * from 'unocss';

interface SSUContext {
  uno: UnoGenerator<{}>;
  ready: Promise<UserConfig<{}>>;
}

interface TransformClassesOptions extends SvelteScopedUnocssOptions {
  /**
   * Add hash and combine recognized tokens (optimal for production); set false in dev mode for easy dev tools toggling to allow for design adjustments in the browser
   * @default true
   */
  combine?: boolean
}

interface SvelteScopedUnocssOptions {
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

declare function SvelteScopedUnoPlugin({ configOrPath, options, }?: {
    configOrPath?: UserConfig | string;
    options?: SvelteScopedUnocssOptions;
}): Plugin[];

export { SSUContext, SvelteScopedUnocssOptions, TransformClassesOptions, SvelteScopedUnoPlugin as default };
