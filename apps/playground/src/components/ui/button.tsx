import type { JSX } from 'solid-js'
import { Show, splitProps } from 'solid-js'
import { Center, styled } from 'styled-system/jsx'

import { Spinner } from './spinner'
import {
  Button as StyledButton,
  type ButtonProps as StyledButtonProps,
} from './styled/button'

interface ButtonLoadingProps {
  loading?: boolean
  loadingText?: JSX.Element
}

export interface ButtonProps extends StyledButtonProps, ButtonLoadingProps {}

export const Button = (props: ButtonProps) => {
  const [localProps, rest] = splitProps(props, [
    'loading',
    'disabled',
    'loadingText',
    'children',
  ])
  const trulyDisabled = () => localProps.loading || localProps.disabled

  return (
    <StyledButton disabled={trulyDisabled()} {...rest}>
      <Show
        fallback={localProps.loadingText || localProps.children}
        when={localProps.loading && !localProps.loadingText}
      >
        <ButtonSpinner />
        <styled.span opacity={0}>{localProps.children}</styled.span>
      </Show>
    </StyledButton>
  )
}

const ButtonSpinner = () => (
  <Center
    inline
    insetStart="50%"
    position="absolute"
    top="50%"
    transform="translate(-50%, -50%)"
  >
    <Spinner
      borderRightColor="fg.disabled"
      borderTopColor="fg.disabled"
      borderWidth="1.5px"
      height="1.1em"
      width="1.1em"
    />
  </Center>
)
