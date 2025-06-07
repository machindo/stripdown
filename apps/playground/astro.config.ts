import solidJs from '@astrojs/solid-js'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [solidJs()],
  site: 'https://machindo.github.io',
  base: 'stripdown',
})
