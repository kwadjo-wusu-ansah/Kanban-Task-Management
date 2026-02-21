import { TaskCard } from '../TaskCard'
import { useAppSelector } from '../../store/hooks'
import { classNames } from '../../utils'
import styles from './Tasks.module.css'
import type { TasksProps } from './Tasks.types'

// Formats the column title label that appears in the tasks group heading.
function formatHeadingLabel(heading: string, taskCount: number): string {
  const trimmedHeading = heading.trim()
  const safeHeading = trimmedHeading.length > 0 ? trimmedHeading : 'Untitled'
  const safeTaskCount = Math.max(0, taskCount)

  return `${safeHeading.toUpperCase()} (${safeTaskCount})`
}

// Renders a reusable task stack using TaskCard items under a column-style heading.
function Tasks({
  accentColor = 'var(--color-primary)',
  className,
  columnId,
  mode = 'light',
  onTaskSelect,
  ...props
}: TasksProps) {
  const column = useAppSelector((state) => state.kanban.columns[columnId])
  const taskIds = column?.taskIds ?? []
  const heading = column?.name ?? 'Untitled'
  const resolvedTaskCount = taskIds.length

  if (!column) {
    return null
  }

  return (
    <section className={classNames(styles.root, className)} {...props}>
      <header className={styles.headingRow}>
        <span aria-hidden="true" className={styles.headingDot} style={{ backgroundColor: accentColor || column.accentColor }} />
        <h2 className={styles.headingText}>{formatHeadingLabel(heading, resolvedTaskCount)}</h2>
      </header>
      <ul className={styles.tasksList}>
        {taskIds.map((taskId) => (
          <li className={styles.taskRow} key={taskId}>
            <TaskCard
              mode={mode}
              onClick={onTaskSelect ? () => onTaskSelect(taskId) : undefined}
              taskId={taskId}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Tasks
