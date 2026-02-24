import { useNavigate } from 'react-router'
import { Button } from '../../components'
import { useAuth } from '../../context'
import styles from './Admin.module.css'

// Renders protected admin route controls and logout navigation.
function Admin() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  // Clears auth state and sends users back to the login route.
  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <p className={styles.description}>This is a protected route. Only authenticated users can view this page.</p>
      <div className={styles.actionRow}>
        <Button onClick={() => navigate('/')} size="small" variant="secondary">
          Return to Dashboard
        </Button>
        <Button onClick={handleLogout} size="small" variant="destructive">
          Logout
        </Button>
      </div>
    </>
  )
}

export default Admin
