import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import type { ModalItem } from '../components'

interface UseBoardViewFormStateParams {
  createInitialAddBoardColumns: () => ModalItem[]
  createInitialAddTaskSubtasks: () => ModalItem[]
}

interface UseBoardViewFormStateResult {
  addBoardColumns: ModalItem[]
  addBoardName: string
  addBoardNameError: string
  addColumnName: string
  addColumnNameError: string
  addTaskDescription: string
  addTaskStatusValue: string
  addTaskSubtasks: ModalItem[]
  addTaskSubtasksError: string
  addTaskTitle: string
  deletingBoardId: string | null
  deletingBoardName: string
  deletingTaskBoardId: string | null
  deletingTaskId: string | null
  deletingTaskName: string
  editBoardColumns: ModalItem[]
  editBoardColumnsError: string
  editBoardName: string
  editBoardNameError: string
  editingBoardId: string | null
  editingTaskId: string | null
  editTaskDescription: string
  editTaskStatusValue: string
  editTaskSubtasks: ModalItem[]
  editTaskTitle: string
  setAddBoardColumns: Dispatch<SetStateAction<ModalItem[]>>
  setAddBoardName: Dispatch<SetStateAction<string>>
  setAddBoardNameError: Dispatch<SetStateAction<string>>
  setAddColumnName: Dispatch<SetStateAction<string>>
  setAddColumnNameError: Dispatch<SetStateAction<string>>
  setAddTaskDescription: Dispatch<SetStateAction<string>>
  setAddTaskStatusValue: Dispatch<SetStateAction<string>>
  setAddTaskSubtasks: Dispatch<SetStateAction<ModalItem[]>>
  setAddTaskSubtasksError: Dispatch<SetStateAction<string>>
  setAddTaskTitle: Dispatch<SetStateAction<string>>
  setDeletingBoardId: Dispatch<SetStateAction<string | null>>
  setDeletingBoardName: Dispatch<SetStateAction<string>>
  setDeletingTaskBoardId: Dispatch<SetStateAction<string | null>>
  setDeletingTaskId: Dispatch<SetStateAction<string | null>>
  setDeletingTaskName: Dispatch<SetStateAction<string>>
  setEditBoardColumns: Dispatch<SetStateAction<ModalItem[]>>
  setEditBoardColumnsError: Dispatch<SetStateAction<string>>
  setEditBoardName: Dispatch<SetStateAction<string>>
  setEditBoardNameError: Dispatch<SetStateAction<string>>
  setEditingBoardId: Dispatch<SetStateAction<string | null>>
  setEditingTaskId: Dispatch<SetStateAction<string | null>>
  setEditTaskDescription: Dispatch<SetStateAction<string>>
  setEditTaskStatusValue: Dispatch<SetStateAction<string>>
  setEditTaskSubtasks: Dispatch<SetStateAction<ModalItem[]>>
  setEditTaskTitle: Dispatch<SetStateAction<string>>
  setViewStatusValue: Dispatch<SetStateAction<string>>
  setViewSubtasks: Dispatch<SetStateAction<ModalItem[]>>
  viewStatusValue: string
  viewSubtasks: ModalItem[]
}

// Manages BoardView-local form, editing, and delete target state.
export function useBoardViewFormState({
  createInitialAddBoardColumns,
  createInitialAddTaskSubtasks,
}: UseBoardViewFormStateParams): UseBoardViewFormStateResult {
  const [viewStatusValue, setViewStatusValue] = useState('')
  const [viewSubtasks, setViewSubtasks] = useState<ModalItem[]>([])

  const [addTaskTitle, setAddTaskTitle] = useState('')
  const [addTaskDescription, setAddTaskDescription] = useState('')
  const [addTaskStatusValue, setAddTaskStatusValue] = useState('')
  const [addTaskSubtasks, setAddTaskSubtasks] = useState<ModalItem[]>(createInitialAddTaskSubtasks)
  const [addTaskSubtasksError, setAddTaskSubtasksError] = useState('')

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editTaskTitle, setEditTaskTitle] = useState('')
  const [editTaskDescription, setEditTaskDescription] = useState('')
  const [editTaskStatusValue, setEditTaskStatusValue] = useState('')
  const [editTaskSubtasks, setEditTaskSubtasks] = useState<ModalItem[]>([])

  const [addBoardName, setAddBoardName] = useState('')
  const [addBoardNameError, setAddBoardNameError] = useState('')
  const [addBoardColumns, setAddBoardColumns] = useState<ModalItem[]>(createInitialAddBoardColumns)
  const [addColumnName, setAddColumnName] = useState('')
  const [addColumnNameError, setAddColumnNameError] = useState('')

  const [editingBoardId, setEditingBoardId] = useState<string | null>(null)
  const [editBoardName, setEditBoardName] = useState('')
  const [editBoardNameError, setEditBoardNameError] = useState('')
  const [editBoardColumns, setEditBoardColumns] = useState<ModalItem[]>([])
  const [editBoardColumnsError, setEditBoardColumnsError] = useState('')

  const [deletingBoardId, setDeletingBoardId] = useState<string | null>(null)
  const [deletingBoardName, setDeletingBoardName] = useState('')

  const [deletingTaskBoardId, setDeletingTaskBoardId] = useState<string | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)
  const [deletingTaskName, setDeletingTaskName] = useState('')

  return {
    addBoardColumns,
    addBoardName,
    addBoardNameError,
    addColumnName,
    addColumnNameError,
    addTaskDescription,
    addTaskStatusValue,
    addTaskSubtasks,
    addTaskSubtasksError,
    addTaskTitle,
    deletingBoardId,
    deletingBoardName,
    deletingTaskBoardId,
    deletingTaskId,
    deletingTaskName,
    editBoardColumns,
    editBoardColumnsError,
    editBoardName,
    editBoardNameError,
    editingBoardId,
    editingTaskId,
    editTaskDescription,
    editTaskStatusValue,
    editTaskSubtasks,
    editTaskTitle,
    setAddBoardColumns,
    setAddBoardName,
    setAddBoardNameError,
    setAddColumnName,
    setAddColumnNameError,
    setAddTaskDescription,
    setAddTaskStatusValue,
    setAddTaskSubtasks,
    setAddTaskSubtasksError,
    setAddTaskTitle,
    setDeletingBoardId,
    setDeletingBoardName,
    setDeletingTaskBoardId,
    setDeletingTaskId,
    setDeletingTaskName,
    setEditBoardColumns,
    setEditBoardColumnsError,
    setEditBoardName,
    setEditBoardNameError,
    setEditingBoardId,
    setEditingTaskId,
    setEditTaskDescription,
    setEditTaskStatusValue,
    setEditTaskSubtasks,
    setEditTaskTitle,
    setViewStatusValue,
    setViewSubtasks,
    viewStatusValue,
    viewSubtasks,
  }
}
