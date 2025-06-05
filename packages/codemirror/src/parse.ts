import { syntaxTree } from '@codemirror/language'
import type { EditorState } from '@codemirror/state'
import type { SyntaxNode } from '@lezer/common'

import { headingLevelProp } from './markdownConfig'
import {
  type DialogueProps,
  type ExpectedNumberedHeadingProps,
  type HeadingProps,
  nodeTypes,
  parseDialogue,
  parseNumberedHeading,
  parseSpeaker,
  type SpeakerProps,
  validateNumberedHeadingProps,
} from './nodes'

type Context = {
  headingNodes: StripdownNode[]
  headingNumbers: number[]
  speaker: StripdownNode | undefined
  top: { type: 'Top' }
  wordCount: number
}

export type StripdownTopNode = {
  type: 'Top'
}

export type StripdownHeadingNode = {
  type: 'Heading'
  node: SyntaxNode
  scope: StripdownNode[]
  expectedProps: ExpectedNumberedHeadingProps | undefined
  props: HeadingProps
  text: string
}

export type StripdownSpeakerNode = {
  type: 'Speaker'
  node: SyntaxNode
  scope: StripdownNode[]
  text: string
  props: SpeakerProps
}

export type StripdownDialogueNode = {
  type: 'Dialogue'
  node: SyntaxNode
  scope: StripdownNode[]
  text: string
  props: DialogueProps
}

export type StripdownNode =
  | StripdownTopNode
  | StripdownHeadingNode
  | StripdownSpeakerNode
  | StripdownDialogueNode

type StripdownNodeResult =
  | {
      value: StripdownNode
      context: Context
    }
  | undefined

export type StripdownTree = {
  children: StripdownNode[]
}

export const isPageHeading = (
  node: StripdownNode,
): node is StripdownHeadingNode =>
  node.type === 'Heading' && node.node.type.prop(headingLevelProp) === 2

const createContext = (): Context => ({
  headingNodes: [],
  headingNumbers: [],
  speaker: undefined,
  top: { type: 'Top' },
  wordCount: 0,
})

const wordCounts = new WeakMap<StripdownNode, number>()

const createHeadingNode = ({
  state,
  node,
  context,
}: {
  state: EditorState
  node: SyntaxNode
  context: Context
}): StripdownNodeResult => {
  const level = node.type.prop(headingLevelProp)

  if (!level) return undefined

  const text = state.sliceDoc(node.from, node.to)
  const expectedStart = (context.headingNumbers[level - 1] ?? 0) + 1
  const props = parseNumberedHeading(text)
  const expectedProps = validateNumberedHeadingProps(props, expectedStart)
  const scope = context.headingNodes.slice(0, level - 1)
  const value = {
    type: 'Heading',
    node,
    scope,
    text,
    props,
    expectedProps,
  } satisfies StripdownNode

  return {
    value,
    context: {
      ...context,
      headingNodes: [...scope, value],
      headingNumbers: [
        ...context.headingNumbers.slice(0, level - 1),
        props.isNumbered
          ? (expectedProps?.end ?? props.implicitEnd)
          : (context.headingNumbers[level - 1] ?? 0),
      ],
      speaker: undefined,
      wordCount: context.wordCount,
    },
  }
}

const createSpeakerNode = ({
  state,
  node,
  context,
}: {
  state: EditorState
  node: SyntaxNode
  context: Context
}): StripdownNodeResult => {
  if (node.name !== nodeTypes.speaker.name) return undefined

  const text = state.sliceDoc(node.from, node.to)
  const value = {
    type: 'Speaker',
    node,
    scope: context.headingNodes,
    text,
    props: parseSpeaker(text),
  } satisfies StripdownNode

  return {
    value,
    context: {
      ...context,
      speaker: value,
    },
  }
}

const createDialogueNode = ({
  state,
  node,
  context,
}: {
  state: EditorState
  node: SyntaxNode
  context: Context
}): StripdownNodeResult => {
  if (node.name !== nodeTypes.dialogue.name) return undefined

  const text = state.sliceDoc(node.from, node.to)
  const props = parseDialogue(text)
  const value = {
    type: 'Dialogue',
    node: node.node,
    scope: [...context.headingNodes, context.speaker].filter(Boolean),
    text,
    props,
  } satisfies StripdownNode

  wordCounts.set(value, props.wordCount)
  wordCounts.set(context.top, context.wordCount + props.wordCount)
  value.scope.forEach((node) => {
    wordCounts.set(node, (wordCounts.get(node) ?? 0) + props.wordCount)
  })

  return {
    value,
    context: {
      ...context,
      speaker: undefined,
      wordCount: context.wordCount + props.wordCount,
    },
  }
}

export const parse = function* (
  state: EditorState,
): Generator<StripdownNode, void, unknown> {
  const tree = syntaxTree(state)
  const cursor = tree.cursor()
  let context = createContext()

  yield context.top

  while (cursor.next(cursor.type.isTop)) {
    const result =
      createHeadingNode({ state, node: cursor.node, context }) ??
      createSpeakerNode({ state, node: cursor.node, context }) ??
      createDialogueNode({ state, node: cursor.node, context })

    if (result) {
      context = result.context

      yield result.value
    }
  }
}

export const getWordCount = (node: StripdownNode) => {
  return wordCounts.get(node) ?? 0
}

const treeCache = new WeakMap<EditorState, StripdownTree>()

export const parseStripdownTree = (state: EditorState): StripdownTree => {
  const cachedTree = treeCache.get(state)

  if (cachedTree) return cachedTree

  const children = parse(state).toArray()
  const tree = { children }

  treeCache.set(state, tree)

  return tree
}

export const inRanges = (
  tree: StripdownTree,
  ranges: readonly { from: number; to: number }[],
) =>
  tree.children.filter(
    (node) =>
      node.type !== 'Top' &&
      ranges.some(
        (range) => range.from <= node.node.to && range.to >= node.node.from,
      ),
  )
