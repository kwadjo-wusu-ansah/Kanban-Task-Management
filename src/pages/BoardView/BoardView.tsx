import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import type { BoardPreview, BoardTaskPreview } from '../../data'
import { AddColumnCard, EmptyBoardState, Header, Modal, Sidebar, Tasks } from '../../components'
import type { DropdownOption, ModalItem, SidebarMode } from '../../components'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectBoardPreviews, selectSidebarBoards } from '../../store/selectors'
import {
  boardColumnsReordered,
  boardCreated,
  boardRemoved,
  boardUpdated,
  columnCreated,
  columnRemoved,
  columnUpdated,
  taskAdded,
  taskDeleted,
  taskMoved,
  taskUpdated,
} from '../../store/slices'
import { classNames } from '../../utils'
import styles from '../../App.module.css'

const DEFAULT_ADD_SUBTASK_PLACEHOLDERS = ['e.g. Make coffee', 'e.g. Drink coffee & smile']
const DEFAULT_ADD_BOARD_COLUMN_VALUES = ['Todo', 'Doing']
const DEFAULT_BOARD_COLUMN_PLACEHOLDER = 'e.g. Todo'
const COLUMN_ACCENT_COLORS = ['#49c4e5', '#8471f2', '#67e2ae']
const MOBILE_BREAKPOINT = 788
const FALLBACK_BOARD_NAME = 'Platform Launch'

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

