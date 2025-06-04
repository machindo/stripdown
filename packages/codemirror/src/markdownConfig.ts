import { NodeProp } from '@lezer/common'
import type { Element, MarkdownConfig } from '@lezer/markdown'

import { nodeTypes, parentheticalPattern, speakerPattern } from './nodes'

export const headingLevelProp = new NodeProp<number>()

export const markdownConfig: MarkdownConfig = {
  defineNodes: Object.values(nodeTypes),
  parseBlock: [
    {
      name: 'Speaker',
      parse: (cx, line) => {
        if (!speakerPattern.test(line.text)) return false
        if (cx.peekLine() === '') return false

        const start = cx.lineStart

        cx.nextLine()
        cx.addElement(cx.elt(nodeTypes.speaker.name, start, cx.prevLineEnd()))

        const dialogueTextStart = cx.lineStart
        const lines: Element[] = []

        while (line.text !== '') {
          lines.push(...cx.parser.parseInline(line.text, cx.lineStart))

          if (!cx.nextLine()) break
        }

        cx.addElement(
          cx.elt(
            nodeTypes.dialogue.name,
            dialogueTextStart,
            cx.prevLineEnd(),
            lines,
          ),
        )

        return true
      },
    },
    {
      name: 'Parenthetical',
      parse: (cx, line) => {
        if (!parentheticalPattern.test(line.text)) return false

        const start = cx.lineStart

        cx.nextLine()
        cx.addElement(
          cx.elt(nodeTypes.parenthetical.name, start, cx.prevLineEnd()),
        )

        return true
      },
    },
  ],
  props: [
    headingLevelProp.add({
      ATXHeading1: 1,
      ATXHeading2: 2,
      ATXHeading3: 3,
      ATXHeading4: 4,
      ATXHeading5: 5,
      ATXHeading6: 6,
      SetextHeading1: 1,
      SetextHeading2: 2,
    }),
  ],
} as const
