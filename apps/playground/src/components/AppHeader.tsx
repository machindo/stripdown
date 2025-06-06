import { Link } from '@tanstack/solid-router'
import type { VoidComponent } from 'solid-js'
import { css } from 'styled-system/css'
import { Flex } from 'styled-system/jsx'

const link = css({
  _currentPage: {
    fontWeight: 'bold',
  },
})

export const AppHeader: VoidComponent = () => (
  <Flex borderBottom="1px solid" borderColor="gray.7" gap="2" p="2">
    <h1>Stripdown</h1>
    <Link class={link} to="/">
      Playground
    </Link>
    <Link class={link} to="/guide">
      Guide
    </Link>
  </Flex>
)
