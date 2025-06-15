import type { Extension } from '@codemirror/state'
import { Plugin } from 'obsidian'

import { codemirrorExtension } from './codemirrorExtension'
import { markdownPostProcessor } from './markdownPostProcessor'

export default class StripdownPlugin extends Plugin {
  private editorExtension: Extension[] = []

  isEnabled() {
    const file = this.app.workspace.activeEditor?.file

    if (!file) return false

    const tags: string[] | undefined =
      this.app.metadataCache.getFileCache(file)?.frontmatter?.tags

    return !!tags?.includes('stripdown')
  }

  override async onload() {
    this.registerEditorExtension(this.editorExtension)

    this.toggleEditorExtension()

    this.app.workspace.on('active-leaf-change', this.toggleEditorExtension)
    this.app.workspace.on('file-open', this.toggleEditorExtension)
    this.app.metadataCache.on('changed', this.toggleEditorExtension)

    this.registerMarkdownPostProcessor(markdownPostProcessor(this))
  }

  private toggleEditorExtension = () => {
    const enable = this.isEnabled()

    if (enable && this.editorExtension.length === 0) {
      this.editorExtension.push(codemirrorExtension)
      this.app.workspace.updateOptions()
    } else if (!enable && this.editorExtension.length > 0) {
      this.editorExtension.length = 0
      this.app.workspace.updateOptions()
    }
  }

  override onunload() {
    this.app.workspace.off('active-leaf-change', this.toggleEditorExtension)
    this.app.workspace.off('file-open', this.toggleEditorExtension)
    this.app.metadataCache.off('changed', this.toggleEditorExtension)
  }
}
