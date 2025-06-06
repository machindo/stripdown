import type { VoidComponent } from 'solid-js'
import { Flex } from 'styled-system/jsx'

import { AppHeader } from './components/AppHeader'
import { Editor } from './components/Editor'

export const App: VoidComponent = () => (
  <Flex flexDir="column" h="full" w="full">
    <AppHeader />
    <Editor flex="1" h="100px" />
  </Flex>
)
