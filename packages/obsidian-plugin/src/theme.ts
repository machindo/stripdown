import { EditorView } from '@codemirror/view'

const colorFgDefault = '#202020'
const colorFgSubtle = '#666666'
const colorBgDefault = '#fcfcfc'

export const theme = EditorView.theme({
  // stripdownHighlightStyle
  '.cm-stripdown-speaker': {
    fontWeight: 'bold',
  },
  '.cm-line:has(.cm-stripdown-dialogue)': {
    paddingInline: '7ch',
  },
  '.cm-stripdown-parenthetical': {
    fontStyle: 'italic',
    color: colorFgSubtle,
  },
  // pageBackgroundLayer
  '.cm-page-background': {
    backgroundColor: colorBgDefault,
    borderRadius: '4px',
    boxShadow: '0 1px 1px #00000011, 0 2px 2px #00000011, 0 4px 4px #00000011',
  },
  // wordCountGutter
  '.cm-wordCountGutter-marker': {
    textAlign: 'right',
    verticalAlign: 'middle',
    fontSize: '12px',
    color: colorFgSubtle,
  },
  // pageIconDecorations
  '.cm-pageIconWidget-container': {
    position: 'absolute',
    insetInlineEnd: '2ch',
    pointerEvents: 'none',
  },
  '.cm-pageIconWidget-row': {
    display: 'flex',
    placeContent: 'center',
  },
  '.cm-pageIconWidget-icon': {
    stroke: colorFgDefault,
  },
  '.cm-pageIconWidget-icon_left > [key=left]': {
    fill: colorFgSubtle,
  },
  '.cm-pageIconWidget-icon_left > [key=right]': {
    stroke: colorFgSubtle,
    strokeDasharray: '1 3',
  },
  '.cm-pageIconWidget-icon_right > [key=left]': {
    stroke: colorFgSubtle,
    strokeDasharray: '1 3',
  },
  '.cm-pageIconWidget-icon_right > [key=right]': {
    fill: colorFgSubtle,
  },
  '.cm-pageIconWidget-icon_both > [key=left]': {
    fill: colorFgSubtle,
  },
  '.cm-pageIconWidget-icon_both > [key=right]': {
    fill: colorFgSubtle,
  },
  // pageSummaryDecorations
  '.cm-pageSummaryWidget': {
    fontStyle: 'italic',
    color: colorFgSubtle,
  },
})
