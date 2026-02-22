import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { KanbanState, KanbanSubtaskEntity } from '../../store/slices'
import { buildEmptyKanbanState, renderWithKanbanStore } from '../../test/renderWithKanbanStore'
import TaskCard from './TaskCard'

// Builds a minimal Kanban store state with one board, one column, and one task.
function buildTaskCardState(subtasks: KanbanSubtaskEntity[]): KanbanState {
  return {
    ...buildEmptyKanbanState(),
    boardIds: ['board-1'],
    boards: {
      'board-1': {
        columnIds: ['column-1'],
        id: 'board-1',
        name: 'Product Roadmap',
      },
    },
    columnIds: ['column-1'],
    columns: {
      'column-1': {
        accentColor: '#49c4e5',
        boardId: 'board-1',
        id: 'column-1',
        name: 'Todo',
        taskIds: ['task-1'],
      },
    },
    taskIds: ['task-1'],
    tasks: {
      'task-1': {
        boardId: 'board-1',
        columnId: 'column-1',
        description: 'Finalize wireframes for dashboard widgets.',
        id: 'task-1',
        status: 'Todo',
        subtasks,
        title: 'Design dashboard widgets',
      },
    },
  }
}

describe('TaskCard', () => {
  it('renders task title and subtask completion summary from store data', () => {
    const preloadedKanbanState = buildTaskCardState([
      { id: 'subtask-1', isCompleted: true, title: 'Collect requirements' },
      { id: 'subtask-2', isCompleted: false, title: 'Create mockups' },
    ])

    renderWithKanbanStore(<TaskCard taskId="task-1" />, { preloadedKanbanState })

    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Design dashboard widgets')).toBeInTheDocument()
    expect(screen.getByText('1 of 2 subtasks')).toBeInTheDocument()
  })

  it('uses singular summary text when a task has one subtask', () => {
    const preloadedKanbanState = buildTaskCardState([{ id: 'subtask-1', isCompleted: true, title: 'Confirm copy' }])

    renderWithKanbanStore(<TaskCard taskId="task-1" />, { preloadedKanbanState })

    expect(screen.getByText('1 of 1 subtask')).toBeInTheDocument()
  })

  it('returns null when the requested task is missing', () => {
    const preloadedKanbanState = buildEmptyKanbanState()
    const { container } = renderWithKanbanStore(<TaskCard taskId="task-404" />, { preloadedKanbanState })

    expect(container.firstChild).toBeNull()
  })
})
