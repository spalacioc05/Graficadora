import { useAuth } from '../context/AuthContext.jsx'

export default function LoginCard() {
  const { signInWithGoogle, needsConfig } = useAuth()
  return (
    <div className="login-wrap">
      <div className="login-card panel">
        <h1 className="login-title" style={{ fontSize: '2rem' }}>Graficadora</h1>
        <button className="google-btn" onClick={signInWithGoogle} disabled={needsConfig}>
          <GoogleIcon />
          <span>Iniciar sesión con Google</span>
        </button>
        {needsConfig && <p className="hint">Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en frontend/.env</p>}
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#FFC107" d="M43.61 20.083H42V20H24v8h11.303C33.676 32.33 29.223 36 24 36 16.82 36 11 30.18 11 23S16.82 10 24 10c3.27 0 6.24 1.237 8.5 3.262l5.657-5.657C34.842 4.027 29.69 2 24 2 11.85 2 2 11.85 2 24s9.85 22 22 22c11.045 0 21-8 21-22 0-1.324-.138-2.61-.39-3.917z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.817C14.625 16.15 18.94 13 24 13c3.27 0 6.24 1.237 8.5 3.262l5.657-5.657C34.842 4.027 29.69 2 24 2 15.34 2 7.95 7.02 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 46c5.166 0 9.86-1.71 13.552-4.646l-6.26-5.348C29.12 37.502 26.702 38 24 38c-5.202 0-9.644-3.644-11.196-8.54l-6.5 5.01C8.917 41.16 15.883 46 24 46z"/>
      <path fill="#1976D2" d="M43.61 20.083H42V20H24v8h11.303c-1.016 3.33-3.61 5.989-6.96 7.004l6.26 5.348C36.202 41.337 43 36 43 24c0-1.324-.138-2.61-.39-3.917z"/>
    </svg>
  )
}
