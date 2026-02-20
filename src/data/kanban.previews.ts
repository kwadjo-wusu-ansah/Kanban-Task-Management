import { typedKanbanDataset } from './kanban.dataset'
import type { DatasetBoard, SubtaskPreview } from './kanban.types'

// Extracts a stable list of column names for dropdown preview data.
function getUniqueColumnNames(boards: DatasetBoard[]): string[] {
  const columnNameSet = new Set<string>()

  boards.forEach((board) => {
    board.columns.forEach((column) => {
      columnNameSet.add(column.name)
    })
  })

  return Array.from(columnNameSet)
}

// Derives checkbox preview rows from first available subtasks.
function buildSubtaskStatePreviews(fallbackTaskTitle: string, boards: DatasetBoard[]): SubtaskPreview[] {
  const allSubtasks = boards.flatMap((board) => board.columns.flatMap((column) => column.tasks.flatMap((task) => task.subtasks)))
  const firstSubtask = allSubtasks[0]
  const secondSubtask = allSubtasks[1]
  const completedSubtask = allSubtasks.find((subtask) => subtask.isCompleted)

  return [
    {
      label: firstSubtask?.title ?? fallbackTaskTitle,
      checked: false,
      state: 'idle',
    },
    {
      label: secondSubtask?.title ?? 'Hovered',
      checked: false,
      state: 'hovered',
    },
    {
      label: completedSubtask?.title ?? 'Completed',
      checked: true,
      state: 'completed',
    },
  ]
}

const firstTask = typedKanbanDataset.boards[0]?.columns.find((column) => column.tasks.length > 0)?.tasks[0]

export const sampleTaskTitle = firstTask?.title ?? 'Building a slideshow'
export const dropdownOptions = getUniqueColumnNames(typedKanbanDataset.boards)
export const subtaskStates = buildSubtaskStatePreviews(sampleTaskTitle, typedKanbanDataset.boards)
