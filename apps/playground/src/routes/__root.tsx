import { createRootRoute, Outlet } from '@tanstack/solid-router'
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools'
import { Flex } from 'styled-system/jsx'

import { AppHeader } from '@/components/AppHeader'

export const Route = createRootRoute({
  component: () => (
    <Flex flexDir="column" h="full" w="full">
      <AppHeader />
      <Outlet />
      <TanStackRouterDevtools />
    </Flex>
  ),
})
