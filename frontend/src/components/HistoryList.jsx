import { Link } from 'react-router-dom'
import MathExpr from './MathExpr.jsx'

export default function HistoryList({ items, loading, error, onRefresh }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Historial</h2>
        <button className="btn" onClick={onRefresh} disabled={loading}>Recargar</button>
      </div>
      {loading && <p>Cargando historial...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (!items || items.length === 0) && <p>Sin registros aún.</p>}
      <ul className="list">
        {items?.map((it) => (
          <li key={it.idEcuacion} className="item">
            <div>
              <div className="expr"><MathExpr expr={it.expresion} /></div>
              <div className="meta">Grado: {it.grado ?? '—'} · {new Date(it.fechaCreacion).toLocaleString()}</div>
            </div>
            <Link className="btn" to={`/polynomials/${it.idEcuacion}`}>Ver</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
