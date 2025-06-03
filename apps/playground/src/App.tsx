import type { VoidComponent } from 'solid-js'
import { Container } from 'styled-system/jsx'

import { Editor } from './components/Editor'

export const App: VoidComponent = () => (
  <Container display="flex" flexDir="column" h="full">
    <h1>Stripdown Playground</h1>
    <Editor flex="1" h="100px" />
  </Container>
)
