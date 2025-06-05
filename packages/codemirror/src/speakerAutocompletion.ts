import type {
  CompletionContext,
  CompletionSource,
} from '@codemirror/autocomplete'

import { isSpeaker, parseStripdownTree } from './parse'

const maxOptions = 5

const findPreviousSpeakers = (context: CompletionContext, skip: number) => {
  const tree = parseStripdownTree(context.state)

  const speakers = tree.children
    .filter(isSpeaker)
    .filter((node) => node.node.from < context.pos)
    .map((speaker) => speaker.props.name)
    .toReversed()

  const uniqueSpeakers = [...new Set(speakers)].slice(skip, skip + maxOptions)

  return uniqueSpeakers
}

const speakerOptions = (context: CompletionContext, skip = 0) => {
  const speakers = findPreviousSpeakers(context, skip)

  return [...speakers.values()].map((speaker) => ({
    label: `${speaker}:`,
  }))
}

export const speakerAutocompletion: CompletionSource = (context) => {
  if (context.explicit) {
    return {
      from: context.pos,
      options: speakerOptions(context),
    }
  }

  const match = context.matchBefore(/^:+/)

  return match
    ? {
        filter: false,
        from: match.from,
        options: speakerOptions(context, match.text.length - 1),
      }
    : null
}
