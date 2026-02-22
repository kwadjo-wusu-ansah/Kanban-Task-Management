import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import type { Connect, Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const APP_BASE_PATH = '/Kanbon-Task-Management/'
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

// Normalizes Vite base paths so endpoint matching can support base-prefixed requests.
function normalizeBasePath(basePath: string): string {
  if (!basePath.startsWith('/')) {
    return `/${basePath.replace(/\/+$/, '')}`
  }

  return basePath.replace(/\/+$/, '')
}

// Checks whether a pathname targets the mock endpoint with or without the configured base path.
function isMockApiPath(pathname: string, basePath: string): boolean {
  if (pathname === MOCK_API_PATH) {
    return true
  }

  const normalizedBasePath = normalizeBasePath(basePath)

  if (normalizedBasePath === '/') {
    return false
  }

  return pathname === `${normalizedBasePath}${MOCK_API_PATH}`
}

// Creates mock API middleware for local Kanban data requests.
function createKanbanMockApiMiddleware(basePath: string): Connect.NextHandleFunction {
  return (request, response, next) => {
    if (request.method !== 'GET' || !request.url) {
      next()
      return
    }

    const requestUrl = new URL(request.url, 'http://localhost')

    if (!isMockApiPath(requestUrl.pathname, basePath)) {
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
function createKanbanMockApiPlugin(basePath: string): Plugin {
  const mockApiMiddleware = createKanbanMockApiMiddleware(basePath)

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
  base: APP_BASE_PATH,
  plugins: [react(), createKanbanMockApiPlugin(APP_BASE_PATH)],
  test: {
    css: true,
    environment: 'jsdom',
    passWithNoTests: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
