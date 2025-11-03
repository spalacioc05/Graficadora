import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MathExpr from './MathExpr.jsx'

export default function HistoryList({ items, loading, error, onRefresh }) {
  const [visible, setVisible] = useState(10)
  // Asegurar orden (ya viene DESC desde API); por si acaso, ordenamos aquí también
  const ordered = useMemo(() => (items || []).slice().sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)), [items])
  const slice = ordered.slice(0, visible)
  const hasMore = ordered.length > slice.length

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Historial</h2>
        <button className="btn" onClick={onRefresh} disabled={loading}>Recargar</button>
      </div>
      {loading && <p>Cargando historial...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (!ordered || ordered.length === 0) && <p>Sin registros aún.</p>}
      <ul className="list">
        {slice.map((it) => (
          <li key={it.idEcuacion} className="item">
            <div>
              <div className="expr"><MathExpr expr={it.expresion} /></div>
              <div className="meta">Grado: {it.grado ?? '—'} · {new Date(it.fechaCreacion).toLocaleString()}</div>
            </div>
            <Link className="btn" to={`/polynomials/${it.idEcuacion}`}>Ver</Link>
          </li>
        ))}
      </ul>
      {hasMore && (
        <div className="actions" style={{ justifyContent: 'center' }}>
          <button className="btn" onClick={() => setVisible((v) => v + 10)}>Ver más</button>
        </div>
      )}
    </section>
  )
}
