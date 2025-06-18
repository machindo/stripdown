import type { MarkdownPostProcessor } from 'obsidian'

import { parseText } from '../../../libs/codemirror/src'
import type StripdownPlugin from './main'

export const markdownPostProcessor =
  (plugin: StripdownPlugin): MarkdownPostProcessor =>
  (element) => {
    if (!plugin.isEnabled()) return

    const pageHeadings = element.findAll('h2')

    for (const heading of pageHeadings.slice(1)) {
      heading.addClass('reading-stripdown-page-heading')
    }

    const paragraphs = element.findAll('p')

    for (const paragraph of paragraphs) {
      const text = paragraph.getText()

      const nodes = [...parseText(text)].filter((node) => node.type !== 'Top')

      if (nodes.length) {
        paragraph.empty()

        for (const node of nodes) {
          const div = paragraph.createDiv()

          div.setText(node.text)

          switch (node.type) {
            case 'Dialogue':
              div.addClass('reading-stripdown-dialogue')
              break
            case 'Parenthetical':
              div.addClass('reading-stripdown-parenthetical')
              break
            case 'Speaker':
              div.addClass('reading-stripdown-speaker')
              break
          }
        }
      }
    }
  }
