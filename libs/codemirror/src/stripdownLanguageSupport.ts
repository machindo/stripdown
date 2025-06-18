import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { yamlFrontmatter } from '@codemirror/lang-yaml'

import { markdownConfig } from './core/markdownConfig'

export const stripdownLanguageSupport = yamlFrontmatter({
  content: markdown({
    base: markdownLanguage,
    extensions: [markdownConfig],
  }),
})
