import type { ChangeEventHandler, HTMLAttributes, MouseEventHandler } from 'react'
import type { DropdownOption } from '../Input'

export type ModalMode = 'light' | 'dark'
export type ModalVariant = 'viewTask' | 'addTask' | 'editTask' | 'addBoard' | 'editBoard' | 'deleteBoard' | 'deleteTask'

export interface ModalItem {
  checked?: boolean
  errorMessage?: string
  id: string
  placeholder?: string
  value: string
}

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  boardNameErrorMessage?: string
  boardNameValue?: string
  columnsErrorMessage?: string
  columns?: ModalItem[]
  description?: string
  isPrimaryActionDisabled?: boolean
  isStatusMenuOpen?: boolean
  isTaskMenuOpen?: boolean
  mode?: ModalMode
  onAddColumn?: () => void
  onAddSubtask?: () => void
  onBoardNameChange?: ChangeEventHandler<HTMLInputElement>
  onClose?: () => void
  onColumnRemove?: (columnId: string) => void
  onColumnValueChange?: (columnId: string, nextValue: string) => void
  onDeleteTask?: () => void
  onEditTask?: () => void
  onMenuOpen?: () => void
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
  onStatusSelect?: (nextValue: string) => void
  onStatusToggle?: MouseEventHandler<HTMLButtonElement>
  onSubtaskRemove?: (subtaskId: string) => void
  onSubtaskToggle?: (subtaskId: string) => void
  onSubtaskValueChange?: (subtaskId: string, nextValue: string) => void
  onTaskDescriptionChange?: ChangeEventHandler<HTMLTextAreaElement>
  onTaskTitleChange?: ChangeEventHandler<HTMLInputElement>
  open?: boolean
  primaryActionLabel?: string
  secondaryActionLabel?: string
  subtaskErrorMessage?: string
  statusLabel?: string
  statusOptions?: DropdownOption[]
  statusValue?: string
  subtasks?: ModalItem[]
  taskDescriptionPlaceholder?: string
  taskDescriptionValue?: string
  taskTitlePlaceholder?: string
  taskTitleValue?: string
  title?: string
  variant: ModalVariant
}
