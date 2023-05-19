const NOT_PRECEEDED_BY_DIGIT_OR_OPEN_PARENTHESIS_RE = /(?<![\d(])/
// as seen in animate-bounce keyframe digits for example:
// 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }

const SELECTOR_STARTING_WITH_BRACKET_OR_PERIOD_RE = /([[\.][\S\s]+?)/
// as in [dir="rtl"] or a normal selector, capturing lazily

const STYLES_RE = /({[\S\s]+?})/

const EXTRACT_SELECTOR_RE = new RegExp(NOT_PRECEEDED_BY_DIGIT_OR_OPEN_PARENTHESIS_RE.source + SELECTOR_STARTING_WITH_BRACKET_OR_PERIOD_RE.source + STYLES_RE.source, 'g')

export function wrapSelectorsWithGlobal(css: string) {
  return css.replace(EXTRACT_SELECTOR_RE, ':global($1)$2')
}

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest

  describe('wrapSelectorsWithGlobal', () => {
    it('should wrap multiple selectors with :global()', () => {
      const css = '.my-class{color:red;}[dir="rtl"] .mb-1{margin-bottom:0.25em;}'
      const expected = ':global(.my-class){color:red;}:global([dir="rtl"] .mb-1){margin-bottom:0.25em;}'

      expect(wrapSelectorsWithGlobal(css)).toBe(expected)
    })

    it('should not wrap selectors preceded by digits', () => {
      const css = `@keyframes animation {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }`
      const expected = css

      expect(wrapSelectorsWithGlobal(css)).toBe(expected)
    })

    it('should not wrap @media selectors (selectors inside parenthesis)', () => {
      const css = '@media (min-width: 768px) {.my-class{color:red;}}'
      const expected = '@media (min-width: 768px) {:global(.my-class){color:red;}}'

      expect(wrapSelectorsWithGlobal(css)).toBe(expected)
    })
  })
}

// if we ever need to wrap a class starting with a colon as in ":not(...)" then we would need to avoid grabbing colons from media queries like `@media (min-width: 640px){.uno-28lpzl{margin-bottom:0.5rem;}}`
