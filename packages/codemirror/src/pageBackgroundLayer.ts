import { type EditorView, layer, RectangleMarker } from '@codemirror/view'

import { inRanges, isPageHeading, type StripdownTree } from './parse'
import { stripdownTree } from './stripdownTree'

const pageGutter = 8

const buildMarkers = (view: EditorView, tree: StripdownTree) => {
  const parentDomRect = view.dom.getBoundingClientRect()
  const domRect = view.contentDOM.getBoundingClientRect()
  const headerCoords = inRanges(tree, view.visibleRanges)
    .filter(isPageHeading)
    .map((node) => node.node.from)
    .map((pos) => view.coordsAtPos(pos))
    .filter(Boolean)
  const topOffset = view.documentPadding.top - view.documentTop
  const bottom = (view.coordsAtPos(view.state.doc.length)?.bottom ?? 0) + 32

  return [
    new RectangleMarker(
      'cm-page-background',
      domRect.left - parentDomRect.left,
      view.documentPadding.top,
      domRect.width,
      headerCoords[0]
        ? headerCoords[0].top + topOffset - pageGutter
        : bottom + pageGutter - view.documentTop,
    ),
    ...headerCoords.map((coords, i) => {
      const nextCoords = headerCoords[i + 1]

      return new RectangleMarker(
        'cm-page-background',
        domRect.left - parentDomRect.left,
        coords.top + topOffset + pageGutter / 2,
        domRect.width,
        nextCoords
          ? nextCoords.top - coords.top - pageGutter / 2
          : bottom + pageGutter / 2 - coords.top,
      )
    }),
  ]
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
