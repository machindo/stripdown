import { HighlightStyle } from '@codemirror/language'
import { Tag } from '@lezer/highlight'

export const stripdownTags = {
  dialogue: Tag.define('Dialogue'),
  parenthetical: Tag.define('Parenthetical'),
  speaker: Tag.define('Speaker'),
}

export const stripdownHighlightStyle = HighlightStyle.define([
  {
    tag: stripdownTags.speaker,
    class: 'cm-stripdown-speaker',
  },
  {
    tag: stripdownTags.dialogue,
    class: 'cm-stripdown-dialogueText',
  },
  {
    tag: stripdownTags.parenthetical,
    class: 'cm-stripdown-parenthetical',
  },
])
