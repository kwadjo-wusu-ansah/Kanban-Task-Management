import type { ButtonHTMLAttributes } from 'react'

export type TaskCardMode = 'light' | 'dark'

export interface TaskCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: TaskCardMode
  taskId: string
}
