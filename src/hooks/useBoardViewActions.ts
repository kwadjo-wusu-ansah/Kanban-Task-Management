import type { DragEndEvent } from '@dnd-kit/core'
import type { Dispatch, SetStateAction } from 'react'
import type { NavigateFunction } from 'react-router'
import type { DropdownOption, ModalItem } from '../components'
import type { BoardPreview, BoardTaskPreview } from '../data'
import type { AppDispatch } from '../store'
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
} from '../store/slices'
import { fromColumnDragId, fromTaskDragId } from '../utils'

type StateSetter<T> = Dispatch<SetStateAction<T>>

interface UseBoardViewActionsParams {
  activeBoard: BoardPreview | undefined
  activeBoardId: string
  activeTask: BoardTaskPreview | undefined
  addBoardColumns: ModalItem[]
  addBoardName: string
  addColumnName: string
  addTaskDescription: string
  addTaskStatusValue: string
  addTaskSubtasks: ModalItem[]
  addTaskTitle: string
  boardPreviews: BoardPreview[]
  buildStatusOptions: (board: BoardPreview | undefined) => DropdownOption[]
  closeBoardModals: () => void
  closeHeaderMenus: () => void
  closeTaskMenus: () => void
  closeTaskModals: () => void
  columnAccentColors: string[]
  createClientId: (prefix: string) => string
  createEmptySubtaskItem: (placeholder?: string) => ModalItem
  deletingBoardId: string | null
  deletingTaskBoardId: string | null
  deletingTaskId: string | null
  dispatch: AppDispatch
  editBoardColumns: ModalItem[]
  editBoardName: string
  editTaskDescription: string
  editTaskStatusValue: string
  editTaskSubtasks: ModalItem[]
  editTaskTitle: string
  editingBoardId: string | null
  editingTaskId: string | null
  getActiveBoard: (boards: BoardPreview[], boardId: string) => BoardPreview | undefined
  getActiveTask: (board: BoardPreview | undefined, taskId: string | null) => BoardTaskPreview | undefined
  hasColumns: boolean
  hasDuplicateBoardName: (boards: BoardPreview[], boardName: string, excludedBoardId?: string) => boolean
  mapBoardColumnsToEditableItems: (board: BoardPreview) => ModalItem[]
  mapTaskSubtasksToEditableItems: (task: BoardTaskPreview) => ModalItem[]
  mapTaskSubtasksToViewModalItems: (task: BoardTaskPreview) => ModalItem[]
  navigate: NavigateFunction
  navigateToBoardRoute: (replace?: boolean) => void
  resetAddBoardForm: () => void
  resetAddColumnForm: () => void
  resetAddTaskForm: (initialStatusValue?: string) => void
  resetDeleteTaskState: () => void
  resetEditBoardForm: () => void
  resetOverlayDrivenUiState: () => void
  setAddBoardNameError: StateSetter<string>
  setAddColumnNameError: StateSetter<string>
  setAddTaskStatusValue: StateSetter<string>
  setAddTaskSubtasks: StateSetter<ModalItem[]>
  setAddTaskSubtasksError: StateSetter<string>
  setDeletingBoardId: StateSetter<string | null>
  setDeletingBoardName: StateSetter<string>
  setDeletingTaskBoardId: StateSetter<string | null>
  setDeletingTaskId: StateSetter<string | null>
  setDeletingTaskName: StateSetter<string>
  setEditBoardColumns: StateSetter<ModalItem[]>
  setEditBoardColumnsError: StateSetter<string>
  setEditBoardName: StateSetter<string>
  setEditBoardNameError: StateSetter<string>
  setEditTaskDescription: StateSetter<string>
  setEditingBoardId: StateSetter<string | null>
  setEditingTaskId: StateSetter<string | null>
  setEditTaskStatusValue: StateSetter<string>
  setEditTaskSubtasks: StateSetter<ModalItem[]>
  setEditTaskTitle: StateSetter<string>
  setIsAddBoardModalOpen: StateSetter<boolean>
  setIsAddColumnModalOpen: StateSetter<boolean>
  setIsAddTaskModalOpen: StateSetter<boolean>
  setIsDeleteBoardModalOpen: StateSetter<boolean>
  setIsDeleteTaskModalOpen: StateSetter<boolean>
  setIsEditBoardModalOpen: StateSetter<boolean>
  setIsEditStatusMenuOpen: StateSetter<boolean>
  setIsEditTaskModalOpen: StateSetter<boolean>
  setIsViewStatusMenuOpen: StateSetter<boolean>
  setViewStatusValue: StateSetter<string>
  setViewSubtasks: StateSetter<ModalItem[]>
  statusOptions: DropdownOption[]
  viewSubtasks: ModalItem[]
}

