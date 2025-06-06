/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'

import { createRouter, RouterProvider } from '@tanstack/solid-router'

import { routeTree } from './routeTree.gen.ts'

const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/solid-router' {
  interface Register {
    router: typeof router
  }
}

const root = document.getElementById('root')

if (root && !root.innerHTML) {
  render(() => <RouterProvider router={router} />, root)
}
