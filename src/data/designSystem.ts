import kanbanDataset from '../../data.json'

interface DatasetSubtask {
  title: string
  isCompleted: boolean
}

interface DatasetTask {
  title: string
  description: string
  status: string
  subtasks: DatasetSubtask[]
}

interface DatasetColumn {
  name: string
  tasks: DatasetTask[]
}

interface DatasetBoard {
  name: string
  columns: DatasetColumn[]
}

interface KanbanDataset {
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
  id: string
  title: string
  totalSubtaskCount: number
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

const typedKanbanDataset = kanbanDataset as KanbanDataset
const COLUMN_ACCENT_COLORS = ['#49c4e5', '#8471f2', '#67e2ae', '#f4f7fd']

export const colorTokens: ColorToken[] = [
  { name: 'Main Purple', hex: '#635FC7', rgb: '99, 95, 199', hsl: '242°, 48%, 58%' },
  { name: 'Main Purple (Hover)', hex: '#A8A4FF', rgb: '168, 164, 255', hsl: '243°, 100%, 82%' },
  { name: 'Black', hex: '#000112', rgb: '0, 1, 18', hsl: '237°, 100%, 4%' },
  { name: 'Very Dark Grey (Dark BG)', hex: '#20212C', rgb: '32, 33, 44', hsl: '235°, 16%, 15%' },
  { name: 'Dark Grey', hex: '#2B2C37', rgb: '43, 44, 55', hsl: '235°, 12%, 19%' },
  { name: 'Lines (Dark)', hex: '#3E3F4E', rgb: '62, 63, 78', hsl: '236°, 11%, 27%' },
  { name: 'Medium Grey', hex: '#828FA3', rgb: '130, 143, 163', hsl: '216°, 15%, 57%' },
  { name: 'Lines (Light)', hex: '#E4EBFA', rgb: '228, 235, 250', hsl: '221°, 69%, 94%', swatchTextColor: 'dark' },
  { name: 'Light Grey (Light BG)', hex: '#F4F7FD', rgb: '244, 247, 253', hsl: '220°, 69%, 97%', swatchTextColor: 'dark' },
  { name: 'White', hex: '#FFFFFF', rgb: '255, 255, 255', hsl: '0°, 0%, 100%', swatchTextColor: 'dark' },
  { name: 'Red', hex: '#EA5555', rgb: '234, 85, 85', hsl: '0°, 76%, 63%' },
  { name: 'Red (Hover)', hex: '#FF9898', rgb: '255, 152, 152', hsl: '0°, 100%, 80%' },
]

export const typographyTokens: TypographyToken[] = [
  { label: 'Plus Jakarta Sans Bold 24px 100% Line', sample: 'Heading (XL)', className: 'headingXl' },
  { label: 'Plus Jakarta Sans Bold 18px 100% Line', sample: 'Heading (L)', className: 'headingL' },
  { label: 'Plus Jakarta Sans Bold 15px 100% Line', sample: 'Heading (M)', className: 'headingM' },
  { label: 'Plus Jakarta Sans Bold 12px 100% Line 2.4px Letter Spacing', sample: 'Heading (S)', className: 'headingS' },
  {
    label: 'Plus Jakarta Sans Medium 13px 23px Line',
    sample:
      'Body (L) - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus hendrerit. Pellentesque aliquet lectus tortor, vitae sodales odio, eget blandit nunc risus id nunc. Sed pulvinar, ligula sollicitudin laoreet viverra, tortor libero sodales leo, eget blandit nunc tortor eu nibh. Nullam nunc. Pellentesque suscipit, egestas nec, est aliquam volutpat augue, eget posuere sapien arcu vehicula nunc. In ultrices libero eu magna.',
    className: 'bodyL',
  },
  {
    label: 'Plus Jakarta Sans Bold 12px 100% Line',
    sample:
      'Body (M) - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus hendrerit. Pellentesque aliquet lectus tortor, vitae sodales odio, eget blandit nunc risus id nunc. Sed pulvinar, ligula sollicitudin laoreet viverra, tortor libero sodales leo, eget blandit nunc tortor eu nibh. Nullam nunc. Pellentesque suscipit, egestas nec, est aliquam volutpat augue, eget posuere sapien arcu vehicula nunc. In ultrices libero eu magna.',
    className: 'bodyM',
  },
]

// Builds board-level task totals used by the design-system data preview cards.
function buildBoardSummaries(boards: DatasetBoard[]): BoardSummary[] {
  return boards.map((board) => ({
    name: board.name,
    columnCount: board.columns.length,
    taskCount: board.columns.reduce((totalTasks, column) => totalTasks + column.tasks.length, 0),
  }))
}

// Extracts a stable unique list of column names to drive dropdown examples.
function getUniqueColumnNames(boards: DatasetBoard[]): string[] {
  const columnNameSet = new Set<string>()

  boards.forEach((board) => {
    board.columns.forEach((column) => {
      columnNameSet.add(column.name)
    })
  })

  return Array.from(columnNameSet)
}

// Derives checkbox preview rows from the first task subtasks and completed state.
function buildSubtaskStatePreviews(fallbackTaskTitle: string, boards: DatasetBoard[]): SubtaskPreview[] {
  const allSubtasks = boards.flatMap((board) => board.columns.flatMap((column) => column.tasks.flatMap((task) => task.subtasks)))
  const firstSubtask = allSubtasks[0]
  const secondSubtask = allSubtasks[1]
  const completedSubtask = allSubtasks.find((subtask) => subtask.isCompleted)

  return [
    {
      label: firstSubtask?.title ?? fallbackTaskTitle,
      checked: false,
      state: 'idle',
    },
    {
      label: secondSubtask?.title ?? 'Hovered',
      checked: false,
      state: 'hovered',
    },
    {
      label: completedSubtask?.title ?? 'Completed',
      checked: true,
      state: 'completed',
    },
  ]
}

// Normalizes a display label into a stable ID-safe slug.
function toId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Builds typed board/column/task view models used by board-page UI composition.
function buildBoardPreviews(boards: DatasetBoard[]): BoardPreview[] {
  return boards.map((board, boardIndex) => ({
    columns: board.columns.map((column, columnIndex) => ({
      accentColor: COLUMN_ACCENT_COLORS[columnIndex % COLUMN_ACCENT_COLORS.length],
      id: `${toId(board.name)}-${toId(column.name)}-${columnIndex}`,
      name: column.name,
      tasks: column.tasks.map((task, taskIndex) => ({
        completedSubtaskCount: task.subtasks.filter((subtask) => subtask.isCompleted).length,
        id: `${toId(column.name)}-${toId(task.title)}-${taskIndex}`,
        title: task.title,
        totalSubtaskCount: task.subtasks.length,
      })),
    })),
    id: `${toId(board.name)}-${boardIndex}`,
    name: board.name,
  }))
}

const boardSummaries = buildBoardSummaries(typedKanbanDataset.boards)
const firstTask = typedKanbanDataset.boards[0]?.columns.find((column) => column.tasks.length > 0)?.tasks[0]

export { boardSummaries }

export const boardPreviews = buildBoardPreviews(typedKanbanDataset.boards)
export const sampleTaskTitle = firstTask?.title ?? 'Building a slideshow'
export const dropdownOptions = getUniqueColumnNames(typedKanbanDataset.boards)
export const subtaskStates = buildSubtaskStatePreviews(sampleTaskTitle, typedKanbanDataset.boards)
