import { configureStore } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { kanbanReducer, type KanbanState } from '../store/slices'

interface RenderWithKanbanStoreOptions {
  preloadedKanbanState?: KanbanState
}

// Builds the default empty Kanban state used for isolated component tests.
function buildEmptyKanbanState(): KanbanState {
  return {
    boardIds: [],
    boards: {},
    columnIds: [],
    columns: {},
    taskIds: [],
    tasks: {},
    ui: {
      activeBoardId: null,
      apiHydrationError: null,
      apiHydrationStatus: 'idle',
      hasHydratedFromApi: false,
      theme: 'light',
    },
  }
}

// Creates an isolated Redux store instance for each test render.
function createKanbanTestStore(preloadedKanbanState?: KanbanState) {
  return configureStore({
    preloadedState: {
      kanban: preloadedKanbanState ?? buildEmptyKanbanState(),
    },
    reducer: {
      kanban: kanbanReducer,
    },
  })
}

// Renders UI under the Redux provider and returns both store and render helpers.
function renderWithKanbanStore(ui: ReactElement, options: RenderWithKanbanStoreOptions = {}) {
  const store = createKanbanTestStore(options.preloadedKanbanState)

  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>),
  }
}

export { buildEmptyKanbanState, createKanbanTestStore, renderWithKanbanStore }
