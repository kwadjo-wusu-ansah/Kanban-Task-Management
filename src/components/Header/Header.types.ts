import type { HTMLAttributes } from 'react'

export type HeaderMode = 'light' | 'dark'

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  addTaskLabel?: string
  boardName: string
  isMobile?: boolean
  isAddTaskDisabled?: boolean
  isMenuOpen?: boolean
  mode?: HeaderMode
  onAddTask?: () => void
  onDeleteBoard?: () => void
  onEditBoard?: () => void
  onMenuClose?: () => void
  onMenuOpen?: () => void
  sidebarVisible?: boolean
}
