import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { user, updateDisplayName, signOut } = useAuth()
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateDisplayName(fullName.trim())
      toast.success('Nombre actualizado')
    } catch (e) {
      toast.error(e.message || 'No se pudo actualizar el nombre')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="panel" style={{ maxWidth: 640, margin: '0 auto' }}>
      <h2>Mi perfil</h2>
      <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="field">
          <span>Correo</span>
          <input type="email" value={user?.email || ''} disabled />
        </div>
        <div className="field">
          <span>Nombre para mostrar</span>
          <input
            type="text"
            placeholder="Tu nombre"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="actions">
          <button className="btn primary" type="submit" disabled={saving}>Guardar cambios</button>
          <button className="btn" type="button" onClick={() => setFullName(user?.user_metadata?.full_name || '')}>Restablecer</button>
          <div style={{ flex: 1 }} />
          <button className="btn danger" type="button" onClick={signOut}>Cerrar sesión</button>
        </div>
      </form>
    </section>
  )
}
