import { autocompletion, completionKeymap } from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import {
  defaultHighlightStyle,
  foldKeymap,
  syntaxHighlighting,
} from '@codemirror/language'
import { lintKeymap } from '@codemirror/lint'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { EditorState } from '@codemirror/state'
import {
  drawSelection,
  dropCursor,
  EditorView,
  highlightSpecialChars,
  keymap,
  scrollPastEnd,
} from '@codemirror/view'
import {
  pageBackgroundLayer,
  stripdownLanguageSupport,
  stripdownTree,
  wordCountGutter,
} from '@stripdown/codemirror'
import { styled } from 'styled-system/jsx'

import { baseTheme } from './baseTheme'

export const Editor = styled((props: { className?: string }) => {
  const editorView = new EditorView({
    state: EditorState.create({
      extensions: [
        // Editing
        history(),
        EditorState.allowMultipleSelections.of(true),
        autocompletion(),
        // Presentation
        highlightSpecialChars(),
        drawSelection(),
        highlightSelectionMatches(),
        EditorView.lineWrapping,
        baseTheme,
        scrollPastEnd(),
        pageBackgroundLayer(),
        wordCountGutter(),
        // Input handling
        dropCursor(),
        keymap.of([
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
          ...lintKeymap,
        ]),
        // Language
        stripdownTree,
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        stripdownLanguageSupport,
      ],
    }),
  })

  return <div {...props}>{editorView.dom}</div>
})
