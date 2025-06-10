import type { Extension } from '@codemirror/state'
import { MarkdownView, Plugin } from 'obsidian'

import { codemirrorExtension } from './codemirrorExtension'
import { isStripdownEnabled } from './isStripdownEnabled'

export default class StripdownPlugin extends Plugin {
  private editorExtension: Extension[] = []

  override async onload() {
    this.registerEditorExtension(this.editorExtension)

    this.toggleEditorExtension()

    this.app.workspace.on('active-leaf-change', () => {
      this.toggleEditorExtension()
    })
    this.app.workspace.on('file-open', () => {
      this.toggleEditorExtension()
    })
    this.app.metadataCache.on('changed', () => {
      this.toggleEditorExtension()
    })
  }

  private toggleEditorExtension = () => {
    const file = this.app.workspace.getActiveViewOfType(MarkdownView)?.file

    const enable = file && isStripdownEnabled({ app: this.app, file })

    if (enable && this.editorExtension.length === 0) {
      this.editorExtension.push(codemirrorExtension)
      this.app.workspace.updateOptions()
    } else if (!enable && this.editorExtension.length > 0) {
      this.editorExtension.length = 0
      this.app.workspace.updateOptions()
    }
  }
}
