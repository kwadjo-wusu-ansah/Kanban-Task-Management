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

const DEFAULT_ADD_SUBTASK_PLACEHOLDERS = ['e.g. Make coffee', 'e.g. Drink coffee & smile']

let nextClientId = 0

// Creates a stable local-only ID for new UI-created entities.
function createClientId(prefix: string): string {
  nextClientId += 1
  return `${prefix}-${nextClientId}`
}

// Creates a blank subtask form row with placeholder text.
function createEmptySubtaskItem(placeholder = 'e.g. New subtask'): ModalItem {
  return {
    id: createClientId('subtask'),
    placeholder,
    value: '',
  }
}

// Builds the default Add Task subtask rows shown when the modal opens.
function createInitialAddTaskSubtasks(): ModalItem[] {
  return DEFAULT_ADD_SUBTASK_PLACEHOLDERS.map((placeholder) => createEmptySubtaskItem(placeholder))
}

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
  const [boardsData, setBoardsData] = useState<BoardPreview[]>(boardPreviews.length > 0 ? boardPreviews : fallbackBoardPreviews)
  const boards = buildSidebarBoards(boardsData)
  const [activeBoardId, setActiveBoardId] = useState(boards[0]?.id ?? fallbackBoards[0].id)

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [isViewStatusMenuOpen, setIsViewStatusMenuOpen] = useState(false)
  const [viewStatusValue, setViewStatusValue] = useState('')
  const [viewSubtasks, setViewSubtasks] = useState<ModalItem[]>([])

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [isAddStatusMenuOpen, setIsAddStatusMenuOpen] = useState(false)
  const [addTaskTitle, setAddTaskTitle] = useState('')
  const [addTaskDescription, setAddTaskDescription] = useState('')
  const [addTaskStatusValue, setAddTaskStatusValue] = useState('')
  const [addTaskSubtasks, setAddTaskSubtasks] = useState<ModalItem[]>(createInitialAddTaskSubtasks)

  const activeBoard = getActiveBoard(boardsData, activeBoardId)
  const activeTask = getActiveTask(activeBoard, activeTaskId)
  const activeBoardName = activeBoard?.name ?? fallbackBoards[0].name
  const hasColumns = (activeBoard?.columns.length ?? 0) > 0
  const boardCount = mode === 'dark' ? 8 : 3
  const statusOptions = buildStatusOptions(activeBoard)

  // Resets local Add Task form state to initial values for the active board.
  function resetAddTaskForm(initialStatusValue = statusOptions[0]?.value ?? '') {
    setAddTaskTitle('')
    setAddTaskDescription('')
    setAddTaskStatusValue(initialStatusValue)
    setAddTaskSubtasks(createInitialAddTaskSubtasks())
    setIsAddStatusMenuOpen(false)
  }

  // Handles sidebar board changes and closes any open task modal.
  function handleBoardSelect(nextBoardId: string) {
    const nextBoard = getActiveBoard(boardsData, nextBoardId)
    const nextStatusOptions = buildStatusOptions(nextBoard)

    setActiveBoardId(nextBoardId)
    setActiveTaskId(null)
    setIsViewStatusMenuOpen(false)
    setIsAddTaskModalOpen(false)
    setIsAddStatusMenuOpen(false)
    setAddTaskStatusValue(nextStatusOptions[0]?.value ?? '')
  }

  // Opens the view-task modal using the clicked task and local interactive state.
  function handleTaskSelect(taskId: string) {
    const nextTask = getActiveTask(activeBoard, taskId)

    if (!nextTask) {
      return
    }

    setIsAddTaskModalOpen(false)
    setIsAddStatusMenuOpen(false)
    setActiveTaskId(nextTask.id)
    setViewStatusValue(nextTask.status)
    setViewSubtasks(mapTaskSubtasksToModalItems(nextTask))
    setIsViewStatusMenuOpen(false)
  }

  // Opens Add Task modal with a clean form and closes View Task modal if open.
  function handleAddTaskOpen() {
    if (!hasColumns) {
      return
    }

    setActiveTaskId(null)
    setIsViewStatusMenuOpen(false)
    setIsAddTaskModalOpen(true)
    resetAddTaskForm(statusOptions[0]?.value ?? '')
  }

  // Closes the view-task modal and resets dropdown open state.
  function handleViewTaskModalClose() {
    setActiveTaskId(null)
    setIsViewStatusMenuOpen(false)
  }

  // Closes the Add Task modal and its status dropdown.
  function handleAddTaskModalClose() {
    setIsAddTaskModalOpen(false)
    setIsAddStatusMenuOpen(false)
  }

  // Toggles a subtask checkbox locally inside the open view-task modal.
  function handleViewTaskSubtaskToggle(subtaskId: string) {
    setViewSubtasks((previousSubtasks) =>
      previousSubtasks.map((subtask) => (subtask.id === subtaskId ? { ...subtask, checked: !subtask.checked } : subtask)),
    )
  }

  // Selects a new task status locally and collapses the view-task dropdown menu.
  function handleViewTaskStatusSelect(nextStatusValue: string) {
    setViewStatusValue(nextStatusValue)
    setIsViewStatusMenuOpen(false)
  }

  // Adds a new blank subtask row to the Add Task form.
  function handleAddTaskSubtaskAdd() {
    setAddTaskSubtasks((previousSubtasks) => [...previousSubtasks, createEmptySubtaskItem()])
  }

  // Removes a subtask row from the Add Task form by row ID.
  function handleAddTaskSubtaskRemove(subtaskId: string) {
    setAddTaskSubtasks((previousSubtasks) => previousSubtasks.filter((subtask) => subtask.id !== subtaskId))
  }

  // Updates one subtask row value in the Add Task form.
  function handleAddTaskSubtaskValueChange(subtaskId: string, nextValue: string) {
    setAddTaskSubtasks((previousSubtasks) =>
      previousSubtasks.map((subtask) => (subtask.id === subtaskId ? { ...subtask, value: nextValue } : subtask)),
    )
  }

  // Selects status in Add Task modal and collapses the dropdown menu.
  function handleAddTaskStatusSelect(nextStatusValue: string) {
    setAddTaskStatusValue(nextStatusValue)
    setIsAddStatusMenuOpen(false)
  }

  // Creates a new task at the bottom of the selected status column.
  function handleCreateTask() {
    if (!activeBoard) {
      return
    }

    const normalizedTitle = addTaskTitle.trim()
    const normalizedStatus = addTaskStatusValue.trim()
    const normalizedSubtasks = addTaskSubtasks
      .map((subtask) => subtask.value.trim())
      .filter((subtaskTitle) => subtaskTitle.length > 0)

    if (normalizedTitle.length === 0 || normalizedStatus.length === 0 || normalizedSubtasks.length === 0) {
      return
    }

    const targetColumn = activeBoard.columns.find((column) => column.name === normalizedStatus) ?? activeBoard.columns[0]

    if (!targetColumn) {
      return
    }

    const nextTaskId = createClientId('task')
    const nextTask: BoardTaskPreview = {
      completedSubtaskCount: 0,
      description: addTaskDescription.trim(),
      id: nextTaskId,
      status: targetColumn.name,
      subtasks: normalizedSubtasks.map((subtaskTitle, subtaskIndex) => ({
        id: `${nextTaskId}-subtask-${subtaskIndex}`,
        isCompleted: false,
        title: subtaskTitle,
      })),
      title: normalizedTitle,
      totalSubtaskCount: normalizedSubtasks.length,
    }

    setBoardsData((previousBoards) =>
      previousBoards.map((board) => {
        if (board.id !== activeBoard.id) {
          return board
        }

        return {
          ...board,
          columns: board.columns.map((column) => {
            if (column.id !== targetColumn.id) {
              return column
            }

            return {
              ...column,
              tasks: [...column.tasks, nextTask],
            }
          }),
        }
      }),
    )

    setIsAddTaskModalOpen(false)
    setIsAddStatusMenuOpen(false)
    resetAddTaskForm(targetColumn.name)
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
        <Header boardName={activeBoardName} isAddTaskDisabled={!hasColumns} mode={mode} onAddTask={handleAddTaskOpen} sidebarVisible={!isSidebarHidden} />
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
          isStatusMenuOpen={isViewStatusMenuOpen}
          mode={mode}
          onClose={handleViewTaskModalClose}
          onMenuOpen={() => {}}
          onStatusSelect={handleViewTaskStatusSelect}
          onStatusToggle={() => setIsViewStatusMenuOpen((previousOpenState) => !previousOpenState)}
          onSubtaskToggle={handleViewTaskSubtaskToggle}
          statusLabel="Current Status"
          statusOptions={statusOptions}
          statusValue={viewStatusValue}
          subtasks={viewSubtasks}
          title={activeTask.title}
          variant="viewTask"
        />
      ) : null}

      {isAddTaskModalOpen ? (
        <Modal
          isStatusMenuOpen={isAddStatusMenuOpen}
          mode={mode}
          onAddSubtask={handleAddTaskSubtaskAdd}
          onClose={handleAddTaskModalClose}
          onPrimaryAction={handleCreateTask}
          onStatusSelect={handleAddTaskStatusSelect}
          onStatusToggle={() => setIsAddStatusMenuOpen((previousOpenState) => !previousOpenState)}
          onSubtaskRemove={handleAddTaskSubtaskRemove}
          onSubtaskValueChange={handleAddTaskSubtaskValueChange}
          onTaskDescriptionChange={(event) => setAddTaskDescription(event.target.value)}
          onTaskTitleChange={(event) => setAddTaskTitle(event.target.value)}
          statusLabel="Status"
          statusOptions={statusOptions}
          statusValue={addTaskStatusValue}
          subtasks={addTaskSubtasks}
          taskDescriptionValue={addTaskDescription}
          taskTitleValue={addTaskTitle}
          variant="addTask"
        />
      ) : null}
    </main>
  )
}

export default App
