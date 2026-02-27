import type { SetStateAction } from 'react'
import { useCallback, useReducer } from 'react'

interface BoardViewOverlayState {
  isTaskMenuOpen: boolean
  isViewStatusMenuOpen: boolean
  isAddTaskModalOpen: boolean
  isAddStatusMenuOpen: boolean
  isEditTaskModalOpen: boolean
  isEditStatusMenuOpen: boolean
  isAddBoardModalOpen: boolean
  isAddColumnModalOpen: boolean
  isBoardMenuOpen: boolean
  isMobileBoardsMenuOpen: boolean
  isEditBoardModalOpen: boolean
  isDeleteBoardModalOpen: boolean
  isDeleteTaskModalOpen: boolean
}

type OverlayStateKey = keyof BoardViewOverlayState

type BoardViewOverlayAction =
  | {
      type: 'setValue'
      key: OverlayStateKey
      value: SetStateAction<boolean>
    }
  | { type: 'closeHeaderMenus' }
  | { type: 'closeTaskMenus' }
  | { type: 'closeTaskModals' }
  | { type: 'closeBoardModals' }
  | { type: 'closeDeleteModals' }
  | { type: 'closeAll' }

interface UseBoardViewOverlayStateResult extends BoardViewOverlayState {
  setIsTaskMenuOpen: (value: SetStateAction<boolean>) => void
  setIsViewStatusMenuOpen: (value: SetStateAction<boolean>) => void
  setIsAddTaskModalOpen: (value: SetStateAction<boolean>) => void
  setIsAddStatusMenuOpen: (value: SetStateAction<boolean>) => void
  setIsEditTaskModalOpen: (value: SetStateAction<boolean>) => void
  setIsEditStatusMenuOpen: (value: SetStateAction<boolean>) => void
  setIsAddBoardModalOpen: (value: SetStateAction<boolean>) => void
  setIsAddColumnModalOpen: (value: SetStateAction<boolean>) => void
  setIsBoardMenuOpen: (value: SetStateAction<boolean>) => void
  setIsMobileBoardsMenuOpen: (value: SetStateAction<boolean>) => void
  setIsEditBoardModalOpen: (value: SetStateAction<boolean>) => void
  setIsDeleteBoardModalOpen: (value: SetStateAction<boolean>) => void
  setIsDeleteTaskModalOpen: (value: SetStateAction<boolean>) => void
  closeHeaderMenus: () => void
  closeTaskMenus: () => void
  closeTaskModals: () => void
  closeBoardModals: () => void
  closeDeleteModals: () => void
  closeAllOverlays: () => void
}

