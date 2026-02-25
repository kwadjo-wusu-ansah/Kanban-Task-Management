import { Route, Routes } from "react-router";
import { Admin, BoardView, Dashboard, Login, NotFound } from "./pages";
import { ProtectedRoute } from "./routes";
import { AdminShell, DashboardShell } from "./pages/MainShell/Shell";

// Registers app routes for dashboard, board, auth, and protected admin flows.
function App() {
  return (
    <Routes>

      <Route element={<DashboardShell />}>
        <Route element={<Dashboard />} path="/" />
      </Route>

      <Route element={<Login />} path="/login" />

      <Route element={<ProtectedRoute />}>

        <Route element={<BoardView />} path="/board/:boardId/task/:taskId" />

        <Route element={<BoardView />} path="/board/:boardId" />

        <Route element={<AdminShell />}>
          <Route element={<Admin />} path="/admin" />
        </Route>

      </Route>

      <Route element={<NotFound />} path="*" />
      
    </Routes>
  );
}

export default App;
