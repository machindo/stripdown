import { EditorView } from '@codemirror/view'
import { token } from 'styled-system/tokens'

export const baseTheme = EditorView.theme({
  '&': {
    height: '100%',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-scroller': {
    padding: '1ch 0.5ch 1ch 0',
    background: token('colors.gutter.bg'),
    fontFamily: token('fonts.mono'),
    scrollbarColor: `${token('colors.fg.subtle')} transparent`,
    justifyContent: 'center',
    overflowY: 'scroll',
  },
  '.cm-scroller::-webkit-scrollbar': {
    height: '2ch',
    width: '2ch',
    background: 'transparent',
  },
  '.cm-scroller::-webkit-scrollbar-thumb': {
    border: '0.55ch solid transparent',
    borderRadius: token('radii.xl'),
    backgroundColor: token('colors.gray.8'),
    backgroundClip: 'content-box',
  },
  '.cm-scroller::-webkit-scrollbar-thumb:hover': {
    borderWidth: '0.5ch',
    backgroundColor: token('colors.fg.subtle'),
  },
  '.cm-scroller::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '.cm-gutters': {
    border: 'none',
    background: token('colors.gutter.bg'),
  },
  '.cm-gutterElement': {
    paddingInline: token('spacing.2'),
  },
  '.cm-gutter:first-of-type .cm-activeLineGutter': {
    borderStartStartRadius: token('radii.md'),
    borderEndStartRadius: token('radii.md'),
  },
  '.cm-content': {
    maxWidth: '80ch',
    paddingBlock: '1ex',
  },
  '.cm-line': {
    paddingInline: '3ch',
  },
  '& ::selection': {
    background: 'none',
  },
  '& .cm-selectionBackground': {
    backgroundColor: token('colors.selection.bg.muted'),
    mixBlendMode: 'multiply',
  },
  '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground': {
    backgroundColor: token('colors.selection.bg'),
  },
  // stripdownHighlightStyle
  '.cm-stripdown-speaker': {
    fontWeight: token('fontWeights.semibold'),
  },
  '.cm-line:has(.cm-stripdown-dialogue)': {
    paddingInline: '7ch',
  },
  '.cm-stripdown-parenthetical': {
    fontStyle: 'italic',
    color: token('colors.fg.subtle'),
  },
  // pageBackgroundLayer
  '.cm-page-background': {
    backgroundColor: token('colors.bg.default'),
    borderRadius: token('radii.xs'),
    boxShadow: '0 1px 1px #00000011, 0 2px 2px #00000011, 0 4px 4px #00000011',
  },
  // wordCountGutter
  '.cm-wordCountGutter-marker': {
    textAlign: 'right',
    verticalAlign: 'middle',
    fontSize: token('fontSizes.xs'),
    color: token('colors.fg.subtle'),
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
    stroke: token('colors.fg.default'),
  },
  '.cm-pageIconWidget-icon_left > [key=left]': {
    fill: token('colors.fg.subtle'),
  },
  '.cm-pageIconWidget-icon_left > [key=right]': {
    stroke: token('colors.fg.subtle'),
    strokeDasharray: '1 3',
  },
  '.cm-pageIconWidget-icon_right > [key=left]': {
    stroke: token('colors.fg.subtle'),
    strokeDasharray: '1 3',
  },
  '.cm-pageIconWidget-icon_right > [key=right]': {
    fill: token('colors.fg.subtle'),
  },
  '.cm-pageIconWidget-icon_both > [key=left]': {
    fill: token('colors.fg.subtle'),
  },
  '.cm-pageIconWidget-icon_both > [key=right]': {
    fill: token('colors.fg.subtle'),
  },
  // pageSummaryDecorations
  '.cm-pageSummaryWidget': {
    fontStyle: 'italic',
    color: token('colors.fg.subtle'),
  },
})
