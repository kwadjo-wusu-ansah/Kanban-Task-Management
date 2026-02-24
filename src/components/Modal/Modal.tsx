import { iconCross, iconVerticalEllipsis } from '../../assets'
import { classNames } from '../../utils'
import { Button } from '../Button'
import { Input } from '../Input'
import styles from './Modal.module.css'
import type { ModalProps } from './Modal.types'
import {
  DEFAULT_BOARD_COLUMNS,
  DEFAULT_TASK_DESCRIPTION_PLACEHOLDER,
  DEFAULT_TASK_TITLE_PLACEHOLDER,
  DEFAULT_VIEW_SUBTASKS,
  getFallbackDescription,
  getFallbackTaskDescriptionValue,
  getFallbackTaskTitleValue,
  getFallbackTitle,
  getPrimaryActionLabel,
  resolveStatusOptions,
} from './Modal.utils'

// Renders a reusable modal shell with light/dark modes and eight modal variants.
function Modal({
  boardNameErrorMessage,
  boardNameValue = 'Platform Launch',
  className,
  columnNameErrorMessage,
  columnNameValue = '',
  columnsErrorMessage,
  columns = DEFAULT_BOARD_COLUMNS,
  description,
  isPrimaryActionDisabled = false,
  isStatusMenuOpen = false,
  isTaskMenuOpen = false,
  mode = 'light',
  onAddColumn,
  onAddSubtask,
  onBoardNameChange,
  onClose,
  onColumnRemove,
  onColumnNameChange,
  onColumnValueChange,
  onDeleteTask,
  onEditTask,
  onMenuOpen,
  onPrimaryAction,
  onSecondaryAction,
  onStatusSelect,
  onStatusToggle,
  onSubtaskRemove,
  onSubtaskToggle,
  onSubtaskValueChange,
  onTaskDescriptionChange,
  onTaskTitleChange,
  open = true,
  primaryActionLabel,
  secondaryActionLabel = 'Cancel',
  subtaskErrorMessage,
  statusLabel = 'Status',
  statusOptions,
  statusValue,
  subtasks = DEFAULT_VIEW_SUBTASKS,
  taskDescriptionPlaceholder = DEFAULT_TASK_DESCRIPTION_PLACEHOLDER,
  taskDescriptionValue,
  taskTitlePlaceholder = DEFAULT_TASK_TITLE_PLACEHOLDER,
  taskTitleValue,
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
  const resolvedTaskFormSubtasks = subtasks
  const resolvedBoardColumns = columns
  const resolvedTaskTitleValue = taskTitleValue ?? getFallbackTaskTitleValue(variant)
  const resolvedTaskDescriptionValue = taskDescriptionValue ?? getFallbackTaskDescriptionValue(variant)
  const completedSubtaskCount = subtasks.filter((item) => item.checked).length
  const isDeleteVariant = variant === 'deleteBoard' || variant === 'deleteTask'
  const isAddTaskVariant = variant === 'addTask'
  const isEditTaskVariant = variant === 'editTask'
  const isViewTaskVariant = variant === 'viewTask'
  const isTaskFormVariant = variant === 'addTask' || variant === 'editTask'
  const isBoardFormVariant = variant === 'addBoard' || variant === 'editBoard'
  const isColumnFormVariant = variant === 'addColumn'

  return (
    <div className={classNames(styles.backdrop, mode === 'dark' ? styles.backdropDark : styles.backdropLight)} onClick={onClose}>
      <div
        aria-modal="true"
        className={classNames(
          styles.panel,
          mode === 'dark' ? styles.panelDark : styles.panelLight,
          isAddTaskVariant && styles.panelAddTask,
          isEditTaskVariant && styles.panelEditTask,
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
            <div className={styles.menuRegion}>
              <button aria-label="Open task actions" className={styles.menuButton} onClick={onMenuOpen} type="button">
                <img alt="" aria-hidden="true" className={styles.menuIcon} src={iconVerticalEllipsis} />
              </button>
              {isTaskMenuOpen ? (
                <div className={styles.taskMenu} role="menu">
                  <button className={styles.taskMenuAction} onClick={onEditTask} role="menuitem" type="button">
                    Edit Task
                  </button>
                  <button className={classNames(styles.taskMenuAction, styles.taskMenuActionDanger)} onClick={onDeleteTask} role="menuitem" type="button">
                    Delete Task
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {resolvedDescription && <p className={styles.description}>{resolvedDescription}</p> }

        {isViewTaskVariant && (
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
        )}

        {isTaskFormVariant && (
          <div className={styles.fieldStack}>
            <Input
              fieldLabel="Title"
              mode={mode}
              onTextChange={onTaskTitleChange}
              placeholder={taskTitlePlaceholder}
              state="idle"
              value={resolvedTaskTitleValue}
              variant="textField"
            />
            <div className={styles.textAreaGroup}>
              <span className={styles.textAreaLabel}>Description</span>
              <textarea
                className={styles.textAreaControl}
                onChange={onTaskDescriptionChange}
                placeholder={taskDescriptionPlaceholder}
                readOnly={!onTaskDescriptionChange}
                value={resolvedTaskDescriptionValue}
              />
            </div>
            <div className={styles.sectionGroup}>
              <span className={styles.sectionLabel}>Subtasks</span>
              <div className={styles.editableList}>
                {resolvedTaskFormSubtasks.map((subtask) => (
                  <div className={styles.editableRow} key={subtask.id}>
                    <Input
                      className={styles.editableInput}
                      errorMessage={subtask.errorMessage}
                      mode={mode}
                      onTextChange={(event) => onSubtaskValueChange?.(subtask.id, event.target.value)}
                      placeholder={subtask.placeholder}
                      state={subtask.errorMessage ? 'error' : 'idle'}
                      value={subtask.value}
                      variant="textField"
                    />
                    <button
                      aria-label="Remove subtask"
                      className={classNames(styles.removeButton, subtask.errorMessage && styles.removeButtonError)}
                      onClick={() => onSubtaskRemove?.(subtask.id)}
                      type="button"
                    >
                      <img alt="" aria-hidden="true" className={classNames(styles.removeIcon, subtask.errorMessage && styles.removeIconError)} src={iconCross} />
                    </button>
                  </div>
                ))}
              </div>
              {subtaskErrorMessage && <span className={styles.sectionErrorMessage}>{subtaskErrorMessage}</span>}
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
            <Button
              className={styles.fullWidthButton}
              disabled={isPrimaryActionDisabled}
              onClick={onPrimaryAction}
              size="large"
              variant="primary"
            >
              {resolvedPrimaryActionLabel}
            </Button>
          </div>
        )}

        {isBoardFormVariant && (
          <div className={styles.fieldStack}>
            <Input
              errorMessage={boardNameErrorMessage}
              fieldLabel="Board Name"
              mode={mode}
              onTextChange={onBoardNameChange}
              placeholder="e.g. Web Design"
              state={boardNameErrorMessage ? 'error' : 'idle'}
              value={boardNameValue}
              variant="textField"
            />
            <div className={styles.sectionGroup}>
              <span className={styles.sectionLabel}>Board Columns</span>
              <div className={styles.editableList}>
                {resolvedBoardColumns.map((column) => (
                  <div className={styles.editableRow} key={column.id}>
                    <Input
                      className={styles.editableInput}
                      mode={mode}
                      onTextChange={(event) => onColumnValueChange?.(column.id, event.target.value)}
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
              {columnsErrorMessage && <span className={styles.sectionErrorMessage}>{columnsErrorMessage}</span>}
              <Button className={styles.fullWidthButton} mode={mode} onClick={onAddColumn} size="small" variant="secondary">
                + Add New Column
              </Button>
            </div>
            <Button className={styles.fullWidthButton} onClick={onPrimaryAction} size="large" variant="primary">
              {resolvedPrimaryActionLabel}
            </Button>
          </div>
        )}

        {isColumnFormVariant && (
          <div className={styles.fieldStack}>
            <Input
              errorMessage={columnNameErrorMessage}
              fieldLabel="Column Name"
              mode={mode}
              onTextChange={onColumnNameChange}
              placeholder="e.g. Doing"
              state={columnNameErrorMessage ? 'error' : 'idle'}
              value={columnNameValue}
              variant="textField"
            />
            <div className={styles.buttonRow}>
              <Button className={styles.rowButton} onClick={onPrimaryAction} size="large" variant="primary">
                {resolvedPrimaryActionLabel}
              </Button>
              <Button
                className={classNames(styles.rowButton, styles.rowButtonSecondaryForm)}
                mode={mode}
                onClick={onSecondaryAction ?? onClose}
                variant="secondary"
              >
                {secondaryActionLabel}
              </Button>
            </div>
          </div>
        )}

        {isDeleteVariant && (
          <div className={styles.buttonRow}>
            <Button className={styles.rowButton} onClick={onPrimaryAction} variant="destructive">
              {resolvedPrimaryActionLabel}
            </Button>
            <Button className={styles.rowButton} mode={mode} onClick={onSecondaryAction} variant="secondary">
              {secondaryActionLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
