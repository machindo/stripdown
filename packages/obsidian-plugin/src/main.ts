import type { Extension } from '@codemirror/state'
import { parseOptional } from '@stripdown/codemirror'
import { type } from 'arktype'
import { MarkdownView, Plugin } from 'obsidian'

import { codemirrorExtension } from './codemirrorExtension'
import { markdownPostProcessor } from './markdownPostProcessor'

const Frontmatter = type({ 'tags?': 'string[]' })

export default class StripdownPlugin extends Plugin {
  private editorExtension: Extension[] = []

  isEnabled() {
    const file = this.app.workspace.activeEditor?.file

    if (!file) return false

    const metadata = parseOptional(Frontmatter)(
      this.app.metadataCache.getFileCache(file)?.frontmatter,
    )

    return metadata?.tags?.includes('stripdown')
  }

  override async onload() {
    this.app.workspace.onLayoutReady(() => {
      this.registerEditorExtension(this.editorExtension)

      this.toggleExtension()

      this.app.workspace.on('active-leaf-change', this.toggleExtension)
      this.app.workspace.on('file-open', this.toggleExtension)
      this.app.metadataCache.on('changed', this.toggleExtension)

      this.registerMarkdownPostProcessor(markdownPostProcessor(this))
    })
  }

  private toggleExtension = () => {
    const enable = this.isEnabled()

    this.app.workspace
      .getActiveViewOfType(MarkdownView)
      ?.previewMode.rerender(true)

    if (enable && this.editorExtension.length === 0) {
      this.editorExtension.push(codemirrorExtension)
      this.app.workspace.updateOptions()
    } else if (!enable && this.editorExtension.length > 0) {
      this.editorExtension.length = 0
      this.app.workspace.updateOptions()
    }
  }

  override onunload() {
    this.app.workspace.off('active-leaf-change', this.toggleExtension)
    this.app.workspace.off('file-open', this.toggleExtension)
    this.app.metadataCache.off('changed', this.toggleExtension)
  }
}
