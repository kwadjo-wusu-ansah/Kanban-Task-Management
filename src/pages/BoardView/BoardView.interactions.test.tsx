import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import type { KanbanState } from '../../store/slices'
import { buildEmptyKanbanState, renderWithKanbanStore } from '../../test/renderWithKanbanStore'
import BoardView from './BoardView'

// Builds stable board, column, and task fixtures for board interaction tests.
function buildBoardViewState(): KanbanState {
  return {
    ...buildEmptyKanbanState(),
    boardIds: ['board-a', 'board-b'],
    boards: {
      'board-a': {
        columnIds: ['column-a-todo', 'column-a-done'],
        id: 'board-a',
        name: 'Product Roadmap',
      },
      'board-b': {
        columnIds: ['column-b-todo'],
        id: 'board-b',
        name: 'Brand Refresh',
      },
    },
    columnIds: ['column-a-todo', 'column-a-done', 'column-b-todo'],
    columns: {
      'column-a-done': {
        accentColor: '#8471f2',
        boardId: 'board-a',
        id: 'column-a-done',
        name: 'Done',
        taskIds: ['roadmap-task-2'],
      },
      'column-a-todo': {
        accentColor: '#49c4e5',
        boardId: 'board-a',
        id: 'column-a-todo',
        name: 'Todo',
        taskIds: ['roadmap-task-1'],
      },
      'column-b-todo': {
        accentColor: '#67e2ae',
        boardId: 'board-b',
        id: 'column-b-todo',
        name: 'Todo',
        taskIds: ['brand-task-1'],
      },
    },
    taskIds: ['roadmap-task-1', 'roadmap-task-2', 'brand-task-1'],
    tasks: {
      'brand-task-1': {
        boardId: 'board-b',
        columnId: 'column-b-todo',
        description: 'Refresh top-of-page graphics.',
        id: 'brand-task-1',
        status: 'Todo',
        subtasks: [{ id: 'brand-task-1-subtask-1', isCompleted: false, title: 'Collect references' }],
        title: 'Update hero illustration',
      },
      'roadmap-task-1': {
        boardId: 'board-a',
        columnId: 'column-a-todo',
        description: 'Prepare variants for tablet and desktop.',
        id: 'roadmap-task-1',
        status: 'Todo',
        subtasks: [{ id: 'roadmap-task-1-subtask-1', isCompleted: false, title: 'Draft desktop layout' }],
        title: 'Design dashboard widgets',
      },
      'roadmap-task-2': {
        boardId: 'board-a',
        columnId: 'column-a-done',
        description: 'Release and verify final dark mode visuals.',
        id: 'roadmap-task-2',
        status: 'Done',
        subtasks: [{ id: 'roadmap-task-2-subtask-1', isCompleted: true, title: 'Run accessibility checks' }],
        title: 'Ship dark mode',
      },
    },
    ui: {
      ...buildEmptyKanbanState().ui,
      activeBoardId: 'board-a',
      apiHydrationError: null,
      apiHydrationStatus: 'succeeded',
      hasHydratedFromApi: true,
      theme: 'light',
    },
  }
}

// Renders board routes for both board and board-task URLs with a preloaded store fixture.
function renderBoardView(initialPath = '/board/board-a') {
  const preloadedKanbanState = buildBoardViewState()

  return renderWithKanbanStore(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<div>Dashboard</div>} path="/" />
        <Route element={<BoardView />} path="/board/:boardId" />
        <Route element={<BoardView />} path="/board/:boardId/task/:taskId" />
      </Routes>
    </MemoryRouter>,
    { preloadedKanbanState },
  )
}

describe('BoardView interaction flows', () => {
  it('adds a new task from the add-task modal and updates board UI/store state', async () => {
    const user = userEvent.setup()
    const { store } = renderBoardView()

    await user.click(screen.getByRole('button', { name: '+ Add New Task' }))

    await user.type(screen.getByPlaceholderText('e.g. Take coffee break'), 'Plan launch retrospective')
    await user.type(
      screen.getByPlaceholderText("e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."),
      'Gather stakeholder feedback and prep outcomes.',
    )
    await user.type(screen.getByPlaceholderText('e.g. Make coffee'), 'Draft agenda')
    await user.type(screen.getByPlaceholderText('e.g. Drink coffee & smile'), 'Send attendee notes')
    await user.click(screen.getByRole('button', { name: 'Create Task' }))

    expect(await screen.findByText('Plan launch retrospective')).toBeInTheDocument()

    const kanbanState = store.getState().kanban
    const createdTaskId = kanbanState.taskIds.find((taskId) => kanbanState.tasks[taskId].title === 'Plan launch retrospective')

    expect(createdTaskId).toBeDefined()
    expect(createdTaskId ? kanbanState.columns['column-a-todo'].taskIds.includes(createdTaskId) : false).toBe(true)
  })

  it('edits an existing task from the task actions menu and persists the updated title', async () => {
    const user = userEvent.setup()
    const { store } = renderBoardView()

    fireEvent.click(screen.getByText('Design dashboard widgets'))
    await user.click(screen.getByRole('button', { name: 'Open task actions' }))
    await user.click(screen.getByRole('menuitem', { name: 'Edit Task' }))

    const titleInput = screen.getByDisplayValue('Design dashboard widgets')
    await user.clear(titleInput)
    await user.type(titleInput, 'Design dashboard widgets v2')
    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(await screen.findByText('Design dashboard widgets v2')).toBeInTheDocument()
    expect(store.getState().kanban.tasks['roadmap-task-1'].title).toBe('Design dashboard widgets v2')
  })

  it('deletes a task from the delete-task confirmation flow and removes it from store indexes', async () => {
    const user = userEvent.setup()
    const { store } = renderBoardView()

    fireEvent.click(screen.getByText('Ship dark mode'))
    await user.click(screen.getByRole('button', { name: 'Open task actions' }))
    await user.click(screen.getByRole('menuitem', { name: 'Delete Task' }))
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(store.getState().kanban.tasks['roadmap-task-2']).toBeUndefined()
    })
    expect(store.getState().kanban.columns['column-a-done'].taskIds).not.toContain('roadmap-task-2')
    expect(screen.queryByText('Ship dark mode')).not.toBeInTheDocument()
  })

  it('navigates between boards from the sidebar and updates visible board content', async () => {
    const user = userEvent.setup()
    renderBoardView('/board/board-a')

    expect(screen.getByRole('heading', { name: 'Product Roadmap' })).toBeInTheDocument()
    expect(screen.getByText('Design dashboard widgets')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Brand Refresh' }))

    expect(await screen.findByRole('heading', { name: 'Brand Refresh' })).toBeInTheDocument()
    expect(screen.getByText('Update hero illustration')).toBeInTheDocument()
    expect(screen.queryByText('Design dashboard widgets')).not.toBeInTheDocument()
  })
})
