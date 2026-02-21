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
  isMobile?: boolean
  mobileMenuOpen?: boolean
  mode?: SidebarMode
  onBoardSelect?: (boardId: string) => void
  onCreateBoard?: () => void
  onHideSidebar?: () => void
  onMobileMenuClose?: () => void
  onShowSidebar?: () => void
  onThemeToggle?: () => void
  theme?: SidebarTheme
}
