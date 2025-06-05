import {
  type Extension,
  type RangeSet,
  RangeSetBuilder,
} from '@codemirror/state'
import {
  type EditorView,
  GutterMarker,
  gutter,
  type PluginValue,
  ViewPlugin,
} from '@codemirror/view'

import { h } from '../core/h'
import { getWordCount, inRanges } from '../core/parse'
import { stripdownTree } from '../core/stripdownTree'

type WordCountGutterMarkerOptions = {
  wordCount: number
}

class WordCountGutterMarker extends GutterMarker {
  options: WordCountGutterMarkerOptions

  constructor(options: WordCountGutterMarkerOptions) {
    super()
    this.options = options
  }

  toDOM() {
    return h(
      'div',
      {
        class: 'cm-wordCountGutter-marker',
        title: `Word count: ${this.options.wordCount}`,
      },
      [this.options.wordCount.toString(10)],
    )
  }
}

const buildMarkers = (view: EditorView) => {
  const builder = new RangeSetBuilder<GutterMarker>()
  const tree = view.plugin(stripdownTree)?.tree

  if (!tree) return builder.finish()

  inRanges(tree, view.visibleRanges)
    .filter((node) => node.type === 'Heading' || node.type === 'Speaker')
    .forEach((node) => {
      builder.add(
        node.node.from,
        node.node.from,
        new WordCountGutterMarker({ wordCount: getWordCount(node) }),
      )
    })

  return builder.finish()
}

export const wordCountGutter = (): Extension => {
  const markers = ViewPlugin.define((view) => {
    const value = {
      markers: buildMarkers(view),
      update: (update) => {
        if (update.docChanged || update.viewportChanged) {
          value.markers = buildMarkers(update.view)
        }
      },
    } satisfies PluginValue & { markers: RangeSet<GutterMarker> }

    return value
  })

  return [
    markers,
    gutter({
      class: 'cm-wordCountGutter',
      markers: (view) => view.plugin(markers)?.markers ?? [],
    }),
  ]
}
