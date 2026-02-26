import type { Dispatch, SetStateAction } from 'react'
import type { ModalItem } from '../components'

type StateSetter<T> = Dispatch<SetStateAction<T>>

interface UseBoardViewUiHandlersParams {
  addBoardNameError: string
  addColumnNameError: string
  addTaskSubtasks: ModalItem[]
  closeTaskMenus: () => void
  closeTaskModals: () => void
  createEmptyBoardColumnItem: (value?: string) => ModalItem
  createEmptySubtaskItem: (placeholder?: string) => ModalItem
  editBoardColumnsError: string
  editBoardNameError: string
  navigateToBoardRoute: (replace?: boolean) => void
  resetAddColumnForm: () => void
  resetDeleteBoardState: () => void
  resetDeleteTaskState: () => void
  resetEditBoardForm: () => void
  setAddBoardColumns: StateSetter<ModalItem[]>
  setAddBoardName: StateSetter<string>
  setAddBoardNameError: StateSetter<string>
  setAddColumnName: StateSetter<string>
  setAddColumnNameError: StateSetter<string>
  setAddTaskStatusValue: StateSetter<string>
  setAddTaskSubtasks: StateSetter<ModalItem[]>
  setAddTaskSubtasksError: StateSetter<string>
  setEditBoardColumns: StateSetter<ModalItem[]>
  setEditBoardColumnsError: StateSetter<string>
  setEditBoardName: StateSetter<string>
  setEditBoardNameError: StateSetter<string>
  setEditingTaskId: StateSetter<string | null>
  setEditTaskStatusValue: StateSetter<string>
  setEditTaskSubtasks: StateSetter<ModalItem[]>
  setIsAddBoardModalOpen: StateSetter<boolean>
  setIsAddColumnModalOpen: StateSetter<boolean>
  setIsAddStatusMenuOpen: StateSetter<boolean>
  setIsBoardMenuOpen: StateSetter<boolean>
  setIsEditBoardModalOpen: StateSetter<boolean>
  setIsEditStatusMenuOpen: StateSetter<boolean>
  setIsMobileBoardsMenuOpen: StateSetter<boolean>
  setIsTaskMenuOpen: StateSetter<boolean>
  setIsViewStatusMenuOpen: StateSetter<boolean>
}

interface UseBoardViewUiHandlersResult {
  handleAddBoardColumnAdd: () => void
  handleAddBoardColumnRemove: (columnId: string) => void
  handleAddBoardColumnValueChange: (columnId: string, nextValue: string) => void
  handleAddBoardModalClose: () => void
  handleAddBoardNameChange: (nextName: string) => void
  handleAddColumnModalClose: () => void
  handleAddColumnNameChange: (nextName: string) => void
  handleAddTaskModalClose: () => void
  handleAddTaskStatusSelect: (nextStatusValue: string) => void
  handleAddTaskSubtaskAdd: () => void
  handleAddTaskSubtaskRemove: (subtaskId: string) => void
  handleAddTaskSubtaskValueChange: (subtaskId: string, nextValue: string) => void
  handleBoardMenuClose: () => void
  handleBoardMenuToggle: () => void
  handleDeleteBoardModalClose: () => void
  handleDeleteTaskModalClose: () => void
  handleEditBoardColumnAdd: () => void
  handleEditBoardColumnRemove: (columnId: string) => void
  handleEditBoardColumnValueChange: (columnId: string, nextValue: string) => void
  handleEditBoardModalClose: () => void
  handleEditBoardNameChange: (nextName: string) => void
  handleEditTaskModalClose: () => void
  handleEditTaskStatusSelect: (nextStatusValue: string) => void
  handleEditTaskSubtaskAdd: () => void
  handleEditTaskSubtaskRemove: (subtaskId: string) => void
  handleEditTaskSubtaskValueChange: (subtaskId: string, nextValue: string) => void
  handleMobileBoardsMenuClose: () => void
  handleMobileBoardsMenuToggle: () => void
  handleTaskMenuToggle: () => void
  handleViewTaskModalClose: () => void
}

