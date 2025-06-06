import { ChangeSet, EditorState, StateEffect } from '@codemirror/state'

import { isFixableHeading, parseStripdownTree } from '../core/parse'

// Note: this calculates tr.state, which can be expensive
export const headingAutoCorrect = EditorState.transactionFilter.of((tr) => {
  if (!tr.docChanged) return tr

  const fixableHeadings = parseStripdownTree(tr.state).children.filter(
    isFixableHeading,
  )
  const changes = fixableHeadings.map((node) => {
    const insert =
      node.props.extra === 0
        ? `${node.expectedProps.start}`
        : node.props.dir === 'ltr'
          ? `${node.expectedProps.start}${node.props.delimiter}${node.expectedProps.end}`
          : `${node.expectedProps.end}${node.props.delimiter}${node.expectedProps.start}`

    return {
      from: node.node.from + node.props.columnStart,
      to: node.node.from + node.props.columnEnd,
      insert,
    }
  })
  const changeSet = ChangeSet.of(changes, tr.newDoc.length)
  const newTr = {
    changes: tr.changes.compose(changeSet),
    effects: StateEffect.mapEffects(tr.effects, changeSet),
    selection: tr.selection?.map(changeSet),
    scrollIntoView: tr.scrollIntoView,
  }

  return newTr
})
