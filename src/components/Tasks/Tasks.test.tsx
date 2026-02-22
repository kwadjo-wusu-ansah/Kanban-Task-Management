import { DndContext } from '@dnd-kit/core'
import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { KanbanState } from '../../store/slices'
import { buildEmptyKanbanState, renderWithKanbanStore } from '../../test/renderWithKanbanStore'
import Tasks from './Tasks'

// Builds a state fixture with one column and two tasks for Tasks component assertions.
function buildTasksState(): KanbanState {
  return {
    ...buildEmptyKanbanState(),
    boardIds: ['board-1'],
    boards: {
      'board-1': {
        columnIds: ['column-1'],
        id: 'board-1',
        name: 'Platform',
      },
    },
    columnIds: ['column-1'],
    columns: {
      'column-1': {
        accentColor: '#8471f2',
        boardId: 'board-1',
        id: 'column-1',
        name: 'Doing',
        taskIds: ['task-1', 'task-2'],
      },
    },
    taskIds: ['task-1', 'task-2'],
    tasks: {
      'task-1': {
        boardId: 'board-1',
        columnId: 'column-1',
        description: 'Wire up modal actions to Redux handlers.',
        id: 'task-1',
        status: 'Doing',
        subtasks: [],
        title: 'Connect modal actions',
      },
      'task-2': {
        boardId: 'board-1',
        columnId: 'column-1',
        description: 'Clean up duplicated ID parsing helpers.',
        id: 'task-2',
        status: 'Doing',
        subtasks: [{ id: 'subtask-1', isCompleted: false, title: 'Review drag events' }],
        title: 'Refactor drag utilities',
      },
    },
  }
}

// Renders the Tasks component under required Redux and drag-drop providers.
function renderTasks(preloadedKanbanState: KanbanState, onTaskSelect?: (taskId: string) => void) {
  return renderWithKanbanStore(
    <DndContext>
      <Tasks columnId="column-1" onTaskSelect={onTaskSelect} />
    </DndContext>,
    { preloadedKanbanState },
  )
}

describe('Tasks', () => {
  it('renders the uppercase heading with task count and task titles', () => {
    const preloadedKanbanState = buildTasksState()
    renderTasks(preloadedKanbanState)

    expect(screen.getByRole('heading', { name: 'DOING (2)' })).toBeInTheDocument()
    expect(screen.getByText('Connect modal actions')).toBeInTheDocument()
    expect(screen.getByText('Refactor drag utilities')).toBeInTheDocument()
  })

  it('calls onTaskSelect with the clicked task id', async () => {
    const handleTaskSelect = vi.fn()
    const preloadedKanbanState = buildTasksState()
    renderTasks(preloadedKanbanState, handleTaskSelect)

    fireEvent.click(screen.getByText('Refactor drag utilities'))

    expect(handleTaskSelect).toHaveBeenCalledTimes(1)
    expect(handleTaskSelect).toHaveBeenCalledWith('task-2')
  })

  it('returns null when the target column does not exist', () => {
    const preloadedKanbanState = buildEmptyKanbanState()
    const { container } = renderWithKanbanStore(
      <DndContext>
        <Tasks columnId="missing-column" />
      </DndContext>,
      { preloadedKanbanState },
    )

    expect(container.querySelector('section')).toBeNull()
  })
})
