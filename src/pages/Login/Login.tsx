import { Navigate, useLocation, useNavigate } from 'react-router'
import { Button } from '../../components'
import { useAuth } from '../../context'
import styles from './Login.module.css'

interface LoginLocationState {
  from?: {
    pathname: string
  }
}

// Resolves post-login redirect path from navigation state with dashboard fallback.
function getRedirectPath(state: LoginLocationState | null): string {
  return state?.from?.pathname || '/'
}

// Renders login route and redirects to the previously requested page after sign-in.
function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn, login } = useAuth()

  // Redirects authenticated users away from login to avoid duplicate auth screens.
  function handleLogin() {
    login()
    navigate(getRedirectPath(location.state as LoginLocationState | null), { replace: true })
  }

  if (isLoggedIn) {
    return <Navigate replace to="/" />
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.description}>Sign in to access protected routes like the admin panel.</p>
        <Button onClick={handleLogin} size="large" variant="primary">
          Login
        </Button>
      </section>
    </main>
  )
}

export default Login
