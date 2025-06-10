import type {
  BlockContext,
  Element,
  Line,
  MarkdownConfig,
} from '@lezer/markdown'

import { nodeTypes, parentheticalPattern, speakerPattern } from './nodes'

const parseParenthetical = (cx: BlockContext, line: Line) => {
  if (!parentheticalPattern.test(line.text)) return false

  const start = cx.lineStart

  cx.nextLine()
  cx.addElement(cx.elt(nodeTypes.parenthetical.name, start, cx.prevLineEnd()))

  return true
}

const parseSpeakerDialogue = (cx: BlockContext, line: Line) => {
  if (!speakerPattern.test(line.text)) return false
  if (cx.peekLine() === '') return false

  const start = cx.lineStart

  cx.nextLine()
  cx.addElement(cx.elt(nodeTypes.speaker.name, start, cx.prevLineEnd()))

  // Attempt to parse the line after speaker as parenthetical
  parseParenthetical(cx, line)

  const dialogueTextStart = cx.lineStart
  const lines: Element[] = []

  while (line.text !== '') {
    lines.push(...cx.parser.parseInline(line.text, cx.lineStart))

    if (!cx.nextLine()) break
  }

  cx.addElement(
    cx.elt(nodeTypes.dialogue.name, dialogueTextStart, cx.prevLineEnd(), lines),
  )

  return true
}

export const markdownConfig: MarkdownConfig = {
  defineNodes: Object.values(nodeTypes),
  parseBlock: [
    {
      name: 'SpeakerDialogue',
      parse: parseSpeakerDialogue,
    },
    {
      name: 'Parenthetical',
      parse: parseParenthetical,
    },
  ],
} as const
