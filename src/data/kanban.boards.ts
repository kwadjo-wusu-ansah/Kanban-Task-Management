import { typedKanbanDataset } from './kanban.dataset'
import type { BoardPreview, BoardSummary, DatasetBoard } from './kanban.types'

const COLUMN_ACCENT_COLORS = ['#49c4e5', '#8471f2', '#67e2ae']

// Builds board-level task totals used by the design-system preview cards.
export function buildBoardSummaries(boards: DatasetBoard[]): BoardSummary[] {
  return boards.map((board) => ({
    name: board.name,
    columnCount: board.columns.length,
    taskCount: board.columns.reduce((totalTasks, column) => totalTasks + column.tasks.length, 0),
  }))
}

// Normalizes a display label into a stable ID-safe slug.
export function toId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Builds typed board, column, and task models used by board-page composition.
export function buildBoardPreviews(boards: DatasetBoard[]): BoardPreview[] {
  return boards.map((board, boardIndex) => ({
    columns: board.columns.map((column, columnIndex) => ({
      accentColor: COLUMN_ACCENT_COLORS[columnIndex % COLUMN_ACCENT_COLORS.length],
      id: `${toId(board.name)}-${toId(column.name)}-${columnIndex}`,
      name: column.name,
      tasks: column.tasks.map((task, taskIndex) => {
        const taskId = `${toId(column.name)}-${toId(task.title)}-${taskIndex}`

        return {
          completedSubtaskCount: task.subtasks.filter((subtask) => subtask.isCompleted).length,
          description: task.description,
          id: taskId,
          status: task.status,
          subtasks: task.subtasks.map((subtask, subtaskIndex) => ({
            id: `${taskId}-subtask-${subtaskIndex}`,
            isCompleted: subtask.isCompleted,
            title: subtask.title,
          })),
          title: task.title,
          totalSubtaskCount: task.subtasks.length,
        }
      }),
    })),
    id: `${toId(board.name)}-${boardIndex}`,
    name: board.name,
  }))
}

export const boardSummaries = buildBoardSummaries(typedKanbanDataset.boards)
export const boardPreviews = buildBoardPreviews(typedKanbanDataset.boards)
