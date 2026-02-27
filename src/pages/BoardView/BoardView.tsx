import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { AddColumnCard, EmptyBoardState, Header, Modal, Sidebar, Tasks } from '../../components'
import type { SidebarMode } from '../../components'
import {
  useBoardViewActions,
  useBoardViewFormState,
  useBoardViewMobileViewport,
  useBoardViewOverlayState,
  useBoardViewRouteState,
  useBoardViewUiHandlers,
} from '../../hooks'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectBoardPreviews, selectSidebarBoards } from '../../store/selectors'
import { classNames } from '../../utils'
import {
  COLUMN_ACCENT_COLORS,
  MOBILE_BREAKPOINT,
  buildBoardViewDerivedState,
  buildStatusOptions,
  createClientId,
  createEmptyBoardColumnItem,
  createEmptySubtaskItem,
  createInitialAddBoardColumns,
  createInitialAddTaskSubtasks,
  getActiveBoard,
  getActiveTask,
  hasDuplicateBoardName,
  mapBoardColumnsToEditableItems,
  mapTaskSubtasksToEditableItems,
  mapTaskSubtasksToViewModalItems,
} from './BoardView.utils'
import styles from '../../App.module.css'

// Renders the board view screen and syncs the active board with route params.
function BoardView() {

  const { boardId, taskId } = useParams()
  const dispatch = useAppDispatch()
  const boardPreviews = useAppSelector(selectBoardPreviews)
  const boards = useAppSelector(selectSidebarBoards)
  const navigate = useNavigate()
  
  const [mode, setMode] = useState<SidebarMode>('light')
  const [isSidebarHidden, setIsSidebarHidden] = useState(false)

  const {
    isTaskMenuOpen,
    isViewStatusMenuOpen,
    isAddTaskModalOpen,
    isAddStatusMenuOpen,
    isEditTaskModalOpen,
    isEditStatusMenuOpen,
    isAddBoardModalOpen,
    isAddColumnModalOpen,
    isBoardMenuOpen,
    isMobileBoardsMenuOpen,
    isEditBoardModalOpen,
    isDeleteBoardModalOpen,
    isDeleteTaskModalOpen,
    setIsTaskMenuOpen,
    setIsViewStatusMenuOpen,
    setIsAddTaskModalOpen,
    setIsAddStatusMenuOpen,
    setIsEditTaskModalOpen,
    setIsEditStatusMenuOpen,
    setIsAddBoardModalOpen,
    setIsAddColumnModalOpen,
    setIsBoardMenuOpen,
    setIsMobileBoardsMenuOpen,
    setIsEditBoardModalOpen,
    setIsDeleteBoardModalOpen,
    setIsDeleteTaskModalOpen,
    closeHeaderMenus,
    closeTaskMenus,
    closeTaskModals,
    closeBoardModals,
    closeAllOverlays,
  } = useBoardViewOverlayState()

  const { isMobileViewport } = useBoardViewMobileViewport({
    mobileBreakpoint: MOBILE_BREAKPOINT,
    setIsMobileBoardsMenuOpen,
  })

  const {
    addBoardColumns,
    addBoardName,
    addBoardNameError,
    addColumnName,
    addColumnNameError,
    addTaskDescription,
    addTaskStatusValue,
    addTaskSubtasks,
    addTaskSubtasksError,
    addTaskTitle,
    deletingBoardId,
    deletingBoardName,
    deletingTaskBoardId,
    deletingTaskId,
    deletingTaskName,
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
    setAddBoardColumns,
    setAddBoardName,
    setAddBoardNameError,
    setAddColumnName,
    setAddColumnNameError,
    setAddTaskDescription,
    setAddTaskStatusValue,
    setAddTaskSubtasks,
    setAddTaskSubtasksError,
    setAddTaskTitle,
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
    setViewStatusValue,
    setViewSubtasks,
    viewStatusValue,
    viewSubtasks,
  } = useBoardViewFormState({
    createInitialAddBoardColumns,
    createInitialAddTaskSubtasks,
  })

  const {
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
  } = buildBoardViewDerivedState({
    boardId,
    boardPreviews,
    deletingBoardName,
    deletingTaskName,
    isMobileViewport,
    isSidebarHidden,
    sidebarBoards: boards,
    taskId,
  })

  const { navigateToBoardRoute } = useBoardViewRouteState({
    activeBoard,
    activeBoardId,
    boardId,
    boardPreviews,
    closeTaskMenus,
    getActiveTask,
    mapTaskSubtasksToViewModalItems,
    navigate,
    setViewStatusValue,
    setViewSubtasks,
    taskId,
  })

  const dragSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

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

  // Clears overlay visibility and paired transient UI fields before opening a new flow.
  function resetOverlayDrivenUiState() {
    closeAllOverlays()
    setEditingTaskId(null)
    setAddBoardNameError('')
    resetAddColumnForm()
    resetEditBoardForm()
    resetDeleteBoardState()
    resetDeleteTaskState()
  }

  const {
    handleBoardSelect,
    handleTaskDragEnd,
    handleTaskSelect,
    handleAddTaskOpen,
    handleAddBoardOpen,
    handleAddColumnOpen,
    handleBoardDeleteAction,
    handleEditBoardOpen,
    handleDeleteBoardConfirm,
    handleViewTaskSubtaskToggle,
    handleViewTaskStatusSelect,
    handleEditTaskOpen,
    handleTaskDeleteAction,
    handleDeleteTaskConfirm,
    handleCreateTask,
    handleCreateColumn,
    handleCreateBoard,
    handleSaveBoardChanges,
    handleSaveTaskChanges,
  } = useBoardViewActions({
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
    columnAccentColors: COLUMN_ACCENT_COLORS,
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
  })

  const {
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
  } = useBoardViewUiHandlers({
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
            <DndContext collisionDetection={closestCenter} onDragEnd={handleTaskDragEnd} sensors={dragSensors}>
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
            </DndContext>
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
