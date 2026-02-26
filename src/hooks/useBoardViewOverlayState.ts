import { useCallback, useReducer } from 'react'

export type BoardViewOverlayState = {
  isAddBoardModalOpen: boolean
  isAddColumnModalOpen: boolean
  isAddStatusMenuOpen: boolean
  isAddTaskModalOpen: boolean
  isBoardMenuOpen: boolean
  isDeleteBoardModalOpen: boolean
  isDeleteTaskModalOpen: boolean
  isEditBoardModalOpen: boolean
  isEditStatusMenuOpen: boolean
  isEditTaskModalOpen: boolean
  isMobileBoardsMenuOpen: boolean
  isTaskMenuOpen: boolean
  isViewStatusMenuOpen: boolean
}

export type BoardViewOverlayKey = keyof BoardViewOverlayState
export type BoardViewOverlayUpdater = boolean | ((previousValue: boolean) => boolean)
type BoardViewOverlayAction =
  | { type: 'set'; key: BoardViewOverlayKey; value: BoardViewOverlayUpdater }
  | { type: 'setMany'; values: Partial<BoardViewOverlayState> }
  | { type: 'reset' }

export type VisibilitySetter = (value: BoardViewOverlayUpdater) => void

const initialBoardViewOverlayState: BoardViewOverlayState = {
  isAddBoardModalOpen: false,
  isAddColumnModalOpen: false,
  isAddStatusMenuOpen: false,
  isAddTaskModalOpen: false,
  isBoardMenuOpen: false,
  isDeleteBoardModalOpen: false,
  isDeleteTaskModalOpen: false,
  isEditBoardModalOpen: false,
  isEditStatusMenuOpen: false,
  isEditTaskModalOpen: false,
  isMobileBoardsMenuOpen: false,
  isTaskMenuOpen: false,
  isViewStatusMenuOpen: false,
}

// Resolves a reducer overlay value whether it comes from a raw boolean or updater callback.
function resolveOverlayValue(currentValue: boolean, nextValue: BoardViewOverlayUpdater): boolean {
  if (typeof nextValue === 'function') {
    return nextValue(currentValue)
  }

  return nextValue
}

// Centralizes all BoardView overlay/menu visibility updates in one reducer.
function boardViewOverlayReducer(state: BoardViewOverlayState, action: BoardViewOverlayAction): BoardViewOverlayState {
  if (action.type === 'reset') {
    return initialBoardViewOverlayState
  }

  if (action.type === 'setMany') {
    return {
      ...state,
      ...action.values,
    }
  }

  return {
    ...state,
    [action.key]: resolveOverlayValue(state[action.key], action.value),
  }
}

// Encapsulates BoardView overlay visibility state and stable setter utilities.
function useBoardViewOverlayState() {
  const [overlayState, dispatchOverlay] = useReducer(boardViewOverlayReducer, initialBoardViewOverlayState)

  // Updates a single overlay/menu visibility value using a useState-compatible setter signature.
  const setOverlayValue = useCallback((key: BoardViewOverlayKey, value: BoardViewOverlayUpdater) => {
    dispatchOverlay({ key, type: 'set', value })
  }, [])

  // Updates multiple overlay/menu visibility values in one reducer dispatch.
  const setOverlayValues = useCallback((values: Partial<BoardViewOverlayState>) => {
    dispatchOverlay({ type: 'setMany', values })
  }, [])

  // Resets all overlay/menu visibility values to their closed state.
  const resetOverlayVisibility = useCallback(() => {
    dispatchOverlay({ type: 'reset' })
  }, [])

  const setIsTaskMenuOpen: VisibilitySetter = useCallback(
    (value) => setOverlayValue('isTaskMenuOpen', value),
    [setOverlayValue],
  )
  const setIsViewStatusMenuOpen: VisibilitySetter = useCallback(
    (value) => setOverlayValue('isViewStatusMenuOpen', value),
    [setOverlayValue],
  )
  const setIsAddTaskModalOpen: VisibilitySetter = useCallback(
    (value) => setOverlayValue('isAddTaskModalOpen', value),
    [setOverlayValue],
  )
  const setIsAddStatusMenuOpen: VisibilitySetter = useCallback(
    (value) => setOverlayValue('isAddStatusMenuOpen', value),
    [setOverlayValue],
  )
  const setIsEditTaskModalOpen: VisibilitySetter = useCallback(
    (value) => setOverlayValue('isEditTaskModalOpen', value),
    [setOverlayValue],
  )
  const setIsEditStatusMenuOpen: VisibilitySetter = useCallback(
    (value) => setOverlayValue('isEditStatusMenuOpen', value),
    [setOverlayValue],
  )
  const setIsAddBoardModalOpen: VisibilitySetter = useCallback(
    (value) => setOverlayValue('isAddBoardModalOpen', value),
    [setOverlayValue],
  )
  const setIsAddColumnModalOpen: VisibilitySetter = useCallback(
    (value) => setOverlayValue('isAddColumnModalOpen', value),
    [setOverlayValue],
  )
  const setIsBoardMenuOpen: VisibilitySetter = useCallback(
    (value) => setOverlayValue('isBoardMenuOpen', value),
    [setOverlayValue],
  )
  const setIsMobileBoardsMenuOpen: VisibilitySetter = useCallback(
    (value) => setOverlayValue('isMobileBoardsMenuOpen', value),
    [setOverlayValue],
  )
  const setIsEditBoardModalOpen: VisibilitySetter = useCallback(
    (value) => setOverlayValue('isEditBoardModalOpen', value),
    [setOverlayValue],
  )
  const setIsDeleteBoardModalOpen: VisibilitySetter = useCallback(
    (value) => setOverlayValue('isDeleteBoardModalOpen', value),
    [setOverlayValue],
  )
  const setIsDeleteTaskModalOpen: VisibilitySetter = useCallback(
    (value) => setOverlayValue('isDeleteTaskModalOpen', value),
    [setOverlayValue],
  )

  return {
    overlayState,
    resetOverlayVisibility,
    setIsAddBoardModalOpen,
    setIsAddColumnModalOpen,
    setIsAddStatusMenuOpen,
    setIsAddTaskModalOpen,
    setIsBoardMenuOpen,
    setIsDeleteBoardModalOpen,
    setIsDeleteTaskModalOpen,
    setIsEditBoardModalOpen,
    setIsEditStatusMenuOpen,
    setIsEditTaskModalOpen,
    setIsMobileBoardsMenuOpen,
    setIsTaskMenuOpen,
    setIsViewStatusMenuOpen,
    setOverlayValues,
  }
}

export default useBoardViewOverlayState
