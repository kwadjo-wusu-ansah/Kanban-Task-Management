import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { boardPreviews } from '../../data'
import { AddColumnCard, EmptyBoardState, Header, Modal, Sidebar, Tasks } from '../../components'
import { useBoardViewActions, useBoardViewOverlayState } from '../../hooks'
import { classNames } from '../../utils'
import styles from '../../App.module.css'
import type { BoardPreview, ModalItem, SidebarMode } from './BoardView.types'
import {
  buildDeleteBoardDescription,
  buildDeleteTaskDescription,
  buildSidebarBoards,
  buildStatusOptions,
  COLUMN_ACCENT_COLORS,
  createInitialAddBoardColumns,
  createInitialAddTaskSubtasks,
  fallbackBoardPreviews,
  fallbackBoards,
  getActiveBoard,
  getActiveTask,
  mapTaskSubtasksToViewModalItems,
  MOBILE_BREAKPOINT,
} from './BoardView.utils'

// Renders the board view screen and syncs the active board with route params.
function BoardView() {

  const { boardId, taskId } = useParams()
  const navigate = useNavigate()
  
  const [mode, setMode] = useState<SidebarMode>('light')
  const [isSidebarHidden, setIsSidebarHidden] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(() => window.innerWidth < MOBILE_BREAKPOINT)
  const [boardsData, setBoardsData] = useState<BoardPreview[]>(boardPreviews.length > 0 ? boardPreviews : fallbackBoardPreviews)
  const boards = buildSidebarBoards(boardsData)
  const activeBoardId = boardId ?? boards[0]?.id ?? fallbackBoards[0].id

  const {
    overlayState,
    resetOverlayVisibility,
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
    setOverlayValues,
  } = useBoardViewOverlayState()
  const {
    isAddBoardModalOpen,
    isAddColumnModalOpen,
    isAddStatusMenuOpen,
    isAddTaskModalOpen,
    isBoardMenuOpen,
    isDeleteBoardModalOpen,
    isDeleteTaskModalOpen,
    isEditBoardModalOpen,
    isEditStatusMenuOpen,
    isEditTaskModalOpen,
    isMobileBoardsMenuOpen,
    isTaskMenuOpen,
    isViewStatusMenuOpen,
  } = overlayState

  const [viewStatusValue, setViewStatusValue] = useState('')
  const [viewSubtasks, setViewSubtasks] = useState<ModalItem[]>([])

  const [addTaskTitle, setAddTaskTitle] = useState('')
  const [addTaskDescription, setAddTaskDescription] = useState('')
  const [addTaskStatusValue, setAddTaskStatusValue] = useState('')
  const [addTaskSubtasks, setAddTaskSubtasks] = useState<ModalItem[]>(createInitialAddTaskSubtasks)
  const [addTaskSubtasksError, setAddTaskSubtasksError] = useState('')

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editTaskTitle, setEditTaskTitle] = useState('')
  const [editTaskDescription, setEditTaskDescription] = useState('')
  const [editTaskStatusValue, setEditTaskStatusValue] = useState('')
  const [editTaskSubtasks, setEditTaskSubtasks] = useState<ModalItem[]>([])

  const [addBoardName, setAddBoardName] = useState('')
  const [addBoardNameError, setAddBoardNameError] = useState('')
  const [addBoardColumns, setAddBoardColumns] = useState<ModalItem[]>(createInitialAddBoardColumns)
  const [addColumnName, setAddColumnName] = useState('')
  const [addColumnNameError, setAddColumnNameError] = useState('')

  const [editingBoardId, setEditingBoardId] = useState<string | null>(null)
  const [editBoardName, setEditBoardName] = useState('')
  const [editBoardNameError, setEditBoardNameError] = useState('')
  const [editBoardColumns, setEditBoardColumns] = useState<ModalItem[]>([])
  const [editBoardColumnsError, setEditBoardColumnsError] = useState('')

  const [deletingBoardId, setDeletingBoardId] = useState<string | null>(null)
  const [deletingBoardName, setDeletingBoardName] = useState('')

  const [deletingTaskBoardId, setDeletingTaskBoardId] = useState<string | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)
  const [deletingTaskName, setDeletingTaskName] = useState('')

  const activeBoard = getActiveBoard(boardsData, activeBoardId)
  const activeTask = getActiveTask(activeBoard, taskId ?? null)
  const activeBoardName = activeBoard?.name ?? fallbackBoards[0].name
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
      if (boardsData[0]) {
        navigate(`/board/${boardsData[0].id}`, { replace: true })
      }
      return
    }

    const hasMatchingBoard = boardsData.some((board) => board.id === boardId)

    if (!hasMatchingBoard) {
      if (boardsData[0]) {
        navigate(`/board/${boardsData[0].id}`, { replace: true })
      } else {
        navigate('/', { replace: true })
      }
      return
    }

  }, [boardId, boardsData, navigate])

  // Syncs task modal state with nested task route params and redirects unknown tasks.
  useEffect(() => {
    if (!taskId) {
      setOverlayValues({
        isTaskMenuOpen: false,
        isViewStatusMenuOpen: false,
      })
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
    setOverlayValues({
      isTaskMenuOpen: false,
      isViewStatusMenuOpen: false,
    })
  }, [activeBoard, activeBoardId, navigate, setOverlayValues, taskId])

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
  }, [isMobileViewport, setIsMobileBoardsMenuOpen])

  // Closes both header menus so only one top-level menu is visible at a time.
  function closeHeaderMenus() {
    setOverlayValues({
      isBoardMenuOpen: false,
      isMobileBoardsMenuOpen: false,
    })
  }

  // Closes every menu and modal overlay in the BoardView surface.
  function closeAllOverlays() {
    resetOverlayVisibility()
  }

  // Navigates to the current board route while clearing any nested task segment.
  function navigateToBoardRoute(replace = false) {
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

  // Resets transient BoardView interaction state used across overlay transitions.
  function resetTransientBoardInteractionState() {
    setEditingTaskId(null)
    setAddBoardNameError('')
    resetAddColumnForm()
    resetEditBoardForm()
    resetDeleteBoardState()
    resetDeleteTaskState()
  }

  const {
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
  } = useBoardViewActions({
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
  })

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
                  heading={column.name}
                  key={column.id}
                  mode={mode}
                  onTaskSelect={handleTaskSelect}
                  taskCount={column.tasks.length}
                  tasks={column.tasks}
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
