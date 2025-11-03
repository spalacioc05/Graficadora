import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProfileMenu() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const name = user?.user_metadata?.full_name || user?.email || 'Usuario'
  const initials = (name || 'U')
    .split(' ')?.map((s) => s.charAt(0).toUpperCase()).slice(0, 2).join('') || 'U'

  useEffect(() => {
    function onDocClick(e) {
      if (!ref.current) return
      if (!ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <div className="profile-wrap" ref={ref}>
      <button className="avatar" onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open}>
        {initials}
      </button>
      {open && (
        <div className="menu" role="menu">
          <div className="menu-header">
            <div className="avatar small">{initials}</div>
            <div className="menu-id">
              <div className="menu-name">{name}</div>
              <div className="menu-email">{user?.email}</div>
            </div>
          </div>
          <Link className="menu-item" to="/profile" onClick={() => setOpen(false)}>Mi perfil</Link>
          <button className="menu-item danger" onClick={signOut}>Cerrar sesión</button>
        </div>
      )}
    </div>
  )
}
