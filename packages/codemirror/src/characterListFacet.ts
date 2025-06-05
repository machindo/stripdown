import { type EditorState, Facet } from '@codemirror/state'
import { type } from 'arktype'

import { metadataFacet } from './metadataFacet'
import { isSpeaker, parseStripdownTree } from './parse'
import { StripdownConfig } from './StripdownConfig'

export const characterListFacet = Facet.define<string[], string[]>({
  combine: (lists) => [...new Set(lists.flat()).values()],
})

export const charactersFromSpeakers = (state: EditorState) => {
  const tree = parseStripdownTree(state)

  const speakers = tree.children
    .filter(isSpeaker)
    .map((speaker) => speaker.props.name)

  return [...new Set<string>(speakers)]
}

export const charactersFromMetadata = (state: EditorState) => {
  const frontmatter = state.facet(metadataFacet)
  const characters = StripdownConfig.pipe(({ characters }) => characters ?? [])(
    frontmatter,
  )

  return characters instanceof type.errors ? [] : characters
}
