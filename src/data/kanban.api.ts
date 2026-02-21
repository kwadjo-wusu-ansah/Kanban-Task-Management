import type { DatasetBoard, DatasetColumn, DatasetTask, KanbanDataset } from './kanban.types'

const DEFAULT_KANBAN_API_PATH = 'api/kanban.json'

// Validates that a subtask payload contains the required string/boolean fields.
function isDatasetSubtask(value: unknown): value is { title: string; isCompleted: boolean } {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<{ title: string; isCompleted: boolean }>
  return typeof candidate.title === 'string' && typeof candidate.isCompleted === 'boolean'
}

// Validates that a task payload matches the expected Kanban task contract.
function isDatasetTask(value: unknown): value is DatasetTask {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<DatasetTask>

  return (
    typeof candidate.title === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.status === 'string' &&
    Array.isArray(candidate.subtasks) &&
    candidate.subtasks.every((subtask) => isDatasetSubtask(subtask))
  )
}

// Validates that a column payload contains a label and task collection.
function isDatasetColumn(value: unknown): value is DatasetColumn {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<DatasetColumn>
  return typeof candidate.name === 'string' && Array.isArray(candidate.tasks) && candidate.tasks.every((task) => isDatasetTask(task))
}

// Validates that a board payload contains a name and column collection.
function isDatasetBoard(value: unknown): value is DatasetBoard {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<DatasetBoard>
  return typeof candidate.name === 'string' && Array.isArray(candidate.columns) && candidate.columns.every((column) => isDatasetColumn(column))
}

// Validates that the root API response is a Kanban dataset payload.
function isKanbanDataset(value: unknown): value is KanbanDataset {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<KanbanDataset>
  return Array.isArray(candidate.boards) && candidate.boards.every((board) => isDatasetBoard(board))
}

// Resolves the configured API URL or falls back to the local mock endpoint.
function getKanbanApiUrl(): string {
  const configuredUrl = import.meta.env.VITE_KANBAN_API_URL

  if (typeof configuredUrl === 'string' && configuredUrl.trim().length > 0) {
    return configuredUrl
  }

  const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`
  return `${baseUrl}${DEFAULT_KANBAN_API_PATH}`
}

// Fetches the Kanban dataset from API and validates payload shape before use.
export async function fetchKanbanDataset(): Promise<KanbanDataset> {
  const response = await fetch(getKanbanApiUrl())

  if (!response.ok) {
    throw new Error(`Unable to load Kanban data (${response.status}).`)
  }

  const dataset = (await response.json()) as unknown

  if (!isKanbanDataset(dataset)) {
    throw new Error('Received an invalid Kanban dataset payload.')
  }

  return dataset
}
