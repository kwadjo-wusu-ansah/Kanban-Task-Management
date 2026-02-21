import { Link } from 'react-router'
import { MainShell } from '../MainShell'
import { useAppSelector } from '../../store/hooks'
import { selectBoardPreviews } from '../../store/selectors'
import styles from './Dashboard.module.css'

// Computes total task count for dashboard board summary cards.
function getTaskCount(columnCount: number, taskCount: number): string {
  const columnLabel = columnCount === 1 ? 'column' : 'columns'
  const taskLabel = taskCount === 1 ? 'task' : 'tasks'

  return `${columnCount} ${columnLabel} · ${taskCount} ${taskLabel}`
}

// Renders the dashboard route listing all available boards with dynamic links.
function Dashboard() {
  const boardPreviews = useAppSelector(selectBoardPreviews)

  return (
    <MainShell title="Dashboard">
      <p className={styles.intro}>Select a board to open its tasks and columns.</p>
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
