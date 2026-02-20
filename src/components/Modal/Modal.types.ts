import type { HTMLAttributes, MouseEventHandler } from 'react'
import type { DropdownOption } from '../Input'

export type ModalMode = 'light' | 'dark'
export type ModalVariant = 'viewTask' | 'addTask' | 'editTask' | 'addBoard' | 'editBoard' | 'deleteBoard' | 'deleteTask'

export interface ModalItem {
  checked?: boolean
  id: string
  placeholder?: string
  value: string
}

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  boardNameValue?: string
  columns?: ModalItem[]
  description?: string
  isStatusMenuOpen?: boolean
  mode?: ModalMode
  onAddColumn?: () => void
  onAddSubtask?: () => void
  onClose?: () => void
  onColumnRemove?: (columnId: string) => void
  onMenuOpen?: () => void
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
  onStatusSelect?: (nextValue: string) => void
  onStatusToggle?: MouseEventHandler<HTMLButtonElement>
  onSubtaskRemove?: (subtaskId: string) => void
  onSubtaskToggle?: (subtaskId: string) => void
  open?: boolean
  primaryActionLabel?: string
  secondaryActionLabel?: string
  statusLabel?: string
  statusOptions?: DropdownOption[]
  statusValue?: string
  subtasks?: ModalItem[]
  taskDescriptionValue?: string
  taskTitleValue?: string
  title?: string
  variant: ModalVariant
}
