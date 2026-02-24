import { describe, expect, it } from 'vitest'
import type { BoardPreview } from '../../data'
import {
  boardColumnsReordered,
  boardCreated,
  boardRemoved,
  columnRemoved,
  kanbanDataHydratedFromApi,
  kanbanReducer,
  taskAdded,
  taskMoved,
  taskUpdated,
  type KanbanState,
} from './kanban.slice'

// Builds a clean reducer baseline state by running the slice with an init action.
function buildInitialState(): KanbanState {
  return kanbanReducer(undefined, { type: '@@INIT' })
}

// Builds a reusable board preview payload for async hydration reducer tests.
function buildHydratedBoardPreviews(): BoardPreview[] {
  return [
    {
      columns: [
        {
          accentColor: '#49c4e5',
          id: 'hydrated-column-1',
          name: 'Todo',
          tasks: [
            {
              completedSubtaskCount: 0,
              description: 'Ship filter improvements',
              id: 'hydrated-task-1',
              status: 'Todo',
              subtasks: [{ id: 'hydrated-subtask-1', isCompleted: false, title: 'Create unit tests' }],
              title: 'Improve filters',
              totalSubtaskCount: 1,
            },
          ],
        },
      ],
      id: 'hydrated-board-1',
      name: 'Hydrated Board',
    },
  ]
}

// Seeds state with one board containing Todo/Done columns and one Todo task.
function buildBoardStateWithTask(): KanbanState {
  const stateWithBoard = kanbanReducer(
    buildInitialState(),
    boardCreated({
      boardId: 'board-1',
      columns: [
        { id: 'column-todo', name: 'Todo' },
        { id: 'column-done', name: 'Done' },
      ],
      name: 'Roadmap',
    }),
  )

  return kanbanReducer(
    stateWithBoard,
    taskAdded({
      boardId: 'board-1',
      columnId: 'column-todo',
      task: {
        description: 'Initial planning and backlog grooming.',
        id: 'task-1',
        subtasks: [{ id: 'task-1-subtask-1', isCompleted: false, title: 'Draft backlog' }],
        title: 'Plan Q2 roadmap',
      },
    }),
  )
}

