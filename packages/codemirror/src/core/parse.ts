import { markdown } from '@codemirror/lang-markdown'
import { syntaxTree } from '@codemirror/language'
import type { EditorState } from '@codemirror/state'
import type { SyntaxNode } from '@lezer/common'

import { headingLevelProp, markdownConfig } from './markdownConfig'
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

export type StripdownTopNode = {
  type: 'Top'
  node: SyntaxNode
}

type Context = {
  headingNodes: StripdownNode[]
  headingNumbers: number[]
  speaker: StripdownNode | undefined
  top: StripdownTopNode
  wordCount: number
}

export type StripdownHeadingNode = {
  type: 'Heading'
  node: SyntaxNode
  scope: StripdownNode[]
  expectedProps: ExpectedNumberedHeadingProps | undefined
  parenthetical: StripdownParentheticalNode | undefined
  props: HeadingProps
  text: string
}

export type StripdownSpeakerNode = {
  type: 'Speaker'
  node: SyntaxNode
  scope: StripdownNode[]
  parenthetical: StripdownParentheticalNode | undefined
  props: SpeakerProps
  text: string
}

export type StripdownDialogueNode = {
  type: 'Dialogue'
  node: SyntaxNode
  scope: StripdownNode[]
  props: DialogueProps
  text: string
}

export type StripdownParentheticalNode = {
  type: 'Parenthetical'
  node: SyntaxNode
  text: string
}

export type StripdownNode =
  | StripdownTopNode
  | StripdownHeadingNode
  | StripdownSpeakerNode
  | StripdownDialogueNode
  | StripdownParentheticalNode

type StripdownNodeResult<T = StripdownNode> =
  | {
      value: T
      context: Context
    }
  | undefined

export type StripdownTree = {
  children: StripdownNode[]
}

const parseSyntaxTree =
  import.meta.env.PARSE_MODE === 'obsidian'
    ? (
        () => (state: EditorState) =>
          markdown({
            extensions: [markdownConfig],
          }).language.parser.parse(state.doc.toString())
      )()
    : syntaxTree

export const isPageHeading = (
  node: StripdownNode,
): node is StripdownHeadingNode => node.node.type.prop(headingLevelProp) === 2

export const isNumberedPageHeading = (
  node: StripdownNode,
): node is StripdownHeadingNode & { props: { isNumbered: true } } =>
  node.type === 'Heading' &&
  node.node.type.prop(headingLevelProp) === 2 &&
  node.props.isNumbered

export const isNumberedPanelHeading = (
  node: StripdownNode,
): node is StripdownHeadingNode & { props: { isNumbered: true } } =>
  node.type === 'Heading' &&
  node.node.type.prop(headingLevelProp) === 3 &&
  node.props.isNumbered

export const isFixableHeading = (
  node: StripdownNode,
): node is StripdownHeadingNode & {
  props: { isNumbered: true }
  expectedProps: ExpectedNumberedHeadingProps
} => node.type === 'Heading' && node.props.isNumbered && !!node.expectedProps

export const isSpeaker = (node: StripdownNode): node is StripdownSpeakerNode =>
  node.type === 'Speaker'

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
  const level = node.node.type.prop(headingLevelProp)

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
    parenthetical:
      (node.nextSibling &&
        createParentheticalNode({
          state,
          node: node.nextSibling,
          context,
        })?.value) ??
      undefined,
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
    parenthetical:
      (node.nextSibling &&
        createParentheticalNode({
          state,
          node: node.nextSibling,
          context,
        })?.value) ??
      undefined,
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

const createParentheticalNode = ({
  state,
  node,
  context,
}: {
  state: EditorState
  node: SyntaxNode
  context: Context
}): StripdownNodeResult<StripdownParentheticalNode> => {
  if (node.name !== nodeTypes.parenthetical.name) return undefined

  return {
    value: {
      type: 'Parenthetical',
      node,
      text: state.sliceDoc(node.from, node.to),
    },
    context,
  }
}

export const parse = function* (
  state: EditorState,
): Generator<StripdownNode, void, unknown> {
  const tree = parseSyntaxTree(state)
  const cursor = tree.cursor()
  let context: Context = {
    headingNodes: [],
    headingNumbers: [],
    speaker: undefined,
    top: {
      type: 'Top',
      node: tree.topNode,
    },
    wordCount: 0,
  }

  yield context.top

  while (cursor.next(cursor.type.isTop)) {
    const result =
      createHeadingNode({ state, node: cursor.node, context }) ??
      createSpeakerNode({ state, node: cursor.node, context }) ??
      createDialogueNode({ state, node: cursor.node, context }) ??
      createParentheticalNode({ state, node: cursor.node, context })

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

  const children = [...parse(state)]
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
