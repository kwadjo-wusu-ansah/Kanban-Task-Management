import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Header, Sidebar } from '../../components'
import type { SidebarBoard, SidebarMode } from '../../components'
import { boardPreviews } from '../../data'
import { classNames } from '../../utils'
import appStyles from '../../App.module.css'
import styles from './MainShell.module.css'
import type { ReactNode } from 'react'

const MOBILE_BREAKPOINT = 788

interface MainShellProps {
  activeBoardId?: string
  children: ReactNode
  title: string
}

// Maps board previews into sidebar entries for layout routes.
function getSidebarBoards(): SidebarBoard[] {
  return boardPreviews.map((board) => ({
    id: board.id,
    name: board.name,
  }))
}

// Renders a reusable page shell with shared header/sidebar behavior for routed views.
function MainShell({ activeBoardId = '', children, title }: MainShellProps) {
  const navigate = useNavigate()
  const [mode, setMode] = useState<SidebarMode>('light')
  const [isSidebarHidden, setIsSidebarHidden] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(() => window.innerWidth < MOBILE_BREAKPOINT)
  const [isMobileBoardsMenuOpen, setIsMobileBoardsMenuOpen] = useState(false)

  const boards = useMemo(() => getSidebarBoards(), [])
  const shouldRenderSidebar = !isMobileViewport
  const isHeaderSidebarVisible = shouldRenderSidebar && !isSidebarHidden

  // Tracks viewport breakpoint so the shell can switch desktop and mobile sidebar variants.
  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    function handleMobileBreakpointChange(event: MediaQueryListEvent) {
      setIsMobileViewport(event.matches)

      if (!event.matches) {
        setIsMobileBoardsMenuOpen(false)
      }
    }

    mediaQuery.addEventListener('change', handleMobileBreakpointChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMobileBreakpointChange)
    }
  }, [])

  // Navigates sidebar board selection to the matching dynamic board route.
  function handleBoardSelect(boardId: string) {
    setIsMobileBoardsMenuOpen(false)
    navigate(`/board/${boardId}`)
  }

  return (
    <main className={classNames(appStyles.app, mode === 'dark' ? appStyles.appDark : appStyles.appLight)}>
      {shouldRenderSidebar ? (
        <Sidebar
          activeBoardId={activeBoardId}
          boardCount={boards.length}
          boards={boards}
          hidden={isSidebarHidden}
          mode={mode}
          onBoardSelect={handleBoardSelect}
          onCreateBoard={() => navigate('/')}
          onHideSidebar={() => setIsSidebarHidden(true)}
          onShowSidebar={() => setIsSidebarHidden(false)}
          onThemeToggle={() => setMode((previousMode) => (previousMode === 'dark' ? 'light' : 'dark'))}
          theme={mode}
        />
      ) : null}
      {isMobileViewport ? (
        <Sidebar
          activeBoardId={activeBoardId}
          boardCount={boards.length}
          boards={boards}
          isMobile
          mobileMenuOpen={isMobileBoardsMenuOpen}
          mode={mode}
          onBoardSelect={handleBoardSelect}
          onCreateBoard={() => navigate('/')}
          onMobileMenuClose={() => setIsMobileBoardsMenuOpen(false)}
          onThemeToggle={() => setMode((previousMode) => (previousMode === 'dark' ? 'light' : 'dark'))}
          theme={mode}
        />
      ) : null}

      <div className={appStyles.contentArea}>
        <Header
          boardName={title}
          isAddTaskDisabled
          isBoardSwitcherOpen={isMobileBoardsMenuOpen}
          isMobile={isMobileViewport}
          mode={mode}
          onBoardSwitcherToggle={() => setIsMobileBoardsMenuOpen((previousOpenState) => !previousOpenState)}
          sidebarVisible={isHeaderSidebarVisible}
        />
        <section className={classNames(appStyles.boardCanvas, mode === 'dark' ? appStyles.boardCanvasDark : appStyles.boardCanvasLight)}>
          <div className={classNames(styles.content, mode === 'dark' ? styles.dark : '')}>{children}</div>
        </section>
      </div>
    </main>
  )
}

export default MainShell
