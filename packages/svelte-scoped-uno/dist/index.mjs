import { expandVariantGroup, createGenerator } from 'unocss';
export * from 'unocss';
import { loadConfig } from '@unocss/config';
import { createFilter } from '@rollup/pluginutils';
import MagicString from 'magic-string';
import { transformDirectives } from '@unocss/transformer-directives';

const NOT_PRECEEDED_BY_DIGIT_OR_OPEN_PARENTHESIS_RE = /(?<![\d(])/;
const SELECTOR_STARTING_WITH_BRACKET_OR_PERIOD_RE = /([[\.][\S\s]+?)/;
const STYLES_RE = /({[\S\s]+?})/;
const EXTRACT_SELECTOR_RE = new RegExp(NOT_PRECEEDED_BY_DIGIT_OR_OPEN_PARENTHESIS_RE.source + SELECTOR_STARTING_WITH_BRACKET_OR_PERIOD_RE.source + STYLES_RE.source, "g");
function wrapSelectorsWithGlobal(css) {
  return css.replace(EXTRACT_SELECTOR_RE, ":global($1)$2");
}

function hash(str) {
  let i;
  let l;
  let hval = 2166136261;
  for (i = 0, l = str.length; i < l; i++) {
    hval ^= str.charCodeAt(i);
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }
  return `00000${(hval >>> 0).toString(36)}`.slice(-6);
}

const stylesTagWithCapturedDirectivesRE = /(?<!<!--\s*)<style([^>]*)>[\s\S]*?<\/style\s*>/;
const classesRE = /class=(["'\`])([\S\s]+?)\1/g;
const classesDirectivesRE = /class:([\S]+?)={/g;
const classDirectivesShorthandRE = /class:([^=>\s/]+)[{>\s/]/g;
const classesFromInlineConditionalsRE = /'([\S\s]+?)'/g;
async function transformClasses({ code, id, uno, options }) {
  const classes = [...code.matchAll(classesRE)];
  const classDirectives = [...code.matchAll(classesDirectivesRE)];
  const classDirectivesShorthand = [...code.matchAll(classDirectivesShorthandRE)];
  if (!classes.length && !classDirectives.length && !classDirectivesShorthand.length)
    return;
  const {
    classPrefix = "uno-",
    combine = true,
    hashFn = hash
  } = options;
  const originalShortcuts = uno.config.shortcuts;
  const shortcuts = {};
  const toGenerate = /* @__PURE__ */ new Set();
  const s = new MagicString(code);
  const idHash = combine ? "" : hashFn(id);
  let styles = "";
  let map;
  for (const match of classes) {
    let body = expandVariantGroup(match[2].trim());
    const inlineConditionals = [...body.matchAll(classesFromInlineConditionalsRE)];
    for (const conditional of inlineConditionals) {
      const replacement2 = await sortKnownAndUnknownClasses(conditional[1].trim());
      if (replacement2)
        body = body.replace(conditional[0], `'${replacement2}'`);
    }
    const replacement = await sortKnownAndUnknownClasses(body);
    if (replacement) {
      const start = match.index;
      s.overwrite(start + 7, start + match[0].length - 1, replacement);
    }
  }
  for (const match of classDirectives) {
    const token = match[1];
    const result = await needsGenerated(token);
    if (!result)
      continue;
    const className = queueCompiledClass([token]);
    const start = match.index + "class:".length;
    s.overwrite(start, start + match[1].length, className);
  }
  for (const match of classDirectivesShorthand) {
    const token = match[1];
    const result = await needsGenerated(token);
    if (!result)
      continue;
    const className = queueCompiledClass([token]);
    const start = match.index + "class:".length;
    s.overwrite(start, start + match[1].length, `${className}={${token}}`);
  }
  async function sortKnownAndUnknownClasses(str) {
    const classArr = str.split(/\s+/);
    const result = await Promise.all(classArr.filter(Boolean).map(async (token) => [token, await needsGenerated(token)]));
    const known = result.filter(([, matched]) => matched).map(([t]) => t).sort();
    if (!known.length)
      return null;
    const replacements = result.filter(([, matched]) => !matched).map(([i]) => i);
    const className = queueCompiledClass(known);
    return [className, ...replacements].join(" ");
  }
  async function needsGenerated(token) {
    if (uno.config.safelist.includes(token))
      return false;
    return !!await uno.parseToken(token);
  }
  function queueCompiledClass(tokens) {
    if (combine) {
      const _shortcuts = tokens.filter((t) => isOriginalShortcut(t));
      for (const s2 of _shortcuts)
        toGenerate.add(s2);
      const _tokens = tokens.filter((t) => !isOriginalShortcut(t));
      if (!_tokens.length)
        return _shortcuts.join(" ");
      const hash2 = hashFn(_tokens.join(" ") + id);
      const className = `${classPrefix}${hash2}`;
      shortcuts[className] = _tokens;
      toGenerate.add(className);
      return [className, ..._shortcuts].join(" ");
    } else {
      return tokens.map((token) => {
        if (isOriginalShortcut(token)) {
          toGenerate.add(token);
          return token;
        }
        const className = `_${token}_${idHash}`;
        shortcuts[className] = [token];
        toGenerate.add(className);
        return className;
      }).join(" ");
    }
  }
  function isOriginalShortcut(token) {
    return originalShortcuts.some((s2) => s2[0] === token);
  }
  uno.config.shortcuts = [...originalShortcuts, ...Object.entries(shortcuts)];
  const { css } = await uno.generate(toGenerate, { preflights: false, safelist: false, minify: true });
  styles += wrapSelectorsWithGlobal(css);
  uno.config.shortcuts = originalShortcuts;
  if (toGenerate.size > 0 || s.hasChanged()) {
    code = s.toString();
    map = s.generateMap({ hires: true, source: id });
  } else {
    return;
  }
  const preexistingStylesTag = code.match(stylesTagWithCapturedDirectivesRE);
  if (preexistingStylesTag) {
    return {
      code: code.replace(/(<style[^>]*>)/, `$1${styles}`),
      map
    };
  }
  return {
    code: `${code}
<style>${styles}</style>`,
    map
  };
}

const defaultSvelteScopedInclude = [/\.svelte$/, /\.svelte\.md$/, /\.svx$/];
const defaultExclude = [/\.svelte-kit\/generated/, /node_modules/];
function TransformClassesPlugin({ ready, uno }, options = {}) {
  let filter = createFilter(defaultSvelteScopedInclude, defaultExclude);
  let viteConfig;
  return {
    name: "svelte-scoped-uno:transform-classes",
    enforce: "pre",
    async configResolved(_viteConfig) {
      viteConfig = _viteConfig;
      const config = await ready;
      filter = createFilter(
        config.include || defaultSvelteScopedInclude,
        config.exclude || defaultExclude
      );
    },
    transform(code, id) {
      if (filter(id))
        return transformClasses({ code, id, uno, options: { classPrefix: options.classPrefix, hashFn: options.hashFn, combine: viteConfig.command === "build" } });
    },
    handleHotUpdate(ctx) {
      const read = ctx.read;
      if (filter(ctx.file)) {
        ctx.read = async () => {
          const code = await read();
          return (await transformClasses({ code, id: ctx.file, uno, options: { classPrefix: options.classPrefix, hashFn: options.hashFn, combine: false } }))?.code || code;
        };
      }
    }
  };
}

const cssIdRE = /\.(css|postcss|sass|scss|less|stylus|styl)($|\?)/;
function TransformDirectivesPlugin({ ready, uno }) {
  return {
    name: "svelte-scoped-uno:transform-directives",
    async configResolved() {
      await ready;
    },
    transform(code, id) {
      if (!!id.match(cssIdRE))
        return _transformDirectives({ code, uno });
    }
  };
}
async function _transformDirectives({ code, uno }) {
  const s = new MagicString(code);
  await transformDirectives(s, uno, {});
  if (s.hasChanged())
    return s.toString();
  return code;
}

const GLOBAL_STYLES_PLACEHOLDER = "svelte_scoped_uno_global_styles";
const PLACEHOLDER_USER_SETS_IN_INDEX_HTML = "%svelte-scoped-uno.global%";
const DEV_GLOBAL_STYLES_DATA_TITLE = "svelte-scoped-uno global styles";

function isServerHooksFile(path) {
  return path.includes("hooks") && path.includes("server");
}
function replaceGlobalStylesPlaceholder(code, stylesTag) {
  const captureQuoteMark = "([\"'`])";
  const matchCapturedQuoteMark = "\\1";
  const QUOTES_WITH_PLACEHOLDER_RE = new RegExp(captureQuoteMark + GLOBAL_STYLES_PLACEHOLDER + matchCapturedQuoteMark);
  const escapedStylesTag = stylesTag.replaceAll(/`/g, "\\`");
  return code.replace(QUOTES_WITH_PLACEHOLDER_RE, `\`${escapedStylesTag}\``);
}
async function replacePlaceholderWithPreflightsAndSafelist(uno, code) {
  const css = await generateGlobalCss(uno);
  return {
    code: replaceGlobalStylesPlaceholder(code, `<style type="text/css" data-title="${DEV_GLOBAL_STYLES_DATA_TITLE}">${css}</style>`)
  };
}
async function generateGlobalCss(uno) {
  const { css } = await uno.generate("", { preflights: true, safelist: true, minify: true });
  return css;
}
function checkTransformPageChunkHook(server) {
  server.middlewares.use((req, res, next) => {
    const originalWrite = res.write;
    res.write = function(chunk, ...rest) {
      const str = chunk instanceof Buffer ? chunk.toString() : Array.isArray(chunk) || "at" in chunk ? Buffer.from(chunk).toString() : `${chunk}`;
      if (str.includes("<head>") && !str.includes(DEV_GLOBAL_STYLES_DATA_TITLE)) {
        server.config.logger.error(
          `You have not setup the svelte-scoped-uno global styles for SvelteKit correctly. You need to have a transformPageChunk hook in your server hooks file with: \`html.replace('${PLACEHOLDER_USER_SETS_IN_INDEX_HTML}', '${GLOBAL_STYLES_PLACEHOLDER}')\`. You can see an example of the usage at https://github.com/jacob-8/svelte-scoped-uno/tree/main/examples/sveltekit-vite-plugin.`,
          { timestamp: true }
        );
      }
      return originalWrite.call(this, chunk, ...rest);
    };
    next();
  });
}

function GlobalStylesPlugin({ ready, uno }) {
  let isSvelteKit;
  let viteConfig;
  let unoCssFileReferenceId;
  let unoCssHashedLinkTag;
  return {
    name: "svelte-scoped-uno:global-styles",
    async configResolved(_viteConfig) {
      viteConfig = _viteConfig;
      await ready;
      isSvelteKit = viteConfig.plugins.some((p) => p.name.includes("sveltekit"));
    },
    // serve
    configureServer: checkTransformPageChunkHook,
    // serve
    transform(code, id) {
      if (isSvelteKit && viteConfig.command === "serve" && isServerHooksFile(id))
        return replacePlaceholderWithPreflightsAndSafelist(uno, code);
    },
    // build
    async buildStart() {
      if (viteConfig.command === "build") {
        const css = await generateGlobalCss(uno);
        unoCssFileReferenceId = this.emitFile({
          type: "asset",
          name: "uno.css",
          source: css
        });
      }
    },
    // build
    renderStart() {
      const unoCssFileName = this.getFileName(unoCssFileReferenceId);
      const base = viteConfig.base ?? "/";
      unoCssHashedLinkTag = `<link href="${base}${unoCssFileName}" rel="stylesheet" />`;
    },
    // build
    renderChunk(code, chunk) {
      if (isSvelteKit && chunk.moduleIds.some((id) => isServerHooksFile(id)))
        return replaceGlobalStylesPlaceholder(code, unoCssHashedLinkTag);
    },
    // serve and build
    async transformIndexHtml(html) {
      if (!isSvelteKit) {
        if (viteConfig.command === "build")
          return html.replace(PLACEHOLDER_USER_SETS_IN_INDEX_HTML, unoCssHashedLinkTag);
        if (viteConfig.command === "serve") {
          const css = await generateGlobalCss(uno);
          return html.replace(PLACEHOLDER_USER_SETS_IN_INDEX_HTML, `<style>${css}</style>`);
        }
      }
    }
  };
}

function SvelteScopedUnoPlugin({
  configOrPath,
  options = {}
} = { options: {} }) {
  const context = initUno(configOrPath);
  const plugins = [
    GlobalStylesPlugin(context),
    TransformClassesPlugin(context, options),
    TransformDirectivesPlugin(context)
  ];
  return plugins;
}
function initUno(configOrPath) {
  const uno = createGenerator();
  let ready = reloadConfig();
  async function reloadConfig() {
    const { config } = await loadConfig(process.cwd(), configOrPath);
    uno.setConfig(config);
    return config;
  }
  return {
    uno,
    ready
  };
}

export { SvelteScopedUnoPlugin as default };
