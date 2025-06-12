import { lineNumbers } from '@codemirror/view'
import type { CodeMirrorControl } from 'api/types'

exports.default = (_context: {
  contentScriptId: string
  postMessage: unknown
}) => ({
  plugin: (codeMirrorWrapper: CodeMirrorControl) => {
    codeMirrorWrapper.addExtension(lineNumbers())
  },
})
