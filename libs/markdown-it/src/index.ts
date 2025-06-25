/** biome-ignore-all lint/style/noNonNullAssertion: Safe here */
import type { PluginSimple } from 'markdown-it'
import type { RuleBlock } from 'markdown-it/lib/parser_block.mjs'

export const parenthetical: PluginSimple = (md) => {
  const parse: RuleBlock = (state, startLine, _endLine, silent) => {
    const pos = state.bMarks[startLine]! + state.tShift[startLine]!
    const max = state.skipSpacesBack(state.eMarks[startLine]! - 1, pos)

    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine]! - state.blkIndent >= 4) return false

    // line should be at least 3 chars - "(x)"
    if (pos + 3 > max) return false

    // line must begin with "("
    if (state.src.charAt(pos) !== '(') return false

    // line must end with "("
    if (state.src.charAt(max) !== ')') return false

    if (silent) {
      return true
    }

    state.line = startLine + 1

    const token_o = state.push('parenthetical_open', 'p', 1)
    token_o.attrSet('class', 'parenthetical')
    token_o.markup = '('
    token_o.map = [startLine, state.line]

    const token_i = state.push('inline', '', 0)
    token_i.content = state.src.slice(pos, max + 1).trim()
    token_i.map = [startLine, state.line]
    token_i.children = []

    const token_c = state.push('parenthetical_close', 'p', -1)
    token_c.markup = ')'

    return true
  }

  md.block.ruler.before('paragraph', 'parenthetical', parse, {
    alt: ['paragraph', 'reference', 'blockquote'],
  })
}
