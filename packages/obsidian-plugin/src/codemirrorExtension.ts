import { syntaxHighlighting } from '@codemirror/language'
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

import { theme } from './theme'

export const codemirrorExtension = [
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
]
