import { html } from '@stripdown/spec/spec.md'
import { createFileRoute } from '@tanstack/solid-router'
import { css } from 'styled-system/css'
import { Container } from 'styled-system/jsx'

const style = css({
  '& h1': {
    fontSize: '2xl',
    fontWeight: 'semibold',
  },
  '& h2': {
    fontSize: 'xl',
    fontWeight: 'semibold',
    mt: 3,
  },
  '& h3': {
    fontSize: 'lg',
    fontWeight: 'semibold',
    mt: 3,
  },
  '& h4': {
    fontWeight: 'semibold',
    mt: 3,
  },
  '& p': {
    my: 2,
  },
  '& pre': {
    p: 3,
    border: '1px solid',
    borderColor: 'gray.7',
  },
  '& ul': {
    listStyleType: 'disc',
    paddingInlineStart: 6,
  },
  '& ol': {
    listStyleType: 'decimal',
    paddingInlineStart: 6,
  },
})

const About = () => (
  <Container py={4}>
    <div class={style} innerHTML={html} />
  </Container>
)

export const Route = createFileRoute('/guide')({
  component: About,
})
