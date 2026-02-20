import { useState } from 'react'
import { boardPreviews } from './data'
import type { BoardPreview, BoardTaskPreview } from './data'
import { AddColumnCard, EmptyBoardState, Header, Modal, Sidebar, Tasks } from './components'
import type { DropdownOption, ModalItem, SidebarBoard, SidebarMode } from './components'
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

// Resolves the selected task from the active board by task ID.
function getActiveTask(board: BoardPreview | undefined, taskId: string | null): BoardTaskPreview | undefined {
  if (!board || !taskId) {
    return undefined
  }

  return board.columns.flatMap((column) => column.tasks).find((task) => task.id === taskId)
}

// Builds status dropdown options from the active board column names.
function buildStatusOptions(board: BoardPreview | undefined): DropdownOption[] {
  if (!board || board.columns.length === 0) {
    return [
      { label: 'Todo', value: 'Todo' },
      { label: 'Doing', value: 'Doing' },
      { label: 'Done', value: 'Done' },
    ]
  }

  return board.columns.map((column) => ({
    label: column.name,
    value: column.name,
  }))
}

// Maps task subtasks into the modal checkbox item format.
function mapTaskSubtasksToModalItems(task: BoardTaskPreview): ModalItem[] {
  return task.subtasks.map((subtask) => ({
    checked: subtask.isCompleted,
    id: subtask.id,
    value: subtask.title,
  }))
}

const fallbackBoardPreviews = buildFallbackBoardPreviews(fallbackBoards)

// Renders the desktop board app shell in populated and empty states for both themes.
function App() {
  const [mode, setMode] = useState<SidebarMode>('light')
  const [isSidebarHidden, setIsSidebarHidden] = useState(false)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false)
  const [modalStatusValue, setModalStatusValue] = useState('')
  const [modalSubtasks, setModalSubtasks] = useState<ModalItem[]>([])
  const boardDataset = boardPreviews.length > 0 ? boardPreviews : fallbackBoardPreviews
  const boards = buildSidebarBoards(boardDataset)
  const [activeBoardId, setActiveBoardId] = useState(boards[0]?.id ?? fallbackBoards[0].id)
  const activeBoard = getActiveBoard(boardDataset, activeBoardId)
  const activeTask = getActiveTask(activeBoard, activeTaskId)
  const activeBoardName = activeBoard?.name ?? fallbackBoards[0].name
  const hasColumns = (activeBoard?.columns.length ?? 0) > 0
  const boardCount = mode === 'dark' ? 8 : 3
  const statusOptions = buildStatusOptions(activeBoard)

  // Handles sidebar board changes and closes any open task modal.
  function handleBoardSelect(nextBoardId: string) {
    setActiveBoardId(nextBoardId)
    setActiveTaskId(null)
    setIsStatusMenuOpen(false)
  }

  // Opens the view-task modal using the clicked task and local interactive state.
  function handleTaskSelect(taskId: string) {
    const nextTask = getActiveTask(activeBoard, taskId)

    if (!nextTask) {
      return
    }

    setActiveTaskId(nextTask.id)
    setModalStatusValue(nextTask.status)
    setModalSubtasks(mapTaskSubtasksToModalItems(nextTask))
    setIsStatusMenuOpen(false)
  }

  // Closes the view-task modal and resets dropdown open state.
  function handleModalClose() {
    setActiveTaskId(null)
    setIsStatusMenuOpen(false)
  }

  // Toggles a subtask checkbox locally inside the open view-task modal.
  function handleSubtaskToggle(subtaskId: string) {
    setModalSubtasks((previousSubtasks) =>
      previousSubtasks.map((subtask) => (subtask.id === subtaskId ? { ...subtask, checked: !subtask.checked } : subtask)),
    )
  }

  // Selects a new task status locally and collapses the dropdown menu.
  function handleStatusSelect(nextStatusValue: string) {
    setModalStatusValue(nextStatusValue)
    setIsStatusMenuOpen(false)
  }

  return (
    <main className={classNames(styles.app, mode === 'dark' ? styles.appDark : styles.appLight)}>
      <Sidebar
        activeBoardId={activeBoardId}
        boardCount={boardCount}
        boards={boards}
        hidden={isSidebarHidden}
        mode={mode}
        onBoardSelect={handleBoardSelect}
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
                  onTaskSelect={handleTaskSelect}
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
      {activeTask ? (
        <Modal
          description={activeTask.description}
          isStatusMenuOpen={isStatusMenuOpen}
          mode={mode}
          onClose={handleModalClose}
          onMenuOpen={() => {}}
          onStatusSelect={handleStatusSelect}
          onStatusToggle={() => setIsStatusMenuOpen((previousOpenState) => !previousOpenState)}
          onSubtaskToggle={handleSubtaskToggle}
          statusLabel="Current Status"
          statusOptions={statusOptions}
          statusValue={modalStatusValue}
          subtasks={modalSubtasks}
          title={activeTask.title}
          variant="viewTask"
        />
      ) : null}
    </main>
  )
}

export default App
