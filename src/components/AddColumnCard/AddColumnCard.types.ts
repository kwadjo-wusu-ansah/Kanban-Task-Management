import type { ButtonHTMLAttributes } from 'react'

export type AddColumnCardMode = 'light' | 'dark'

export interface AddColumnCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  mode?: AddColumnCardMode
}
