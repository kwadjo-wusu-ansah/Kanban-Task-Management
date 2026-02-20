import { Button } from './components'
import styles from './App.module.css'

// Renders a light-mode preview for reusable button variants.
function App() {
  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <h1 className={styles.title}>Button (Light Mode)</h1>
        <p className={styles.message}>Primary, secondary, and destructive variants with hover states.</p>
        <div className={styles.buttonGrid}>
          <Button variant="primary">Button Primary (L)</Button>
          <Button size="small" variant="primary">
            Button Primary (S)
          </Button>
          <Button variant="secondary">Button Secondary</Button>
          <Button variant="destructive">Button Destructive</Button>
        </div>
      </section>
    </main>
  )
}

export default App
