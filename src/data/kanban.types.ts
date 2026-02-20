export interface DatasetSubtask {
  title: string
  isCompleted: boolean
}

export interface DatasetTask {
  title: string
  description: string
  status: string
  subtasks: DatasetSubtask[]
}

export interface DatasetColumn {
  name: string
  tasks: DatasetTask[]
}

export interface DatasetBoard {
  name: string
  columns: DatasetColumn[]
}

export interface KanbanDataset {
  boards: DatasetBoard[]
}

export interface ColorToken {
  name: string
  hex: string
  rgb: string
  hsl: string
  swatchTextColor?: 'light' | 'dark'
}

export interface TypographyToken {
  label: string
  sample: string
  className: 'headingXl' | 'headingL' | 'headingM' | 'headingS' | 'bodyL' | 'bodyM'
}

export interface BoardSummary {
  name: string
  columnCount: number
  taskCount: number
}

export interface BoardTaskPreview {
  completedSubtaskCount: number
  description: string
  id: string
  status: string
  subtasks: BoardSubtaskPreview[]
  title: string
  totalSubtaskCount: number
}

export interface BoardSubtaskPreview {
  id: string
  isCompleted: boolean
  title: string
}

export interface BoardColumnPreview {
  accentColor: string
  id: string
  name: string
  tasks: BoardTaskPreview[]
}

export interface BoardPreview {
  columns: BoardColumnPreview[]
  id: string
  name: string
}

export interface SubtaskPreview {
  label: string
  checked: boolean
  state: 'idle' | 'hovered' | 'completed'
}
