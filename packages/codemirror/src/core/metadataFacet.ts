import { syntaxTree } from '@codemirror/language'
import type { EditorState } from '@codemirror/state'
import { Facet } from '@codemirror/state'
import type { StandardSchemaV1 } from '@standard-schema/spec'
import yaml from 'js-yaml'

import { StripdownConfig } from './StripdownConfig'

const frontmatterPattern = /^---\n(?<frontmatter>.+?)\n---\n/s

export const metadataFacet = Facet.define<unknown, unknown>({
  combine: (values) => values[values.length - 1],
})

export const sliceFrontmatter = (state: EditorState) => {
  const topNode = syntaxTree(state).topNode

  // Fallback to direct doc string parsing if state cannot be parsed, e.g. in a Joplin plugin when Stripdown is not enabled
  if (!topNode.firstChild) {
    return frontmatterPattern.exec(state.doc.toString())?.groups?.frontmatter
  }

  const node = topNode.getChild('Frontmatter')?.getChild('Stream')?.node

  return node && state.sliceDoc(node.from, node.to)
}

const isSuccessResult = <T>(
  result: StandardSchemaV1.Result<T> | Promise<StandardSchemaV1.Result<T>>,
): result is StandardSchemaV1.SuccessResult<T> => 'value' in result

export const parseOptional =
  <T>(schema: StandardSchemaV1<unknown, T>) =>
  (data: unknown) => {
    const result = schema['~standard'].validate(data)

    return isSuccessResult(result) ? result.value : undefined
  }

export const frontmatterAs =
  <T>(schema: StandardSchemaV1<unknown, T>) =>
  (state: EditorState) => {
    const frontmatter = sliceFrontmatter(state)

    if (!frontmatter) return undefined

    try {
      const data = yaml.load(frontmatter)

      return parseOptional(schema)(data)
    } catch {
      return undefined
    }
  }

export const frontmatterAsStripdownConfig = () =>
  metadataFacet.compute(['doc'], frontmatterAs(StripdownConfig))
