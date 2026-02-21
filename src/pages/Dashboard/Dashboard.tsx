import { useEffect } from 'react'
import { Link } from 'react-router'
import { MainShell } from '../MainShell'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectApiHydrationStatus, selectBoardPreviews, selectHasHydratedFromApi } from '../../store/selectors'
import { kanbanDataHydratedFromApi } from '../../store/slices'
import styles from './Dashboard.module.css'

// Computes total task count for dashboard board summary cards.
function getTaskCount(columnCount: number, taskCount: number): string {
  const columnLabel = columnCount === 1 ? 'column' : 'columns'
  const taskLabel = taskCount === 1 ? 'task' : 'tasks'

  return `${columnCount} ${columnLabel} · ${taskCount} ${taskLabel}`
}

// Renders the dashboard route listing all available boards with dynamic links.
function Dashboard() {
  const dispatch = useAppDispatch()
  const boardPreviews = useAppSelector(selectBoardPreviews)
  const hasHydratedFromApi = useAppSelector(selectHasHydratedFromApi)
  const apiHydrationStatus = useAppSelector(selectApiHydrationStatus)
  const isLoadingBoards = apiHydrationStatus === 'loading'

  // Requests remote board data only during the initial idle hydration state.
  useEffect(() => {
    if (hasHydratedFromApi || apiHydrationStatus !== 'idle') {
      return
    }

    void dispatch(kanbanDataHydratedFromApi())
  }, [apiHydrationStatus, dispatch, hasHydratedFromApi])

  return (
    <MainShell title="Dashboard">
      <p className={styles.intro}>Select a board to open its tasks and columns.</p>
      {isLoadingBoards ? (
        <p aria-live="polite" className={styles.statusMessage}>
          Loading latest boards...
        </p>
      ) : null}
      <div className={styles.linksRow}>
        <Link className={styles.routeLink} to="/admin">
          Go to Admin
        </Link>
        <Link className={styles.routeLink} to="/login">
          Go to Login
        </Link>
      </div>
      <ul className={styles.boardList}>
        {boardPreviews.map((board) => (
          <li key={board.id}>
            <Link className={styles.boardLink} to={`/board/${board.id}`}>
              <span>{board.name}</span>
              <span className={styles.boardMeta}>
                {getTaskCount(
                  board.columns.length,
                  board.columns.reduce((totalTasks, column) => totalTasks + column.tasks.length, 0),
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </MainShell>
  )
}

export default Dashboard
