import { foldService } from '@codemirror/language'

import { parseStripdownTree } from '../core/parse'
import { headingLevels } from './headingLevels'

export const headingFoldService = foldService.of(
  (state, lineStart, lineEnd) => {
    const tree = parseStripdownTree(state)
    const index = tree.children.findIndex(
      (child) => child.node.from === lineStart,
    )
    const level =
      tree.children[index] && headingLevels[tree.children[index].node.name]

    if (!level) return null

    const end = tree.children.slice(index + 1).find((child) => {
      const childLevel = headingLevels[child.node.name]

      return childLevel && childLevel <= level
    })

    return {
      from: lineEnd,
      to: (end?.node.from ?? state.doc.length) - 1,
    }
  },
)
