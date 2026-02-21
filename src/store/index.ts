import { configureStore } from '@reduxjs/toolkit'
import type { KanbanState } from './slices'
import { kanbanReducer } from './slices'

const STORE_PERSISTENCE_KEY = 'kanban-task-management.store.v1'

interface PersistedStoreState {
  kanban: KanbanState
}

// Checks if the current runtime can access localStorage safely.
function canUseLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

// Deduplicates ID lists while preserving first-seen order.
function dedupeIds(values: string[]): string[] {
  const seenValues = new Set<string>()

  return values.filter((value) => {
    if (seenValues.has(value)) {
      return false
    }

    seenValues.add(value)
    return true
  })
}

// Validates a persisted payload shape before hydrating the Redux store.
function isPersistedStoreState(value: unknown): value is PersistedStoreState {
  if (!value || typeof value !== 'object') {
    return false
  }

  const { kanban } = value as Partial<PersistedStoreState>

  return Boolean(
    kanban &&
      Array.isArray(kanban.boardIds) &&
      typeof kanban.boards === 'object' &&
      kanban.boards !== null &&
      Array.isArray(kanban.columnIds) &&
      typeof kanban.columns === 'object' &&
      kanban.columns !== null &&
      Array.isArray(kanban.taskIds) &&
      typeof kanban.tasks === 'object' &&
      kanban.tasks !== null &&
      typeof kanban.ui === 'object' &&
      kanban.ui !== null,
  )
}

// Sanitizes persisted Kanban state to remove stale references and duplicate IDs.
function sanitizeKanbanState(state: KanbanState): KanbanState {
  const hasHydratedFromApi = Boolean(state.ui?.hasHydratedFromApi)
  const sourceBoardIds = hasHydratedFromApi && Array.isArray(state.boardIds) ? state.boardIds : []
  const sourceBoards = hasHydratedFromApi && typeof state.boards === 'object' && state.boards !== null ? state.boards : {}
  const sourceColumns = hasHydratedFromApi && typeof state.columns === 'object' && state.columns !== null ? state.columns : {}
  const sourceTasks = hasHydratedFromApi && typeof state.tasks === 'object' && state.tasks !== null ? state.tasks : {}

  const sanitizedBoardIds = dedupeIds(sourceBoardIds).filter((boardId) => Boolean(sourceBoards[boardId]))
  const sanitizedBoards: KanbanState['boards'] = {}
  const sanitizedColumns: KanbanState['columns'] = {}
  const sanitizedTasks: KanbanState['tasks'] = {}
  const sanitizedColumnIds: string[] = []
  const sanitizedTaskIds: string[] = []

  sanitizedBoardIds.forEach((boardId) => {
    const sourceBoard = sourceBoards[boardId]
    const sourceBoardColumnIds = Array.isArray(sourceBoard?.columnIds) ? sourceBoard.columnIds : []
    const sanitizedBoardColumnIds: string[] = []

    dedupeIds(sourceBoardColumnIds).forEach((columnId) => {
      const sourceColumn = sourceColumns[columnId]

      if (!sourceColumn) {
        return
      }

      const sourceColumnTaskIds = Array.isArray(sourceColumn.taskIds) ? sourceColumn.taskIds : []
      const sanitizedColumnTaskIds: string[] = []

      dedupeIds(sourceColumnTaskIds).forEach((taskId) => {
        const sourceTask = sourceTasks[taskId]

        if (!sourceTask || sanitizedTasks[taskId]) {
          return
        }

        const sourceSubtasks = Array.isArray(sourceTask.subtasks) ? sourceTask.subtasks : []

        sanitizedTasks[taskId] = {
          boardId,
          columnId,
          description: typeof sourceTask.description === 'string' ? sourceTask.description : '',
          id: taskId,
          status: typeof sourceColumn.name === 'string' ? sourceColumn.name : '',
          subtasks: sourceSubtasks
            .map((subtask) => ({
              id: typeof subtask.id === 'string' ? subtask.id : `${taskId}-subtask`,
              isCompleted: Boolean(subtask.isCompleted),
              title: typeof subtask.title === 'string' ? subtask.title : '',
            }))
            .filter((subtask) => subtask.title.length > 0),
          title: typeof sourceTask.title === 'string' ? sourceTask.title : 'Untitled task',
        }
        sanitizedColumnTaskIds.push(taskId)
        sanitizedTaskIds.push(taskId)
      })

      sanitizedColumns[columnId] = {
        accentColor: typeof sourceColumn.accentColor === 'string' ? sourceColumn.accentColor : '#49c4e5',
        boardId,
        id: columnId,
        name: typeof sourceColumn.name === 'string' ? sourceColumn.name : 'Untitled',
        taskIds: sanitizedColumnTaskIds,
      }
      sanitizedBoardColumnIds.push(columnId)
      sanitizedColumnIds.push(columnId)
    })

    sanitizedBoards[boardId] = {
      columnIds: sanitizedBoardColumnIds,
      id: boardId,
      name: typeof sourceBoard?.name === 'string' ? sourceBoard.name : 'Untitled board',
    }
  })

  const selectedBoardId = typeof state.ui?.activeBoardId === 'string' ? state.ui.activeBoardId : null
  const activeBoardId = selectedBoardId && sanitizedBoards[selectedBoardId] ? selectedBoardId : sanitizedBoardIds[0] ?? null
  const theme = state.ui?.theme === 'dark' ? 'dark' : 'light'

  return {
    boardIds: sanitizedBoardIds,
    boards: sanitizedBoards,
    columnIds: dedupeIds(sanitizedColumnIds),
    columns: sanitizedColumns,
    taskIds: dedupeIds(sanitizedTaskIds),
    tasks: sanitizedTasks,
    ui: {
      activeBoardId,
      apiHydrationError: null,
      apiHydrationStatus: hasHydratedFromApi ? 'succeeded' : 'idle',
      hasHydratedFromApi,
      theme,
    },
  }
}

// Loads persisted store state from localStorage when available.
function loadPersistedState(): PersistedStoreState | undefined {
  if (!canUseLocalStorage()) {
    return undefined
  }

  try {
    const persistedState = window.localStorage.getItem(STORE_PERSISTENCE_KEY)

    if (!persistedState) {
      return undefined
    }

    const parsedState = JSON.parse(persistedState) as unknown
    return isPersistedStoreState(parsedState)
      ? {
          kanban: sanitizeKanbanState(parsedState.kanban),
        }
      : undefined
  } catch {
    return undefined
  }
}

// Saves the current store snapshot to localStorage for cross-session persistence.
function savePersistedState(state: PersistedStoreState): void {
  if (!canUseLocalStorage()) {
    return
  }

  try {
    window.localStorage.setItem(STORE_PERSISTENCE_KEY, JSON.stringify(state))
  } catch {
    // Ignore storage write failures so UI state updates continue.
  }
}

export const store = configureStore({
  preloadedState: loadPersistedState(),
  reducer: {
    kanban: kanbanReducer,
  },
})

store.subscribe(() => {
  savePersistedState({ kanban: store.getState().kanban })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
