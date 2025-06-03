import { EditorView } from '@codemirror/view'
import { styled } from 'styled-system/jsx'

export const Editor = styled((props: { className?: string }) => {
  const editorView = new EditorView()

  return <div {...props}>{editorView.dom}</div>
})
