import type { HTMLAttributes } from 'react'
import type { TaskCardMode } from '../TaskCard'

export interface TasksItem {
  completedSubtaskCount: number
  id: string
  title: string
  totalSubtaskCount: number
}

export interface TasksProps extends HTMLAttributes<HTMLElement> {
  accentColor?: string
  heading: string
  mode?: TaskCardMode
  onTaskSelect?: (taskId: string) => void
  taskCount?: number
  tasks: TasksItem[]
}
