import { autocompletion, completionKeymap } from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import {
  defaultHighlightStyle,
  foldGutter,
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
  characterAutocompletion,
  characterListFacet,
  charactersFromMetadata,
  charactersFromSpeakers,
  frontmatterAsStripdownConfig,
  headingAutoCorrect,
  headingAutocompletionEN_US,
  headingFoldService,
  headingLinter,
  highlightStyle,
  pageBackgroundLayer,
  pageIconDecorations,
  pageSummaryDecorations,
  speakerAutocompletion,
  stripdownLanguageSupport,
  stripdownTree,
  wordCountGutter,
} from '@stripdown/codemirror'
import { RotateCcw } from 'lucide-solid'
import { Box, styled } from 'styled-system/jsx'

import { doc } from '@/examples/shadowland.ts'
import { baseTheme } from './baseTheme'

const createEditorView = () => {
  const editorView = new EditorView({
    state: EditorState.create({
      doc: localStorage.getItem('doc') ?? doc,
      extensions: [
        // Editing
        history(),
        EditorState.allowMultipleSelections.of(true),
        autocompletion({
          icons: false,
          maxRenderedOptions: 10,
          override: [
            characterAutocompletion,
            headingAutocompletionEN_US,
            speakerAutocompletion,
          ],
        }),
        // Presentation
        baseTheme,
        drawSelection(),
        EditorView.lineWrapping,
        foldGutter(),
        highlightSelectionMatches(),
        highlightSpecialChars(),
        pageBackgroundLayer(),
        pageIconDecorations,
        pageSummaryDecorations,
        scrollPastEnd(),
        wordCountGutter(),
        // Input handling
        characterListFacet.compute(['doc'], charactersFromMetadata),
        characterListFacet.compute(['doc'], charactersFromSpeakers),
        dropCursor(),
        headingAutoCorrect,
        keymap.of([
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
          ...lintKeymap,
        ]),
        EditorView.updateListener.of((update) => {
          if (!update.docChanged) return

          localStorage.setItem('doc', update.view.state.doc.toString())
        }),
        // Language
        frontmatterAsStripdownConfig(),
        headingFoldService,
        headingLinter,
        stripdownLanguageSupport,
        stripdownTree,
        syntaxHighlighting(defaultHighlightStyle),
        syntaxHighlighting(highlightStyle),
      ],
    }),
  })

  return editorView
}

export const Editor = styled((props: { className?: string }) => {
  const editorView = createEditorView()
  const reset = () => {
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: doc,
      },
    })
  }

  return (
    <Box pos="relative" {...props}>
      <styled.button
        _hover={{
          bg: 'gray.1',
        }}
        aspectRatio={1}
        bg="gray.2"
        border="solid 1px"
        borderColor="gray.7"
        borderRadius={4}
        left="1ex"
        onClick={reset}
        p={2}
        pos="absolute"
        title="Reset document"
        top="1ex"
        type="button"
        zIndex={1}
      >
        <RotateCcw size={16} />
      </styled.button>
      {editorView.dom}
    </Box>
  )
})
