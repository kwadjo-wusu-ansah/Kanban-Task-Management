import { useState } from 'react'
import { boardPreviews } from './data'
import type { BoardPreview } from './data'
import { AddColumnCard, EmptyBoardState, Header, Sidebar, Tasks } from './components'
import type { SidebarBoard, SidebarMode } from './components'
import { classNames } from './utils'
import styles from './App.module.css'

const fallbackBoards: SidebarBoard[] = [
  { id: 'platform-launch', name: 'Platform Launch' },
  { id: 'marketing-plan', name: 'Marketing Plan' },
  { id: 'roadmap', name: 'Roadmap' },
]

// Builds fallback board previews so the app shell still renders when data is unavailable.
function buildFallbackBoardPreviews(boards: SidebarBoard[]): BoardPreview[] {
  return boards.map((board) => ({
    columns: [],
    id: board.id,
    name: board.name,
  }))
}

// Maps board previews into sidebar entries used by the Sidebar component.
function buildSidebarBoards(boards: BoardPreview[]): SidebarBoard[] {
  return boards.map((board) => ({
    id: board.id,
    name: board.name,
  }))
}

// Resolves the currently selected board and falls back to the first board when needed.
function getActiveBoard(boards: BoardPreview[], boardId: string): BoardPreview | undefined {
  return boards.find((board) => board.id === boardId) ?? boards[0]
}

const fallbackBoardPreviews = buildFallbackBoardPreviews(fallbackBoards)

// Renders the desktop board app shell in populated and empty states for both themes.
function App() {
  const [mode, setMode] = useState<SidebarMode>('light')
  const [isSidebarHidden, setIsSidebarHidden] = useState(false)
  const boardDataset = boardPreviews.length > 0 ? boardPreviews : fallbackBoardPreviews
  const boards = buildSidebarBoards(boardDataset)
  const [activeBoardId, setActiveBoardId] = useState(boards[0]?.id ?? fallbackBoards[0].id)
  const activeBoard = getActiveBoard(boardDataset, activeBoardId)
  const activeBoardName = activeBoard?.name ?? fallbackBoards[0].name
  const hasColumns = (activeBoard?.columns.length ?? 0) > 0
  const boardCount = mode === 'dark' ? 8 : 3

  return (
    <main className={classNames(styles.app, mode === 'dark' ? styles.appDark : styles.appLight)}>
      <Sidebar
        activeBoardId={activeBoardId}
        boardCount={boardCount}
        boards={boards}
        hidden={isSidebarHidden}
        mode={mode}
        onBoardSelect={setActiveBoardId}
        onCreateBoard={() => {}}
        onHideSidebar={() => setIsSidebarHidden(true)}
        onShowSidebar={() => setIsSidebarHidden(false)}
        onThemeToggle={() => setMode((previousMode) => (previousMode === 'dark' ? 'light' : 'dark'))}
        theme={mode}
      />

      <div className={styles.contentArea}>
        <Header boardName={activeBoardName} isAddTaskDisabled={!hasColumns} mode={mode} sidebarVisible={!isSidebarHidden} />
        <section className={classNames(styles.boardCanvas, mode === 'dark' ? styles.boardCanvasDark : styles.boardCanvasLight)}>
          {hasColumns ? (
            <div className={styles.columnsScroller}>
              {activeBoard?.columns.map((column) => (
                <Tasks
                  accentColor={column.accentColor}
                  heading={column.name}
                  key={column.id}
                  mode={mode}
                  taskCount={column.tasks.length}
                  tasks={column.tasks}
                />
              ))}
              <div className={styles.addColumnLane}>
                <AddColumnCard mode={mode} />
              </div>
            </div>
          ) : (
            <div className={styles.emptyStateWrapper}>
              <EmptyBoardState mode={mode} onAddColumn={() => {}} />
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
