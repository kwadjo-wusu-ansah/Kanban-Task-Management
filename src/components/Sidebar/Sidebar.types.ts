export type SidebarMode = 'light' | 'dark'
export type SidebarTheme = 'light' | 'dark'

export interface SidebarBoard {
  id: string
  name: string
}

export interface SidebarProps {
  activeBoardId: string
  boardCount?: number
  boards: SidebarBoard[]
  className?: string
  hidden?: boolean
  mode?: SidebarMode
  onBoardSelect?: (boardId: string) => void
  onCreateBoard?: () => void
  onHideSidebar?: () => void
  onShowSidebar?: () => void
  onThemeToggle?: () => void
  theme?: SidebarTheme
}
