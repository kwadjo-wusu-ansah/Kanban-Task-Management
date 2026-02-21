import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './auth.context'

const AUTH_STORAGE_KEY = 'kanban-auth-state'

// Reads persisted auth state safely with a false fallback when storage is unavailable.
function getInitialAuthState(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
}

// Provides app-wide mock auth state with localStorage persistence.
function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(getInitialAuthState)

  // Persists auth state so protected routes remain consistent after refresh.
  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, String(isLoggedIn))
  }, [isLoggedIn])

  const value = useMemo(
    () => ({
      isLoggedIn,
      login: () => setIsLoggedIn(true),
      logout: () => setIsLoggedIn(false),
    }),
    [isLoggedIn],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthProvider }
