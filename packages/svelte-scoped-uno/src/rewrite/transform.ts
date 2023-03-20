
// need to create a function that receives a string (class="..."), an acceptance function, a hash, compile or not, and return back the string to replace the original with + an object of compiledClassName: utility class

const classesRE = /class=(["'\`])([\S\s]+?)\1/g // class="mb-1"
const classesFromInlineConditionalsRE = /'([\S\s]+?)'/g // { foo ? 'mt-1' : 'mt-2'}

export function transform(code: string) {
  const classes = [...code.matchAll(classesRE)]
  
  for (const match of classes) {
    const body = match[2].trim();
    const inlineConditionals = [...body.matchAll(classesFromInlineConditionalsRE)]
    
  }
  
  
  console.log(classes)

}