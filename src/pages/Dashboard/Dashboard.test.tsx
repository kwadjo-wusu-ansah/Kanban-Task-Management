import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { KanbanDataset } from '../../data'
import { buildEmptyKanbanState, renderWithKanbanStore } from '../../test/renderWithKanbanStore'
import Dashboard from './Dashboard'

const datasetFixture: KanbanDataset = {
  boards: [
    {
      name: 'Platform Launch',
      columns: [
        {
          name: 'Todo',
          tasks: [
            {
              title: 'Design dashboard widgets',
              description: 'Finalize widget states and spacing.',
              status: 'Todo',
              subtasks: [{ isCompleted: false, title: 'Review spacing tokens' }],
            },
          ],
        },
      ],
    },
  ],
}

// Creates a JSON response payload for mocked fetch calls.
function createJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    status,
  })
}

// Creates a controllable promise used to keep mocked fetch requests pending.
function createDeferred<T>() {
  let resolvePromise!: (value: T | PromiseLike<T>) => void
  let rejectPromise!: (reason?: unknown) => void

  const promise = new Promise<T>((resolve, reject) => {
    resolvePromise = resolve
    rejectPromise = reject
  })

  return {
    promise,
    reject: rejectPromise,
    resolve: resolvePromise,
  }
}

// Renders the Dashboard route with Redux and router providers.
function renderDashboard() {
  return renderWithKanbanStore(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>,
    { preloadedKanbanState: buildEmptyKanbanState() },
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Dashboard API hydration states', () => {
  it('shows a loading status while the hydration request is in progress', async () => {
    const deferredFetch = createDeferred<Response>()
    const fetchMock = vi.fn(() => deferredFetch.promise)
    vi.stubGlobal('fetch', fetchMock)

    renderDashboard()

    expect(await screen.findByText('Loading latest boards. This may take a few seconds on slower connections.')).toBeInTheDocument()
    expect(screen.queryByText('Boards synced successfully.')).not.toBeInTheDocument()

    deferredFetch.resolve(createJsonResponse(datasetFixture))
    expect(await screen.findByText('Boards synced successfully.')).toBeInTheDocument()
  })

  it('shows success feedback and board links when API hydration succeeds', async () => {
    const fetchMock = vi.fn().mockResolvedValue(createJsonResponse(datasetFixture))
    vi.stubGlobal('fetch', fetchMock)

    renderDashboard()

    expect(await screen.findByText('Boards synced successfully.')).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: /Platform Launch/i })).toBeInTheDocument()
    expect(screen.getByText('1 column · 1 task')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith('/api/kanban')
  })

  it('shows an error panel when hydration fails and recovers after retry', async () => {
    const user = userEvent.setup()
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(createJsonResponse({ message: 'Mock failure' }, 500))
      .mockResolvedValueOnce(createJsonResponse(datasetFixture))
    vi.stubGlobal('fetch', fetchMock)

    renderDashboard()

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByText("We couldn't load the latest board data.")).toBeInTheDocument()
    expect(screen.getByText('Unable to load Kanban data (500).')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Retry loading boards' }))

    expect(await screen.findByText('Boards synced successfully.')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
