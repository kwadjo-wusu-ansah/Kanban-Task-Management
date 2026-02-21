import type { HTMLAttributes } from 'react'
import type { TaskCardMode } from '../TaskCard'

export interface TasksProps extends HTMLAttributes<HTMLElement> {
  accentColor?: string
  columnId: string
  mode?: TaskCardMode
  onTaskSelect?: (taskId: string) => void
}
