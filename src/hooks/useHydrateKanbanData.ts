import { useCallback, useEffect } from 'react'
import type { ApiHydrationStatus } from '../store/slices'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectApiHydrationStatus, selectHasHydratedFromApi } from '../store/selectors'
import { kanbanDataHydratedFromApi } from '../store/slices'

interface UseHydrateKanbanDataResult {
  apiHydrationStatus: ApiHydrationStatus
  hasHydratedFromApi: boolean
  requestHydration: () => void
}

// Ensures Kanban API hydration runs once from any consumer route and exposes manual retry.
export function useHydrateKanbanData(): UseHydrateKanbanDataResult {
  const dispatch = useAppDispatch()
  const apiHydrationStatus = useAppSelector(selectApiHydrationStatus)
  const hasHydratedFromApi = useAppSelector(selectHasHydratedFromApi)

  const requestHydration = useCallback(() => {
    void dispatch(kanbanDataHydratedFromApi())
  }, [dispatch])

  useEffect(() => {
    if (hasHydratedFromApi || apiHydrationStatus !== 'idle') {
      return
    }

    requestHydration()
  }, [apiHydrationStatus, hasHydratedFromApi, requestHydration])

  return {
    apiHydrationStatus,
    hasHydratedFromApi,
    requestHydration,
  }
}
