import { RangeSetBuilder } from '@codemirror/state'
import {
  Decoration,
  type DecorationSet,
  type EditorView,
  type PluginValue,
  ViewPlugin,
  WidgetType,
} from '@codemirror/view'
import { match } from 'arktype'

import { h } from '../core/h'
import {
  inRanges,
  isNumberedPageHeading,
  isNumberedPanelHeading,
} from '../core/parse'
import { stripdownTree } from '../core/stripdownTree'

type PanelCountWidgetOptions = {
  panelCount: number
}

export class PageSummaryWidget extends WidgetType {
  options: PanelCountWidgetOptions

  constructor(options: PanelCountWidgetOptions) {
    super()
    this.options = options
  }

  toDOM() {
    return h('span', { class: 'cm-pageSummaryWidget' }, [
      match
        .case('1', (count) => ` (${count} panel)`)
        .default((count) => ` (${count} panels)`)(this.options.panelCount),
    ])
  }
}

const createPageIconDecorations = (view: EditorView) => {
  const builder = new RangeSetBuilder<Decoration>()
  const tree = view.plugin(stripdownTree)?.tree

  if (!tree) return builder.finish()

  const pageHeadingNodes = inRanges(tree, view.visibleRanges).filter(
    isNumberedPageHeading,
  )

  const panelHeadingNodes = tree.children.filter(isNumberedPanelHeading)

  for (const pageHeading of pageHeadingNodes) {
    const panelCount =
      panelHeadingNodes.findLast((child) => child.scope.includes(pageHeading))
        ?.props.implicitEnd ?? 0

    builder.add(
      pageHeading.node.to,
      pageHeading.node.to,
      Decoration.widget({
        side: -1,
        widget: new PageSummaryWidget({
          panelCount,
        }),
      }),
    )
  }

  return builder.finish()
}

export const pageSummaryDecorations = ViewPlugin.define(
  (view) => {
    const value = {
      decorations: createPageIconDecorations(view),
      update: (update) => {
        if (!update.docChanged && !update.viewportChanged) {
          value.decorations = createPageIconDecorations(update.view)
        }
      },
    } satisfies PluginValue & { decorations: DecorationSet }

    return value
  },
  {
    decorations: (value) => value.decorations,
  },
)
