import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'destructive'
export type ButtonSize = 'large' | 'small'
export type ButtonMode = 'light' | 'dark'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: ButtonMode
  variant?: ButtonVariant
  size?: ButtonSize
}
