import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../lib/api.js'
import PolynomialForm from '../components/PolynomialForm.jsx'
import GraphPlot from '../components/GraphPlot.jsx'
import HistoryList from '../components/HistoryList.jsx'
import LoginCard from '../components/LoginCard.jsx'
import MathExpr from '../components/MathExpr.jsx'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [history, setHistory] = useState([])
  const [histLoading, setHistLoading] = useState(false)
  const [histError, setHistError] = useState('')
  const [current, setCurrent] = useState(null) // { expression, points }
  const [submitting, setSubmitting] = useState(false)

  const authUid = user?.id
  const displayName = user?.user_metadata?.full_name || user?.email || 'Usuario'
  const email = user?.email

  const fetchHistory = async () => {
    if (!authUid) return
    setHistLoading(true)
    setHistError('')
    try {
      const rows = await api.getHistory(authUid)
      setHistory(rows)
    } catch (e) {
      setHistError(e.message)
    } finally {
      setHistLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUid])

  const handleCreate = async ({ expresion, rango }) => {
    if (!authUid) {
      toast.error('Inicia sesión para continuar')
      return
    }
    setSubmitting(true)
    try {
      const res = await api.createPolynomial({ authUid, nombre: displayName, correo: email, expresion, rango })
      setCurrent({ expression: res.expresion || expresion, points: res.puntos, meta: res })
      toast.success('Gráfica generada')
      fetchHistory()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading) return <p>Cargando...</p>
  if (!user) return <LoginCard />

  return (
    <div className="grid-2">
      <div>
        <PolynomialForm onSubmit={handleCreate} loading={submitting} />
        {current && (
          <section className="panel">
            <h2>Resultado</h2>
            <div className="expr-lg"><MathExpr expr={current.expression} block /></div>
            <GraphPlot expression={current.expression} points={current.points} />
          </section>
        )}
      </div>
      <HistoryList items={history} loading={histLoading} error={histError} onRefresh={fetchHistory} />
    </div>
  )
}
