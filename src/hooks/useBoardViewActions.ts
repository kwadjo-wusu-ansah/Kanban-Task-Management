import type { Dispatch, SetStateAction } from 'react'
import type { NavigateFunction } from 'react-router'
import type { BoardPreview, BoardTaskPreview, DropdownOption, ModalItem } from '../pages/BoardView/BoardView.types'
import type { VisibilitySetter } from './useBoardViewOverlayState'
import {
  buildStatusOptions,
  COLUMN_ACCENT_COLORS,
  createClientId,
  createEmptyBoardColumnItem,
  createEmptySubtaskItem,
  getActiveBoard,
  getActiveTask,
  hasDuplicateBoardName,
  mapBoardColumnsToEditableItems,
  mapTaskSubtasksToEditableItems,
  mapTaskSubtasksToViewModalItems,
} from '../pages/BoardView/BoardView.utils'

type UseBoardViewActionsParams = {
  activeBoard: BoardPreview | undefined
  activeBoardId: string
  activeTask: BoardTaskPreview | undefined
  addBoardColumns: ModalItem[]
  addBoardName: string
  addBoardNameError: string
  addColumnName: string
  addColumnNameError: string
  addTaskDescription: string
  addTaskStatusValue: string
  addTaskSubtasks: ModalItem[]
  addTaskTitle: string
  boardsData: BoardPreview[]
  closeAllOverlays: () => void
  closeHeaderMenus: () => void
  deletingBoardId: string | null
  deletingTaskBoardId: string | null
  deletingTaskId: string | null
  editBoardColumns: ModalItem[]
  editBoardColumnsError: string
  editBoardName: string
  editBoardNameError: string
  editingBoardId: string | null
  editingTaskId: string | null
  editTaskDescription: string
  editTaskStatusValue: string
  editTaskSubtasks: ModalItem[]
  editTaskTitle: string
  hasColumns: boolean
  navigate: NavigateFunction
  navigateToBoardRoute: (replace?: boolean) => void
  resetAddBoardForm: () => void
  resetAddColumnForm: () => void
  resetAddTaskForm: (initialStatusValue?: string) => void
  resetDeleteBoardState: () => void
  resetDeleteTaskState: () => void
  resetEditBoardForm: () => void
  resetTransientBoardInteractionState: () => void
  setAddBoardColumns: Dispatch<SetStateAction<ModalItem[]>>
  setAddBoardName: Dispatch<SetStateAction<string>>
  setAddBoardNameError: Dispatch<SetStateAction<string>>
  setAddColumnName: Dispatch<SetStateAction<string>>
  setAddColumnNameError: Dispatch<SetStateAction<string>>
  setAddTaskStatusValue: Dispatch<SetStateAction<string>>
  setAddTaskSubtasks: Dispatch<SetStateAction<ModalItem[]>>
  setAddTaskSubtasksError: Dispatch<SetStateAction<string>>
  setBoardsData: Dispatch<SetStateAction<BoardPreview[]>>
  setDeletingBoardId: Dispatch<SetStateAction<string | null>>
  setDeletingBoardName: Dispatch<SetStateAction<string>>
  setDeletingTaskBoardId: Dispatch<SetStateAction<string | null>>
  setDeletingTaskId: Dispatch<SetStateAction<string | null>>
  setDeletingTaskName: Dispatch<SetStateAction<string>>
  setEditBoardColumns: Dispatch<SetStateAction<ModalItem[]>>
  setEditBoardColumnsError: Dispatch<SetStateAction<string>>
  setEditBoardName: Dispatch<SetStateAction<string>>
  setEditBoardNameError: Dispatch<SetStateAction<string>>
  setEditingBoardId: Dispatch<SetStateAction<string | null>>
  setEditingTaskId: Dispatch<SetStateAction<string | null>>
  setEditTaskDescription: Dispatch<SetStateAction<string>>
  setEditTaskStatusValue: Dispatch<SetStateAction<string>>
  setEditTaskSubtasks: Dispatch<SetStateAction<ModalItem[]>>
  setEditTaskTitle: Dispatch<SetStateAction<string>>
  setIsAddBoardModalOpen: VisibilitySetter
  setIsAddColumnModalOpen: VisibilitySetter
  setIsAddStatusMenuOpen: VisibilitySetter
  setIsAddTaskModalOpen: VisibilitySetter
  setIsBoardMenuOpen: VisibilitySetter
  setIsDeleteBoardModalOpen: VisibilitySetter
  setIsDeleteTaskModalOpen: VisibilitySetter
  setIsEditBoardModalOpen: VisibilitySetter
  setIsEditStatusMenuOpen: VisibilitySetter
  setIsEditTaskModalOpen: VisibilitySetter
  setIsMobileBoardsMenuOpen: VisibilitySetter
  setIsTaskMenuOpen: VisibilitySetter
  setIsViewStatusMenuOpen: VisibilitySetter
  setViewStatusValue: Dispatch<SetStateAction<string>>
  setViewSubtasks: Dispatch<SetStateAction<ModalItem[]>>
  statusOptions: DropdownOption[]
}

