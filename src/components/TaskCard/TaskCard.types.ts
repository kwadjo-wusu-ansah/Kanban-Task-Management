import type { ButtonHTMLAttributes } from 'react'

export type TaskCardMode = 'light' | 'dark'

export interface TaskCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  completedSubtaskCount: number
  mode?: TaskCardMode
  title: string
  totalSubtaskCount: number
}
