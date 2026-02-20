import { Button } from './components'
import styles from './App.module.css'

// Renders a dark-mode preview for reusable button variants.
function App() {
  return (
    <main className={styles.page}>
      <section className={`${styles.panel} ${styles.panelDark}`}>
        <h1 className={styles.title}>Button (Dark Mode)</h1>
        <p className={styles.message}>Primary, secondary, and destructive variants with hover states.</p>
        <div className={styles.buttonGrid}>
          <Button mode="dark" variant="primary">
            Button Primary (L)
          </Button>
          <Button mode="dark" size="small" variant="primary">
            Button Primary (S)
          </Button>
          <Button mode="dark" variant="secondary">
            Button Secondary
          </Button>
          <Button mode="dark" variant="destructive">
            Button Destructive
          </Button>
        </div>
      </section>
    </main>
  )
}

export default App
