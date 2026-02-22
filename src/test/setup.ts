import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Resets the rendered DOM between tests to keep each case isolated.
afterEach(() => {
  cleanup()
})
