import { type UnoGenerator, type SourceMap } from 'unocss'
import { transformClasses } from './transformClasses';
import { TransformClassesOptions } from './types';

export async function transformSvelteSFC({ code, id, uno, options }: { code: string; id: string; uno: UnoGenerator; options: TransformClassesOptions }): Promise<{ code: string; map?: SourceMap } | undefined> {
  const result = await transformClasses({ code, id, uno, options })
  return result
}
