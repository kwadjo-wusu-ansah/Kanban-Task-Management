import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import type { InputProps } from '../components/Input/Input.types'
import { getDropdownMenuPlacement } from '../components/Input/Input.utils'

type UseDropdownMenuPlacementParams = {
  variant: InputProps['variant']
  isMenuOpen: boolean
  optionCount: number
  triggerRef: RefObject<HTMLDivElement | null>
}

// Resolves dropdown menu placement from viewport space when the menu opens.
export function useDropdownMenuPlacement({
  isMenuOpen,
  optionCount,
  triggerRef,
  variant,
}: UseDropdownMenuPlacementParams): 'bottom' | 'top' {
  const [dropdownPlacement, setDropdownPlacement] = useState<'bottom' | 'top'>('bottom')

  useEffect(() => {
    if (variant !== 'dropdown' || !isMenuOpen || !triggerRef.current) {
      return
    }

    const triggerRect = triggerRef.current.getBoundingClientRect()
    setDropdownPlacement(getDropdownMenuPlacement(triggerRect, optionCount))
  }, [isMenuOpen, optionCount, triggerRef, variant])

  return dropdownPlacement
}
