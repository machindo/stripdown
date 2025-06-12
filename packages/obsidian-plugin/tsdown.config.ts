import { defineConfig } from 'tsdown'

export default defineConfig({
  copy: 'src/manifest.json',
  entry: 'src/main.ts',
  external: [
    '@codemirror/language',
    '@codemirror/state',
    '@codemirror/view',
    '@lezer/common',
    '@lezer/highlight',
    'obsidian',
  ],
  format: 'commonjs',
  minify: true,
  outExtensions: () => ({
    js: '.js',
  }),
})
