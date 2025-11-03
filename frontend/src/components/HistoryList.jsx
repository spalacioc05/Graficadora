import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MathExpr from './MathExpr.jsx'
import { api } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { toast } from 'sonner'
import ConfirmDialog from './ConfirmDialog.jsx'

export default function HistoryList({ items, loading, error, onRefresh }) {
  const { user } = useAuth()
  const authUid = user?.id
  const [visible, setVisible] = useState(10)
  const [selected, setSelected] = useState(new Set())
  const [confirm, setConfirm] = useState({ open: false, type: null, payload: null })
  // Asegurar orden (ya viene DESC desde API); por si acaso, ordenamos aquí también
  const ordered = useMemo(() => (items || []).slice().sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)), [items])
  const slice = ordered.slice(0, visible)
  const hasMore = ordered.length > slice.length

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const requestDeleteOne = (id) => setConfirm({ open: true, type: 'single', payload: id })

  const requestDeleteSelected = () => setConfirm({ open: true, type: 'multi', payload: null })

  const requestClearAll = () => setConfirm({ open: true, type: 'clear', payload: null })

  const performConfirm = async () => {
    if (!authUid) return
    const { type, payload } = confirm
    try {
      if (type === 'single') {
        await api.deletePolynomial(payload, authUid)
        toast.success('Ecuación eliminada')
      } else if (type === 'multi') {
        if (selected.size === 0) return
        await api.bulkDeletePolynomials(authUid, Array.from(selected))
        toast.success('Ecuaciones eliminadas')
        setSelected(new Set())
      } else if (type === 'clear') {
        await api.clearHistory(authUid)
        toast.success('Historial vaciado')
        setSelected(new Set())
      }
      onRefresh && onRefresh()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setConfirm({ open: false, type: null, payload: null })
    }
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Historial</h2>
        <div className="actions">
          {selected.size > 0 && (
            <button className="btn danger" onClick={requestDeleteSelected} disabled={loading}>Eliminar seleccionadas ({selected.size})</button>
          )}
          {ordered.length > 0 && (
            <button className="btn danger" onClick={requestClearAll} disabled={loading}>Vaciar todo</button>
          )}
          <button className="btn" onClick={onRefresh} disabled={loading}>Recargar</button>
        </div>
      </div>
      {loading && <p>Cargando historial...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (!ordered || ordered.length === 0) && <p>Sin registros aún.</p>}
      <ul className="list">
        {slice.map((it) => {
          const checked = selected.has(it.idEcuacion)
          return (
            <li key={it.idEcuacion} className="item">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" checked={checked} onChange={() => toggleSelect(it.idEcuacion)} />
                <div>
                  <div className="expr"><MathExpr expr={it.expresion} /></div>
                  <div className="meta">Grado: {it.grado ?? '—'} · {new Date(it.fechaCreacion).toLocaleString()}</div>
                </div>
              </div>
              <div className="actions">
                <Link className="btn" to={`/polynomials/${it.idEcuacion}`}>Ver</Link>
                <button className="btn danger" onClick={() => requestDeleteOne(it.idEcuacion)}>Eliminar</button>
              </div>
            </li>
          )
        })}
      </ul>
      {hasMore && (
        <div className="actions" style={{ justifyContent: 'center' }}>
          <button className="btn" onClick={() => setVisible((v) => v + 10)}>Ver más</button>
        </div>
      )}
      <ConfirmDialog
        open={confirm.open}
        title={confirm.type === 'single' ? 'Eliminar ecuación' : confirm.type === 'multi' ? 'Eliminar seleccionadas' : 'Vaciar historial'}
        description={
          confirm.type === 'single'
            ? '¿Eliminar esta ecuación del historial?'
            : confirm.type === 'multi'
            ? `¿Eliminar ${selected.size} ecuación(es) del historial?`
            : '¿Vaciar todo el historial? Esta acción no se puede deshacer.'
        }
        confirmLabel={confirm.type === 'clear' ? 'Vaciar' : 'Eliminar'}
        onCancel={() => setConfirm({ open: false, type: null, payload: null })}
        onConfirm={performConfirm}
      />
    </section>
  )
}
