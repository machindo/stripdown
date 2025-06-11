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
  pageBackgroundLayer,
  pageIconDecorations,
  pageSummaryDecorations,
  speakerAutocompletion,
  speakerDecorations,
  stripdownLanguageSupport,
  stripdownTree,
  wordCountGutter,
} from '@stripdown/codemirror'

import { theme } from './theme'

export const codemirrorExtension = Prec.lowest([
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
  speakerDecorations,
  wordCountGutter(),
  // Input handling
  characterListFacet.compute(['doc'], charactersFromMetadata),
  characterListFacet.compute(['doc'], charactersFromSpeakers),
  headingAutoCorrect,
  // Language
  frontmatterAsStripdownConfig(),
  headingFoldService,
  headingLinter,
  stripdownTree,
])
