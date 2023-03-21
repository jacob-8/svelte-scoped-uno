// This is just here for our global usage of SvelteScopedUno to conveniently provide a reset and preflights to my demo app - this is unnecessary for your usage of svelte-preprocess-unocss

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%svelte-scoped-uno.global%', 'svelte_scoped_uno_global_styles'),
  })
  return response
}
