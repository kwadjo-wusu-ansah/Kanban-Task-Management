import { createSlice } from '@reduxjs/toolkit'
import { boardPreviews } from '../../data'
import type { BoardPreview } from '../../data'

export type ThemePreference = 'light' | 'dark'

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
  reducers: {},
})

export const kanbanReducer = kanbanSlice.reducer
