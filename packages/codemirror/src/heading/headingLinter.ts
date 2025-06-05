import { type Diagnostic, linter } from '@codemirror/lint'

import { stripdownTree } from '../core/stripdownTree'

export const headingLinter = linter(
  (view) => {
    const tree = view.plugin(stripdownTree)?.tree
    const diagnostics: Diagnostic[] = []

    for (const node of tree?.children ?? []) {
      if (
        node.type === 'Heading' &&
        node.props.isNumbered &&
        node.expectedProps
      ) {
        const expectedNumberText =
          node.props.extra === 0
            ? `${node.expectedProps.start}`
            : node.props.dir === 'ltr'
              ? `${node.expectedProps.start}${node.props.delimiter}${node.expectedProps.end}`
              : `${node.expectedProps.end}${node.props.delimiter}${node.expectedProps.start}`
        const expectedText = `${node.props.before}${expectedNumberText}${node.props.after}`

        diagnostics.push({
          from: node.node.from,
          to: node.node.to,
          severity: 'error',
          message: 'Heading numbers must be in order',
          source: 'stripdown',
          actions: [
            {
              name: `Replace with "${expectedText}"`,
              apply: (view, from, to) => {
                view.dispatch({
                  changes: {
                    from,
                    to,
                    insert: expectedText,
                  },
                })
              },
            },
          ],
        })
      }
    }

    return diagnostics
  },
  {
    delay: 1000,
  },
)
