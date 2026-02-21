import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { boardPreviews } from '../../data'
import type { BoardPreview } from '../../data'

export type ThemePreference = 'light' | 'dark'
const DEFAULT_COLUMN_ACCENT_COLOR = '#49c4e5'

export interface KanbanSubtaskEntity {
  id: string
  isCompleted: boolean
  title: string
}

export interface KanbanTaskEntity {
  boardId: string
  columnId: string
  description: string
  id: string
  status: string
  subtasks: KanbanSubtaskEntity[]
  title: string
}

export interface KanbanColumnEntity {
  accentColor: string
  boardId: string
  id: string
  name: string
  taskIds: string[]
}

export interface KanbanBoardEntity {
  columnIds: string[]
  id: string
  name: string
}

export interface KanbanUiState {
  activeBoardId: string | null
  theme: ThemePreference
}

export interface KanbanState {
  boardIds: string[]
  boards: Record<string, KanbanBoardEntity>
  columnIds: string[]
  columns: Record<string, KanbanColumnEntity>
  taskIds: string[]
  tasks: Record<string, KanbanTaskEntity>
  ui: KanbanUiState
}

export interface AddTaskPayload {
  boardId: string
  columnId: string
  index?: number
  task: {
    description: string
    id: string
    status?: string
    subtasks?: KanbanSubtaskEntity[]
    title: string
  }
}

export interface UpdateTaskPayload {
  changes: {
    description?: string
    status?: string
    subtasks?: KanbanSubtaskEntity[]
    title?: string
  }
  taskId: string
}

export interface DeleteTaskPayload {
  taskId: string
}

export interface MoveTaskPayload {
  destinationColumnId: string
  index?: number
  taskId: string
}

export interface CreateBoardPayload {
  boardId: string
  columns?: Array<{
    accentColor?: string
    id: string
    name: string
  }>
  name: string
}

export interface DeleteBoardPayload {
  boardId: string
}

export interface UpdateBoardPayload {
  boardId: string
  changes: {
    name?: string
  }
}

export interface CreateColumnPayload {
  boardId: string
  column: {
    accentColor?: string
    id: string
    name: string
  }
  index?: number
}

export interface DeleteColumnPayload {
  boardId: string
  columnId: string
  targetColumnId?: string
}

export interface UpdateColumnPayload {
  changes: {
    accentColor?: string
    name?: string
  }
  columnId: string
}

export interface ReorderBoardColumnsPayload {
  boardId: string
  columnIds: string[]
}

// Clones subtasks so reducer writes never retain references from action payloads.
function cloneSubtasks(subtasks: KanbanSubtaskEntity[] | undefined): KanbanSubtaskEntity[] {
  return (subtasks ?? []).map((subtask) => ({
    id: subtask.id,
    isCompleted: subtask.isCompleted,
    title: subtask.title,
  }))
}

// Inserts an ID into a list at an optional index, defaulting to append.
function insertAtPosition(values: string[], value: string, index?: number): void {
  if (typeof index !== 'number' || index < 0 || index > values.length) {
    values.push(value)
    return
  }

  values.splice(index, 0, value)
}

// Removes an ID from a list when present.
function removeFromList(values: string[], value: string): void {
  const valueIndex = values.indexOf(value)

  if (valueIndex !== -1) {
    values.splice(valueIndex, 1)
  }
}

// Finds a safe target column for moved tasks when deleting a column.
function getFallbackColumnId(board: KanbanBoardEntity, removedColumnId: string, preferredColumnId?: string): string | undefined {
  if (preferredColumnId && preferredColumnId !== removedColumnId && board.columnIds.includes(preferredColumnId)) {
    return preferredColumnId
  }

  return board.columnIds.find((columnId) => columnId !== removedColumnId)
}

