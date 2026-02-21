import { useContext } from 'react'
import { AuthContext } from './auth.context'
import type { AuthContextValue } from './auth.context'

// Exposes typed auth context helpers and enforces provider usage.
function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

export { useAuth }
