import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import GraphPlot from '../components/GraphPlot.jsx'
import MathExpr from '../components/MathExpr.jsx'

export default function DetailPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    api.getDetail(id)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Cargando detalle...</p>
  if (error) return <p className="error">{error}</p>
  if (!data) return <p>No encontrado.</p>

  return (
    <section className="panel">
      <h2>Detalle del polinomio</h2>
      <div className="expr-lg"><MathExpr expr={data.expresion} block /></div>
      <GraphPlot expression={data.expresion} points={data.puntos || []} />
      <div className="meta">Creado: {new Date(data.fechaCreacion).toLocaleString()}</div>
    </section>
  )
}