// Centralizes BoardView modal, menu, and form-row UI handlers.
export function useBoardViewUiHandlers({
  addBoardNameError,
  addColumnNameError,
  addTaskSubtasks,
  closeTaskMenus,
  closeTaskModals,
  createEmptyBoardColumnItem,
  createEmptySubtaskItem,
  editBoardColumnsError,
  editBoardNameError,
  navigateToBoardRoute,
  resetAddColumnForm,
  resetDeleteBoardState,
  resetDeleteTaskState,
  resetEditBoardForm,
  setAddBoardColumns,
  setAddBoardName,
  setAddBoardNameError,
  setAddColumnName,
  setAddColumnNameError,
  setAddTaskStatusValue,
  setAddTaskSubtasks,
  setAddTaskSubtasksError,
  setEditBoardColumns,
  setEditBoardColumnsError,
  setEditBoardName,
  setEditBoardNameError,
  setEditingTaskId,
  setEditTaskStatusValue,
  setEditTaskSubtasks,
  setIsAddBoardModalOpen,
  setIsAddColumnModalOpen,
  setIsAddStatusMenuOpen,
  setIsBoardMenuOpen,
  setIsEditBoardModalOpen,
  setIsEditStatusMenuOpen,
  setIsMobileBoardsMenuOpen,
  setIsTaskMenuOpen,
  setIsViewStatusMenuOpen,
}: UseBoardViewUiHandlersParams): UseBoardViewUiHandlersResult {
  // Closes the view-task modal and related menu/dropdown state.
  function handleViewTaskModalClose() {
    navigateToBoardRoute()
    closeTaskMenus()
  }

  // Closes the Add Task modal and its status dropdown.
  function handleAddTaskModalClose() {
    closeTaskModals()
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

  // Closes the Edit Board modal and clears its local form state.
  function handleEditBoardModalClose() {
    setIsEditBoardModalOpen(false)
    resetEditBoardForm()
  }

  // Toggles the view-task action menu and collapses the status dropdown.
  function handleTaskMenuToggle() {
    setIsViewStatusMenuOpen(false)
    setIsTaskMenuOpen((previousMenuState) => !previousMenuState)
  }

  // Closes the Delete Task modal.
  function handleDeleteTaskModalClose() {
    resetDeleteTaskState()
  }

  // Closes the Edit Task modal and edit-status dropdown.
  function handleEditTaskModalClose() {
    closeTaskModals()
    setEditingTaskId(null)
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

  // Updates the Add Column name field and clears validation once the value changes.
  function handleAddColumnNameChange(nextName: string) {
    setAddColumnName(nextName)

    if (addColumnNameError) {
      setAddColumnNameError('')
    }
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

  return {
    handleAddBoardColumnAdd,
    handleAddBoardColumnRemove,
    handleAddBoardColumnValueChange,
    handleAddBoardModalClose,
    handleAddBoardNameChange,
    handleAddColumnModalClose,
    handleAddColumnNameChange,
    handleAddTaskModalClose,
    handleAddTaskStatusSelect,
    handleAddTaskSubtaskAdd,
    handleAddTaskSubtaskRemove,
    handleAddTaskSubtaskValueChange,
    handleBoardMenuClose,
    handleBoardMenuToggle,
    handleDeleteBoardModalClose,
    handleDeleteTaskModalClose,
    handleEditBoardColumnAdd,
    handleEditBoardColumnRemove,
    handleEditBoardColumnValueChange,
    handleEditBoardModalClose,
    handleEditBoardNameChange,
    handleEditTaskModalClose,
    handleEditTaskStatusSelect,
    handleEditTaskSubtaskAdd,
    handleEditTaskSubtaskRemove,
    handleEditTaskSubtaskValueChange,
    handleMobileBoardsMenuClose,
    handleMobileBoardsMenuToggle,
    handleTaskMenuToggle,
    handleViewTaskModalClose,
  }
}
