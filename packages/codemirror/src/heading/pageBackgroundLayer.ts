import {
  Direction,
  type EditorView,
  layer,
  RectangleMarker,
} from '@codemirror/view'

import { isPageHeading, type StripdownTree } from '../core/parse'
import { stripdownTree } from '../core/stripdownTree'

function getBase(view: EditorView) {
  const rect = view.scrollDOM.getBoundingClientRect()
  const left =
    view.textDirection === Direction.LTR
      ? rect.left
      : rect.right - view.scrollDOM.clientWidth * view.scaleX
  return {
    left: left - view.scrollDOM.scrollLeft * view.scaleX,
    top: rect.top - view.scrollDOM.scrollTop * view.scaleY,
  }
}

const buildMarkers = (view: EditorView, tree: StripdownTree) => {
  const contentRect = view.contentDOM.getBoundingClientRect()
  const base = getBase(view)
  const headerPositions = tree.children
    .filter(isPageHeading)
    .map((node) => node.node.from)
    .filter((pos) => pos > view.viewport.from && pos < view.viewport.to)
  const positions = [view.viewport.from, ...headerPositions, view.viewport.to]
  const pageGap = 8

  const markers = positions
    .map((pos, i) => {
      const coords = view.coordsAtPos(pos)
      const nextPos = positions[i + 1]

      if (!coords || !nextPos) return undefined

      const top = coords.top
      const bottom = view.coordsAtPos(nextPos)?.top

      if (!bottom) return undefined

      return new RectangleMarker(
        'cm-page-background',
        contentRect.left - base.left,
        top - base.top - pageGap / 2,
        contentRect.width,
        bottom - top - pageGap / 2,
      )
    })
    .filter(Boolean)

  return markers
}

export const pageBackgroundLayer = () => {
  return [
    layer({
      above: false,
      update: () => false,
      markers: (view) => {
        const tree = view.plugin(stripdownTree)?.tree

        return tree ? buildMarkers(view, tree) : []
      },
    }),
  ]
}
