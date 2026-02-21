import { Route, Routes } from 'react-router'
import { Admin, BoardView, Dashboard, Login, NotFound } from './pages'
import { ProtectedRoute } from './routes'

// Registers app routes for dashboard, board, auth, and protected admin flows.
function App() {
  return (
    <Routes>
      <Route element={<Dashboard />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route element={<ProtectedRoute />}>
        <Route element={<BoardView />} path="/board/:boardId" />
        <Route element={<Admin />} path="/admin" />
      </Route>
      <Route element={<NotFound />} path="*" />
    </Routes>
  )
}

export default App
