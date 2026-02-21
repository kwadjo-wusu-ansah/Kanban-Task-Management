import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TaskCard } from '../TaskCard'
import { useAppSelector } from '../../store/hooks'
import { classNames, toColumnDragId, toTaskDragId } from '../../utils'
import styles from './Tasks.module.css'
import type { TasksProps } from './Tasks.types'

// Formats the column title label that appears in the tasks group heading.
function formatHeadingLabel(heading: string, taskCount: number): string {
  const trimmedHeading = heading.trim()
  const safeHeading = trimmedHeading.length > 0 ? trimmedHeading : 'Untitled'
  const safeTaskCount = Math.max(0, taskCount)

  return `${safeHeading.toUpperCase()} (${safeTaskCount})`
}

interface SortableTaskRowProps {
  mode: 'light' | 'dark'
  onTaskSelect?: (taskId: string) => void
  taskId: string
}

// Renders a sortable task-row wrapper that wires drag listeners into TaskCard.
function SortableTaskRow({ mode, onTaskSelect, taskId }: SortableTaskRowProps) {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: toTaskDragId(taskId),
  })
  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li className={classNames(styles.taskRow, isDragging && styles.taskRowDragging)} ref={setNodeRef} style={sortableStyle}>
      <TaskCard
        mode={mode}
        onClick={onTaskSelect ? () => onTaskSelect(taskId) : undefined}
        taskId={taskId}
        {...attributes}
        {...listeners}
      />
    </li>
  )
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
  const sortableTaskIds = taskIds.map((taskId) => toTaskDragId(taskId))
  const heading = column?.name ?? 'Untitled'
  const resolvedTaskCount = taskIds.length
  const { isOver, setNodeRef } = useDroppable({
    id: toColumnDragId(columnId),
  })

  if (!column) {
    return null
  }

  return (
    <section className={classNames(styles.root, isOver && styles.columnDropTarget, className)} ref={setNodeRef} {...props}>
      <header className={styles.headingRow}>
        <span aria-hidden="true" className={styles.headingDot} style={{ backgroundColor: accentColor || column.accentColor }} />
        <h2 className={styles.headingText}>{formatHeadingLabel(heading, resolvedTaskCount)}</h2>
      </header>
      <SortableContext items={sortableTaskIds} strategy={verticalListSortingStrategy}>
        <ul className={styles.tasksList}>
          {taskIds.map((taskId) => (
            <SortableTaskRow key={taskId} mode={mode} onTaskSelect={onTaskSelect} taskId={taskId} />
          ))}
        </ul>
      </SortableContext>
    </section>
  )
}

export default Tasks
