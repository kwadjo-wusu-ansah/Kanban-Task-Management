import type { HTMLAttributes } from 'react'

export type HeaderMode = 'light' | 'dark'

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  addTaskLabel?: string
  boardName: string
  isAddTaskDisabled?: boolean
  mode?: HeaderMode
  onAddTask?: () => void
  onMenuOpen?: () => void
  sidebarVisible?: boolean
}