// Normalizes preview board data into entity maps used by the Redux store.
function buildInitialState(boards: BoardPreview[]): KanbanState {
  const boardIds: string[] = []
  const boardsById: Record<string, KanbanBoardEntity> = {}
  const columnIds: string[] = []
  const columnsById: Record<string, KanbanColumnEntity> = {}
  const taskIds: string[] = []
  const tasksById: Record<string, KanbanTaskEntity> = {}

  boards.forEach((board) => {
    const boardColumnIds: string[] = []

    board.columns.forEach((column) => {
      const columnTaskIds: string[] = []

      column.tasks.forEach((task) => {
        taskIds.push(task.id)
        columnTaskIds.push(task.id)
        tasksById[task.id] = {
          boardId: board.id,
          columnId: column.id,
          description: task.description,
          id: task.id,
          status: task.status,
          subtasks: task.subtasks.map((subtask) => ({
            id: subtask.id,
            isCompleted: subtask.isCompleted,
            title: subtask.title,
          })),
          title: task.title,
        }
      })

      columnIds.push(column.id)
      boardColumnIds.push(column.id)
      columnsById[column.id] = {
        accentColor: column.accentColor,
        boardId: board.id,
        id: column.id,
        name: column.name,
        taskIds: columnTaskIds,
      }
    })

    boardIds.push(board.id)
    boardsById[board.id] = {
      columnIds: boardColumnIds,
      id: board.id,
      name: board.name,
    }
  })

  return {
    boardIds,
    boards: boardsById,
    columnIds,
    columns: columnsById,
    taskIds,
    tasks: tasksById,
    ui: {
      activeBoardId: boardIds[0] ?? null,
      theme: 'light',
    },
  }
}

const initialState = buildInitialState(boardPreviews)

