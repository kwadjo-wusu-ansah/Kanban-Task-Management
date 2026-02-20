import { useState } from 'react'
import { Button, TaskCard } from './components'
import type { TaskCardMode } from './components'
import { classNames } from './utils'
import styles from './App.module.css'

const previewTasks = [
  { completedSubtasks: 2, id: 'build-ui', title: 'Build UI for onboarding flow', totalSubtasks: 5 },
  { completedSubtasks: 0, id: 'audit-copy', title: 'Audit marketing copy and CTA hierarchy', totalSubtasks: 3 },
  { completedSubtasks: 1, id: 'retro-notes', title: 'Write sprint retro notes', totalSubtasks: 1 },
]

// Renders a focused preview page for the reusable TaskCard component.
function App() {
  const [taskCardMode, setTaskCardMode] = useState<TaskCardMode>('light')

  return (
    <main className={styles.page}>
      <header className={styles.controls}>
        <Button onClick={() => setTaskCardMode('light')} size="small" variant={taskCardMode === 'light' ? 'primary' : 'secondary'}>
          Light Task Card
        </Button>
        <Button onClick={() => setTaskCardMode('dark')} size="small" variant={taskCardMode === 'dark' ? 'primary' : 'secondary'}>
          Dark Task Card
        </Button>
      </header>

      <section className={classNames(styles.canvas, taskCardMode === 'dark' ? styles.canvasDark : styles.canvasLight)}>
        {previewTasks.map((task) => (
          <TaskCard
            completedSubtaskCount={task.completedSubtasks}
            key={task.id}
            mode={taskCardMode}
            title={task.title}
            totalSubtaskCount={task.totalSubtasks}
          />
        ))}
      </section>
    </main>
  )
}

export default App
