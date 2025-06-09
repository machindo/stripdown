import { type EditorState, Facet } from '@codemirror/state'
import { type } from 'arktype'

import { metadataFacet } from '../core/metadataFacet'
import { isSpeaker, parseStripdownTree } from '../core/parse'
import { StripdownConfig } from '../core/StripdownConfig'

export const characterListFacet = Facet.define<string[], string[]>({
  combine: (lists) => [...new Set(lists.flat()).values()],
})

export const charactersFromSpeakers = (state: EditorState) => {
  const tree = parseStripdownTree(state)
  const speakers = tree.children
    .filter(isSpeaker)
    .map((speaker) => speaker.props.name)
  const uniqueSpeakers = new Map(
    speakers.map((name) => [name.toLocaleLowerCase(), name]),
  ).values()

  return [...uniqueSpeakers]
}

export const charactersFromMetadata = (state: EditorState) => {
  const frontmatter = state.facet(metadataFacet)
  const characters = StripdownConfig.pipe(({ characters }) => characters ?? [])(
    frontmatter,
  )

  return characters instanceof type.errors ? [] : characters
}
