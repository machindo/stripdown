import type { VoidComponent } from 'solid-js'
import { Box } from 'styled-system/jsx'

export type PlainTextViewerProps = {
  doc: string
}

export const PlainTextViewer: VoidComponent<PlainTextViewerProps> = (props) => (
  <Box maxW="75ch" mx="auto" whiteSpace="pre-wrap">
    {props.doc}
  </Box>
)
