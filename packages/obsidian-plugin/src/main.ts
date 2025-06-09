import { Plugin } from 'obsidian'

import { codemirrorExtension } from './codemirrorExtension'

export default class StripdownPlugin extends Plugin {
  async onload() {
    this.registerEditorExtension(codemirrorExtension)
  }
  async onunload() {
    // Release any resources configured by the plugin.
  }
}
