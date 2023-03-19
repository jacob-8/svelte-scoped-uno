/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%svelte-scoped-uno.global%', 'svelte_scoped_uno_global_styles'),
  })
  return response
}
