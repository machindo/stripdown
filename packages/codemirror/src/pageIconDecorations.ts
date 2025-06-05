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
import {
  createElement,
  Ellipsis,
  type IconNode,
  MoveLeft,
  MoveRight,
  type SVGProps,
} from 'lucide'

import { cx } from './cx'
import { h } from './h'
import { metadataFacet, parseOptional } from './metadataFacet'
import { inRanges, isNumberedPageHeading } from './parse'
import { StripdownConfig } from './StripdownConfig'
import { stripdownTree } from './stripdownTree'

type PageSideOptions = {
  pageNumber: number
  pageTurnDirection: 'ltr' | 'rtl'
  pageSpan: number
  oddSide: 'left' | 'right'
}

export const ltrPageOptions = {
  pageTurnDirection: 'ltr',
  oddSide: 'right',
} as const satisfies StripdownConfig

export const rtlPageOptions = {
  pageTurnDirection: 'rtl',
  oddSide: 'left',
} as const satisfies StripdownConfig

const iconNode: IconNode = [
  [
    'path',
    {
      d: 'M3,18 a1,1,0,0,1,-1,-1 V4 a1,1,0,0,1,1,-1 h5 a4,4,0,0,1,4,4 v14 a3,3,0,0,0,-3,-3 Z',
      key: 'left',
    },
  ],
  [
    'path',
    {
      d: 'M12,7 a4,4,0,0,1,4,-4 h5 a1,1,0,0,1,1,1 v13 a1,1,0,0,1,-1,1 h-6 a3,3,0,0,0,-3,3 Z',
      key: 'right',
    },
  ],
  ['path', { d: 'M12 7v14', key: 'gutter' }],
]

const chunkPages = ({
  pageTurnDirection,
  oddSide,
  pageNumber,
  pageSpan,
}: {
  pageTurnDirection: 'ltr' | 'rtl'
  oddSide: 'left' | 'right'
  pageNumber: number
  pageSpan: number
}) => {
  const isParityReversed =
    (pageTurnDirection === 'ltr' && oddSide === 'left') ||
    (pageTurnDirection === 'rtl' && oddSide === 'right')
  const spreads: [number | undefined, number | undefined][] = []
  const parity =
    oddSide === 'left'
      ? (num: number) => +(num % 2 === 0)
      : (num: number) => +(num % 2 === 1)

  for (let i = pageNumber; i < pageNumber + pageSpan; i++) {
    const spreadIndex = isParityReversed ? Math.ceil(i / 2) : Math.floor(i / 2)

    spreads[spreadIndex] ??= [undefined, undefined]
    spreads[spreadIndex][parity(i)] = i
  }

  return (
    pageTurnDirection === 'rtl' ? [...spreads].reverse() : spreads
  ).filter(Boolean)
}

const spreadFill = match
  .case(['number', 'undefined'], () => 'cm-pageIconWidget-icon_left' as const)
  .case(['number', 'number'], () => 'cm-pageIconWidget-icon_both' as const)
  .case(['undefined', 'number'], () => 'cm-pageIconWidget-icon_right' as const)
  .default('assert')

const PageSideIcon = (props?: SVGProps) => createElement(iconNode, props)

export const createPageSideIconWidget = (options: PageSideOptions) => {
  return new (class extends WidgetType {
    toDOM() {
      const spreads = chunkPages(options)

      return h('div', { class: 'cm-pageIconWidget-container' }, [
        h('div', { class: 'cm-pageIconWidget-row' }, [
          PageSideIcon({
            class: cx('cm-pageIconWidget-icon', spreadFill(spreads[0])),
          }),
          spreads.length === 3 &&
            PageSideIcon({
              class: 'cm-pageIconWidget-icon cm-pageIconWidget-icon_both',
            }),
          spreads.length > 3 && createElement(Ellipsis),
          spreads.length > 1 &&
            PageSideIcon({
              class: cx(
                'cm-pageIconWidget-icon',
                spreadFill(spreads[spreads.length - 1]),
              ),
            }),
        ]),
        h('div', { class: 'cm-pageIconWidget-row' }, [
          createElement(
            options.pageTurnDirection === 'ltr' ? MoveRight : MoveLeft,
          ),
        ]),
      ])
    }
  })()
}

const createPageIconDecorations = (view: EditorView) => {
  const pageOptions = {
    ...ltrPageOptions,
    ...parseOptional(StripdownConfig)(view.state.facet(metadataFacet)),
  }
  const builder = new RangeSetBuilder<Decoration>()
  const tree = view.plugin(stripdownTree)?.tree

  if (!tree) return builder.finish()

  const pageHeadingNodes = inRanges(tree, view.visibleRanges).filter(
    isNumberedPageHeading,
  )

  for (const {
    node: { from },
    props: { start, span },
  } of pageHeadingNodes) {
    builder.add(
      from,
      from,
      Decoration.widget({
        side: -1,
        widget: createPageSideIconWidget({
          pageNumber: start,
          pageSpan: span,
          pageTurnDirection: pageOptions.pageTurnDirection,
          oddSide: pageOptions.oddSide,
        }),
      }),
    )
  }

  return builder.finish()
}

export const pageIconDecorations = ViewPlugin.define(
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
