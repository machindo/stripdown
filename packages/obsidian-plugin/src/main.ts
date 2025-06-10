import { Prec } from '@codemirror/state'
import { Plugin } from 'obsidian'

import { codemirrorExtension } from './codemirrorExtension'

export default class StripdownPlugin extends Plugin {
  override async onload() {
    this.registerEditorExtension(Prec.lowest(codemirrorExtension))
  }
  override async onunload() {
    // Release any resources configured by the plugin.
  }
}
