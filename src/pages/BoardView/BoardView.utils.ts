import type { DropdownOption, ModalItem } from '../../components'
import type { BoardPreview, BoardTaskPreview } from '../../data'

export const DEFAULT_ADD_SUBTASK_PLACEHOLDERS = ['e.g. Make coffee', 'e.g. Drink coffee & smile']
export const DEFAULT_ADD_BOARD_COLUMN_VALUES = ['Todo', 'Doing']
export const DEFAULT_BOARD_COLUMN_PLACEHOLDER = 'e.g. Todo'
export const COLUMN_ACCENT_COLORS = ['#49c4e5', '#8471f2', '#67e2ae']
export const MOBILE_BREAKPOINT = 788
export const FALLBACK_BOARD_NAME = 'Platform Launch'

let nextClientId = 0

// Creates a stable local-only ID for new UI-created entities.
export function createClientId(prefix: string): string {
  nextClientId += 1
  return `${prefix}-${nextClientId}`
}

// Creates a blank subtask form row with placeholder text.
export function createEmptySubtaskItem(placeholder = 'e.g. New subtask'): ModalItem {
  return {
    id: createClientId('subtask'),
    placeholder,
    value: '',
  }
}

// Creates a blank board-column form row with optional initial value.
export function createEmptyBoardColumnItem(value = ''): ModalItem {
  return {
    id: createClientId('board-column'),
    placeholder: DEFAULT_BOARD_COLUMN_PLACEHOLDER,
    value,
  }
}

// Builds default Add Task subtask rows shown when the modal opens.
export function createInitialAddTaskSubtasks(): ModalItem[] {
  return DEFAULT_ADD_SUBTASK_PLACEHOLDERS.map((placeholder) => createEmptySubtaskItem(placeholder))
}

// Builds default Add Board column rows shown when the modal opens.
export function createInitialAddBoardColumns(): ModalItem[] {
  return DEFAULT_ADD_BOARD_COLUMN_VALUES.map((value) => createEmptyBoardColumnItem(value))
}

// Maps task subtasks into editable modal rows while preserving completion state.
export function mapTaskSubtasksToEditableItems(task: BoardTaskPreview): ModalItem[] {
  return task.subtasks.map((subtask) => ({
    checked: subtask.isCompleted,
    id: subtask.id,
    value: subtask.title,
  }))
}

// Resolves the currently selected board and falls back to the first board when needed.
export function getActiveBoard(boards: BoardPreview[], boardId: string): BoardPreview | undefined {
  return boards.find((board) => board.id === boardId) ?? boards[0]
}

// Resolves the selected task from the active board by task ID.
export function getActiveTask(board: BoardPreview | undefined, taskId: string | null): BoardTaskPreview | undefined {
  if (!board || !taskId) {
    return undefined
  }

  return board.columns.flatMap((column) => column.tasks).find((task) => task.id === taskId)
}

// Builds status dropdown options from the active board column names.
export function buildStatusOptions(board: BoardPreview | undefined): DropdownOption[] {
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

// Maps task subtasks into the view-task modal checkbox item format.
export function mapTaskSubtasksToViewModalItems(task: BoardTaskPreview): ModalItem[] {
  return task.subtasks.map((subtask) => ({
    checked: subtask.isCompleted,
    id: subtask.id,
    value: subtask.title,
  }))
}

// Maps board columns into editable modal rows.
export function mapBoardColumnsToEditableItems(board: BoardPreview): ModalItem[] {
  return board.columns.map((column) => ({
    id: column.id,
    placeholder: DEFAULT_BOARD_COLUMN_PLACEHOLDER,
    value: column.name,
  }))
}

// Checks whether a board name already exists using a case-insensitive comparison.
export function hasDuplicateBoardName(boards: BoardPreview[], boardName: string, excludedBoardId?: string): boolean {
  const normalizedBoardName = boardName.trim().toLowerCase()

  return boards.some((board) => board.id !== excludedBoardId && board.name.trim().toLowerCase() === normalizedBoardName)
}

// Builds delete-board confirmation copy that includes the target board name.
export function buildDeleteBoardDescription(boardName: string): string {
  return `Are you sure you want to delete the '${boardName}' board? This action will remove all columns and tasks and cannot be reversed.`
}

// Builds delete-task confirmation copy that includes the target task name.
export function buildDeleteTaskDescription(taskName: string): string {
  return `Are you sure you want to delete the '${taskName}' task and its subtasks? This action cannot be reversed.`
}

interface BuildBoardViewDerivedStateParams {
  boardId: string | undefined
  boardPreviews: BoardPreview[]
  deletingBoardName: string
  deletingTaskName: string
  isMobileViewport: boolean
  isSidebarHidden: boolean
  sidebarBoards: Array<{ id: string }>
  taskId: string | undefined
}

interface BoardViewDerivedState {
  activeBoard: BoardPreview | undefined
  activeBoardId: string
  activeBoardName: string
  activeTask: BoardTaskPreview | undefined
  boardCount: number
  deleteBoardDescription: string
  deleteTaskDescription: string
  hasColumns: boolean
  isHeaderSidebarVisible: boolean
  shouldRenderSidebar: boolean
  statusOptions: DropdownOption[]
}

// Builds core BoardView derived values from route params, board data, and responsive UI state.
export function buildBoardViewDerivedState({
  boardId,
  boardPreviews,
  deletingBoardName,
  deletingTaskName,
  isMobileViewport,
  isSidebarHidden,
  sidebarBoards,
  taskId,
}: BuildBoardViewDerivedStateParams): BoardViewDerivedState {
  const activeBoardId = boardId ?? sidebarBoards[0]?.id ?? ''
  const activeBoard = getActiveBoard(boardPreviews, activeBoardId)
  const activeTask = getActiveTask(activeBoard, taskId ?? null)
  const activeBoardName = activeBoard?.name ?? FALLBACK_BOARD_NAME
  const hasColumns = (activeBoard?.columns.length ?? 0) > 0
  const boardCount = sidebarBoards.length
  const statusOptions = buildStatusOptions(activeBoard)
  const deleteBoardDescription = buildDeleteBoardDescription(deletingBoardName || activeBoardName)
  const deleteTaskDescription = buildDeleteTaskDescription(deletingTaskName || activeTask?.title || '')
  const shouldRenderSidebar = !isMobileViewport
  const isHeaderSidebarVisible = shouldRenderSidebar && !isSidebarHidden

  return {
    activeBoard,
    activeBoardId,
    activeBoardName,
    activeTask,
    boardCount,
    deleteBoardDescription,
    deleteTaskDescription,
    hasColumns,
    isHeaderSidebarVisible,
    shouldRenderSidebar,
    statusOptions,
  }
}
