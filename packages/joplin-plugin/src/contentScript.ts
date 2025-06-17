import { syntaxHighlighting } from '@codemirror/language'
import { Compartment, type EditorState, Facet, Prec } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import {
  characterAutocompletion,
  characterListFacet,
  charactersFromMetadata,
  charactersFromSpeakers,
  frontmatterAs,
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
import { type } from 'arktype'

import { theme } from './theme.js'

const compartment = new Compartment()

const Frontmatter = type({ 'stripdown?': 'boolean' })

const frontmatterFacet = Facet.define<
  typeof Frontmatter.infer | undefined,
  typeof Frontmatter.infer | undefined
>({
  combine: (values) => values[values.length - 1],
})

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

const toggleStripdown = ({
  docChanged,
  state,
  view,
}: {
  docChanged: boolean
  state: EditorState
  view: EditorView
}) => {
  if (!docChanged) return

  const compartmentValue = compartment.get(state)

  const isEnabled =
    Array.isArray(compartmentValue) && compartmentValue.length > 0
  const shouldBeEnabled = !!state.facet(frontmatterFacet)?.stripdown

  if (isEnabled && !shouldBeEnabled) {
    view.dispatch({
      effects: compartment.reconfigure([]),
    })
  } else if (shouldBeEnabled && !isEnabled) {
    view.dispatch({
      effects: compartment.reconfigure([codemirrorExtension]),
    })
  }
}

exports.default = (_context: {
  contentScriptId: string
  postMessage: unknown
}): MarkdownEditorContentScriptModule => ({
  plugin: (editorControl) => {
    editorControl.addExtension([
      compartment.of([]),
      frontmatterFacet.compute(['doc'], frontmatterAs(Frontmatter)),
      EditorView.updateListener.of(toggleStripdown),
    ])

    toggleStripdown({
      docChanged: true,
      state: editorControl.editor.state,
      view: editorControl.editor,
    })
  },
})
