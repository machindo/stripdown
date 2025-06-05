import { foldService } from '@codemirror/language'

import { headingLevelProp } from './markdownConfig'
import { parseStripdownTree } from './parse'

export const stripdownFoldService = foldService.of(
  (state, lineStart, lineEnd) => {
    const tree = parseStripdownTree(state)
    const index = tree.children.findIndex(
      (child) => child.node.from === lineStart,
    )
    const level = tree.children[index]?.node.type.prop(headingLevelProp)

    if (!level) return null

    const end = tree.children.slice(index + 1).find((child) => {
      const childLevel = child.node.type.prop(headingLevelProp)

      return childLevel && childLevel <= level
    })

    return {
      from: lineEnd,
      to: (end?.node.from ?? state.doc.length) - 1,
    }
  },
)
