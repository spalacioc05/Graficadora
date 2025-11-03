import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../lib/api'

const schema = z.object({
  a5: z.coerce.number().optional(),
  a4: z.coerce.number().optional(),
  a3: z.coerce.number().optional(),
  a2: z.coerce.number().optional(),
  a1: z.coerce.number().optional(),
  a0: z.coerce.number().optional(),
  grado: z.coerce.number().int().min(0).max(5).default(2),
  xMin: z.coerce.number().optional(),
  xMax: z.coerce.number().optional(),
  paso: z.coerce.number().positive().max(10).optional(),
}).refine((v) => {
  const coeffs = [v.a5, v.a4, v.a3, v.a2, v.a1, v.a0].map((n) => (Number.isFinite(n) ? n : 0))
  return coeffs.some((c) => c !== 0)
}, { message: 'Debe ingresar al menos un coeficiente distinto de 0' })
.refine((v) => (v.xMin == null || v.xMax == null) || Number(v.xMax) > Number(v.xMin), { message: 'xMax debe ser mayor a xMin' })

function buildExpression(values) {
  const { a5=0, a4=0, a3=0, a2=0, a1=0, a0=0 } = values
  const terms = []
  const pushTerm = (coef, power) => {
    if (!coef) return
    if (power === 0) return terms.push(`${coef}`)
    if (power === 1) return terms.push(`${coef}*x`)
    terms.push(`${coef}*x^${power}`)
  }
  pushTerm(a5, 5); pushTerm(a4, 4); pushTerm(a3, 3); pushTerm(a2, 2); pushTerm(a1, 1); pushTerm(a0, 0)
  // join with + and normalize `+ -c` into `- c`
  return terms.join(' + ').replace(/\+\s-/g, '- ')
}

export default function PolynomialForm({ onSubmit, loading, useDegreesApi = true }) {
  const [degrees, setDegrees] = useState([])
  const [degLoading, setDegLoading] = useState(false)
  const [degError, setDegError] = useState('')

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    // Paso más denso para curvas suaves por defecto
    defaultValues: { a5: 0, a4: 0, a3: 0, a2: 0, a1: 0, a0: 0, grado: 2, xMin: -10, xMax: 10, paso: 0.02 },
  })

  const grado = Number(watch('grado') ?? 2)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!useDegreesApi) return
      setDegLoading(true)
      setDegError('')
      try {
        const rows = await api.getDegrees()
        if (mounted) setDegrees(rows)
      } catch (e) {
        if (mounted) {
          setDegError(e.message)
          // fallback por si no hay API durante pruebas locales
          setDegrees([{ id_grado: 1, valor: 0 }, { id_grado: 2, valor: 1 }, { id_grado: 3, valor: 2 }, { id_grado: 4, valor: 3 }, { id_grado: 5, valor: 4 }, { id_grado: 6, valor: 5 }])
        }
      } finally {
        if (mounted) setDegLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [useDegreesApi])

  // Al cambiar el grado, forzar a 0 los coeficientes superiores
  useEffect(() => {
    for (let p = 5; p > grado; p--) {
      setValue(`a${p}`, 0)
    }
  }, [grado, setValue])

  const submit = (values) => {
    // Forzar a cero los coeficientes por encima del grado seleccionado
    const g = Number(values.grado ?? 2)
    const coeffs = { ...values }
    for (let p = 5; p > g; p--) {
      coeffs[`a${p}`] = 0
    }
    const expresion = buildExpression(coeffs)
    const rango = { xMin: Number(values.xMin), xMax: Number(values.xMax), paso: Number(values.paso) }
    onSubmit({ expresion, rango })
    reset({ ...values })
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="panel" aria-label="polynomial-form">
      <h2>Ingresar polinomio (grado ≤ 5)</h2>
      <div className="grid">
        <label className="field">
          <span>Grado</span>
          <select {...register('grado')} disabled={degLoading}>
            {(degrees.length ? degrees : [{ valor: 0 }, { valor: 1 }, { valor: 2 }, { valor: 3 }, { valor: 4 }, { valor: 5 }]).map((d) => (
              <option key={d.valor} value={d.valor}>{d.valor}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid">
        {Array.from({ length: grado + 1 }).map((_, idx) => {
          const d = grado - idx
          return (
            <label key={d} className="field">
              <span>Coeficiente a{d}</span>
              <input type="number" step="any" placeholder={`a${d}`} {...register(`a${d}`)} />
            </label>
          )
        })}
      </div>
      <div className="grid">
        <label className="field">
          <span>xMin</span>
          <input type="number" step="any" {...register('xMin')} />
        </label>
        <label className="field">
          <span>xMax</span>
          <input type="number" step="any" {...register('xMax')} />
        </label>
        <label className="field">
          <span>Paso</span>
          <input type="number" step="any" min="0.0001" {...register('paso')} />
        </label>
      </div>
      {errors.root && <p className="error">{errors.root.message}</p>}
      {errors?.message && <p className="error">{errors.message}</p>}
      {Object.values(errors).map((e, i) => e?.message && <p key={i} className="error">{e.message}</p>)}
      <div className="actions">
        <button className="btn primary" disabled={loading} type="submit">{loading ? 'Procesando...' : 'Generar gráfica'}</button>
      </div>
    </form>
  )
}

export { buildExpression }