const kanbanSlice = createSlice({
  initialState,
  name: 'kanban',
  reducers: {
    // Adds a task to a board column and indexes it for global lookup.
    taskAdded(state, action: PayloadAction<AddTaskPayload>) {
      const { boardId, columnId, index, task } = action.payload
      const board = state.boards[boardId]
      const column = state.columns[columnId]

      if (!board || !column || column.boardId !== boardId || state.tasks[task.id]) {
        return
      }

      state.tasks[task.id] = {
        boardId,
        columnId,
        description: task.description,
        id: task.id,
        status: task.status ?? column.name,
        subtasks: cloneSubtasks(task.subtasks),
        title: task.title,
      }
      state.taskIds.push(task.id)
      insertAtPosition(column.taskIds, task.id, index)
    },

    // Updates task content without changing column membership.
    taskUpdated(state, action: PayloadAction<UpdateTaskPayload>) {
      const { changes, taskId } = action.payload
      const existingTask = state.tasks[taskId]

      if (!existingTask) {
        return
      }

      if (typeof changes.title === 'string') {
        existingTask.title = changes.title
      }

      if (typeof changes.description === 'string') {
        existingTask.description = changes.description
      }

      if (typeof changes.status === 'string') {
        existingTask.status = changes.status
      }

      if (changes.subtasks) {
        existingTask.subtasks = cloneSubtasks(changes.subtasks)
      }
    },

    // Deletes a task and removes all references from column and global indexes.
    taskDeleted(state, action: PayloadAction<DeleteTaskPayload>) {
      const { taskId } = action.payload
      const existingTask = state.tasks[taskId]

      if (!existingTask) {
        return
      }

      const sourceColumn = state.columns[existingTask.columnId]

      if (sourceColumn) {
        removeFromList(sourceColumn.taskIds, taskId)
      }

      delete state.tasks[taskId]
      removeFromList(state.taskIds, taskId)
    },

    // Moves a task into another column and updates task status/ownership metadata.
    taskMoved(state, action: PayloadAction<MoveTaskPayload>) {
      const { destinationColumnId, index, taskId } = action.payload
      const existingTask = state.tasks[taskId]
      const destinationColumn = state.columns[destinationColumnId]

      if (!existingTask || !destinationColumn) {
        return
      }

      const sourceColumn = state.columns[existingTask.columnId]

      if (sourceColumn) {
        removeFromList(sourceColumn.taskIds, taskId)
      }

      insertAtPosition(destinationColumn.taskIds, taskId, index)
      existingTask.columnId = destinationColumn.id
      existingTask.boardId = destinationColumn.boardId
      existingTask.status = destinationColumn.name
    },

    // Creates a board with optional starter columns.
    boardCreated(state, action: PayloadAction<CreateBoardPayload>) {
      const { boardId, columns = [], name } = action.payload

      if (state.boards[boardId]) {
        return
      }

      state.boards[boardId] = {
        columnIds: [],
        id: boardId,
        name,
      }
      state.boardIds.push(boardId)

      columns.forEach((column) => {
        if (state.columns[column.id]) {
          return
        }

        state.columns[column.id] = {
          accentColor: column.accentColor ?? DEFAULT_COLUMN_ACCENT_COLOR,
          boardId,
          id: column.id,
          name: column.name,
          taskIds: [],
        }
        state.columnIds.push(column.id)
        state.boards[boardId].columnIds.push(column.id)
      })

      if (!state.ui.activeBoardId) {
        state.ui.activeBoardId = boardId
      }
    },

    // Removes a board and all child columns/tasks from the store.
    boardRemoved(state, action: PayloadAction<DeleteBoardPayload>) {
      const { boardId } = action.payload
      const board = state.boards[boardId]

      if (!board) {
        return
      }

      board.columnIds.forEach((columnId) => {
        const column = state.columns[columnId]

        if (!column) {
          return
        }

        column.taskIds.forEach((taskId) => {
          delete state.tasks[taskId]
          removeFromList(state.taskIds, taskId)
        })

        delete state.columns[columnId]
        removeFromList(state.columnIds, columnId)
      })

      delete state.boards[boardId]
      removeFromList(state.boardIds, boardId)

      if (state.ui.activeBoardId === boardId) {
        state.ui.activeBoardId = state.boardIds[0] ?? null
      }
    },

    // Updates board-level properties such as its display name.
    boardUpdated(state, action: PayloadAction<UpdateBoardPayload>) {
      const { boardId, changes } = action.payload
      const board = state.boards[boardId]

      if (!board) {
        return
      }

      if (typeof changes.name === 'string') {
        board.name = changes.name
      }
    },

    // Creates a new column in an existing board.
    columnCreated(state, action: PayloadAction<CreateColumnPayload>) {
      const { boardId, column, index } = action.payload
      const board = state.boards[boardId]

      if (!board || state.columns[column.id]) {
        return
      }

      state.columns[column.id] = {
        accentColor: column.accentColor ?? DEFAULT_COLUMN_ACCENT_COLOR,
        boardId,
        id: column.id,
        name: column.name,
        taskIds: [],
      }
      state.columnIds.push(column.id)
      insertAtPosition(board.columnIds, column.id, index)
    },

    // Removes a column and either rehomes or removes its tasks.
    columnRemoved(state, action: PayloadAction<DeleteColumnPayload>) {
      const { boardId, columnId, targetColumnId } = action.payload
      const board = state.boards[boardId]
      const removedColumn = state.columns[columnId]

      if (!board || !removedColumn || removedColumn.boardId !== boardId) {
        return
      }

      const fallbackColumnId = getFallbackColumnId(board, columnId, targetColumnId)
      const fallbackColumn = fallbackColumnId ? state.columns[fallbackColumnId] : undefined

      if (fallbackColumn) {
        removedColumn.taskIds.forEach((taskId) => {
          const task = state.tasks[taskId]

          if (!task) {
            return
          }

          task.boardId = boardId
          task.columnId = fallbackColumn.id
          task.status = fallbackColumn.name
          fallbackColumn.taskIds.push(taskId)
        })
      } else {
        removedColumn.taskIds.forEach((taskId) => {
          delete state.tasks[taskId]
          removeFromList(state.taskIds, taskId)
        })
      }

      delete state.columns[columnId]
      removeFromList(state.columnIds, columnId)
      removeFromList(board.columnIds, columnId)
    },

    // Updates column properties and syncs task status when the column name changes.
    columnUpdated(state, action: PayloadAction<UpdateColumnPayload>) {
      const { changes, columnId } = action.payload
      const column = state.columns[columnId]

      if (!column) {
        return
      }

      if (typeof changes.accentColor === 'string') {
        column.accentColor = changes.accentColor
      }

      if (typeof changes.name === 'string') {
        const nextName = changes.name
        column.name = nextName
        column.taskIds.forEach((taskId) => {
          const task = state.tasks[taskId]

          if (task) {
            task.status = nextName
          }
        })
      }
    },

    // Reorders a board's columns while keeping only columns owned by that board.
    boardColumnsReordered(state, action: PayloadAction<ReorderBoardColumnsPayload>) {
      const { boardId, columnIds } = action.payload
      const board = state.boards[boardId]

      if (!board) {
        return
      }

      const nextOrder = columnIds.filter((columnId) => state.columns[columnId]?.boardId === boardId)
      const remainingColumns = board.columnIds.filter(
        (columnId) => !nextOrder.includes(columnId) && state.columns[columnId]?.boardId === boardId,
      )

      board.columnIds = [...nextOrder, ...remainingColumns]
    },
  },
})

export const {
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
} = kanbanSlice.actions

export const kanbanReducer = kanbanSlice.reducer
