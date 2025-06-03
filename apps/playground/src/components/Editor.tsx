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
import { parse, stripdownLanguageSupport } from '@stripdown/codemirror'
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
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        stripdownLanguageSupport,
        // Debug
        EditorView.updateListener.of((update) => {
          if (!update.docChanged) return

          console.time('parse')

          let validCount = 0
          let headingCount = 0
          let invalidCount = 0
          let speakerCount = 0
          let dialogueCount = 0
          let wordCount = 0

          for (const node of parse(update.view.state)) {
            switch (node.type) {
              case 'Heading':
                headingCount++
                if (node.props.isValid) {
                  validCount++
                } else {
                  invalidCount++
                }
                break
              case 'Speaker':
                speakerCount++
                break
              case 'Dialogue':
                dialogueCount++
                wordCount += node.props.wordCount
                break
            }
          }

          console.timeEnd('parse')
          console.log({
            headingCount,
            validCount,
            invalidCount,
            speakerCount,
            dialogueCount,
            wordCount,
          })
        }),
      ],
    }),
  })

  return <div {...props}>{editorView.dom}</div>
})
