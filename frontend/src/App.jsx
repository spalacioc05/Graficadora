import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Toaster } from 'sonner'
import DashboardPage from './pages/Dashboard.jsx'
import DetailPage from './pages/Detail.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import './App.css'
import FloatingMath from './components/FloatingMath.jsx'

function TopBar() {
  const { user, signInWithGoogle, signOut, needsConfig } = useAuth()
  return (
    <header className="topbar">
      <Link to="/" className="brand">Graficadora</Link>
      <nav className="nav">
        {user ? (
          <>
            <span className="user">{user.email || 'Usuario'}</span>
            <button className="btn" onClick={signOut}>Cerrar sesión</button>
          </>
        ) : null}
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
          </Routes>
        </main>
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  )
}
