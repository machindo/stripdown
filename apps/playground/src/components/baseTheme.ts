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
    padding: '1ch 0.5ch 1ch 1ch',
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
    paddingInline: '1ch',
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
  '.cm-line:has(.superscript-dialogue)': {
    paddingInline: '7ch',
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
})
