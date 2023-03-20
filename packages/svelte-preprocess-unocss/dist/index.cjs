'use strict';

const core = require('@unocss/core');
const config = require('@unocss/config');
const presetUno = require('@unocss/preset-uno');
const svelteScopedUno = require('svelte-scoped-uno');

function SveltePreprocessUnocss({
  configOrPath,
  options = {}
}) {
  if (!options.transformDirectives)
    options.transformDirectives = true;
  let uno;
  return {
    markup: async ({ content, filename }) => {
      if (!uno)
        uno = await init(configOrPath);
      let code = content;
      const result = await svelteScopedUno.transformSvelteSFC({ code, id: filename || "", uno, options });
      if (result?.code)
        code = result.code;
      if (result?.map) {
        return {
          code,
          map: result.map
        };
      } else {
        return {
          code
        };
      }
    }
    // style: async ({ content }) => {
    //   if (options.transformDirectives) {
    //     if (!uno)
    //       uno = await init(configOrPath)
    //     const s = new MagicString(content)
    //     await transformDirectives(s, uno, {
    //       varStyle: '--at-',
    //     })
    //     if (s.hasChanged())
    //       return { code: s.toString() }
    //   }
    // },
  };
}
async function init(configOrPath) {
  const defaults = {
    presets: [
      presetUno()
    ]
  };
  const { config: config$1 } = await config.loadConfig(process.cwd(), configOrPath);
  return core.createGenerator(config$1, defaults);
}

module.exports = SveltePreprocessUnocss;
