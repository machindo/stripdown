import joplin from 'api'
import { ContentScriptType } from 'api/types'

joplin.plugins.register({
  onStart: async () => {
    joplin.contentScripts.register(
      ContentScriptType.CodeMirrorPlugin,
      'stripdown-content-script',
      './contentScript.js',
    )
  },
})
