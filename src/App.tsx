import { useState } from 'react'
import { Button, Header } from './components'
import type { HeaderMode } from './components'
import { classNames } from './utils'
import styles from './App.module.css'

// Renders a focused preview page for the reusable Header component.
function App() {
  const [headerMode, setHeaderMode] = useState<HeaderMode>('light')
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)

  return (
    <main className={styles.page}>
      <header className={styles.controls}>
        <Button onClick={() => setHeaderMode('light')} size="small" variant={headerMode === 'light' ? 'primary' : 'secondary'}>
          Light Header
        </Button>
        <Button onClick={() => setHeaderMode('dark')} size="small" variant={headerMode === 'dark' ? 'primary' : 'secondary'}>
          Dark Header
        </Button>
        <Button onClick={() => setIsSidebarVisible(true)} size="small" variant={isSidebarVisible ? 'primary' : 'secondary'}>
          Sidebar Showing
        </Button>
        <Button onClick={() => setIsSidebarVisible(false)} size="small" variant={!isSidebarVisible ? 'primary' : 'secondary'}>
          Sidebar Hidden
        </Button>
      </header>

      <section className={classNames(styles.canvas, headerMode === 'dark' ? styles.canvasDark : styles.canvasLight)}>
        <Header boardName="Platform Launch" mode={headerMode} sidebarVisible={isSidebarVisible} />
      </section>
    </main>
  )
}

export default App
