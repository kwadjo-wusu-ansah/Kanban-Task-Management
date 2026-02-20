import { iconCross, iconVerticalEllipsis } from '../../assets'
import { classNames } from '../../utils'
import { Button } from '../Button'
import { Input } from '../Input'
import styles from './Modal.module.css'
import type { ModalItem, ModalProps, ModalVariant } from './Modal.types'

const DEFAULT_STATUS_OPTIONS = [
  { label: 'Todo', value: 'Todo' },
  { label: 'Doing', value: 'Doing' },
  { label: 'Done', value: 'Done' },
]

const DEFAULT_VIEW_SUBTASKS: ModalItem[] = [
  { checked: true, id: 'view-subtask-1', value: 'Complete wireframes' },
  { checked: false, id: 'view-subtask-2', value: 'Build production-ready styles' },
  { checked: false, id: 'view-subtask-3', value: 'Connect API integrations' },
]

const DEFAULT_FORM_SUBTASKS: ModalItem[] = [
  { id: 'task-form-1', placeholder: 'e.g. Make coffee', value: 'Build production-ready styles' },
  { id: 'task-form-2', placeholder: 'e.g. Drink coffee & smile', value: 'Connect API integrations' },
]

const DEFAULT_BOARD_COLUMNS: ModalItem[] = [
  { id: 'board-column-1', placeholder: 'e.g. Todo', value: 'Todo' },
  { id: 'board-column-2', placeholder: 'e.g. Doing', value: 'Doing' },
]

// Resolves the fallback modal title from the selected modal variant.
function getFallbackTitle(variant: ModalVariant): string {
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

  if (variant === 'deleteBoard') {
    return 'Delete this board?'
  }

  return 'Delete this task?'
}

// Resolves destructive and form primary action labels from the modal variant.
function getPrimaryActionLabel(variant: ModalVariant): string {
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

  return 'Delete'
}

