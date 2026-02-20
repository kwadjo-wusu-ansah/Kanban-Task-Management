import { Input } from './components'
import styles from './App.module.css'

const statusOptions = [
  { label: 'Todo', value: 'Todo' },
  { label: 'Doing', value: 'Doing' },
  { label: 'Done', value: 'Done' },
]

// Renders a dark-mode preview for reusable input variants.
function App() {
  return (
    <main className={styles.page}>
      <section className={`${styles.panel} ${styles.panelDark}`}>
        <h1 className={styles.title}>Input (Dark Mode)</h1>
        <p className={styles.message}>Checkbox, text field, and dropdown states from the dark design system.</p>
        <div className={styles.previewGrid}>
          <div className={styles.previewColumn}>
            <h2 className={styles.sectionTitle}>Checkbox</h2>
            <div className={styles.previewStack}>
              <Input checkboxLabel="Idle" mode="dark" state="idle" variant="checkbox" />
              <Input checkboxLabel="Hovered" mode="dark" state="hover" variant="checkbox" />
              <Input checkboxLabel="Completed" mode="dark" state="active" variant="checkbox" />
            </div>
          </div>

          <div className={styles.previewColumn}>
            <h2 className={styles.sectionTitle}>Text Field</h2>
            <div className={styles.previewStack}>
              <Input fieldLabel="Text Field (Idle)" mode="dark" placeholder="Enter task name" state="idle" variant="textField" />
              <Input fieldLabel="Text Field (Active)" mode="dark" state="active" value="Building a slideshow" variant="textField" />
              <Input
                errorMessage="Can’t be empty"
                fieldLabel="Text Field (Error)"
                mode="dark"
                placeholder="Enter task name"
                state="error"
                variant="textField"
              />
            </div>
          </div>

          <div className={styles.previewColumn}>
            <h2 className={styles.sectionTitle}>Dropdown</h2>
            <div className={styles.previewStack}>
              <Input dropdownLabel="Dropdown (Idle)" mode="dark" options={statusOptions} state="idle" value="Doing" variant="dropdown" />
              <Input
                dropdownLabel="Dropdown (Active)"
                isMenuOpen
                mode="dark"
                options={statusOptions}
                state="active"
                value="Doing"
                variant="dropdown"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
