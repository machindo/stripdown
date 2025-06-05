import count from 'word-count'

import { stripdownTags } from './highlightStyle'

type NumberedHeadingProps = {
  isNumbered: true
  isStatic: boolean
  after: string
  before: string
  columnEnd: number
  columnStart: number
  delimiter: string
  dir: string
  end: number | undefined
  extra: number
  implicitEnd: number
  span: number
  start: number
}

export type ExpectedNumberedHeadingProps = {
  start: number
  end: number
}

type UnnumberedHeadingProps = {
  isNumbered: false
  isValid: true
}

export type HeadingProps = UnnumberedHeadingProps | NumberedHeadingProps

export type SpeakerProps = {
  name: string
}

export type DialogueProps = {
  wordCount: number
}

export const nodeTypes = {
  speaker: {
    name: 'Speaker',
    block: true,
    style: [stripdownTags.speaker],
  },
  dialogue: {
    name: 'Dialogue',
    block: true,
    style: [stripdownTags.dialogue],
  },
  parenthetical: {
    name: 'Parenthetical',
    block: true,
    style: [stripdownTags.parenthetical],
  },
} as const

// Matches any series of western arabic numerals, or 2 series separated by a delimiter, signifying a range
// Delimiter can be a hyphen, en dash, em dash, or tilde
// Any group
export const numberPattern =
  /(?<!\\\d{0,5}(?:[-–—~〜]\d{0,5})?)(?<left>\d+)(?<delimiter>[-–—~〜]?)(?<right>\d*)/

export const speakerPattern = /^[^:]+:\s*$/

export const parentheticalPattern = /^\s*\(.*\)\s*$/

export const parseNumberedHeading = (string: string): HeadingProps => {
  const matches = numberPattern.exec(string)

  if (!matches) return { isNumbered: false, isValid: true }

  const { groups, index } = matches
  const {
    left,
    right,
    delimiter,
  }: {
    left: string
    right: string
    delimiter: string
  } = { left: '', right: '', delimiter: '', ...groups }
  const leftNumber = Number.parseInt(left, 10)
  const rightNumber = right === '' ? undefined : Number.parseInt(right, 10)
  const start =
    rightNumber === undefined ? leftNumber : Math.min(leftNumber, rightNumber)
  const end =
    rightNumber === undefined ? undefined : Math.max(leftNumber, rightNumber)
  const dir =
    rightNumber === undefined || leftNumber <= rightNumber ? 'ltr' : 'rtl'
  const extra = (end ?? start) - start
  const isStatic = left[0] === '0' || right[0] === '0'
  const columnStart = index
  const columnEnd = columnStart + left.length + delimiter.length + right.length
  const before = string.substring(0, columnStart)
  const after = string.substring(columnEnd)

  return {
    isNumbered: true,
    isStatic,
    after,
    before,
    columnEnd,
    columnStart,
    delimiter,
    dir,
    end,
    extra,
    implicitEnd: end ?? start,
    span: extra + 1,
    start,
  }
}

export const validateNumberedHeadingProps = (
  props: HeadingProps,
  expectedStart: number,
): ExpectedNumberedHeadingProps | undefined => {
  if (!props.isNumbered) return undefined
  if (props.isStatic) return undefined
  if (props.start === expectedStart) return undefined

  return {
    start: expectedStart,
    end: expectedStart + props.extra,
  }
}

export const parseSpeaker = (string: string): SpeakerProps => {
  const trimmed = string.trim()
  const name = trimmed.substring(0, trimmed.length - 1)

  return { name }
}

export const parseDialogue = (string: string): DialogueProps => ({
  wordCount: count(string),
})
