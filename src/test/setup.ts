import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Provides a jsdom-safe matchMedia fallback for components that observe viewport breakpoints.
function ensureMatchMediaPolyfill() {
  if (typeof window.matchMedia === 'function') {
    return
  }

  Object.defineProperty(window, 'matchMedia', {
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
    writable: true,
  })
}

ensureMatchMediaPolyfill()

// Resets the rendered DOM between tests to keep each case isolated.
afterEach(() => {
  cleanup()
})
