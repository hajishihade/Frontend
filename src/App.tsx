import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from './theme'
import { useAuthStore } from './stores/authStore'

// Layouts
import MinimalLayout from './layouts/MinimalLayout'

// Pages
import LoginPage from './pages/Login'
import DashboardPage from './pages/Dashboard'
import CreateSessionPage from './pages/CreateSession'
import EpisodePage from './pages/Episode'
import StatsPage from './pages/Stats'
import ResumePage from './pages/Resume'
import StoryDetailPage from './pages/StoryDetail'
import SessionViewPage from './pages/SessionView'
import SettingsPage from './pages/Settings'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          
          {/* Protected routes */}
          <Route
            element={
              isAuthenticated ? <MinimalLayout /> : <Navigate to="/login" />
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create" element={<CreateSessionPage />} />
            <Route path="/episode/:id" element={<EpisodePage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/story/:id" element={<StoryDetailPage />} />
            <Route path="/session/:id" element={<SessionViewPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App