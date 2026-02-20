import { useCallback, useState } from 'react'

interface UseBooleanActions {
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
}

// Manages boolean UI state with stable action handlers.
export function useBoolean(initialValue = false): [boolean, UseBooleanActions] {
  const [value, setValue] = useState(initialValue)

  const setTrue = useCallback(() => {
    setValue(true)
  }, [])

  const setFalse = useCallback(() => {
    setValue(false)
  }, [])

  const toggle = useCallback(() => {
    setValue((previousValue) => !previousValue)
  }, [])

  return [value, { setTrue, setFalse, toggle }]
}
