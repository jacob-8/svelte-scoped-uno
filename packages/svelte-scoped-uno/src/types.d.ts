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