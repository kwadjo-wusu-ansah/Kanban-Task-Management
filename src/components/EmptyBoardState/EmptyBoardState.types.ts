import type { HTMLAttributes } from 'react'

export type EmptyBoardStateMode = 'light' | 'dark'

export interface EmptyBoardStateProps extends HTMLAttributes<HTMLElement> {
  actionLabel?: string
  message?: string
  mode?: EmptyBoardStateMode
  onAddColumn?: () => void
}
