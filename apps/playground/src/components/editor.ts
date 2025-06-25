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
import { EditorState, type Extension } from '@codemirror/state'
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

import { baseTheme } from './baseTheme'

export const createEditorView = (doc: string, extension?: Extension) =>
  new EditorView({
    state: EditorState.create({
      doc,
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
        // Language
        frontmatterAsStripdownConfig(),
        headingFoldService,
        headingLinter,
        stripdownLanguageSupport,
        stripdownTree,
        syntaxHighlighting(defaultHighlightStyle),
        syntaxHighlighting(highlightStyle),
        // Optional
        extension ?? [],
      ],
    }),
  })
