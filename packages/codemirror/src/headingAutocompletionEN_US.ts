import type {
  Completion,
  CompletionContext,
  CompletionSource,
} from '@codemirror/autocomplete'

import {
  isNumberedPageHeading,
  isNumberedPanelHeading,
  isPageHeading,
  parseStripdownTree,
} from './parse'

const pageHeadingOption = (context: CompletionContext): Completion => {
  const tree = parseStripdownTree(context.state)

  const lastEnd =
    tree.children
      .filter(isNumberedPageHeading)
      .findLast((heading) => heading.node.from < context.pos)?.props
      .implicitEnd ?? 0
  const num = lastEnd + 1

  return {
    displayLabel: `Page ${num}`,
    label: `## Page ${num}`,
  }
}

const panelHeadingOption = (context: CompletionContext): Completion => {
  const tree = parseStripdownTree(context.state)

  const lastHeading = tree.children
    .filter((child) => isPageHeading(child) || isNumberedPanelHeading(child))
    .findLast((heading) => heading.node.from < context.pos)

  const num =
    lastHeading && isNumberedPanelHeading(lastHeading)
      ? lastHeading.props.implicitEnd + 1
      : 1

  return {
    displayLabel: `Panel ${num}`,
    label: `### Panel ${num}`,
    boost: 1,
  }
}

export const headingOptions = (context: CompletionContext, text = '') =>
  [
    'page'.startsWith(text) && pageHeadingOption(context),
    'panel'.startsWith(text) && panelHeadingOption(context),
  ].filter(Boolean)

export const headingAutocompletionEN_US: CompletionSource = (context) => {
  if (context.explicit) {
    return {
      from: context.pos,
      options: headingOptions(context),
    }
  }

  const match = context.matchBefore(/^\w+/)

  return match
    ? {
        from: match.from,
        options: headingOptions(context, match.text.toLocaleLowerCase()),
      }
    : null
}
