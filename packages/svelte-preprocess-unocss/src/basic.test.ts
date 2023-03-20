import { assert, expect, test } from 'vitest'
import { transform } from './transform';

test('basic', () => {
  const code = '<div class="bg-red-500" />'
  // expect(transform(code)).toMatchInlineSnapshot();
  
  expect(transform(`<span class="font-bold {bar ? 'text-red-600' : 'text-(green-500 blue-400) font-semibold boo'} underline foo {baz ? 'italic ' : ''}">Hello</span>`)).toMatchInlineSnapshot('undefined');
});

test('Math.sqrt()', () => {
  expect(Math.sqrt(4)).toBe(2)
  expect(Math.sqrt(144)).toBe(12)
  expect(Math.sqrt(2)).toBe(Math.SQRT2)
})

test('JSON', () => {
  const input = {
    foo: 'hello',
    bar: 'world',
  }

  const output = JSON.stringify(input)

  expect(output).eq('{"foo":"hello","bar":"world"}')
  assert.deepEqual(JSON.parse(output), input, 'matches original')
})
