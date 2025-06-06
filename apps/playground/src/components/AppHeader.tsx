import type { VoidComponent } from 'solid-js'
import { Flex } from 'styled-system/jsx'

export const AppHeader: VoidComponent = () => (
  <Flex borderBottom="1px solid" borderColor="gray.7" p="2">
    <h1>Stripdown Playground</h1>
  </Flex>
)
