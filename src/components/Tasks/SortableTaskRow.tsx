import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TaskCard } from '../TaskCard'
import { classNames, toTaskDragId } from '../../utils'
import styles from './Tasks.module.css'
import type { SortableTaskRowProps } from './Tasks.types'

// Renders a sortable task-row wrapper that wires drag listeners into TaskCard.
export function SortableTaskRow({ mode, onTaskSelect, taskId }: SortableTaskRowProps) {
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
