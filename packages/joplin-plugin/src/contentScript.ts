import { syntaxHighlighting } from '@codemirror/language'
import { Prec } from '@codemirror/state'
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
import type { MarkdownEditorContentScriptModule } from 'api/types'

import { theme } from './theme.js'

const codemirrorExtension = Prec.lowest([
  // Editing
  stripdownLanguageSupport.language.data.of({
    autocomplete: [
      characterAutocompletion,
      headingAutocompletionEN_US,
      speakerAutocompletion,
    ],
  }),
  // Presentation
  theme,
  pageBackgroundLayer(),
  pageIconDecorations,
  pageSummaryDecorations,
  // speakerDecorations,
  wordCountGutter(),
  // Input handling
  characterListFacet.compute(['doc'], charactersFromMetadata),
  characterListFacet.compute(['doc'], charactersFromSpeakers),
  headingAutoCorrect,
  // Language
  frontmatterAsStripdownConfig(),
  headingFoldService,
  headingLinter,
  stripdownLanguageSupport,
  stripdownTree,
  syntaxHighlighting(highlightStyle),
])

exports.default = (_context: {
  contentScriptId: string
  postMessage: unknown
}): MarkdownEditorContentScriptModule => ({
  plugin: (editorControl) => {
    editorControl.addExtension(codemirrorExtension)
  },
})