// Encapsulates BoardView task/board action handlers to keep route component orchestration-focused.
function useBoardViewActions(params: UseBoardViewActionsParams) {
  const {
    activeBoard,
    activeBoardId,
    activeTask,
    addBoardColumns,
    addBoardName,
    addBoardNameError,
    addColumnName,
    addColumnNameError,
    addTaskDescription,
    addTaskStatusValue,
    addTaskSubtasks,
    addTaskTitle,
    boardsData,
    closeAllOverlays,
    closeHeaderMenus,
    deletingBoardId,
    deletingTaskBoardId,
    deletingTaskId,
    editBoardColumns,
    editBoardColumnsError,
    editBoardName,
    editBoardNameError,
    editingBoardId,
    editingTaskId,
    editTaskDescription,
    editTaskStatusValue,
    editTaskSubtasks,
    editTaskTitle,
    hasColumns,
    navigate,
    navigateToBoardRoute,
    resetAddBoardForm,
    resetAddColumnForm,
    resetAddTaskForm,
    resetDeleteBoardState,
    resetDeleteTaskState,
    resetEditBoardForm,
    resetTransientBoardInteractionState,
    setAddBoardColumns,
    setAddBoardName,
    setAddBoardNameError,
    setAddColumnName,
    setAddColumnNameError,
    setAddTaskStatusValue,
    setAddTaskSubtasks,
    setAddTaskSubtasksError,
    setBoardsData,
    setDeletingBoardId,
    setDeletingBoardName,
    setDeletingTaskBoardId,
    setDeletingTaskId,
    setDeletingTaskName,
    setEditBoardColumns,
    setEditBoardColumnsError,
    setEditBoardName,
    setEditBoardNameError,
    setEditingBoardId,
    setEditingTaskId,
    setEditTaskDescription,
    setEditTaskStatusValue,
    setEditTaskSubtasks,
    setEditTaskTitle,
    setIsAddBoardModalOpen,
    setIsAddColumnModalOpen,
    setIsAddStatusMenuOpen,
    setIsAddTaskModalOpen,
    setIsBoardMenuOpen,
    setIsDeleteBoardModalOpen,
    setIsDeleteTaskModalOpen,
    setIsEditBoardModalOpen,
    setIsEditStatusMenuOpen,
    setIsEditTaskModalOpen,
    setIsMobileBoardsMenuOpen,
    setIsTaskMenuOpen,
    setIsViewStatusMenuOpen,
    setViewStatusValue,
    setViewSubtasks,
    statusOptions,
  } = params

  // Handles sidebar board changes and closes all open task modals and menus.
  function handleBoardSelect(nextBoardId: string) {
    const nextBoard = getActiveBoard(boardsData, nextBoardId)
    const nextStatusOptions = buildStatusOptions(nextBoard)

    navigate(`/board/${nextBoardId}`)
    closeAllOverlays()
    setAddTaskStatusValue(nextStatusOptions[0]?.value ?? '')
    resetTransientBoardInteractionState()
  }

  // Opens the view-task modal using the clicked task and local interactive state.
  function handleTaskSelect(taskId: string) {
    const nextTask = getActiveTask(activeBoard, taskId)

    if (!nextTask) {
      return
    }

    closeAllOverlays()
    resetTransientBoardInteractionState()
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
    closeAllOverlays()
    resetTransientBoardInteractionState()
    setIsAddTaskModalOpen(true)
    resetAddTaskForm(statusOptions[0]?.value ?? '')
  }

  // Opens Add Board modal with a clean form and closes other task overlays.
  function handleAddBoardOpen() {
    navigateToBoardRoute()
    closeAllOverlays()
    resetTransientBoardInteractionState()
    setIsAddBoardModalOpen(true)
    resetAddBoardForm()
  }

  // Opens Add Column modal with a clean form and closes other overlays.
  function handleAddColumnOpen() {
    if (!activeBoard) {
      return
    }

    navigateToBoardRoute()
    closeAllOverlays()
    resetTransientBoardInteractionState()
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

    closeAllOverlays()
    resetTransientBoardInteractionState()
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
    closeAllOverlays()
    setEditingTaskId(null)
    setAddBoardNameError('')
    resetAddColumnForm()
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
    if (remainingBoards[0]) {
      navigate(`/board/${remainingBoards[0].id}`, { replace: true })
    } else {
      navigate('/', { replace: true })
    }

    closeAllOverlays()
    resetTransientBoardInteractionState()
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

    closeAllOverlays()
    navigateToBoardRoute()
    setAddBoardNameError('')
    resetEditBoardForm()
    resetDeleteBoardState()
    resetDeleteTaskState()

    setEditingTaskId(activeTask.id)
    setEditTaskTitle(activeTask.title)
    setEditTaskDescription(activeTask.description)
    setEditTaskStatusValue(activeTask.status)
    setEditTaskSubtasks(editableSubtasks.length > 0 ? editableSubtasks : [createEmptySubtaskItem('e.g. Make coffee')])
    setIsEditTaskModalOpen(true)
  }

  // Opens the Delete Task modal from the view-task action menu.
  function handleTaskDeleteAction() {
    if (!activeTask || !activeBoard) {
      setIsTaskMenuOpen(false)
      return
    }

    closeAllOverlays()
    navigateToBoardRoute()
    setEditingTaskId(null)
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

    closeAllOverlays()
    setEditingTaskId(null)
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

  // Updates the Add Column name field and clears validation once the value changes.
  function handleAddColumnNameChange(nextName: string) {
    setAddColumnName(nextName)

    if (addColumnNameError) {
      setAddColumnNameError('')
    }
  }

  // Creates a new column at the end of the active board column list.
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
    const nextColumn = {
      accentColor: COLUMN_ACCENT_COLORS[nextColumnIndex % COLUMN_ACCENT_COLORS.length],
      id: createClientId('column'),
      name: normalizedColumnName,
      tasks: [],
    }

    setBoardsData((previousBoards) =>
      previousBoards.map((board) => {
        if (board.id !== activeBoard.id) {
          return board
        }

        return {
          ...board,
          columns: [...board.columns, nextColumn],
        }
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
    navigate(`/board/${nextBoard.id}`)
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

  return {
    handleAddBoardColumnAdd,
    handleAddBoardColumnRemove,
    handleAddBoardColumnValueChange,
    handleAddBoardModalClose,
    handleAddBoardNameChange,
    handleAddBoardOpen,
    handleAddColumnModalClose,
    handleAddColumnNameChange,
    handleAddColumnOpen,
    handleAddTaskModalClose,
    handleAddTaskOpen,
    handleAddTaskStatusSelect,
    handleAddTaskSubtaskAdd,
    handleAddTaskSubtaskRemove,
    handleAddTaskSubtaskValueChange,
    handleBoardDeleteAction,
    handleBoardMenuClose,
    handleBoardMenuToggle,
    handleBoardSelect,
    handleCreateBoard,
    handleCreateColumn,
    handleCreateTask,
    handleDeleteBoardConfirm,
    handleDeleteBoardModalClose,
    handleDeleteTaskConfirm,
    handleDeleteTaskModalClose,
    handleEditBoardColumnAdd,
    handleEditBoardColumnRemove,
    handleEditBoardColumnValueChange,
    handleEditBoardModalClose,
    handleEditBoardNameChange,
    handleEditBoardOpen,
    handleEditTaskModalClose,
    handleEditTaskOpen,
    handleEditTaskStatusSelect,
    handleEditTaskSubtaskAdd,
    handleEditTaskSubtaskRemove,
    handleEditTaskSubtaskValueChange,
    handleMobileBoardsMenuClose,
    handleMobileBoardsMenuToggle,
    handleSaveBoardChanges,
    handleSaveTaskChanges,
    handleTaskDeleteAction,
    handleTaskMenuToggle,
    handleTaskSelect,
    handleViewTaskModalClose,
    handleViewTaskStatusSelect,
    handleViewTaskSubtaskToggle,
  }
}

export default useBoardViewActions
