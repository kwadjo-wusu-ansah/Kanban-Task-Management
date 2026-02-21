import { Link } from 'react-router'
import { useHydrateKanbanData } from '../../hooks'
import { MainShell } from '../MainShell'
import { useAppSelector } from '../../store/hooks'
import { selectApiHydrationError, selectApiHydrationStatus, selectBoardPreviews } from '../../store/selectors'
import styles from './Dashboard.module.css'

// Computes total task count for dashboard board summary cards.
function getTaskCount(columnCount: number, taskCount: number): string {
  const columnLabel = columnCount === 1 ? 'column' : 'columns'
  const taskLabel = taskCount === 1 ? 'task' : 'tasks'

  return `${columnCount} ${columnLabel} · ${taskCount} ${taskLabel}`
}

// Renders the dashboard route listing all available boards with dynamic links.
function Dashboard() {
  const { requestHydration } = useHydrateKanbanData()
  const boardPreviews = useAppSelector(selectBoardPreviews)
  const apiHydrationError = useAppSelector(selectApiHydrationError)
  const apiHydrationStatus = useAppSelector(selectApiHydrationStatus)
  const hasHydrationError = apiHydrationStatus === 'failed'
  const isLoadingBoards = apiHydrationStatus === 'loading'
  const hasSuccessfulHydration = apiHydrationStatus === 'succeeded'
  const shouldRenderStatusMessage = isLoadingBoards || hasSuccessfulHydration
  const statusMessage = isLoadingBoards
    ? 'Loading latest boards. This may take a few seconds on slower connections.'
    : 'Boards synced successfully.'

  // Retries fetching board data after an API hydration failure.
  function handleRetryBoardsLoad() {
    if (isLoadingBoards) {
      return
    }

    requestHydration()
  }

  return (
    <MainShell title="Dashboard">
      <p className={styles.intro}>Select a board to open its tasks and columns.</p>
      {shouldRenderStatusMessage ? (
        <p
          aria-live="polite"
          className={`${styles.statusMessage} ${isLoadingBoards ? styles.statusMessageLoading : styles.statusMessageSuccess}`}
        >
          {statusMessage}
        </p>
      ) : null}
      {hasHydrationError ? (
        <section aria-live="assertive" className={styles.errorPanel} role="alert">
          <p className={styles.errorTitle}>We couldn&apos;t load the latest board data.</p>
          <p className={styles.errorDescription}>{apiHydrationError ?? 'Please check your connection and try again.'}</p>
          <button aria-busy={isLoadingBoards} className={styles.retryButton} onClick={handleRetryBoardsLoad} type="button">
            {isLoadingBoards ? 'Retrying...' : 'Retry loading boards'}
          </button>
        </section>
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
