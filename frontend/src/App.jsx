import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Toaster } from 'sonner'
import DashboardPage from './pages/Dashboard.jsx'
import DetailPage from './pages/Detail.jsx'
import ProfilePage from './pages/Profile.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import './App.css'
import FloatingMath from './components/FloatingMath.jsx'
import ProfileMenu from './components/ProfileMenu.jsx'

function TopBar() {
  const { user, signInWithGoogle, signOut, needsConfig } = useAuth()
  return (
    <header className="topbar">
      <Link to="/" className="brand">Graficadora</Link>
      <nav className="nav">
        {user ? <ProfileMenu /> : null}
      </nav>
    </header>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <FloatingMath />
        <TopBar />
        <main className="container">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/polynomials/:id" element={<DetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  )
}