describe('kanban.slice reducer', () => {
  it('adds a task and indexes it under the target column and global task list', () => {
    const initialState = buildInitialState()
    const stateWithBoard = kanbanReducer(
      initialState,
      boardCreated({
        boardId: 'board-1',
        columns: [{ id: 'column-todo', name: 'Todo' }],
        name: 'Roadmap',
      }),
    )

    const nextState = kanbanReducer(
      stateWithBoard,
      taskAdded({
        boardId: 'board-1',
        columnId: 'column-todo',
        task: {
          description: 'Write release notes.',
          id: 'task-1',
          title: 'Prepare release notes',
        },
      }),
    )

    expect(nextState.taskIds).toContain('task-1')
    expect(nextState.columns['column-todo'].taskIds).toContain('task-1')
    expect(nextState.tasks['task-1'].status).toBe('Todo')
  })

  it('moves a task between columns and updates task metadata', () => {
    const seededState = buildBoardStateWithTask()

    const nextState = kanbanReducer(
      seededState,
      taskMoved({
        destinationColumnId: 'column-done',
        taskId: 'task-1',
      }),
    )

    expect(nextState.columns['column-todo'].taskIds).not.toContain('task-1')
    expect(nextState.columns['column-done'].taskIds).toContain('task-1')
    expect(nextState.tasks['task-1'].columnId).toBe('column-done')
    expect(nextState.tasks['task-1'].status).toBe('Done')
  })

  it('updates editable task fields without changing ownership', () => {
    const seededState = buildBoardStateWithTask()

    const nextState = kanbanReducer(
      seededState,
      taskUpdated({
        changes: {
          description: 'Updated description',
          subtasks: [
            { id: 'task-1-subtask-1', isCompleted: true, title: 'Draft backlog' },
            { id: 'task-1-subtask-2', isCompleted: false, title: 'Review priorities' },
          ],
          title: 'Plan Q2 roadmap v2',
        },
        taskId: 'task-1',
      }),
    )

    expect(nextState.tasks['task-1'].title).toBe('Plan Q2 roadmap v2')
    expect(nextState.tasks['task-1'].description).toBe('Updated description')
    expect(nextState.tasks['task-1'].subtasks).toHaveLength(2)
    expect(nextState.tasks['task-1'].columnId).toBe('column-todo')
  })

  it('rehomes tasks when a column is removed and a fallback column is provided', () => {
    const seededState = buildBoardStateWithTask()

    const nextState = kanbanReducer(
      seededState,
      columnRemoved({
        boardId: 'board-1',
        columnId: 'column-todo',
        targetColumnId: 'column-done',
      }),
    )

    expect(nextState.columns['column-todo']).toBeUndefined()
    expect(nextState.columns['column-done'].taskIds).toContain('task-1')
    expect(nextState.tasks['task-1'].columnId).toBe('column-done')
    expect(nextState.tasks['task-1'].status).toBe('Done')
  })

  it('removes board descendants and promotes next board as active when active board is deleted', () => {
    const firstBoardState = buildBoardStateWithTask()
    const secondBoardState = kanbanReducer(
      firstBoardState,
      boardCreated({
        boardId: 'board-2',
        columns: [{ id: 'board-2-column-1', name: 'Todo' }],
        name: 'Marketing',
      }),
    )

    const nextState = kanbanReducer(
      secondBoardState,
      boardRemoved({
        boardId: 'board-1',
      }),
    )

    expect(nextState.boards['board-1']).toBeUndefined()
    expect(nextState.columns['column-todo']).toBeUndefined()
    expect(nextState.tasks['task-1']).toBeUndefined()
    expect(nextState.ui.activeBoardId).toBe('board-2')
  })

  it('reorders columns with dedupe and ownership filtering', () => {
    const initialState = buildInitialState()
    const stateWithBoards = kanbanReducer(
      kanbanReducer(
        initialState,
        boardCreated({
          boardId: 'board-1',
          columns: [
            { id: 'column-1', name: 'Todo' },
            { id: 'column-2', name: 'Doing' },
            { id: 'column-3', name: 'Done' },
          ],
          name: 'Roadmap',
        }),
      ),
      boardCreated({
        boardId: 'board-2',
        columns: [{ id: 'column-4', name: 'Backlog' }],
        name: 'Marketing',
      }),
    )

    const nextState = kanbanReducer(
      stateWithBoards,
      boardColumnsReordered({
        boardId: 'board-1',
        columnIds: ['column-3', 'column-3', 'column-4', 'column-1'],
      }),
    )

    expect(nextState.boards['board-1'].columnIds).toEqual(['column-3', 'column-1', 'column-2'])
  })

  it('applies async hydration reducer states for pending, fulfilled, and rejected actions', () => {
    const initialState = buildInitialState()
    const withUiPreferences: KanbanState = {
      ...initialState,
      ui: {
        ...initialState.ui,
        apiHydrationError: 'Old error',
        apiHydrationStatus: 'failed',
        theme: 'dark',
      },
    }

    const loadingState = kanbanReducer(withUiPreferences, kanbanDataHydratedFromApi.pending('request-1', undefined))
    expect(loadingState.ui.apiHydrationStatus).toBe('loading')
    expect(loadingState.ui.apiHydrationError).toBeNull()

    const fulfilledState = kanbanReducer(
      loadingState,
      kanbanDataHydratedFromApi.fulfilled(buildHydratedBoardPreviews(), 'request-1', undefined),
    )

    expect(fulfilledState.ui.apiHydrationStatus).toBe('succeeded')
    expect(fulfilledState.ui.hasHydratedFromApi).toBe(true)
    expect(fulfilledState.ui.theme).toBe('dark')
    expect(fulfilledState.boards['hydrated-board-1']).toBeDefined()
    expect(fulfilledState.tasks['hydrated-task-1']).toBeDefined()

    const rejectedState = kanbanReducer(
      loadingState,
      kanbanDataHydratedFromApi.rejected(new Error('Network down'), 'request-2', undefined),
    )

    expect(rejectedState.ui.apiHydrationStatus).toBe('failed')
    expect(rejectedState.ui.apiHydrationError).toBe('Network down')
  })
})
