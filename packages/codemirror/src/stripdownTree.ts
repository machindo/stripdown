import { type PluginValue, ViewPlugin } from '@codemirror/view'

import { parseStripdownTree, type StripdownTree } from './parse'

export const stripdownTree = ViewPlugin.define((view) => {
  const value = {
    tree: parseStripdownTree(view.state),
    update: (update) => {
      if (update.docChanged) {
        value.tree = parseStripdownTree(update.view.state)
      }
    },
  } satisfies PluginValue & { tree: StripdownTree }

  return value
})
