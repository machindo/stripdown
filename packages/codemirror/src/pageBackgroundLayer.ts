import {
  type EditorView,
  layer,
  type PluginValue,
  RectangleMarker,
  ViewPlugin,
} from '@codemirror/view'

import { isPageHeading, stripdownTree } from './parse'

const pageGutter = 8

const getPageHeadingPositions = (view: EditorView) =>
  stripdownTree(view.state)
    .children.filter(isPageHeading)
    .map((node) => node.node.from)
    .filter((pos) =>
      view.visibleRanges.some((range) => pos >= range.from && pos <= range.to),
    )

const buildMarkers = (view: EditorView, pageHeadingPositions: number[]) => {
  const parentDomRect = view.dom.getBoundingClientRect()
  const domRect = view.contentDOM.getBoundingClientRect()
  const headerCoords = pageHeadingPositions
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
  const pageHeadingPositions = ViewPlugin.define((view) => {
    const value = {
      pageHeadingPositions: getPageHeadingPositions(view),
      update: (update) => {
        if (update.docChanged || update.viewportChanged) {
          value.pageHeadingPositions = getPageHeadingPositions(update.view)
        }
      },
    } satisfies PluginValue & { pageHeadingPositions: number[] }

    return value
  })

  return [
    pageHeadingPositions,
    layer({
      above: false,
      update: () => false,
      markers: (view) =>
        buildMarkers(
          view,
          view.plugin(pageHeadingPositions)?.pageHeadingPositions ?? [],
        ),
    }),
  ]
}
