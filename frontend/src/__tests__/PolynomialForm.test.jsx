import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { test, expect, vi } from 'vitest'
import PolynomialForm, { buildExpression } from '../components/PolynomialForm.jsx'

test('buildExpression joins terms correctly', () => {
  const expr = buildExpression({ a2: 3, a1: -2, a0: 1 })
  expect(expr).toContain('3*x^2')
  expect(expr).toContain('- 2*x')
  expect(expr).toContain('1')
})

test('submits with coefficients and range', async () => {
  const onSubmit = vi.fn()
  render(<PolynomialForm onSubmit={onSubmit} loading={false} />)
  fireEvent.change(screen.getByLabelText(/Coeficiente a2/i), { target: { value: '3' } })
  fireEvent.change(screen.getByLabelText(/Coeficiente a1/i), { target: { value: '-2' } })
  fireEvent.change(screen.getByLabelText(/Coeficiente a0/i), { target: { value: '1' } })
  fireEvent.change(screen.getByLabelText(/xMin/i), { target: { value: '-1' } })
  fireEvent.change(screen.getByLabelText(/xMax/i), { target: { value: '1' } })
  fireEvent.change(screen.getByLabelText(/Paso/i), { target: { value: '1' } })
  fireEvent.click(screen.getByRole('button', { name: /generar gráfica/i }))
  await waitFor(() => expect(onSubmit).toHaveBeenCalled())
})
