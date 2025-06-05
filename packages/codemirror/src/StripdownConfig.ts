import { type } from 'arktype'

import { frontmatterAs, metadataFacet } from './metadataFacet'

export const StripdownConfig = type({
  characters: ['string[]', '=', () => []],
  'title?': 'string',
  'pageTurnDirection?': "'ltr' | 'rtl'",
  'oddSide?': "'left' | 'right'",
}).onUndeclaredKey('delete')

export const frontmatterAsStripdownConfig = () =>
  metadataFacet.compute(['doc'], frontmatterAs(StripdownConfig))
