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
    return isPersistedStoreState(parsedState) ? parsedState : undefined
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
