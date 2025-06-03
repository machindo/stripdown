import { tags } from '@lezer/highlight'
import count from 'word-count'

type NumberedHeadingProps = {
  isNumbered: true
  isStatic: boolean
  isValid: boolean
  columnEnd: number
  columnStart: number
  delimiter: string
  dir: string
  end: number | undefined
  extra: number
  expectedStart: number
  expectedEnd: number
  implicitEnd: number
  level: number
  span: number
  start: number
}

type UnnumberedHeadingProps = {
  isNumbered: false
  isValid: true
  level: number
}

export type HeadingProps = UnnumberedHeadingProps | NumberedHeadingProps

export type SpeakerProps = {
  name: string
}

export type DialogueProps = {
  wordCount: number
}

/**
 * The level of each node type, or false if the node should be skipped
 */
export const headingLevels: Readonly<Record<string, number>> = {
  ATXHeading1: 1,
  ATXHeading2: 2,
  ATXHeading3: 3,
  ATXHeading4: 4,
  ATXHeading5: 5,
  ATXHeading6: 6,
  SetextHeading1: 1,
  SetextHeading2: 2,
}

export const nodeTypes = {
  speaker: {
    name: 'Speaker',
    block: true,
    style: [tags.heading4],
  },
  dialogue: {
    name: 'Dialogue',
    block: true,
    style: [tags.content],
  },
  parenthetical: {
    name: 'Parenthetical',
    block: true,
    style: [tags.content],
  },
} as const

// Matches any series of western arabic numerals, or 2 series separated by a delimiter, signifying a range
// Delimiter can be a hyphen, en dash, em dash, or tilde
// Any group
export const numberPattern =
  /(?<!\\\d{0,5}(?:[-–—~〜]\d{0,5})?)(?<left>\d+)(?<delimiter>[-–—~〜]?)(?<right>\d*)/

export const speakerPattern = /^[^:]+:\s*$/

export const parentheticalPattern = /^\s*\(.*\)\s*$/

export const parseNumberedHeading = (
  string: string,
  {
    level,
    expectedStart,
  }: {
    level: number
    expectedStart: number
  },
): UnnumberedHeadingProps | NumberedHeadingProps => {
  const matches = numberPattern.exec(string)

  if (!matches) return { isNumbered: false, isValid: true, level }

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
  const isValid = isStatic || start === expectedStart

  return {
    isNumbered: true,
    isStatic,
    isValid,
    columnEnd: index + left.length + delimiter.length + right.length,
    columnStart: index,
    delimiter,
    dir,
    end,
    extra,
    expectedStart,
    expectedEnd: expectedStart + extra,
    implicitEnd: end ?? start,
    level,
    span: extra + 1,
    start,
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
