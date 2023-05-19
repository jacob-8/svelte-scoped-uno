import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const _dirname = typeof __dirname !== 'undefined'
  ? __dirname
  : dirname(fileURLToPath(import.meta.url))

const tempTailwindResetUntilFixed = '*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}'

export function getReset(injectReset: string): string {
  if (injectReset === '@unocss/reset/tailwind.css') return tempTailwindResetUntilFixed;

  if (injectReset.startsWith("@unocss/reset")) {
    const resolvedPNPM = resolve(resolve(_dirname, `../node_modules/${injectReset}`));
    if (isFile(resolvedPNPM))
      return readFileSync(resolvedPNPM, "utf-8");

    const resolvedNPM = resolve(process.cwd(), "node_modules", injectReset);
    return readFileSync(resolvedNPM, "utf-8");
  }


  if (injectReset.startsWith('@unocss/reset'))
    return readFileSync(resolve(_dirname, `../node_modules/${injectReset}`), 'utf-8')

  if (injectReset.startsWith('.')) {
    const resolved = resolve(process.cwd(), injectReset)
    if (!isFile(resolved))
      throw new Error(`"${injectReset}" given as your injectReset value is not a valid file path relative to the root of your project, where your vite config file sits. To give an example, if you placed a reset.css in your src directory, "./src/reset.css" would work.`)

    return readFileSync(resolved, 'utf-8')
  }

  if (injectReset.startsWith('/'))
    throw new Error(`Your injectReset value: "${injectReset}" is not a valid file path. To give an example, if you placed a reset.css in your src directory, "./src/reset.css" would work.`)

  const resolvedFromNodeModules = resolve(process.cwd(), 'node_modules', injectReset)
  if (!isFile(resolvedFromNodeModules))
    throw new Error(`"${injectReset}" given as your injectReset value is not a valid file path relative to your project's node_modules folder. Can you confirm that you've installed "${injectReset}"?`)

  return readFileSync(resolvedFromNodeModules, 'utf-8')
}

function isFile(path: string) {
  return existsSync(path) && statSync(path).isFile()
}
