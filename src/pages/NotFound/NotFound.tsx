import { useNavigate } from 'react-router'
import { Button } from '../../components'
import styles from './NotFound.module.css'

// Renders a fallback page for unmatched routes with recovery navigation actions.
function NotFound() {
  const navigate = useNavigate()

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>404 - Page Not Found</h1>
        <p className={styles.description}>The page you requested does not exist or was moved.</p>
        <div className={styles.actions}>
          <Button onClick={() => navigate(-1)} size="small" variant="secondary">
            Go Back
          </Button>
          <Button onClick={() => navigate('/')} size="small" variant="primary">
            Return to Dashboard
          </Button>
        </div>
      </section>
    </main>
  )
}

export default NotFound
