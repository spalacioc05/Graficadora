import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, test, expect } from 'vitest'
import App from '../App.jsx'
import { AuthProvider } from '../context/AuthContext.jsx'

const fakeUser = { id: '00000000-0000-0000-0000-000000000001', email: 'demo@example.com', user_metadata: { full_name: 'Demo' } }

vi.mock('../context/AuthContext.jsx', async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...mod,
    useAuth: () => ({ user: fakeUser, loading: false, signInWithGoogle: vi.fn(), signOut: vi.fn(), isDevAuth: true }),
    AuthProvider: ({ children }) => children,
  }
})

vi.mock('../lib/api.js', () => ({
  api: {
    createPolynomial: vi.fn(async () => ({ expresion: 'x', puntos: [{ x: 0, y: 0 }, { x: 1, y: 1 }] })),
    getHistory: vi.fn(async () => []),
    getDetail: vi.fn(async () => ({ expresion: 'x', puntos: [{ x: 0, y: 0 }] })),
  },
}))

test('submitting the form triggers API and shows graph', async () => {
  render(<AuthProvider><App /></AuthProvider>)
  fireEvent.change(screen.getByLabelText(/Coeficiente a1/i), { target: { value: '1' } })
  fireEvent.click(screen.getByRole('button', { name: /generar gráfica/i }))
  await waitFor(() => expect(screen.getByLabelText('graph')).toBeInTheDocument())
})
