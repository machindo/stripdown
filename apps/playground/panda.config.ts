import { defineConfig } from '@pandacss/dev'
import { createPreset } from '@park-ui/panda-preset'
import blue from '@park-ui/panda-preset/colors/blue'
import neutral from '@park-ui/panda-preset/colors/neutral'

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  presets: [
    createPreset({ accentColor: neutral, grayColor: neutral, radius: 'sm' }),
  ],

  // Where to look for your css declarations
  include: ['./src/**/*.{astro,js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  jsxFramework: 'solid',

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          [blue.name]: blue.tokens,
        },
        fonts: {
          mono: {
            value: [
              '"Courier Prime"',
              'ui-monospace',
              'SFMono-Regular',
              'Menlo',
              'Monaco',
              'Consolas',
              '"Liberation Mono"',
              '"Courier New"',
              'monospace',
            ].join(','),
          },
        },
      },
      semanticTokens: {
        colors: {
          'gutter.bg': { value: '{colors.bg.muted}' },
          'selection.bg': { value: '{colors.blue.light.5}' },
          'selection.bg.muted': { value: '{colors.blue.light.5/50}' },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
})
