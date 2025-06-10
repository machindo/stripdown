import { defineConfig } from 'tsdown/config'

export default defineConfig({
  clean: false,
  entry: 'src/main.ts',
  env: {
    PARSE_MODE: 'obsidian',
  },
  external: [
    '@codemirror/language',
    '@codemirror/state',
    '@codemirror/view',
    '@lezer/common',
    '@lezer/highlight',
    'obsidian',
  ],
  format: 'commonjs',
  outExtensions: () => ({
    js: '.js',
  }),
})
