import { useState } from 'react'
import { Button, Sidebar } from './components'
import type { SidebarBoard, SidebarMode, SidebarTheme } from './components'
import styles from './App.module.css'

const previewBoards: SidebarBoard[] = [
  { id: 'platform-launch', name: 'Platform Launch' },
  { id: 'marketing-plan', name: 'Marketing Plan' },
  { id: 'roadmap', name: 'Roadmap' },
]

// Renders a focused preview page for the reusable Sidebar component.
function App() {
  const [activeBoardId, setActiveBoardId] = useState('platform-launch')
  const [isSidebarHidden, setIsSidebarHidden] = useState(false)
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>('light')
  const [sidebarTheme, setSidebarTheme] = useState<SidebarTheme>('light')

  return (
    <main className={styles.page}>
      <header className={styles.controls}>
        <Button onClick={() => setSidebarMode('light')} size="small" variant={sidebarMode === 'light' ? 'primary' : 'secondary'}>
          Light Sidebar
        </Button>
        <Button onClick={() => setSidebarMode('dark')} size="small" variant={sidebarMode === 'dark' ? 'primary' : 'secondary'}>
          Dark Sidebar
        </Button>
        <Button
          onClick={() => setIsSidebarHidden((previousHidden) => !previousHidden)}
          size="small"
          variant={isSidebarHidden ? 'primary' : 'secondary'}
        >
          {isSidebarHidden ? 'Show Sidebar' : 'Hide Sidebar'}
        </Button>
      </header>

      <section className={styles.canvas}>
        <Sidebar
          activeBoardId={activeBoardId}
          boardCount={sidebarMode === 'dark' ? 8 : 3}
          boards={previewBoards}
          hidden={isSidebarHidden}
          mode={sidebarMode}
          onBoardSelect={setActiveBoardId}
          onCreateBoard={() => {}}
          onHideSidebar={() => setIsSidebarHidden(true)}
          onShowSidebar={() => setIsSidebarHidden(false)}
          onThemeToggle={() => setSidebarTheme((previousTheme) => (previousTheme === 'dark' ? 'light' : 'dark'))}
          theme={sidebarTheme}
        />
      </section>
    </main>
  )
}

export default App
