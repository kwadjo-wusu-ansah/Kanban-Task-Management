import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../context'

// Guards nested routes and redirects anonymous users to login.
function ProtectedRoute() {
  const { isLoggedIn } = useAuth()
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return <Outlet />
}

export default ProtectedRoute
