import { type UnoGenerator, type SourceMap } from 'unocss'
import { transformClasses } from './transformClasses';
import transformDirectives from './transformDirectives';
import { TransformClassesOptions } from './types';

export async function transformSvelteSFC({ code, id, uno, options }: { code: string; id: string; uno: UnoGenerator; options: TransformClassesOptions }): Promise<{ code: string; map?: SourceMap } | undefined> {
  const transformed_code = await transformDirectives({ code, uno })
  const result = await transformClasses({ code: transformed_code, id, uno, options })
  return result || { code: transformed_code }
}
