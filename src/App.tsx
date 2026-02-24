import { Outlet, Route, Routes } from 'react-router'
import { Admin, BoardView, Dashboard, Login, MainShell, NotFound } from './pages'
import { ProtectedRoute } from './routes'

// Registers app routes for dashboard, board, auth, and protected admin flows.
function App() {
  return (
    <Routes>
      <Route
        element={
          <MainShell title="Dashboard">
            <Outlet />
          </MainShell>
        }
      >
        <Route element={<Dashboard />} path="/" />
      </Route>
      <Route element={<Login />} path="/login" />
      <Route element={<ProtectedRoute />}>
        <Route element={<BoardView />} path="/board/:boardId/task/:taskId" />
        <Route element={<BoardView />} path="/board/:boardId" />
        <Route
          element={
            <MainShell title="Admin">
              <Outlet />
            </MainShell>
          }
        >
          <Route element={<Admin />} path="/admin" />
        </Route>
      </Route>
      <Route element={<NotFound />} path="*" />
    </Routes>
  )
}

export default App