// Renders the board view screen and syncs the active board with route params.
function BoardView() {
  const { boardId, taskId } = useParams()
  const dispatch = useAppDispatch()
  const boardPreviews = useAppSelector(selectBoardPreviews)
  const boards = useAppSelector(selectSidebarBoards)
  const navigate = useNavigate()
  const [mode, setMode] = useState<SidebarMode>('light')
  const [isSidebarHidden, setIsSidebarHidden] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(() => window.innerWidth < MOBILE_BREAKPOINT)
  const activeBoardId = boardId ?? boards[0]?.id ?? ''

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
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false)
  const [addColumnName, setAddColumnName] = useState('')
  const [addColumnNameError, setAddColumnNameError] = useState('')

  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(false)
  const [isMobileBoardsMenuOpen, setIsMobileBoardsMenuOpen] = useState(false)

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

  const activeBoard = getActiveBoard(boardPreviews, activeBoardId)
  const activeTask = getActiveTask(activeBoard, taskId ?? null)
  const activeBoardName = activeBoard?.name ?? FALLBACK_BOARD_NAME
  const hasColumns = (activeBoard?.columns.length ?? 0) > 0
  const boardCount = boards.length
  const statusOptions = buildStatusOptions(activeBoard)
  const deleteBoardDescription = buildDeleteBoardDescription(deletingBoardName || activeBoardName)
  const deleteTaskDescription = buildDeleteTaskDescription(deletingTaskName || activeTask?.title || '')
  const shouldRenderSidebar = !isMobileViewport
  const isHeaderSidebarVisible = shouldRenderSidebar && !isSidebarHidden

  // Keeps component board state aligned with URL params and redirects invalid board IDs.
  useEffect(() => {
    if (!boardId) {
      if (boardPreviews[0]) {
        navigate(`/board/${boardPreviews[0].id}`, { replace: true })
      }
      return
    }

    const hasMatchingBoard = boardPreviews.some((board) => board.id === boardId)

    if (!hasMatchingBoard) {
      if (boardPreviews[0]) {
        navigate(`/board/${boardPreviews[0].id}`, { replace: true })
      } else {
        navigate('/', { replace: true })
      }
      return
    }

  }, [boardId, boardPreviews, navigate])

  // Syncs task modal state with nested task route params and redirects unknown tasks.
  useEffect(() => {
    if (!taskId) {
      setIsTaskMenuOpen(false)
      setIsViewStatusMenuOpen(false)
      return
    }

    if (!activeBoard) {
      return
    }

    const nextTask = getActiveTask(activeBoard, taskId)

    if (!nextTask) {
      navigate(`/board/${activeBoardId}`, { replace: true })
      return
    }

    setViewStatusValue(nextTask.status)
    setViewSubtasks(mapTaskSubtasksToViewModalItems(nextTask))
    setIsTaskMenuOpen(false)
    setIsViewStatusMenuOpen(false)
  }, [activeBoard, activeBoardId, navigate, taskId])

  // Tracks the mobile breakpoint so the app can switch between desktop sidebar and mobile header layouts.
  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    function handleMobileBreakpointChange(event: MediaQueryListEvent) {
      setIsMobileViewport(event.matches)
    }

    setIsMobileViewport(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleMobileBreakpointChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMobileBreakpointChange)
    }
  }, [])

  // Closes the mobile boards popover when switching to tablet/desktop layouts.
  useEffect(() => {
    if (!isMobileViewport) {
      setIsMobileBoardsMenuOpen(false)
    }
  }, [isMobileViewport])

  // Closes both header menus so only one top-level menu is visible at a time.
  function closeHeaderMenus() {
    setIsBoardMenuOpen(false)
    setIsMobileBoardsMenuOpen(false)
  }

  // Navigates to the current board route while clearing any nested task segment.
  function navigateToBoardRoute(replace = false) {
    if (!activeBoardId) {
      navigate('/', { replace })
      return
    }

    if (replace) {
      navigate(`/board/${activeBoardId}`, { replace: true })
      return
    }

    navigate(`/board/${activeBoardId}`)
  }

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

  // Resets local Add Column form state to initial values.
  function resetAddColumnForm() {
    setAddColumnName('')
    setAddColumnNameError('')
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
    const nextBoard = getActiveBoard(boardPreviews, nextBoardId)
    const nextStatusOptions = buildStatusOptions(nextBoard)

    navigate(`/board/${nextBoardId}`)
    setIsTaskMenuOpen(false)
    setIsViewStatusMenuOpen(false)

    setIsAddTaskModalOpen(false)
    setIsAddStatusMenuOpen(false)
    setAddTaskStatusValue(nextStatusOptions[0]?.value ?? '')

    setIsEditTaskModalOpen(false)
    setEditingTaskId(null)
    setIsEditStatusMenuOpen(false)

    closeHeaderMenus()

    setIsAddBoardModalOpen(false)
    setAddBoardNameError('')
    setIsAddColumnModalOpen(false)
    resetAddColumnForm()

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

    closeHeaderMenus()

    setIsAddBoardModalOpen(false)
    setAddBoardNameError('')
    setIsAddColumnModalOpen(false)
    resetAddColumnForm()

    setIsEditBoardModalOpen(false)
    resetEditBoardForm()

    resetDeleteBoardState()
    resetDeleteTaskState()

    navigate(`/board/${activeBoardId}/task/${nextTask.id}`)
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

    navigateToBoardRoute()
    setIsTaskMenuOpen(false)
    setIsViewStatusMenuOpen(false)

    setIsEditTaskModalOpen(false)
    setEditingTaskId(null)
    setIsEditStatusMenuOpen(false)

    closeHeaderMenus()

    setIsAddBoardModalOpen(false)
    setAddBoardNameError('')
    setIsAddColumnModalOpen(false)
    resetAddColumnForm()

    setIsEditBoardModalOpen(false)
    resetEditBoardForm()

    resetDeleteBoardState()
    resetDeleteTaskState()

    setIsAddTaskModalOpen(true)
    resetAddTaskForm(statusOptions[0]?.value ?? '')
  }

  // Opens Add Board modal with a clean form and closes other task overlays.
  function handleAddBoardOpen() {
    navigateToBoardRoute()
    setIsTaskMenuOpen(false)
    setIsViewStatusMenuOpen(false)

    setIsAddTaskModalOpen(false)
    setIsAddStatusMenuOpen(false)

    setIsEditTaskModalOpen(false)
    setEditingTaskId(null)
    setIsEditStatusMenuOpen(false)

    closeHeaderMenus()
    setIsAddColumnModalOpen(false)
    resetAddColumnForm()

    setIsEditBoardModalOpen(false)
    resetEditBoardForm()

    resetDeleteBoardState()
    resetDeleteTaskState()

    setIsAddBoardModalOpen(true)
    resetAddBoardForm()
  }

  // Opens Add Column modal with a clean form and closes other overlays.
  function handleAddColumnOpen() {
    if (!activeBoard) {
      return
    }

    navigateToBoardRoute()
    setIsTaskMenuOpen(false)
    setIsViewStatusMenuOpen(false)
    setIsAddTaskModalOpen(false)
    setIsAddStatusMenuOpen(false)
    setIsEditTaskModalOpen(false)
    setEditingTaskId(null)
    setIsEditStatusMenuOpen(false)
    closeHeaderMenus()
    setIsAddBoardModalOpen(false)
    setAddBoardNameError('')
    setIsEditBoardModalOpen(false)
    resetEditBoardForm()
    resetDeleteBoardState()
    resetDeleteTaskState()
    setIsAddColumnModalOpen(true)
    resetAddColumnForm()
  }

  // Closes the view-task modal and related menu/dropdown state.
  function handleViewTaskModalClose() {
    navigateToBoardRoute()
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

  // Closes the Add Column modal and clears column-name validation feedback.
  function handleAddColumnModalClose() {
    setIsAddColumnModalOpen(false)
    resetAddColumnForm()
  }

  // Closes the Delete Board modal.
  function handleDeleteBoardModalClose() {
    resetDeleteBoardState()
  }

  // Toggles the header board-action menu.
  function handleBoardMenuToggle() {
    setIsMobileBoardsMenuOpen(false)
    setIsBoardMenuOpen((previousMenuState) => !previousMenuState)
  }

  // Closes the header board-action menu.
  function handleBoardMenuClose() {
    setIsBoardMenuOpen(false)
  }

  // Toggles the mobile board switcher popover from the header board title.
  function handleMobileBoardsMenuToggle() {
    setIsBoardMenuOpen(false)
    setIsMobileBoardsMenuOpen((previousMenuState) => !previousMenuState)
  }

  // Closes the mobile board switcher popover.
  function handleMobileBoardsMenuClose() {
    setIsMobileBoardsMenuOpen(false)
  }

  // Opens the Delete Board modal from the header board-action menu.
  function handleBoardDeleteAction() {
    if (!activeBoard) {
      closeHeaderMenus()
      return
    }

    closeHeaderMenus()
    setIsAddColumnModalOpen(false)
    resetAddColumnForm()
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

    navigateToBoardRoute()
    setIsTaskMenuOpen(false)
    setIsViewStatusMenuOpen(false)

    setIsAddTaskModalOpen(false)
    setIsAddStatusMenuOpen(false)

    setIsEditTaskModalOpen(false)
    setEditingTaskId(null)
    setIsEditStatusMenuOpen(false)

    setIsAddBoardModalOpen(false)
    setAddBoardNameError('')
    setIsAddColumnModalOpen(false)
    resetAddColumnForm()

    closeHeaderMenus()
    resetDeleteBoardState()
    resetDeleteTaskState()

    setEditingBoardId(activeBoard.id)
    setEditBoardName(activeBoard.name)
    setEditBoardNameError('')
    setEditBoardColumns(mapBoardColumnsToEditableItems(activeBoard))
    setEditBoardColumnsError('')
    setIsEditBoardModalOpen(true)
  }

  // Deletes the selected board in the store and switches to the first remaining board.
  function handleDeleteBoardConfirm() {
    if (!deletingBoardId) {
      return
    }

    const nextBoardId = boardPreviews.find((board) => board.id !== deletingBoardId)?.id
    dispatch(boardRemoved({ boardId: deletingBoardId }))

    if (nextBoardId) {
      navigate(`/board/${nextBoardId}`, { replace: true })
    } else {
      navigate('/', { replace: true })
    }

    setIsTaskMenuOpen(false)
    setIsViewStatusMenuOpen(false)
    setIsAddTaskModalOpen(false)
    setIsAddStatusMenuOpen(false)
    setIsEditTaskModalOpen(false)
    setEditingTaskId(null)
    setIsEditStatusMenuOpen(false)
    setIsAddBoardModalOpen(false)
    setAddBoardNameError('')
    setIsAddColumnModalOpen(false)
    resetAddColumnForm()
    setIsEditBoardModalOpen(false)
    resetEditBoardForm()
    closeHeaderMenus()
    resetDeleteBoardState()
    resetDeleteTaskState()
  }

  // Closes the Edit Board modal and clears its local form state.
  function handleEditBoardModalClose() {
    setIsEditBoardModalOpen(false)
    resetEditBoardForm()
  }

  // Toggles a subtask checkbox and persists the updated completion state in the store.
  function handleViewTaskSubtaskToggle(subtaskId: string) {
    if (!activeTask) {
      return
    }

    const nextSubtasks = viewSubtasks.map((subtask) => (subtask.id === subtaskId ? { ...subtask, checked: !subtask.checked } : subtask))

    setViewSubtasks(nextSubtasks)
    dispatch(
      taskUpdated({
        changes: {
          subtasks: nextSubtasks.map((subtask) => ({
            id: subtask.id,
            isCompleted: Boolean(subtask.checked),
            title: subtask.value,
          })),
        },
        taskId: activeTask.id,
      }),
    )
  }

  // Selects a new task status and moves the task to the matching column.
  function handleViewTaskStatusSelect(nextStatusValue: string) {
    if (!activeBoard || !activeTask) {
      setIsViewStatusMenuOpen(false)
      return
    }

    const targetColumn = activeBoard.columns.find((column) => column.name === nextStatusValue)

    if (targetColumn && nextStatusValue !== activeTask.status) {
      dispatch(taskMoved({ destinationColumnId: targetColumn.id, taskId: activeTask.id }))
    }

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
    navigateToBoardRoute()

    closeHeaderMenus()
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
    navigateToBoardRoute()
    setIsEditTaskModalOpen(false)
    setEditingTaskId(null)
    setIsEditStatusMenuOpen(false)
    closeHeaderMenus()
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

  // Deletes the selected task from the store and closes task-level overlays.
  function handleDeleteTaskConfirm() {
    if (!deletingTaskId || !deletingTaskBoardId) {
      return
    }

    dispatch(taskDeleted({ taskId: deletingTaskId }))

    setIsTaskMenuOpen(false)
    setIsViewStatusMenuOpen(false)
    setIsEditTaskModalOpen(false)
    setEditingTaskId(null)
    setIsEditStatusMenuOpen(false)
    navigate(`/board/${deletingTaskBoardId}`, { replace: true })
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

  // Creates a new task in the store at the bottom of the selected status column.
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
    dispatch(
      taskAdded({
        boardId: activeBoard.id,
        columnId: targetColumn.id,
        task: {
          description: addTaskDescription.trim(),
          id: nextTaskId,
          status: targetColumn.name,
          subtasks: normalizedSubtasks.map((subtask, subtaskIndex) => ({
            id: subtask.id || `${nextTaskId}-subtask-${subtaskIndex}`,
            isCompleted: false,
            title: subtask.title,
          })),
          title: normalizedTitle,
        },
      }),
    )

    setIsAddTaskModalOpen(false)
    setIsAddStatusMenuOpen(false)
    resetAddTaskForm(targetColumn.name)
  }

  // Updates the Add Column name field and clears validation once the value changes.
  function handleAddColumnNameChange(nextName: string) {
    setAddColumnName(nextName)

    if (addColumnNameError) {
      setAddColumnNameError('')
    }
  }

  // Creates a new column in the store at the end of the active board column list.
  function handleCreateColumn() {
    if (!activeBoard) {
      return
    }

    const normalizedColumnName = addColumnName.trim()

    if (normalizedColumnName.length === 0) {
      setAddColumnNameError("Can't be empty")
      return
    }

    const nextColumnIndex = activeBoard.columns.length
    dispatch(
      columnCreated({
        boardId: activeBoard.id,
        column: {
          accentColor: COLUMN_ACCENT_COLORS[nextColumnIndex % COLUMN_ACCENT_COLORS.length],
          id: createClientId('column'),
          name: normalizedColumnName,
        },
      }),
    )

    setIsAddColumnModalOpen(false)
    resetAddColumnForm()
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

  // Creates a new board in the store, blocking duplicate board names and allowing empty column rows.
  function handleCreateBoard() {
    const normalizedBoardName = addBoardName.trim()

    if (normalizedBoardName.length === 0) {
      setAddBoardNameError("Can't be empty")
      return
    }

    if (hasDuplicateBoardName(boardPreviews, normalizedBoardName)) {
      setAddBoardNameError('Board name already exists')
      return
    }

    const normalizedColumnNames = addBoardColumns
      .map((column) => column.value.trim())
      .filter((columnName) => columnName.length > 0)

    const nextBoardId = createClientId('board')
    dispatch(
      boardCreated({
        boardId: nextBoardId,
        columns: normalizedColumnNames.map((columnName, columnIndex) => ({
          accentColor: COLUMN_ACCENT_COLORS[columnIndex % COLUMN_ACCENT_COLORS.length],
          id: `${nextBoardId}-column-${columnIndex}`,
          name: columnName,
        })),
        name: normalizedBoardName,
      }),
    )
    navigate(`/board/${nextBoardId}`)
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

    const boardToEdit = boardPreviews.find((board) => board.id === editingBoardId)

    if (!boardToEdit) {
      return
    }

    const normalizedBoardName = editBoardName.trim()

    if (normalizedBoardName.length === 0) {
      setEditBoardNameError("Can't be empty")
      return
    }

    if (hasDuplicateBoardName(boardPreviews, normalizedBoardName, editingBoardId)) {
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

    if (normalizedColumns.length === 0) {
      boardToEdit.columns.forEach((column) => {
        dispatch(columnRemoved({ boardId: editingBoardId, columnId: column.id }))
      })
      dispatch(boardColumnsReordered({ boardId: editingBoardId, columnIds: [] }))
      dispatch(boardUpdated({ boardId: editingBoardId, changes: { name: normalizedBoardName } }))
      setIsEditBoardModalOpen(false)
      resetEditBoardForm()
      return
    }

    const existingColumnIds = new Set(boardToEdit.columns.map((column) => column.id))
    const nextColumns = normalizedColumns.map((column, columnIndex) => {
      const isExisting = existingColumnIds.has(column.id)

      return {
        accentColor: COLUMN_ACCENT_COLORS[columnIndex % COLUMN_ACCENT_COLORS.length],
        id: isExisting ? column.id : createClientId('column'),
        isExisting,
        name: column.name,
      }
    })
    const nextColumnIds = nextColumns.map((column) => column.id)
    const fallbackColumnId = nextColumnIds[0]

    nextColumns.forEach((column, columnIndex) => {
      if (!column.isExisting) {
        dispatch(
          columnCreated({
            boardId: editingBoardId,
            column: {
              accentColor: column.accentColor,
              id: column.id,
              name: column.name,
            },
            index: columnIndex,
          }),
        )
        return
      }

      dispatch(
        columnUpdated({
          changes: {
            accentColor: column.accentColor,
            name: column.name,
          },
          columnId: column.id,
        }),
      )
    })

    boardToEdit.columns
      .map((column) => column.id)
      .filter((columnId) => !normalizedColumns.some((column) => column.id === columnId))
      .forEach((columnId) => {
        dispatch(
          columnRemoved({
            boardId: editingBoardId,
            columnId,
            targetColumnId: fallbackColumnId,
          }),
        )
      })

    dispatch(boardColumnsReordered({ boardId: editingBoardId, columnIds: nextColumnIds }))
    dispatch(boardUpdated({ boardId: editingBoardId, changes: { name: normalizedBoardName } }))
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

    const existingTask = activeBoard.columns.flatMap((column) => column.tasks).find((task) => task.id === editingTaskId)

    if (!existingTask) {
      return
    }

    if (existingTask.status !== targetColumn.name) {
      dispatch(taskMoved({ destinationColumnId: targetColumn.id, taskId: editingTaskId }))
    }

    dispatch(
      taskUpdated({
        changes: {
          description: editTaskDescription.trim(),
          status: targetColumn.name,
          subtasks: normalizedSubtasks.map((subtask, subtaskIndex) => ({
            id: subtask.id || `${editingTaskId}-subtask-${subtaskIndex}`,
            isCompleted: Boolean(subtask.checked),
            title: subtask.value,
          })),
          title: normalizedTitle,
        },
        taskId: editingTaskId,
      }),
    )

    setIsEditTaskModalOpen(false)
    setEditingTaskId(null)
    setIsEditStatusMenuOpen(false)
  }

  return (
    <main className={classNames(styles.app, mode === 'dark' ? styles.appDark : styles.appLight)}>
      {shouldRenderSidebar ? (
        <Sidebar
          activeBoardId={activeBoardId}
          boardCount={boardCount}
          boards={boards}
          hidden={isSidebarHidden}
          mode={mode}
          onBoardSelect={handleBoardSelect}
          onCreateBoard={handleAddBoardOpen}
          onHideSidebar={() => setIsSidebarHidden(true)}
          onLogoClick={() => navigate('/')}
          onShowSidebar={() => setIsSidebarHidden(false)}
          onThemeToggle={() => setMode((previousMode) => (previousMode === 'dark' ? 'light' : 'dark'))}
          theme={mode}
        />
      ) : null}
      {isMobileViewport ? (
        <Sidebar
          activeBoardId={activeBoardId}
          boardCount={boardCount}
          boards={boards}
          isMobile
          mobileMenuOpen={isMobileBoardsMenuOpen}
          mode={mode}
          onBoardSelect={handleBoardSelect}
          onCreateBoard={handleAddBoardOpen}
          onLogoClick={() => navigate('/')}
          onMobileMenuClose={handleMobileBoardsMenuClose}
          onThemeToggle={() => setMode((previousMode) => (previousMode === 'dark' ? 'light' : 'dark'))}
          theme={mode}
        />
      ) : null}

      <div className={styles.contentArea}>
        <Header
          boardName={activeBoardName}
          isBoardSwitcherOpen={isMobileBoardsMenuOpen}
          isMobile={isMobileViewport}
          isAddTaskDisabled={!hasColumns}
          isMenuOpen={isBoardMenuOpen}
          mode={mode}
          onAddTask={handleAddTaskOpen}
          onBoardSwitcherToggle={handleMobileBoardsMenuToggle}
          onDeleteBoard={handleBoardDeleteAction}
          onEditBoard={handleEditBoardOpen}
          onLogoClick={() => navigate('/')}
          onMenuClose={handleBoardMenuClose}
          onMenuOpen={handleBoardMenuToggle}
          sidebarVisible={isHeaderSidebarVisible}
        />
        <section className={classNames(styles.boardCanvas, mode === 'dark' ? styles.boardCanvasDark : styles.boardCanvasLight)}>
          {hasColumns ? (
            <div className={styles.columnsScroller}>
              {activeBoard?.columns.map((column, columnIndex) => (
                <Tasks
                  accentColor={column.accentColor || COLUMN_ACCENT_COLORS[columnIndex % COLUMN_ACCENT_COLORS.length]}
                  columnId={column.id}
                  key={column.id}
                  mode={mode}
                  onTaskSelect={handleTaskSelect}
                />
              ))}
              <div className={styles.addColumnLane}>
                <AddColumnCard mode={mode} onClick={handleAddColumnOpen} />
              </div>
            </div>
          ) : (
            <div className={styles.emptyStateWrapper}>
              <EmptyBoardState mode={mode} onAddColumn={handleAddColumnOpen} />
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

      {isAddColumnModalOpen ? (
        <Modal
          columnNameErrorMessage={addColumnNameError}
          columnNameValue={addColumnName}
          mode={mode}
          onClose={handleAddColumnModalClose}
          onColumnNameChange={(event) => handleAddColumnNameChange(event.target.value)}
          onPrimaryAction={handleCreateColumn}
          onSecondaryAction={handleAddColumnModalClose}
          secondaryActionLabel="Cancel"
          variant="addColumn"
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

export default BoardView
