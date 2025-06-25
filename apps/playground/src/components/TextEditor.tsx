import { EditorView } from '@codemirror/view'
import { IconButton } from '@components/ui/icon-button'
import { type } from 'arktype'
import { Paintbrush, Pencil, RotateCcw, Type } from 'lucide-solid'
import { createSignal, Match, Switch, type VoidComponent } from 'solid-js'
import { Box, VStack } from 'styled-system/jsx'

import { doc as initialDoc } from '@/examples/shadowland.ts'
import { createEditorView } from './editor'
import { PlainTextViewer } from './PlainTextViewer'
import { RenderedViewer } from './RenderedViewer'
import { ToggleGroup } from './ui/toggle-group'

const ViewMode = type("'editing' | 'plain' | 'reading'")

export const TextEditor: VoidComponent = () => {
  const [doc, setDoc] = createSignal(localStorage.getItem('doc') ?? initialDoc)
  const editorView = createEditorView(doc(), [
    EditorView.updateListener.of((update) => {
      if (!update.docChanged) return

      const newDoc = update.view.state.doc.toString()

      setDoc(newDoc)
      localStorage.setItem('doc', newDoc)
    }),
  ])
  const [viewMode, setViewMode] = createSignal<typeof ViewMode.infer>('editing')

  const reset = () => {
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: initialDoc,
      },
    })
  }

  return (
    <Box flex="1" h="100px" id="stripdown-editor" pos="relative">
      <VStack left="1ex" pos="absolute" top="1ex" zIndex={1}>
        <IconButton
          aspectRatio={1}
          onClick={reset}
          title="Reset document"
          type="button"
          variant="outline"
        >
          <RotateCcw />
        </IconButton>
        <ToggleGroup.Root
          onValueChange={({ value }) => setViewMode(ViewMode.assert(value[0]))}
          orientation="vertical"
          value={[viewMode()]}
        >
          <ToggleGroup.Item title="Toggle plain text mode" value="plain">
            <Type />
          </ToggleGroup.Item>
          <ToggleGroup.Item title="Toggle editing mode" value="editing">
            <Pencil />
          </ToggleGroup.Item>
          <ToggleGroup.Item title="Toggle styled reading mode" value="reading">
            <Paintbrush />
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </VStack>
      <Switch>
        <Match when={viewMode() === 'plain'}>
          <PlainTextViewer doc={doc()} />
        </Match>
        <Match when={viewMode() === 'editing'}>{editorView.dom}</Match>
        <Match when={viewMode() === 'reading'}>
          <RenderedViewer doc={doc()} />
        </Match>
      </Switch>
    </Box>
  )
}
