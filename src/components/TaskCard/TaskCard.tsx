import { classNames } from '../../utils'
import styles from './TaskCard.module.css'
import type { TaskCardProps } from './TaskCard.types'

// Formats the completion summary text shown below each task title.
function formatSubtaskSummary(completedSubtaskCount: number, totalSubtaskCount: number): string {
  const safeTotal = Math.max(0, totalSubtaskCount)
  const safeCompleted = Math.max(0, completedSubtaskCount)
  const boundedCompleted = Math.min(safeCompleted, safeTotal)
  const subtaskLabel = safeTotal === 1 ? 'subtask' : 'subtasks'

  return `${boundedCompleted} of ${safeTotal} ${subtaskLabel}`
}

// Renders a reusable clickable task card for light and dark board surfaces.
function TaskCard({
  className,
  completedSubtaskCount,
  mode = 'light',
  title,
  totalSubtaskCount,
  type = 'button',
  ...props
}: TaskCardProps) {
  return (
    <button className={classNames(styles.card, mode === 'dark' ? styles.cardDark : styles.cardLight, className)} type={type} {...props}>
      <span className={styles.title}>{title}</span>
      <span className={styles.subtaskSummary}>{formatSubtaskSummary(completedSubtaskCount, totalSubtaskCount)}</span>
    </button>
  )
}

export default TaskCard
