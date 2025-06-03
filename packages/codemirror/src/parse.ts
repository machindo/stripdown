import { syntaxTree } from '@codemirror/language'
import type { EditorState } from '@codemirror/state'

import {
  type DialogueProps,
  type HeadingProps,
  headingLevels,
  nodeTypes,
  parseDialogue,
  parseNumberedHeading,
  parseSpeaker,
  type SpeakerProps,
} from './nodes'

type StripdownNode =
  | {
      type: 'Heading'
      text: string
      from: number
      to: number
      props: HeadingProps
    }
  | {
      type: 'Speaker'
      text: string
      from: number
      to: number
      props: SpeakerProps
    }
  | {
      type: 'Dialogue'
      text: string
      from: number
      to: number
      props: DialogueProps
    }

const createContext = () => ({
  headingNumberState: Array.from({ length: 6 }, () => 0),
})

export const parse = function* (
  state: EditorState,
  from = 0,
): Generator<StripdownNode, void, unknown> {
  const context = createContext()
  const tree = syntaxTree(state)
  const cursor = tree.cursorAt(from)

  while (cursor.next(cursor.node.type.isTop || cursor.node.type.is('Block'))) {
    const level = headingLevels[cursor.name]

    if (level) {
      const text = state.sliceDoc(cursor.from, cursor.to)
      const expectedStart = (context.headingNumberState[level - 1] ?? 0) + 1
      const props = parseNumberedHeading(text, { level, expectedStart })

      context.headingNumberState.fill(0, level)

      if (props.isNumbered) {
        context.headingNumberState[level - 1] = props.isValid
          ? props.start + props.extra
          : expectedStart + props.extra
      }

      yield {
        type: 'Heading',
        text,
        from: cursor.from,
        to: cursor.to,
        props,
      }

      continue
    }

    switch (cursor.name) {
      case nodeTypes.speaker.name: {
        const text = state.sliceDoc(cursor.from, cursor.to)

        yield {
          type: 'Speaker',
          text,
          from: cursor.from,
          to: cursor.to,
          props: parseSpeaker(text),
        }

        break
      }
      case nodeTypes.dialogue.name: {
        const text = state.sliceDoc(cursor.from, cursor.to)

        yield {
          type: 'Dialogue',
          text,
          from: cursor.from,
          to: cursor.to,
          props: parseDialogue(text),
        }
      }
    }
  }
}
