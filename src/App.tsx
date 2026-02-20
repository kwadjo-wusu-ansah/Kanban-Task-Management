import { useState } from 'react'
import { Button, Tasks } from './components'
import type { TaskCardMode, TasksItem } from './components'
import { classNames } from './utils'
import styles from './App.module.css'

const previewTasks: TasksItem[] = [
  { completedSubtaskCount: 2, id: 'build-ui', title: 'Build UI for onboarding flow', totalSubtaskCount: 5 },
  { completedSubtaskCount: 0, id: 'audit-copy', title: 'Audit marketing copy and CTA hierarchy', totalSubtaskCount: 3 },
  { completedSubtaskCount: 1, id: 'retro-notes', title: 'Write sprint retro notes', totalSubtaskCount: 1 },
]

// Renders a focused preview page for the reusable Tasks component.
function App() {
  const [taskCardMode, setTaskCardMode] = useState<TaskCardMode>('light')
  const [isEmptyPreview, setIsEmptyPreview] = useState(false)

  return (
    <main className={styles.page}>
      <header className={styles.controls}>
        <Button onClick={() => setTaskCardMode('light')} size="small" variant={taskCardMode === 'light' ? 'primary' : 'secondary'}>
          Light Tasks
        </Button>
        <Button onClick={() => setTaskCardMode('dark')} size="small" variant={taskCardMode === 'dark' ? 'primary' : 'secondary'}>
          Dark Tasks
        </Button>
        <Button onClick={() => setIsEmptyPreview((previousValue) => !previousValue)} size="small" variant={isEmptyPreview ? 'primary' : 'secondary'}>
          {isEmptyPreview ? 'Show Task List' : 'Show Empty State'}
        </Button>
      </header>

      <section className={classNames(styles.canvas, taskCardMode === 'dark' ? styles.canvasDark : styles.canvasLight)}>
        <Tasks
          accentColor="#49C4E5"
          emptyMessage="No tasks"
          heading="Todo"
          mode={taskCardMode}
          taskCount={isEmptyPreview ? 0 : previewTasks.length}
          tasks={isEmptyPreview ? [] : previewTasks}
        />
      </section>
    </main>
  )
}

export default App
