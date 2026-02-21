const TASK_DRAG_ID_PREFIX = 'task:'
const COLUMN_DRAG_ID_PREFIX = 'column:'

// Builds a namespaced drag identifier for a task.
function toTaskDragId(taskId: string): string {
  return `${TASK_DRAG_ID_PREFIX}${taskId}`
}

// Builds a namespaced drag identifier for a column drop zone.
function toColumnDragId(columnId: string): string {
  return `${COLUMN_DRAG_ID_PREFIX}${columnId}`
}

// Extracts the task ID from a task drag identifier.
function fromTaskDragId(dragId: string): string | null {
  if (!dragId.startsWith(TASK_DRAG_ID_PREFIX)) {
    return null
  }

  const taskId = dragId.slice(TASK_DRAG_ID_PREFIX.length)
  return taskId.length > 0 ? taskId : null
}

// Extracts the column ID from a column drag identifier.
function fromColumnDragId(dragId: string): string | null {
  if (!dragId.startsWith(COLUMN_DRAG_ID_PREFIX)) {
    return null
  }

  const columnId = dragId.slice(COLUMN_DRAG_ID_PREFIX.length)
  return columnId.length > 0 ? columnId : null
}

export { fromColumnDragId, fromTaskDragId, toColumnDragId, toTaskDragId }
