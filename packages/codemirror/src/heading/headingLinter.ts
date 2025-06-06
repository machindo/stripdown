import { type Diagnostic, linter } from '@codemirror/lint'

import { isFixableHeading } from '../core/parse'
import { stripdownTree } from '../core/stripdownTree'

export const headingLinter = linter(
  (view) => {
    const fixableHeadings =
      view.plugin(stripdownTree)?.tree.children.filter(isFixableHeading) ?? []
    const diagnostics: Diagnostic[] = []

    for (const node of fixableHeadings) {
      const insert =
        node.props.extra === 0
          ? `${node.expectedProps.start}`
          : node.props.dir === 'ltr'
            ? `${node.expectedProps.start}${node.props.delimiter}${node.expectedProps.end}`
            : `${node.expectedProps.end}${node.props.delimiter}${node.expectedProps.start}`

      diagnostics.push({
        from: node.node.from + node.props.columnStart,
        to: node.node.from + node.props.columnEnd,
        severity: 'error',
        message: 'Heading numbers must be in order',
        source: 'stripdown',
        actions: [
          {
            name: `Replace with "${insert}"`,
            apply: (view, from, to) => {
              view.dispatch({
                changes: {
                  from,
                  to,
                  insert,
                },
              })
            },
          },
        ],
      })
    }

    return diagnostics
  },
  {
    delay: 1000,
  },
)