const INITIAL_STATE: BoardViewOverlayState = {
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

// Resolves the next boolean state from either a direct value or updater callback.
function resolveBooleanStateValue(previousValue: boolean, nextValueOrUpdater: SetStateAction<boolean>): boolean {
  if (typeof nextValueOrUpdater === 'function') {
    return nextValueOrUpdater(previousValue)
  }

  return nextValueOrUpdater
}

// Updates overlay UI state with targeted set/toggle and grouped close actions.
function boardViewOverlayReducer(state: BoardViewOverlayState, action: BoardViewOverlayAction): BoardViewOverlayState {
  switch (action.type) {
    case 'setValue': {
      const nextValue = resolveBooleanStateValue(state[action.key], action.value)

      if (state[action.key] === nextValue) {
        return state
      }

      return {
        ...state,
        [action.key]: nextValue,
      }
    }
    case 'closeHeaderMenus':
      return {
        ...state,
        isBoardMenuOpen: false,
        isMobileBoardsMenuOpen: false,
      }
    case 'closeTaskMenus':
      return {
        ...state,
        isTaskMenuOpen: false,
        isViewStatusMenuOpen: false,
      }
    case 'closeTaskModals':
      return {
        ...state,
        isAddStatusMenuOpen: false,
        isAddTaskModalOpen: false,
        isEditStatusMenuOpen: false,
        isEditTaskModalOpen: false,
      }
    case 'closeBoardModals':
      return {
        ...state,
        isAddBoardModalOpen: false,
        isAddColumnModalOpen: false,
        isEditBoardModalOpen: false,
      }
    case 'closeDeleteModals':
      return {
        ...state,
        isDeleteBoardModalOpen: false,
        isDeleteTaskModalOpen: false,
      }
    case 'closeAll':
      return INITIAL_STATE
    default:
      return state
  }
}

// Centralizes BoardView menu/modal visibility state and grouped overlay close actions.
export function useBoardViewOverlayState(): UseBoardViewOverlayStateResult {
  const [state, dispatch] = useReducer(boardViewOverlayReducer, INITIAL_STATE)

  const setIsTaskMenuOpen = useCallback((value: SetStateAction<boolean>) => {
    dispatch({ type: 'setValue', key: 'isTaskMenuOpen', value })
  }, [])
  const setIsViewStatusMenuOpen = useCallback((value: SetStateAction<boolean>) => {
    dispatch({ type: 'setValue', key: 'isViewStatusMenuOpen', value })
  }, [])
  const setIsAddTaskModalOpen = useCallback((value: SetStateAction<boolean>) => {
    dispatch({ type: 'setValue', key: 'isAddTaskModalOpen', value })
  }, [])
  const setIsAddStatusMenuOpen = useCallback((value: SetStateAction<boolean>) => {
    dispatch({ type: 'setValue', key: 'isAddStatusMenuOpen', value })
  }, [])
  const setIsEditTaskModalOpen = useCallback((value: SetStateAction<boolean>) => {
    dispatch({ type: 'setValue', key: 'isEditTaskModalOpen', value })
  }, [])
  const setIsEditStatusMenuOpen = useCallback((value: SetStateAction<boolean>) => {
    dispatch({ type: 'setValue', key: 'isEditStatusMenuOpen', value })
  }, [])
  const setIsAddBoardModalOpen = useCallback((value: SetStateAction<boolean>) => {
    dispatch({ type: 'setValue', key: 'isAddBoardModalOpen', value })
  }, [])
  const setIsAddColumnModalOpen = useCallback((value: SetStateAction<boolean>) => {
    dispatch({ type: 'setValue', key: 'isAddColumnModalOpen', value })
  }, [])
  const setIsBoardMenuOpen = useCallback((value: SetStateAction<boolean>) => {
    dispatch({ type: 'setValue', key: 'isBoardMenuOpen', value })
  }, [])
  const setIsMobileBoardsMenuOpen = useCallback((value: SetStateAction<boolean>) => {
    dispatch({ type: 'setValue', key: 'isMobileBoardsMenuOpen', value })
  }, [])
  const setIsEditBoardModalOpen = useCallback((value: SetStateAction<boolean>) => {
    dispatch({ type: 'setValue', key: 'isEditBoardModalOpen', value })
  }, [])
  const setIsDeleteBoardModalOpen = useCallback((value: SetStateAction<boolean>) => {
    dispatch({ type: 'setValue', key: 'isDeleteBoardModalOpen', value })
  }, [])
  const setIsDeleteTaskModalOpen = useCallback((value: SetStateAction<boolean>) => {
    dispatch({ type: 'setValue', key: 'isDeleteTaskModalOpen', value })
  }, [])

  const closeHeaderMenus = useCallback(() => {
    dispatch({ type: 'closeHeaderMenus' })
  }, [])

  const closeTaskMenus = useCallback(() => {
    dispatch({ type: 'closeTaskMenus' })
  }, [])

  const closeTaskModals = useCallback(() => {
    dispatch({ type: 'closeTaskModals' })
  }, [])

  const closeBoardModals = useCallback(() => {
    dispatch({ type: 'closeBoardModals' })
  }, [])

  const closeDeleteModals = useCallback(() => {
    dispatch({ type: 'closeDeleteModals' })
  }, [])

  const closeAllOverlays = useCallback(() => {
    dispatch({ type: 'closeAll' })
  }, [])

  return {
    ...state,
    closeAllOverlays,
    closeBoardModals,
    closeDeleteModals,
    closeHeaderMenus,
    closeTaskMenus,
    closeTaskModals,
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
  }
}
