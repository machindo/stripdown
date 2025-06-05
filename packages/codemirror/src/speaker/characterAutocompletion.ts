import type { CompletionSource } from '@codemirror/autocomplete'

import { characterListFacet } from './characterListFacet'

export const characterAutocompletion: CompletionSource = (context) => {
  const characters = [...context.state.facet(characterListFacet)]
  const word = context.matchBefore(/\w*/)

  if (word?.from === word?.to && !context.explicit) return null

  const endOfLine = context.state.doc.lineAt(context.pos).to === context.pos

  return {
    from: word?.from ?? context.pos,
    options: characters.map((character) => ({
      label: character,
    })),
    commitCharacters: endOfLine ? [':'] : [],
  }
}
