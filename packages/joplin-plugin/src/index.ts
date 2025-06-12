import joplin from 'api'
import { ContentScriptType } from 'api/types'

joplin.plugins.register({
  onStart: async () => {
    console.info('Stripdown plugin loaded')
    const contentScriptId = 'stripdown-content-script'
    joplin.contentScripts.register(
      ContentScriptType.CodeMirrorPlugin,
      contentScriptId,
      './contentScript.js',
    )
  },
})
