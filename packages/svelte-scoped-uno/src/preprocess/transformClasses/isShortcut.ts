// import type { Shortcut } from '@unocss/core'
// export function isShortcut(token: string, shortcuts: Shortcut<{}>[]): boolean {

export function isShortcut(token: string, shortcuts: any): boolean {
  return shortcuts.some(s => s[0] === token)
}