interface UseBoardViewActionsResult {
  handleAddBoardOpen: () => void
  handleAddColumnOpen: () => void
  handleAddTaskOpen: () => void
  handleBoardDeleteAction: () => void
  handleBoardSelect: (nextBoardId: string) => void
  handleCreateBoard: () => void
  handleCreateColumn: () => void
  handleCreateTask: () => void
  handleDeleteBoardConfirm: () => void
  handleDeleteTaskConfirm: () => void
  handleEditBoardOpen: () => void
  handleEditTaskOpen: () => void
  handleSaveBoardChanges: () => void
  handleSaveTaskChanges: () => void
  handleTaskDeleteAction: () => void
  handleTaskDragEnd: (event: DragEndEvent) => void
  handleTaskSelect: (taskId: string) => void
  handleViewTaskStatusSelect: (nextStatusValue: string) => void
  handleViewTaskSubtaskToggle: (subtaskId: string) => void
}

// Resolves the board column that currently owns the provided task ID.
function getTaskColumn(board: BoardPreview | undefined, taskId: string): BoardPreview['columns'][number] | undefined {
  if (!board) {
    return undefined
  }

  return board.columns.find((column) => column.tasks.some((task) => task.id === taskId))
}

// Centralizes board/task action handlers for BoardView while preserving existing behavior.
export function useBoardViewActions(params: UseBoardViewActionsParams): UseBoardViewActionsResult {
  const {
    activeBoard,
    activeBoardId,
    activeTask,
    addBoardColumns,
    addBoardName,
    addColumnName,
    addTaskDescription,
    addTaskStatusValue,
    addTaskSubtasks,
    addTaskTitle,
    boardPreviews,
    buildStatusOptions,
    closeBoardModals,
    closeHeaderMenus,
    closeTaskMenus,
    closeTaskModals,
    columnAccentColors,
    createClientId,
    createEmptySubtaskItem,
    deletingBoardId,
    deletingTaskBoardId,
    deletingTaskId,
    dispatch,
    editBoardColumns,
    editBoardName,
    editTaskDescription,
    editTaskStatusValue,
    editTaskSubtasks,
    editTaskTitle,
    editingBoardId,
    editingTaskId,
    getActiveBoard,
    getActiveTask,
    hasColumns,
    hasDuplicateBoardName,
    mapBoardColumnsToEditableItems,
    mapTaskSubtasksToEditableItems,
    mapTaskSubtasksToViewModalItems,
    navigate,
    navigateToBoardRoute,
    resetAddBoardForm,
    resetAddColumnForm,
    resetAddTaskForm,
    resetDeleteTaskState,
    resetEditBoardForm,
    resetOverlayDrivenUiState,
    setAddBoardNameError,
    setAddColumnNameError,
    setAddTaskStatusValue,
    setAddTaskSubtasks,
    setAddTaskSubtasksError,
    setDeletingBoardId,
    setDeletingBoardName,
    setDeletingTaskBoardId,
    setDeletingTaskId,
    setDeletingTaskName,
    setEditBoardColumns,
    setEditBoardColumnsError,
    setEditBoardName,
    setEditBoardNameError,
    setEditTaskDescription,
    setEditingBoardId,
    setEditingTaskId,
    setEditTaskStatusValue,
    setEditTaskSubtasks,
    setEditTaskTitle,
    setIsAddBoardModalOpen,
    setIsAddColumnModalOpen,
    setIsAddTaskModalOpen,
    setIsDeleteBoardModalOpen,
    setIsDeleteTaskModalOpen,
    setIsEditBoardModalOpen,
    setIsEditStatusMenuOpen,
    setIsEditTaskModalOpen,
    setIsViewStatusMenuOpen,
    setViewStatusValue,
    setViewSubtasks,
    statusOptions,
    viewSubtasks,
  } = params

  // Handles sidebar board changes and closes all open task modals and menus.
  function handleBoardSelect(nextBoardId: string) {
    const nextBoard = getActiveBoard(boardPreviews, nextBoardId)
    const nextStatusOptions = buildStatusOptions(nextBoard)

    navigate(`/board/${nextBoardId}`)
    resetOverlayDrivenUiState()
    setAddTaskStatusValue(nextStatusOptions[0]?.value ?? '')
  }

  // Handles task drag completion and dispatches cross-column or in-column task moves.
  function handleTaskDragEnd(event: DragEndEvent) {
    if (!activeBoard || !event.over) {
      return
    }

    const activeTaskId = fromTaskDragId(String(event.active.id))

    if (!activeTaskId) {
      return
    }

    const sourceColumn = getTaskColumn(activeBoard, activeTaskId)

    if (!sourceColumn) {
      return
    }

    const overDragId = String(event.over.id)
    const overTaskId = fromTaskDragId(overDragId)
    const overColumnId = fromColumnDragId(overDragId)
    let destinationColumnId: string | undefined
    let destinationIndex = -1

    if (overTaskId) {
      const destinationColumn = getTaskColumn(activeBoard, overTaskId)

      if (!destinationColumn) {
        return
      }

      destinationColumnId = destinationColumn.id
      destinationIndex = destinationColumn.tasks.findIndex((task) => task.id === overTaskId)
    } else if (overColumnId) {
      const destinationColumn = activeBoard.columns.find((column) => column.id === overColumnId)

      if (!destinationColumn) {
        return
      }

      destinationColumnId = destinationColumn.id
      destinationIndex = destinationColumn.tasks.length
    }

    if (!destinationColumnId || destinationIndex < 0) {
      return
    }

    const sourceTaskIndex = sourceColumn.tasks.findIndex((task) => task.id === activeTaskId)

    if (sourceTaskIndex < 0) {
      return
    }

    if (sourceColumn.id === destinationColumnId && sourceTaskIndex === destinationIndex) {
      return
    }

    dispatch(
      taskMoved({
        destinationColumnId,
        index: destinationIndex,
        taskId: activeTaskId,
      }),
    )
  }

  // Opens the view-task modal using the clicked task and local interactive state.
  function handleTaskSelect(taskId: string) {
    const nextTask = getActiveTask(activeBoard, taskId)

    if (!nextTask) {
      return
    }

    resetOverlayDrivenUiState()
    navigate(`/board/${activeBoardId}/task/${nextTask.id}`)
    setViewStatusValue(nextTask.status)
    setViewSubtasks(mapTaskSubtasksToViewModalItems(nextTask))
  }

  // Opens Add Task modal with a clean form and closes other task overlays.
  function handleAddTaskOpen() {
    if (!hasColumns) {
      return
    }

    navigateToBoardRoute()
    resetOverlayDrivenUiState()
    setIsAddTaskModalOpen(true)
    resetAddTaskForm(statusOptions[0]?.value ?? '')
  }

  // Opens Add Board modal with a clean form and closes other task overlays.
  function handleAddBoardOpen() {
    navigateToBoardRoute()
    resetOverlayDrivenUiState()
    setIsAddBoardModalOpen(true)
    resetAddBoardForm()
  }

  // Opens Add Column modal with a clean form and closes other overlays.
  function handleAddColumnOpen() {
    if (!activeBoard) {
      return
    }

    navigateToBoardRoute()
    resetOverlayDrivenUiState()
    setIsAddColumnModalOpen(true)
    resetAddColumnForm()
  }

  // Opens the Delete Board modal from the header board-action menu.
  function handleBoardDeleteAction() {
    if (!activeBoard) {
      closeHeaderMenus()
      return
    }

    closeHeaderMenus()
    closeBoardModals()
    resetAddColumnForm()
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
    resetOverlayDrivenUiState()
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

    resetOverlayDrivenUiState()
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

  // Opens Edit Task modal from the view-task action menu and pre-fills form fields.
  function handleEditTaskOpen() {
    if (!activeTask) {
      return
    }

    const editableSubtasks = mapTaskSubtasksToEditableItems(activeTask)

    navigateToBoardRoute()
    resetOverlayDrivenUiState()
    setEditingTaskId(activeTask.id)
    setEditTaskTitle(activeTask.title)
    setEditTaskDescription(activeTask.description)
    setEditTaskStatusValue(activeTask.status)
    setEditTaskSubtasks(editableSubtasks.length > 0 ? editableSubtasks : [createEmptySubtaskItem('e.g. Make coffee')])
    setIsEditStatusMenuOpen(false)
    setIsEditTaskModalOpen(true)
  }

  // Opens the Delete Task modal from the view-task action menu.
  function handleTaskDeleteAction() {
    if (!activeTask || !activeBoard) {
      closeTaskMenus()
      return
    }

    navigateToBoardRoute()
    resetOverlayDrivenUiState()
    setDeletingTaskBoardId(activeBoard.id)
    setDeletingTaskId(activeTask.id)
    setDeletingTaskName(activeTask.title)
    setIsDeleteTaskModalOpen(true)
  }

  // Deletes the selected task from the store and closes task-level overlays.
  function handleDeleteTaskConfirm() {
    if (!deletingTaskId || !deletingTaskBoardId) {
      return
    }

    dispatch(taskDeleted({ taskId: deletingTaskId }))

    closeTaskMenus()
    closeTaskModals()
    setEditingTaskId(null)
    navigate(`/board/${deletingTaskBoardId}`, { replace: true })
    resetDeleteTaskState()
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

    closeTaskModals()
    resetAddTaskForm(targetColumn.name)
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
          accentColor: columnAccentColors[nextColumnIndex % columnAccentColors.length],
          id: createClientId('column'),
          name: normalizedColumnName,
        },
      }),
    )

    setIsAddColumnModalOpen(false)
    resetAddColumnForm()
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
          accentColor: columnAccentColors[columnIndex % columnAccentColors.length],
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
        accentColor: columnAccentColors[columnIndex % columnAccentColors.length],
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

  return {
    handleAddBoardOpen,
    handleAddColumnOpen,
    handleAddTaskOpen,
    handleBoardDeleteAction,
    handleBoardSelect,
    handleCreateBoard,
    handleCreateColumn,
    handleCreateTask,
    handleDeleteBoardConfirm,
    handleDeleteTaskConfirm,
    handleEditBoardOpen,
    handleEditTaskOpen,
    handleSaveBoardChanges,
    handleSaveTaskChanges,
    handleTaskDeleteAction,
    handleTaskDragEnd,
    handleTaskSelect,
    handleViewTaskStatusSelect,
    handleViewTaskSubtaskToggle,
  }
}
