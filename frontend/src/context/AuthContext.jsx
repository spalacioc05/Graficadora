import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const AuthCtx = createContext(null)

function makeSupabase() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export function AuthProvider({ children }) {
  const supabase = useMemo(() => makeSupabase(), [])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [needsConfig, setNeedsConfig] = useState(false)

  useEffect(() => {
    let unsub = () => {}
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        setUser(data?.session?.user || null)
        setLoading(false)
      })
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null)
      })
      unsub = () => sub?.subscription?.unsubscribe()
    } else {
      // Sin configuración de Supabase no hay modo demo.
      setNeedsConfig(true)
      setLoading(false)
    }
    return () => unsub()
  }, [supabase])

  const signInWithGoogle = async () => {
    if (!supabase) throw new Error('Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY')
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
  }

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut()
    setUser(null)
  }

  const updateDisplayName = async (fullName) => {
    if (!supabase) throw new Error('Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY')
    const { data, error } = await supabase.auth.updateUser({ data: { full_name: fullName } })
    if (error) throw error
    setUser(data?.user || null)
    return data?.user
  }

  return (
    <AuthCtx.Provider value={{ user, supabase, loading, signInWithGoogle, signOut, updateDisplayName, needsConfig }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
