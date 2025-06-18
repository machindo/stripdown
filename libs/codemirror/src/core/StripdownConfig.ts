import { type } from 'arktype'

export const StripdownConfig = type({
  'characters?': 'string[]',
  'title?': 'string',
  'pageTurnDirection?': "'ltr' | 'rtl'",
  'oddSide?': "'left' | 'right'",
}).onUndeclaredKey('delete')

export type StripdownConfig = typeof StripdownConfig.infer
