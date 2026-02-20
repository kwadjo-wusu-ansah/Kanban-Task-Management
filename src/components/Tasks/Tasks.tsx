import { TaskCard } from '../TaskCard'
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
  heading,
  mode = 'light',
  onTaskSelect,
  taskCount,
  tasks,
  ...props
}: TasksProps) {
  const resolvedTaskCount = typeof taskCount === 'number' ? taskCount : tasks.length

  return (
    <section className={classNames(styles.root, className)} {...props}>
      <header className={styles.headingRow}>
        <span aria-hidden="true" className={styles.headingDot} style={{ backgroundColor: accentColor }} />
        <h2 className={styles.headingText}>{formatHeadingLabel(heading, resolvedTaskCount)}</h2>
      </header>
      <ul className={styles.tasksList}>
        {tasks.map((task) => (
          <li className={styles.taskRow} key={task.id}>
            <TaskCard
              completedSubtaskCount={task.completedSubtaskCount}
              mode={mode}
              onClick={onTaskSelect ? () => onTaskSelect(task.id) : undefined}
              title={task.title}
              totalSubtaskCount={task.totalSubtaskCount}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Tasks
