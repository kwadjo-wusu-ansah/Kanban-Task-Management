// Formats the completion summary text shown below each task title.
export function formatSubtaskSummary(completedSubtaskCount: number, totalSubtaskCount: number): string {
  const safeTotal = Math.max(0, totalSubtaskCount)
  const safeCompleted = Math.max(0, completedSubtaskCount)
  const boundedCompleted = Math.min(safeCompleted, safeTotal)
  const subtaskLabel = safeTotal === 1 ? 'subtask' : 'subtasks'

  return `${boundedCompleted} of ${safeTotal} ${subtaskLabel}`
}
