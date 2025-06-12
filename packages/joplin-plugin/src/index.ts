import joplin from 'api'

joplin.plugins.register({
  onStart: async () => {
    console.info('Stripdown plugin loaded')
  },
})
