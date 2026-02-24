import { useEffect } from 'react'
import type { RefObject } from 'react'

interface UseCloseOnOutsideMouseDownOptions {
  isEnabled: boolean
  onClose?: () => void
  targetRef: RefObject<HTMLElement | null>
}

// Closes UI regions when mousedown events occur outside the provided target ref.
export function useCloseOnOutsideMouseDown({ isEnabled, onClose, targetRef }: UseCloseOnOutsideMouseDownOptions): void {
  useEffect(() => {
    if (!isEnabled || !onClose) {
      return
    }

    const closeHandler = onClose

    function handleOutsideMouseDown(event: MouseEvent) {
      const eventTarget = event.target

      if (!targetRef.current || !(eventTarget instanceof Node)) {
        return
      }

      if (targetRef.current.contains(eventTarget)) {
        return
      }

      closeHandler()
    }

    window.addEventListener('mousedown', handleOutsideMouseDown)

    return () => {
      window.removeEventListener('mousedown', handleOutsideMouseDown)
    }
  }, [isEnabled, onClose, targetRef])
}
