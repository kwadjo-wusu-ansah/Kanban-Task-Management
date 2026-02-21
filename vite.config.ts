import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import type { Connect, Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const MOCK_API_PATH = '/api/kanban'
const MAX_MOCK_DELAY_MS = 15000
const MOCK_DATA_FILE_PATH = resolve(process.cwd(), 'data.json')

interface MockApiErrorPayload {
  message: string
}

// Parses a delay value and clamps it to a safe range for mock responses.
function parseDelayMs(value: string | null): number {
  if (!value) {
    return 0
  }

  const parsedDelayMs = Number.parseInt(value, 10)

  if (Number.isNaN(parsedDelayMs) || parsedDelayMs <= 0) {
    return 0
  }

  return Math.min(parsedDelayMs, MAX_MOCK_DELAY_MS)
}

// Reads the canonical Kanban payload used by the mock API endpoint.
function readMockKanbanPayload(): string {
  return readFileSync(MOCK_DATA_FILE_PATH, 'utf-8')
}

// Creates mock API middleware for local Kanban data requests.
function createKanbanMockApiMiddleware(): Connect.NextHandleFunction {
  return (request, response, next) => {
    if (request.method !== 'GET' || !request.url) {
      next()
      return
    }

    const requestUrl = new URL(request.url, 'http://localhost')

    if (requestUrl.pathname !== MOCK_API_PATH) {
      next()
      return
    }

    const responseDelayMs = parseDelayMs(requestUrl.searchParams.get('delayMs'))
    const shouldFail = requestUrl.searchParams.get('fail') === 'true'

    globalThis.setTimeout(() => {
      if (shouldFail) {
        const errorPayload: MockApiErrorPayload = {
          message: 'Mock API failure triggered by query parameter.',
        }

        response.statusCode = 500
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        response.end(JSON.stringify(errorPayload))
        return
      }

      try {
        const mockPayload = readMockKanbanPayload()

        response.statusCode = 200
        response.setHeader('Cache-Control', 'no-store')
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        response.end(mockPayload)
      } catch {
        const errorPayload: MockApiErrorPayload = {
          message: 'Failed to load mock data from data.json.',
        }

        response.statusCode = 500
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        response.end(JSON.stringify(errorPayload))
      }
    }, responseDelayMs)
  }
}

// Registers the Kanban mock API for both dev and preview servers.
function createKanbanMockApiPlugin(): Plugin {
  const mockApiMiddleware = createKanbanMockApiMiddleware()

  return {
    configurePreviewServer(server) {
      server.middlewares.use(mockApiMiddleware)
    },
    configureServer(server) {
      server.middlewares.use(mockApiMiddleware)
    },
    name: 'kanban-mock-api',
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: "/Kanbon-Task-Management/",
  plugins: [react(), createKanbanMockApiPlugin()],
})