// Resolves shared fallback copy for informational and destructive modal variants.
function getFallbackDescription(variant: ModalVariant): string {
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

// Resolves the status options list with safe defaults when no options are provided.
function resolveStatusOptions(
  statusOptions: ModalProps['statusOptions'],
): NonNullable<ModalProps['statusOptions']> {
  return statusOptions && statusOptions.length > 0 ? statusOptions : DEFAULT_STATUS_OPTIONS
}

// Renders a reusable modal shell with light/dark modes and seven modal variants.
function Modal({
  boardNameValue = 'Platform Launch',
  className,
  columns = DEFAULT_BOARD_COLUMNS,
  description,
  isStatusMenuOpen = false,
  mode = 'light',
  onAddColumn,
  onAddSubtask,
  onClose,
  onColumnRemove,
  onMenuOpen,
  onPrimaryAction,
  onSecondaryAction,
  onStatusSelect,
  onStatusToggle,
  onSubtaskRemove,
  onSubtaskToggle,
  open = true,
  primaryActionLabel,
  secondaryActionLabel = 'Cancel',
  statusLabel = 'Status',
  statusOptions,
  statusValue,
  subtasks = DEFAULT_VIEW_SUBTASKS,
  taskDescriptionValue = 'Build and style all interactive components to match the design system.',
  taskTitleValue = 'Build production-ready styles',
  title,
  variant,
  ...props
}: ModalProps) {
  if (!open) {
    return null
  }

  const resolvedStatusOptions = resolveStatusOptions(statusOptions)
  const resolvedStatusValue = statusValue ?? resolvedStatusOptions[0]?.value ?? ''
  const resolvedTitle = title ?? getFallbackTitle(variant)
  const resolvedDescription = description ?? getFallbackDescription(variant)
  const resolvedPrimaryActionLabel = primaryActionLabel ?? getPrimaryActionLabel(variant)
  const resolvedTaskFormSubtasks = subtasks.length > 0 ? subtasks : DEFAULT_FORM_SUBTASKS
  const resolvedBoardColumns = columns.length > 0 ? columns : DEFAULT_BOARD_COLUMNS
  const completedSubtaskCount = subtasks.filter((item) => item.checked).length
  const isDeleteVariant = variant === 'deleteBoard' || variant === 'deleteTask'
  const isViewTaskVariant = variant === 'viewTask'
  const isTaskFormVariant = variant === 'addTask' || variant === 'editTask'
  const isBoardFormVariant = variant === 'addBoard' || variant === 'editBoard'

  return (
    <div className={classNames(styles.backdrop, mode === 'dark' ? styles.backdropDark : styles.backdropLight)} onClick={onClose}>
      <div
        aria-modal="true"
        className={classNames(
          styles.panel,
          mode === 'dark' ? styles.panelDark : styles.panelLight,
          isViewTaskVariant && styles.panelViewTask,
          isDeleteVariant && styles.panelDelete,
          className,
        )}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        {...props}
      >
        <div className={styles.headerRow}>
          <h2 className={classNames(styles.title, isDeleteVariant && styles.titleDanger)}>{resolvedTitle}</h2>
          {isViewTaskVariant ? (
            <button aria-label="Open task actions" className={styles.menuButton} onClick={onMenuOpen} type="button">
              <img alt="" aria-hidden="true" className={styles.menuIcon} src={iconVerticalEllipsis} />
            </button>
          ) : null}
        </div>

        {resolvedDescription ? <p className={styles.description}>{resolvedDescription}</p> : null}

        {isViewTaskVariant ? (
          <>
            <div className={styles.sectionGroup}>
              <span className={styles.sectionLabel}>Subtasks ({completedSubtaskCount} of {subtasks.length})</span>
              <div className={styles.checkboxList}>
                {subtasks.map((subtask) => (
                  <Input
                    checked={Boolean(subtask.checked)}
                    checkboxLabel={subtask.value}
                    key={subtask.id}
                    mode={mode}
                    onCheckboxChange={() => onSubtaskToggle?.(subtask.id)}
                    state={subtask.checked ? 'active' : 'idle'}
                    variant="checkbox"
                  />
                ))}
              </div>
            </div>
            <Input
              dropdownLabel="Current Status"
              isMenuOpen={isStatusMenuOpen}
              mode={mode}
              onDropdownSelect={onStatusSelect}
              onDropdownToggle={onStatusToggle}
              options={resolvedStatusOptions}
              state={isStatusMenuOpen ? 'active' : 'idle'}
              value={resolvedStatusValue}
              variant="dropdown"
            />
          </>
        ) : null}

        {isTaskFormVariant ? (
          <div className={styles.fieldStack}>
            <Input fieldLabel="Title" mode={mode} state="idle" value={taskTitleValue} variant="textField" />
            <div className={styles.textAreaGroup}>
              <span className={styles.textAreaLabel}>Description</span>
              <textarea
                className={styles.textAreaControl}
                placeholder="e.g. It's always good to take a break."
                readOnly
                value={taskDescriptionValue}
              />
            </div>
            <div className={styles.sectionGroup}>
              <span className={styles.sectionLabel}>Subtasks</span>
              <div className={styles.editableList}>
                {resolvedTaskFormSubtasks.map((subtask) => (
                  <div className={styles.editableRow} key={subtask.id}>
                    <Input
                      className={styles.editableInput}
                      mode={mode}
                      placeholder={subtask.placeholder}
                      state="idle"
                      value={subtask.value}
                      variant="textField"
                    />
                    <button
                      aria-label="Remove subtask"
                      className={styles.removeButton}
                      onClick={() => onSubtaskRemove?.(subtask.id)}
                      type="button"
                    >
                      <img alt="" aria-hidden="true" className={styles.removeIcon} src={iconCross} />
                    </button>
                  </div>
                ))}
              </div>
              <Button className={styles.fullWidthButton} mode={mode} onClick={onAddSubtask} size="small" variant="secondary">
                + Add New Subtask
              </Button>
            </div>
            <Input
              dropdownLabel={statusLabel}
              isMenuOpen={isStatusMenuOpen}
              mode={mode}
              onDropdownSelect={onStatusSelect}
              onDropdownToggle={onStatusToggle}
              options={resolvedStatusOptions}
              state={isStatusMenuOpen ? 'active' : 'idle'}
              value={resolvedStatusValue}
              variant="dropdown"
            />
            <Button className={styles.fullWidthButton} onClick={onPrimaryAction} size="large" variant="primary">
              {resolvedPrimaryActionLabel}
            </Button>
          </div>
        ) : null}

        {isBoardFormVariant ? (
          <div className={styles.fieldStack}>
            <Input fieldLabel="Board Name" mode={mode} state="idle" value={boardNameValue} variant="textField" />
            <div className={styles.sectionGroup}>
              <span className={styles.sectionLabel}>Board Columns</span>
              <div className={styles.editableList}>
                {resolvedBoardColumns.map((column) => (
                  <div className={styles.editableRow} key={column.id}>
                    <Input
                      className={styles.editableInput}
                      mode={mode}
                      placeholder={column.placeholder}
                      state="idle"
                      value={column.value}
                      variant="textField"
                    />
                    <button
                      aria-label="Remove column"
                      className={styles.removeButton}
                      onClick={() => onColumnRemove?.(column.id)}
                      type="button"
                    >
                      <img alt="" aria-hidden="true" className={styles.removeIcon} src={iconCross} />
                    </button>
                  </div>
                ))}
              </div>
              <Button className={styles.fullWidthButton} mode={mode} onClick={onAddColumn} size="small" variant="secondary">
                + Add New Column
              </Button>
            </div>
            <Button className={styles.fullWidthButton} onClick={onPrimaryAction} size="large" variant="primary">
              {resolvedPrimaryActionLabel}
            </Button>
          </div>
        ) : null}

        {isDeleteVariant ? (
          <div className={styles.buttonRow}>
            <Button className={styles.rowButton} onClick={onPrimaryAction} variant="destructive">
              {resolvedPrimaryActionLabel}
            </Button>
            <Button className={styles.rowButton} mode={mode} onClick={onSecondaryAction} variant="secondary">
              {secondaryActionLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Modal
