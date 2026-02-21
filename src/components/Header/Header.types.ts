import type { HTMLAttributes } from 'react'

export type HeaderMode = 'light' | 'dark'

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  addTaskLabel?: string
  boardName: string
  isBoardSwitcherOpen?: boolean
  isMobile?: boolean
  isAddTaskDisabled?: boolean
  isMenuOpen?: boolean
  mode?: HeaderMode
  onAddTask?: () => void
  onBoardSwitcherToggle?: () => void
  onDeleteBoard?: () => void
  onEditBoard?: () => void
  onLogoClick?: () => void
  onMenuClose?: () => void
  onMenuOpen?: () => void
  sidebarVisible?: boolean
}
