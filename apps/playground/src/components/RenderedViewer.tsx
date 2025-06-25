import { parenthetical } from '@stripdown/markdown-it'
import markdownIt from 'markdown-it'
// @ts-ignore -- no types available
import markdownItDefList from 'markdown-it-deflist'
import markdownItFrontMatter from 'markdown-it-front-matter'
import type { VoidComponent } from 'solid-js'
import { styled } from 'styled-system/jsx'

export type RenderedViewerProps = {
  doc: string
}

const ReaderBox = styled('article', {
  base: {
    maxW: '75ch',
    mx: 'auto',
    '& > :is(h1, h2, h3)': {
      py: '1ex',
      fontWeight: 'bold',
      lineHeight: '1.2',
    },
    '& > h1': {
      fontSize: '2xl',
    },
    '& > h2': {
      fontSize: 'xl',
    },
    '& > h2:not(:first-of-type)': {
      pageBreakBefore: 'always',
    },
    '& > h3': {
      fontSize: 'lg',
    },
    '& > p': {
      py: '.5ex',
      lineHeight: '1.4',
    },
    '& > dl': {
      display: 'grid',
      gridTemplateColumns: 'max-content auto',
      gap: '2ch',
    },
    '& dt': {
      gridColumnStart: 1,
      fontWeight: 'bold',
      _after: {
        content: '":"',
      },
    },
    '& dd': {
      gridColumnStart: 2,
    },
    '& > .parenthetical': {
      color: 'fg.subtle',
    },
  },
})

const md = markdownIt()
  .use(markdownItFrontMatter, () => {})
  .use(markdownItDefList)
  .use(parenthetical)

export const RenderedViewer: VoidComponent<RenderedViewerProps> = (props) => {
  const innerHTML = md.render(props.doc)

  return <ReaderBox innerHTML={innerHTML} />
}
