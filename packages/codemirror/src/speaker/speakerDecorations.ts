import { RangeSetBuilder } from '@codemirror/state'
import {
  Decoration,
  type DecorationSet,
  type EditorView,
  type PluginValue,
  ViewPlugin,
} from '@codemirror/view'

import { inRanges } from '../core/parse'
import { stripdownTree } from '../core/stripdownTree'

const createSpeakerDecorations = (view: EditorView) => {
  const builder = new RangeSetBuilder<Decoration>()
  const tree = view.plugin(stripdownTree)?.tree

  if (!tree) return builder.finish()

  const nodes = inRanges(tree, view.visibleRanges)

  for (const node of nodes) {
    switch (node.type) {
      case 'Speaker':
        builder.add(
          node.node.from,
          node.node.to,
          Decoration.mark({ class: 'cm-stripdown-speaker' }),
        )
        break
      case 'Dialogue':
        builder.add(
          node.node.from,
          node.node.to,
          Decoration.mark({ class: 'cm-stripdown-dialogue' }),
        )
        break
      case 'Parenthetical':
        builder.add(
          node.node.from,
          node.node.to,
          Decoration.mark({ class: 'cm-stripdown-parenthetical' }),
        )
        break
    }
  }

  return builder.finish()
}

/**
 * Alternative to stripdownHighlightStyle.
 */
export const speakerDecorations = ViewPlugin.define(
  (view) => {
    const value = {
      decorations: createSpeakerDecorations(view),
      update: (update) => {
        if (!update.docChanged && !update.viewportChanged) {
          value.decorations = createSpeakerDecorations(update.view)
        }
      },
    } satisfies PluginValue & { decorations: DecorationSet }

    return value
  },
  {
    decorations: (value) => value.decorations,
  },
)
