import { createFileRoute } from '@tanstack/solid-router'

import { Editor } from '@/components/Editor'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return <Editor flex="1" h="100px" />
}
