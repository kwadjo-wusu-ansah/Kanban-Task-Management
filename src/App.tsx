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
const DEFAULT_ADD_BOARD_COLUMN_VALUES = ['Todo', 'Doing']
const DEFAULT_BOARD_COLUMN_PLACEHOLDER = 'e.g. Todo'
const COLUMN_ACCENT_COLORS = ['#49c4e5', '#8471f2', '#67e2ae', '#f4f7fd']

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

// Creates a blank board-column form row with optional initial value.
function createEmptyBoardColumnItem(value = ''): ModalItem {
  return {
    id: createClientId('board-column'),
    placeholder: DEFAULT_BOARD_COLUMN_PLACEHOLDER,
    value,
  }
}

// Builds default Add Task subtask rows shown when the modal opens.
function createInitialAddTaskSubtasks(): ModalItem[] {
  return DEFAULT_ADD_SUBTASK_PLACEHOLDERS.map((placeholder) => createEmptySubtaskItem(placeholder))
}

// Builds default Add Board column rows shown when the modal opens.
function createInitialAddBoardColumns(): ModalItem[] {
  return DEFAULT_ADD_BOARD_COLUMN_VALUES.map((value) => createEmptyBoardColumnItem(value))
}

// Maps task subtasks into editable modal rows while preserving completion state.
function mapTaskSubtasksToEditableItems(task: BoardTaskPreview): ModalItem[] {
  return task.subtasks.map((subtask) => ({
    checked: subtask.isCompleted,
    id: subtask.id,
    value: subtask.title,
  }))
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

// Maps task subtasks into the view-task modal checkbox item format.
function mapTaskSubtasksToViewModalItems(task: BoardTaskPreview): ModalItem[] {
  return task.subtasks.map((subtask) => ({
    checked: subtask.isCompleted,
    id: subtask.id,
    value: subtask.title,
  }))
}

// Maps board columns into editable modal rows.
function mapBoardColumnsToEditableItems(board: BoardPreview): ModalItem[] {
  return board.columns.map((column) => ({
    id: column.id,
    placeholder: DEFAULT_BOARD_COLUMN_PLACEHOLDER,
    value: column.name,
  }))
}

// Checks whether a board name already exists using a case-insensitive comparison.
function hasDuplicateBoardName(boards: BoardPreview[], boardName: string, excludedBoardId?: string): boolean {
  const normalizedBoardName = boardName.trim().toLowerCase()

  return boards.some((board) => board.id !== excludedBoardId && board.name.trim().toLowerCase() === normalizedBoardName)
}

// Builds delete-board confirmation copy that includes the target board name.
function buildDeleteBoardDescription(boardName: string): string {
  return `Are you sure you want to delete the '${boardName}' board? This action will remove all columns and tasks and cannot be reversed.`
}

// Builds delete-task confirmation copy that includes the target task name.
function buildDeleteTaskDescription(taskName: string): string {
  return `Are you sure you want to delete the '${taskName}' task and its subtasks? This action cannot be reversed.`
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
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false)
  const [isViewStatusMenuOpen, setIsViewStatusMenuOpen] = useState(false)
  const [viewStatusValue, setViewStatusValue] = useState('')
  const [viewSubtasks, setViewSubtasks] = useState<ModalItem[]>([])

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [isAddStatusMenuOpen, setIsAddStatusMenuOpen] = useState(false)
  const [addTaskTitle, setAddTaskTitle] = useState('')
  const [addTaskDescription, setAddTaskDescription] = useState('')
  const [addTaskStatusValue, setAddTaskStatusValue] = useState('')
  const [addTaskSubtasks, setAddTaskSubtasks] = useState<ModalItem[]>(createInitialAddTaskSubtasks)
  const [addTaskSubtasksError, setAddTaskSubtasksError] = useState('')

  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [isEditStatusMenuOpen, setIsEditStatusMenuOpen] = useState(false)
  const [editTaskTitle, setEditTaskTitle] = useState('')
  const [editTaskDescription, setEditTaskDescription] = useState('')
  const [editTaskStatusValue, setEditTaskStatusValue] = useState('')
  const [editTaskSubtasks, setEditTaskSubtasks] = useState<ModalItem[]>([])

  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false)
  const [addBoardName, setAddBoardName] = useState('')
  const [addBoardNameError, setAddBoardNameError] = useState('')
  const [addBoardColumns, setAddBoardColumns] = useState<ModalItem[]>(createInitialAddBoardColumns)

  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(false)

  const [isEditBoardModalOpen, setIsEditBoardModalOpen] = useState(false)
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null)
  const [editBoardName, setEditBoardName] = useState('')
  const [editBoardNameError, setEditBoardNameError] = useState('')
  const [editBoardColumns, setEditBoardColumns] = useState<ModalItem[]>([])
  const [editBoardColumnsError, setEditBoardColumnsError] = useState('')

  const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false)
  const [deletingBoardId, setDeletingBoardId] = useState<string | null>(null)
  const [deletingBoardName, setDeletingBoardName] = useState('')

  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false)
  const [deletingTaskBoardId, setDeletingTaskBoardId] = useState<string | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)
  const [deletingTaskName, setDeletingTaskName] = useState('')

  const activeBoard = getActiveBoard(boardsData, activeBoardId)
  const activeTask = getActiveTask(activeBoard, activeTaskId)
  const activeBoardName = activeBoard?.name ?? fallbackBoards[0].name
  const hasColumns = (activeBoard?.columns.length ?? 0) > 0
  const boardCount = boards.length
  const statusOptions = buildStatusOptions(activeBoard)
  const deleteBoardDescription = buildDeleteBoardDescription(deletingBoardName || activeBoardName)
  const deleteTaskDescription = buildDeleteTaskDescription(deletingTaskName || activeTask?.title || '')

  // Resets local Add Task form state to initial values for the active board.
  function resetAddTaskForm(initialStatusValue = statusOptions[0]?.value ?? '') {
    setAddTaskTitle('')
    setAddTaskDescription('')
    setAddTaskStatusValue(initialStatusValue)
    setAddTaskSubtasks(createInitialAddTaskSubtasks())
    setAddTaskSubtasksError('')
    setIsAddStatusMenuOpen(false)
  }

  // Resets local Add Board form state to initial values.
  function resetAddBoardForm() {
    setAddBoardName('')
    setAddBoardNameError('')
    setAddBoardColumns(createInitialAddBoardColumns())
  }

  // Resets local Edit Board form state and clears validation feedback.
  function resetEditBoardForm() {
    setEditingBoardId(null)
    setEditBoardName('')
    setEditBoardNameError('')
    setEditBoardColumns([])
    setEditBoardColumnsError('')
  }

  // Resets local Delete Board modal state.
  function resetDeleteBoardState() {
    setIsDeleteBoardModalOpen(false)
    setDeletingBoardId(null)
    setDeletingBoardName('')
  }

  // Resets local Delete Task modal state.
  function resetDeleteTaskState() {
    setIsDeleteTaskModalOpen(false)
    setDeletingTaskBoardId(null)
    setDeletingTaskId(null)
    setDeletingTaskName('')
  }

  // Handles sidebar board changes and closes all open task modals and menus.
  function handleBoardSelect(nextBoardId: string) {
    const nextBoard = getActiveBoard(boardsData, nextBoardId)
    const nextStatusOptions = buildStatusOptions(nextBoard)

    setActiveBoardId(nextBoardId)
    setActiveTaskId(null)
    setIsTaskMenuOpen(false)
    setIsViewStatusMenuOpen(false)

    setIsAddTaskModalOpen(false)
    setIsAddStatusMenuOpen(false)
    setAddTaskStatusValue(nextStatusOptions[0]?.value ?? '')

    setIsEditTaskModalOpen(false)
    setEditingTaskId(null)
    setIsEditStatusMenuOpen(false)

    setIsBoardMenuOpen(false)

    setIsAddBoardModalOpen(false)
    setAddBoardNameError('')

    setIsEditBoardModalOpen(false)
    resetEditBoardForm()

    resetDeleteBoardState()
    resetDeleteTaskState()
  }

  // Opens the view-task modal using the clicked task and local interactive state.
  function handleTaskSelect(taskId: string) {
    const nextTask = getActiveTask(activeBoard, taskId)

    if (!nextTask) {
      return
    }

    setIsAddTaskModalOpen(false)
    setIsAddStatusMenuOpen(false)

    setIsEditTaskModalOpen(false)
    setEditingTaskId(null)
    setIsEditStatusMenuOpen(false)

    setIsBoardMenuOpen(false)

    setIsAddBoardModalOpen(false)
    setAddBoardNameError('')

    setIsEditBoardModalOpen(false)
    resetEditBoardForm()

    resetDeleteBoardState()
    resetDeleteTaskState()

    setActiveTaskId(nextTask.id)
    setIsTaskMenuOpen(false)
    setViewStatusValue(nextTask.status)
    setViewSubtasks(mapTaskSubtasksToViewModalItems(nextTask))
    setIsViewStatusMenuOpen(false)
  }

  // Opens Add Task modal with a clean form and closes other task overlays.
  function handleAddTaskOpen() {
    if (!hasColumns) {
      return
    }

    setActiveTaskId(null)
    setIsTaskMenuOpen(false)
    setIsViewStatusMenuOpen(false)

    setIsEditTaskModalOpen(false)
    setEditingTaskId(null)
    setIsEditStatusMenuOpen(false)

    setIsBoardMenuOpen(false)

    setIsAddBoardModalOpen(false)
    setAddBoardNameError('')

    setIsEditBoardModalOpen(false)
    resetEditBoardForm()

    resetDeleteBoardState()
    resetDeleteTaskState()

    setIsAddTaskModalOpen(true)
    resetAddTaskForm(statusOptions[0]?.value ?? '')
  }

  // Opens Add Board modal with a clean form and closes other task overlays.
  function handleAddBoardOpen() {
    setActiveTaskId(null)
    setIsTaskMenuOpen(false)
    setIsViewStatusMenuOpen(false)

    setIsAddTaskModalOpen(false)
    setIsAddStatusMenuOpen(false)

    setIsEditTaskModalOpen(false)
    setEditingTaskId(null)
    setIsEditStatusMenuOpen(false)

    setIsBoardMenuOpen(false)

    setIsEditBoardModalOpen(false)
    resetEditBoardForm()

    resetDeleteBoardState()
    resetDeleteTaskState()

    setIsAddBoardModalOpen(true)
    resetAddBoardForm()
  }

  // Closes the view-task modal and related menu/dropdown state.
  function handleViewTaskModalClose() {
    setActiveTaskId(null)
    setIsTaskMenuOpen(false)
    setIsViewStatusMenuOpen(false)
  }

  // Closes the Add Task modal and its status dropdown.
  function handleAddTaskModalClose() {
    setIsAddTaskModalOpen(false)
    setIsAddStatusMenuOpen(false)
  }

  // Closes the Add Board modal and clears board-name validation feedback.
  function handleAddBoardModalClose() {
    setIsAddBoardModalOpen(false)
    setAddBoardNameError('')
  }

  // Closes the Delete Board modal.
  function handleDeleteBoardModalClose() {
    resetDeleteBoardState()
  }

  // Toggles the header board-action menu.
  function handleBoardMenuToggle() {
    setIsBoardMenuOpen((previousMenuState) => !previousMenuState)
  }

  // Closes the header board-action menu.
  function handleBoardMenuClose() {
    setIsBoardMenuOpen(false)
  }

  // Opens the Delete Board modal from the header board-action menu.
  function handleBoardDeleteAction() {
    if (!activeBoard) {
      setIsBoardMenuOpen(false)
      return
    }

    setIsBoardMenuOpen(false)
    setIsEditBoardModalOpen(false)
    resetEditBoardForm()
    resetDeleteTaskState()
    setIsDeleteBoardModalOpen(true)
    setDeletingBoardId(activeBoard.id)
    setDeletingBoardName(activeBoard.name)
  }

  // Opens Edit Board modal from the header board-action menu and pre-fills form fields.
  function handleEditBoardOpen() {
    if (!activeBoard) {
      return
    }

    setActiveTaskId(null)
    setIsTaskMenuOpen(false)
    setIsViewStatusMenuOpen(false)

    setIsAddTaskModalOpen(false)
    setIsAddStatusMenuOpen(false)

    setIsEditTaskModalOpen(false)
    setEditingTaskId(null)
    setIsEditStatusMenuOpen(false)

    setIsAddBoardModalOpen(false)
    setAddBoardNameError('')

    setIsBoardMenuOpen(false)
    resetDeleteBoardState()
    resetDeleteTaskState()

    setEditingBoardId(activeBoard.id)
    setEditBoardName(activeBoard.name)
    setEditBoardNameError('')
    setEditBoardColumns(mapBoardColumnsToEditableItems(activeBoard))
    setEditBoardColumnsError('')
    setIsEditBoardModalOpen(true)
  }

  // Deletes the selected board locally and switches to the first remaining board.
  function handleDeleteBoardConfirm() {
    if (!deletingBoardId) {
      return
    }

    const remainingBoards = boardsData.filter((board) => board.id !== deletingBoardId)

    setBoardsData(remainingBoards)
    setActiveBoardId(remainingBoards[0]?.id ?? '')

    setActiveTaskId(null)
    setIsTaskMenuOpen(false)
    setIsViewStatusMenuOpen(false)
    setIsAddTaskModalOpen(false)
    setIsAddStatusMenuOpen(false)
    setIsEditTaskModalOpen(false)
    setEditingTaskId(null)
    setIsEditStatusMenuOpen(false)
    setIsAddBoardModalOpen(false)
    setAddBoardNameError('')
    setIsEditBoardModalOpen(false)
    resetEditBoardForm()
    setIsBoardMenuOpen(false)
    resetDeleteBoardState()
    resetDeleteTaskState()
  }

  // Closes the Edit Board modal and clears its local form state.
  function handleEditBoardModalClose() {
    setIsEditBoardModalOpen(false)
    resetEditBoardForm()
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

  // Toggles the view-task action menu and collapses the status dropdown.
  function handleTaskMenuToggle() {
    setIsViewStatusMenuOpen(false)
    setIsTaskMenuOpen((previousMenuState) => !previousMenuState)
  }

  // Opens Edit Task modal from the view-task action menu and pre-fills form fields.
  function handleEditTaskOpen() {
    if (!activeTask) {
      return
    }

    const editableSubtasks = mapTaskSubtasksToEditableItems(activeTask)

    setEditingTaskId(activeTask.id)
    setEditTaskTitle(activeTask.title)
    setEditTaskDescription(activeTask.description)
    setEditTaskStatusValue(activeTask.status)
    setEditTaskSubtasks(editableSubtasks.length > 0 ? editableSubtasks : [createEmptySubtaskItem('e.g. Make coffee')])
    setIsEditStatusMenuOpen(false)
    setIsEditTaskModalOpen(true)

    setIsTaskMenuOpen(false)
    setIsViewStatusMenuOpen(false)
    setActiveTaskId(null)

    setIsBoardMenuOpen(false)
    resetDeleteBoardState()
    resetDeleteTaskState()

    setIsAddBoardModalOpen(false)
    setAddBoardNameError('')

    setIsEditBoardModalOpen(false)
    resetEditBoardForm()
  }

  // Opens the Delete Task modal from the view-task action menu.
  function handleTaskDeleteAction() {
    if (!activeTask || !activeBoard) {
      setIsTaskMenuOpen(false)
      return
    }

    setIsTaskMenuOpen(false)
    setIsViewStatusMenuOpen(false)
    setActiveTaskId(null)
    setIsEditTaskModalOpen(false)
    setEditingTaskId(null)
    setIsEditStatusMenuOpen(false)
    setIsBoardMenuOpen(false)
    resetDeleteBoardState()

    setDeletingTaskBoardId(activeBoard.id)
    setDeletingTaskId(activeTask.id)
    setDeletingTaskName(activeTask.title)
    setIsDeleteTaskModalOpen(true)
  }

  // Closes the Delete Task modal.
  function handleDeleteTaskModalClose() {
    resetDeleteTaskState()
  }

  // Deletes the selected task locally from the active board context.
  function handleDeleteTaskConfirm() {
    if (!deletingTaskId || !deletingTaskBoardId) {
      return
    }

    setBoardsData((previousBoards) =>
      previousBoards.map((board) => {
        if (board.id !== deletingTaskBoardId) {
          return board
        }

        return {
          ...board,
          columns: board.columns.map((column) => ({
            ...column,
            tasks: column.tasks.filter((task) => task.id !== deletingTaskId),
          })),
        }
      }),
    )

    setActiveTaskId(null)
    setIsTaskMenuOpen(false)
    setIsViewStatusMenuOpen(false)
    setIsEditTaskModalOpen(false)
    setEditingTaskId(null)
    setIsEditStatusMenuOpen(false)
    resetDeleteTaskState()
  }

  // Closes the Edit Task modal and edit-status dropdown.
  function handleEditTaskModalClose() {
    setIsEditTaskModalOpen(false)
    setEditingTaskId(null)
    setIsEditStatusMenuOpen(false)
  }

  // Adds a new blank subtask row to the Add Task form.
  function handleAddTaskSubtaskAdd() {
    setAddTaskSubtasks((previousSubtasks) => [...previousSubtasks, createEmptySubtaskItem()])
    setAddTaskSubtasksError('')
  }

  // Removes a subtask row from the Add Task form by row ID.
  function handleAddTaskSubtaskRemove(subtaskId: string) {
    if (addTaskSubtasks.length <= 1) {
      setAddTaskSubtasksError('Keep at least one subtask')
      return
    }

    setAddTaskSubtasks((previousSubtasks) => previousSubtasks.filter((subtask) => subtask.id !== subtaskId))
    setAddTaskSubtasksError('')
  }

  // Updates one subtask row value in the Add Task form.
  function handleAddTaskSubtaskValueChange(subtaskId: string, nextValue: string) {
    setAddTaskSubtasks((previousSubtasks) =>
      previousSubtasks.map((subtask) => (subtask.id === subtaskId ? { ...subtask, errorMessage: undefined, value: nextValue } : subtask)),
    )
    setAddTaskSubtasksError('')
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
    const normalizedSubtasks = addTaskSubtasks.map((subtask) => ({
      id: subtask.id,
      title: subtask.value.trim(),
    }))
    const nextSubtasksWithErrors = addTaskSubtasks.map((subtask) => ({
      ...subtask,
      errorMessage: subtask.value.trim().length === 0 ? "Can't be empty" : undefined,
    }))
    const hasSubtaskError = nextSubtasksWithErrors.some((subtask) => Boolean(subtask.errorMessage))

    if (normalizedTitle.length === 0 || normalizedStatus.length === 0 || hasSubtaskError || normalizedSubtasks.length === 0) {
      setAddTaskSubtasks(nextSubtasksWithErrors)
      if (normalizedSubtasks.length === 0) {
        setAddTaskSubtasksError('Keep at least one subtask')
      }
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
      subtasks: normalizedSubtasks.map((subtask, subtaskIndex) => ({
        id: subtask.id || `${nextTaskId}-subtask-${subtaskIndex}`,
        isCompleted: false,
        title: subtask.title,
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

  // Updates the Add Board name field and clears validation once the value changes.
  function handleAddBoardNameChange(nextName: string) {
    setAddBoardName(nextName)

    if (addBoardNameError) {
      setAddBoardNameError('')
    }
  }

  // Adds a new blank column row to the Add Board form.
  function handleAddBoardColumnAdd() {
    setAddBoardColumns((previousColumns) => [...previousColumns, createEmptyBoardColumnItem()])
  }

  // Removes a column row from the Add Board form by row ID.
  function handleAddBoardColumnRemove(columnId: string) {
    setAddBoardColumns((previousColumns) => previousColumns.filter((column) => column.id !== columnId))
  }

  // Updates one column row value in the Add Board form.
  function handleAddBoardColumnValueChange(columnId: string, nextValue: string) {
    setAddBoardColumns((previousColumns) =>
      previousColumns.map((column) => (column.id === columnId ? { ...column, value: nextValue } : column)),
    )
  }

  // Creates a new board locally, blocking duplicate board names and allowing empty column rows.
  function handleCreateBoard() {
    const normalizedBoardName = addBoardName.trim()

    if (normalizedBoardName.length === 0) {
      setAddBoardNameError("Can't be empty")
      return
    }

    if (hasDuplicateBoardName(boardsData, normalizedBoardName)) {
      setAddBoardNameError('Board name already exists')
      return
    }

    const normalizedColumnNames = addBoardColumns
      .map((column) => column.value.trim())
      .filter((columnName) => columnName.length > 0)

    const nextBoardId = createClientId('board')
    const nextBoard: BoardPreview = {
      columns: normalizedColumnNames.map((columnName, columnIndex) => ({
        accentColor: COLUMN_ACCENT_COLORS[columnIndex % COLUMN_ACCENT_COLORS.length],
        id: `${nextBoardId}-column-${columnIndex}`,
        name: columnName,
        tasks: [],
      })),
      id: nextBoardId,
      name: normalizedBoardName,
    }

    setBoardsData((previousBoards) => [...previousBoards, nextBoard])
    setIsAddBoardModalOpen(false)
    resetAddBoardForm()
  }

  // Updates the Edit Board name field and clears validation once the value changes.
  function handleEditBoardNameChange(nextName: string) {
    setEditBoardName(nextName)

    if (editBoardNameError) {
      setEditBoardNameError('')
    }
  }

  // Adds a new blank column row to the Edit Board form.
  function handleEditBoardColumnAdd() {
    setEditBoardColumns((previousColumns) => [...previousColumns, createEmptyBoardColumnItem()])

    if (editBoardColumnsError) {
      setEditBoardColumnsError('')
    }
  }

  // Removes a column row from the Edit Board form by row ID.
  function handleEditBoardColumnRemove(columnId: string) {
    setEditBoardColumns((previousColumns) => previousColumns.filter((column) => column.id !== columnId))

    if (editBoardColumnsError) {
      setEditBoardColumnsError('')
    }
  }

  // Updates one column row value in the Edit Board form.
  function handleEditBoardColumnValueChange(columnId: string, nextValue: string) {
    setEditBoardColumns((previousColumns) =>
      previousColumns.map((column) => (column.id === columnId ? { ...column, value: nextValue } : column)),
    )

    if (editBoardColumnsError) {
      setEditBoardColumnsError('')
    }
  }

  // Saves board edits and moves tasks from removed columns into the first remaining column.
  function handleSaveBoardChanges() {
    if (!editingBoardId) {
      return
    }

    const boardToEdit = boardsData.find((board) => board.id === editingBoardId)

    if (!boardToEdit) {
      return
    }

    const normalizedBoardName = editBoardName.trim()

    if (normalizedBoardName.length === 0) {
      setEditBoardNameError("Can't be empty")
      return
    }

    if (hasDuplicateBoardName(boardsData, normalizedBoardName, editingBoardId)) {
      setEditBoardNameError('Board name already exists')
      return
    }

    const normalizedColumns = editBoardColumns
      .map((column) => ({
        id: column.id,
        name: column.value.trim(),
      }))
      .filter((column) => column.name.length > 0)

    const hasTasks = boardToEdit.columns.some((column) => column.tasks.length > 0)

    if (normalizedColumns.length === 0 && hasTasks) {
      setEditBoardColumnsError('Keep at least one column while this board has tasks')
      return
    }

    const existingColumnsById = new Map(boardToEdit.columns.map((column) => [column.id, column]))
    const retainedColumnIds = new Set(normalizedColumns.map((column) => column.id).filter((columnId) => existingColumnsById.has(columnId)))
    const movedTasks = boardToEdit.columns.filter((column) => !retainedColumnIds.has(column.id)).flatMap((column) => column.tasks)

    const updatedColumns = normalizedColumns.map((column, columnIndex) => {
      const existingColumn = existingColumnsById.get(column.id)
      const baseTasks = existingColumn?.tasks ?? []
      const columnTasks = columnIndex === 0 ? [...baseTasks, ...movedTasks] : baseTasks

      return {
        accentColor: COLUMN_ACCENT_COLORS[columnIndex % COLUMN_ACCENT_COLORS.length],
        id: existingColumn?.id ?? createClientId('column'),
        name: column.name,
        tasks: columnTasks.map((task) => ({
          ...task,
          status: column.name,
        })),
      }
    })

    const updatedBoard: BoardPreview = {
      ...boardToEdit,
      columns: updatedColumns,
      name: normalizedBoardName,
    }

    setBoardsData((previousBoards) => previousBoards.map((board) => (board.id === editingBoardId ? updatedBoard : board)))
    setIsEditBoardModalOpen(false)
    resetEditBoardForm()
  }

  // Adds a new blank subtask row in Edit Task form.
  function handleEditTaskSubtaskAdd() {
    setEditTaskSubtasks((previousSubtasks) => [...previousSubtasks, createEmptySubtaskItem()])
  }

  // Removes a subtask row from Edit Task form by row ID.
  function handleEditTaskSubtaskRemove(subtaskId: string) {
    setEditTaskSubtasks((previousSubtasks) => previousSubtasks.filter((subtask) => subtask.id !== subtaskId))
  }

  // Updates one subtask row value in Edit Task form.
  function handleEditTaskSubtaskValueChange(subtaskId: string, nextValue: string) {
    setEditTaskSubtasks((previousSubtasks) =>
      previousSubtasks.map((subtask) => (subtask.id === subtaskId ? { ...subtask, value: nextValue } : subtask)),
    )
  }

  // Selects status in Edit Task modal and collapses the dropdown menu.
  function handleEditTaskStatusSelect(nextStatusValue: string) {
    setEditTaskStatusValue(nextStatusValue)
    setIsEditStatusMenuOpen(false)
  }

  // Saves the edited task and moves it to the selected status column bottom.
  function handleSaveTaskChanges() {
    if (!activeBoard || !editingTaskId) {
      return
    }

    const normalizedTitle = editTaskTitle.trim()
    const normalizedStatus = editTaskStatusValue.trim()
    const normalizedSubtasks = editTaskSubtasks
      .map((subtask) => ({
        ...subtask,
        value: subtask.value.trim(),
      }))
      .filter((subtask) => subtask.value.length > 0)

    if (normalizedTitle.length === 0 || normalizedStatus.length === 0 || normalizedSubtasks.length === 0) {
      return
    }

    const targetColumn = activeBoard.columns.find((column) => column.name === normalizedStatus) ?? activeBoard.columns[0]

    if (!targetColumn) {
      return
    }

    setBoardsData((previousBoards) =>
      previousBoards.map((board) => {
        if (board.id !== activeBoard.id) {
          return board
        }

        const existingTask = board.columns.flatMap((column) => column.tasks).find((task) => task.id === editingTaskId)

        if (!existingTask) {
          return board
        }

        const updatedTask: BoardTaskPreview = {
          ...existingTask,
          completedSubtaskCount: normalizedSubtasks.filter((subtask) => Boolean(subtask.checked)).length,
          description: editTaskDescription.trim(),
          status: targetColumn.name,
          subtasks: normalizedSubtasks.map((subtask, subtaskIndex) => ({
            id: subtask.id || `${editingTaskId}-subtask-${subtaskIndex}`,
            isCompleted: Boolean(subtask.checked),
            title: subtask.value,
          })),
          title: normalizedTitle,
          totalSubtaskCount: normalizedSubtasks.length,
        }

        return {
          ...board,
          columns: board.columns.map((column) => {
            const tasksWithoutEditedTask = column.tasks.filter((task) => task.id !== editingTaskId)

            if (column.id !== targetColumn.id) {
              return {
                ...column,
                tasks: tasksWithoutEditedTask,
              }
            }

            return {
              ...column,
              tasks: [...tasksWithoutEditedTask, updatedTask],
            }
          }),
        }
      }),
    )

    setIsEditTaskModalOpen(false)
    setEditingTaskId(null)
    setIsEditStatusMenuOpen(false)
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
        onCreateBoard={handleAddBoardOpen}
        onHideSidebar={() => setIsSidebarHidden(true)}
        onShowSidebar={() => setIsSidebarHidden(false)}
        onThemeToggle={() => setMode((previousMode) => (previousMode === 'dark' ? 'light' : 'dark'))}
        theme={mode}
      />

      <div className={styles.contentArea}>
        <Header
          boardName={activeBoardName}
          isAddTaskDisabled={!hasColumns}
          isMenuOpen={isBoardMenuOpen}
          mode={mode}
          onAddTask={handleAddTaskOpen}
          onDeleteBoard={handleBoardDeleteAction}
          onEditBoard={handleEditBoardOpen}
          onMenuClose={handleBoardMenuClose}
          onMenuOpen={handleBoardMenuToggle}
          sidebarVisible={!isSidebarHidden}
        />
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
          isTaskMenuOpen={isTaskMenuOpen}
          mode={mode}
          onClose={handleViewTaskModalClose}
          onDeleteTask={handleTaskDeleteAction}
          onEditTask={handleEditTaskOpen}
          onMenuOpen={handleTaskMenuToggle}
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
          subtaskErrorMessage={addTaskSubtasksError}
          statusLabel="Status"
          statusOptions={statusOptions}
          statusValue={addTaskStatusValue}
          subtasks={addTaskSubtasks}
          taskDescriptionValue={addTaskDescription}
          taskTitleValue={addTaskTitle}
          variant="addTask"
        />
      ) : null}

      {isEditTaskModalOpen ? (
        <Modal
          isStatusMenuOpen={isEditStatusMenuOpen}
          mode={mode}
          onAddSubtask={handleEditTaskSubtaskAdd}
          onClose={handleEditTaskModalClose}
          onPrimaryAction={handleSaveTaskChanges}
          onStatusSelect={handleEditTaskStatusSelect}
          onStatusToggle={() => setIsEditStatusMenuOpen((previousOpenState) => !previousOpenState)}
          onSubtaskRemove={handleEditTaskSubtaskRemove}
          onSubtaskValueChange={handleEditTaskSubtaskValueChange}
          onTaskDescriptionChange={(event) => setEditTaskDescription(event.target.value)}
          onTaskTitleChange={(event) => setEditTaskTitle(event.target.value)}
          statusLabel="Status"
          statusOptions={statusOptions}
          statusValue={editTaskStatusValue}
          subtasks={editTaskSubtasks}
          taskDescriptionValue={editTaskDescription}
          taskTitleValue={editTaskTitle}
          variant="editTask"
        />
      ) : null}

      {isAddBoardModalOpen ? (
        <Modal
          boardNameErrorMessage={addBoardNameError}
          boardNameValue={addBoardName}
          columns={addBoardColumns}
          mode={mode}
          onAddColumn={handleAddBoardColumnAdd}
          onBoardNameChange={(event) => handleAddBoardNameChange(event.target.value)}
          onClose={handleAddBoardModalClose}
          onColumnRemove={handleAddBoardColumnRemove}
          onColumnValueChange={handleAddBoardColumnValueChange}
          onPrimaryAction={handleCreateBoard}
          variant="addBoard"
        />
      ) : null}

      {isEditBoardModalOpen ? (
        <Modal
          boardNameErrorMessage={editBoardNameError}
          boardNameValue={editBoardName}
          columns={editBoardColumns}
          columnsErrorMessage={editBoardColumnsError}
          mode={mode}
          onAddColumn={handleEditBoardColumnAdd}
          onBoardNameChange={(event) => handleEditBoardNameChange(event.target.value)}
          onClose={handleEditBoardModalClose}
          onColumnRemove={handleEditBoardColumnRemove}
          onColumnValueChange={handleEditBoardColumnValueChange}
          onPrimaryAction={handleSaveBoardChanges}
          variant="editBoard"
        />
      ) : null}

      {isDeleteBoardModalOpen ? (
        <Modal
          description={deleteBoardDescription}
          mode={mode}
          onClose={handleDeleteBoardModalClose}
          onPrimaryAction={handleDeleteBoardConfirm}
          onSecondaryAction={handleDeleteBoardModalClose}
          secondaryActionLabel="Cancel"
          title="Delete this board?"
          variant="deleteBoard"
        />
      ) : null}

      {isDeleteTaskModalOpen ? (
        <Modal
          description={deleteTaskDescription}
          mode={mode}
          onClose={handleDeleteTaskModalClose}
          onPrimaryAction={handleDeleteTaskConfirm}
          onSecondaryAction={handleDeleteTaskModalClose}
          secondaryActionLabel="Cancel"
          title="Delete this task?"
          variant="deleteTask"
        />
      ) : null}
    </main>
  )
}

export default App
