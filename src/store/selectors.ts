import { createSelector } from '@reduxjs/toolkit'
import type { BoardColumnPreview, BoardPreview, BoardTaskPreview } from '../data'
import type { RootState } from './index'

// Reads the Kanban slice state from the app store root.
function selectKanbanState(state: RootState) {
  return state.kanban
}

// Maps a task entity into the BoardView-compatible preview model.
function mapTaskPreview(taskId: string, state: RootState['kanban']): BoardTaskPreview | undefined {
  const task = state.tasks[taskId]

  if (!task) {
    return undefined
  }

  const completedSubtaskCount = task.subtasks.filter((subtask) => subtask.isCompleted).length

  return {
    completedSubtaskCount,
    description: task.description,
    id: task.id,
    status: task.status,
    subtasks: task.subtasks.map((subtask) => ({
      id: subtask.id,
      isCompleted: subtask.isCompleted,
      title: subtask.title,
    })),
    title: task.title,
    totalSubtaskCount: task.subtasks.length,
  }
}

// Maps a column entity into the BoardView-compatible preview model.
function mapColumnPreview(columnId: string, state: RootState['kanban']): BoardColumnPreview | undefined {
  const column = state.columns[columnId]

  if (!column) {
    return undefined
  }

  const tasks = column.taskIds
    .map((taskId) => mapTaskPreview(taskId, state))
    .filter((task): task is BoardTaskPreview => Boolean(task))

  return {
    accentColor: column.accentColor,
    id: column.id,
    name: column.name,
    tasks,
  }
}

// Builds a denormalized board list used by pages and presentational components.
export const selectBoardPreviews = createSelector([selectKanbanState], (state): BoardPreview[] =>
  state.boardIds
    .map((boardId) => {
      const board = state.boards[boardId]

      if (!board) {
        return undefined
      }

      const columns = board.columnIds
        .map((columnId) => mapColumnPreview(columnId, state))
        .filter((column): column is BoardColumnPreview => Boolean(column))

      return {
        columns,
        id: board.id,
        name: board.name,
      }
    })
    .filter((board): board is BoardPreview => Boolean(board)),
)

// Builds sidebar-friendly board entries from denormalized board previews.
export const selectSidebarBoards = createSelector([selectBoardPreviews], (boards) =>
  boards.map((board) => ({
    id: board.id,
    name: board.name,
  })),
)
