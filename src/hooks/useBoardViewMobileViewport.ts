import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

interface UseBoardViewMobileViewportParams {
  mobileBreakpoint: number
  setIsMobileBoardsMenuOpen: Dispatch<SetStateAction<boolean>>
}

interface UseBoardViewMobileViewportResult {
  isMobileViewport: boolean
}

// Tracks BoardView mobile breakpoint state and keeps mobile-only menus closed on larger screens.
export function useBoardViewMobileViewport({
  mobileBreakpoint,
  setIsMobileBoardsMenuOpen,
}: UseBoardViewMobileViewportParams): UseBoardViewMobileViewportResult {
  const [isMobileViewport, setIsMobileViewport] = useState(() => window.innerWidth < mobileBreakpoint)

  // Tracks the mobile breakpoint so the app can switch between desktop sidebar and mobile header layouts.
  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`)

    function handleMobileBreakpointChange(event: MediaQueryListEvent) {
      setIsMobileViewport(event.matches)
    }

    mediaQuery.addEventListener('change', handleMobileBreakpointChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMobileBreakpointChange)
    }
  }, [mobileBreakpoint])

  // Closes the mobile boards popover when switching to tablet/desktop layouts.
  useEffect(() => {
    if (!isMobileViewport) {
      setIsMobileBoardsMenuOpen(false)
    }
  }, [isMobileViewport, setIsMobileBoardsMenuOpen])

  return {
    isMobileViewport,
  }
}
