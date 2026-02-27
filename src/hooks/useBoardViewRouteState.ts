import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect } from 'react'
import type { NavigateFunction } from 'react-router'
import type { ModalItem } from '../components'
import type { BoardPreview, BoardTaskPreview } from '../data'

interface UseBoardViewRouteStateParams {
  activeBoard: BoardPreview | undefined
  activeBoardId: string
  boardId: string | undefined
  boardPreviews: BoardPreview[]
  closeTaskMenus: () => void
  getActiveTask: (board: BoardPreview | undefined, taskId: string | null) => BoardTaskPreview | undefined
  mapTaskSubtasksToViewModalItems: (task: BoardTaskPreview) => ModalItem[]
  navigate: NavigateFunction
  setViewStatusValue: Dispatch<SetStateAction<string>>
  setViewSubtasks: Dispatch<SetStateAction<ModalItem[]>>
  taskId: string | undefined
}

interface UseBoardViewRouteStateResult {
  navigateToBoardRoute: (replace?: boolean) => void
}

// Syncs board/task route params with BoardView UI state and exposes route navigation helpers.
export function useBoardViewRouteState({
  activeBoard,
  activeBoardId,
  boardId,
  boardPreviews,
  closeTaskMenus,
  getActiveTask,
  mapTaskSubtasksToViewModalItems,
  navigate,
  setViewStatusValue,
  setViewSubtasks,
  taskId,
}: UseBoardViewRouteStateParams): UseBoardViewRouteStateResult {
  // Keeps component board state aligned with URL params and redirects invalid board IDs.
  useEffect(() => {
    if (!boardId) {
      if (boardPreviews[0]) {
        navigate(`/board/${boardPreviews[0].id}`, { replace: true })
      }
      return
    }

    const hasMatchingBoard = boardPreviews.some((board) => board.id === boardId)

    if (!hasMatchingBoard) {
      if (boardPreviews[0]) {
        navigate(`/board/${boardPreviews[0].id}`, { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    }
  }, [boardId, boardPreviews, navigate])

  // Syncs task modal state with nested task route params and redirects unknown tasks.
  useEffect(() => {
    if (!taskId) {
      closeTaskMenus()
      return
    }

    if (!activeBoard) {
      return
    }

    const nextTask = getActiveTask(activeBoard, taskId)

    if (!nextTask) {
      navigate(`/board/${activeBoardId}`, { replace: true })
      return
    }

    setViewStatusValue(nextTask.status)
    setViewSubtasks(mapTaskSubtasksToViewModalItems(nextTask))
    closeTaskMenus()
  }, [
    activeBoard,
    activeBoardId,
    closeTaskMenus,
    getActiveTask,
    mapTaskSubtasksToViewModalItems,
    navigate,
    setViewStatusValue,
    setViewSubtasks,
    taskId,
  ])

  // Navigates to the current board route while clearing any nested task segment.
  const navigateToBoardRoute = useCallback(
    (replace = false) => {
      if (!activeBoardId) {
        navigate('/', { replace })
        return
      }

      if (replace) {
        navigate(`/board/${activeBoardId}`, { replace: true })
        return
      }

      navigate(`/board/${activeBoardId}`)
    },
    [activeBoardId, navigate],
  )

  return {
    navigateToBoardRoute,
  }
}
