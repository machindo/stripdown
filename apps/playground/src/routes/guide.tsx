import { createFileRoute } from '@tanstack/solid-router'
import { Container } from 'styled-system/jsx'

export const Route = createFileRoute('/guide')({
  component: About,
})

function About() {
  return (
    <Container>
      <h2>Stripdown Guide</h2>
    </Container>
  )
}
