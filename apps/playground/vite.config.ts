import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { defineConfig } from 'vite'
import { Mode, plugin as markdown } from 'vite-plugin-markdown'
import solid from 'vite-plugin-solid'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    TanStackRouterVite({ target: 'solid', autoCodeSplitting: true }),
    solid(),
    markdown({ mode: [Mode.HTML, Mode.TOC] }),
  ],
})
