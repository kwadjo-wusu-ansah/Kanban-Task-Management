import type { ModalItem, ModalProps, ModalVariant } from './Modal.types'

export const DEFAULT_STATUS_OPTIONS = [
  { label: 'Todo', value: 'Todo' },
  { label: 'Doing', value: 'Doing' },
  { label: 'Done', value: 'Done' },
]

export const DEFAULT_VIEW_SUBTASKS: ModalItem[] = [
  { checked: true, id: 'view-subtask-1', value: 'Complete wireframes' },
  { checked: false, id: 'view-subtask-2', value: 'Build production-ready styles' },
  { checked: false, id: 'view-subtask-3', value: 'Connect API integrations' },
]

export const DEFAULT_BOARD_COLUMNS: ModalItem[] = [
  { id: 'board-column-1', placeholder: 'e.g. Todo', value: 'Todo' },
  { id: 'board-column-2', placeholder: 'e.g. Doing', value: 'Doing' },
]

export const DEFAULT_TASK_TITLE_PLACEHOLDER = 'e.g. Take coffee break'
export const DEFAULT_TASK_DESCRIPTION_PLACEHOLDER =
  "e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."

// Resolves the fallback modal title from the selected modal variant.
export function getFallbackTitle(variant: ModalVariant): string {
  if (variant === 'viewTask') {
    return 'Build production-ready styles'
  }

  if (variant === 'addTask') {
    return 'Add New Task'
  }

  if (variant === 'editTask') {
    return 'Edit Task'
  }

  if (variant === 'addBoard') {
    return 'Add New Board'
  }

  if (variant === 'editBoard') {
    return 'Edit Board'
  }

  if (variant === 'addColumn') {
    return 'Add New Column'
  }

  if (variant === 'deleteBoard') {
    return 'Delete this board?'
  }

  return 'Delete this task?'
}

// Resolves destructive and form primary action labels from the modal variant.
export function getPrimaryActionLabel(variant: ModalVariant): string {
  if (variant === 'addTask') {
    return 'Create Task'
  }

  if (variant === 'editTask') {
    return 'Save Changes'
  }

  if (variant === 'addBoard') {
    return 'Create New Board'
  }

  if (variant === 'editBoard') {
    return 'Save Changes'
  }

  if (variant === 'addColumn') {
    return 'Create Column'
  }

  return 'Delete'
}

// Resolves shared fallback copy for informational and destructive modal variants.
export function getFallbackDescription(variant: ModalVariant): string {
  if (variant === 'viewTask') {
    return 'Please confirm each subtask and update the status when work moves forward.'
  }

  if (variant === 'deleteBoard') {
    return 'Are you sure you want to delete this board? This action will remove all columns and tasks and cannot be reversed.'
  }

  if (variant === 'deleteTask') {
    return 'Are you sure you want to delete this task and its subtasks? This action cannot be reversed.'
  }

  return ''
}

// Resolves fallback task-title value for task form variants.
export function getFallbackTaskTitleValue(variant: ModalVariant): string {
  if (variant === 'editTask') {
    return 'Build production-ready styles'
  }

  return ''
}

// Resolves fallback task-description value for task form variants.
export function getFallbackTaskDescriptionValue(variant: ModalVariant): string {
  if (variant === 'editTask') {
    return 'Build and style all interactive components to match the design system.'
  }

  return ''
}

// Resolves the status options list with safe defaults when no options are provided.
export function resolveStatusOptions(
  statusOptions: ModalProps['statusOptions'],
): NonNullable<ModalProps['statusOptions']> {
  return statusOptions && statusOptions.length > 0 ? statusOptions : DEFAULT_STATUS_OPTIONS
}
