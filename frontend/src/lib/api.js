const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

async function http(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const contentType = res.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await res.json() : await res.text()
  if (!res.ok) {
    const message = typeof data === 'string' ? data : data?.message || 'Error en la petición'
    const error = new Error(message)
    error.status = res.status
    error.data = data
    throw error
  }
  return data
}

export const api = {
  createPolynomial: (payload) => http('POST', '/api/polynomials', payload),
  getHistory: (authUid) => http('GET', `/api/users/${authUid}/polynomials`),
  getDetail: (id) => http('GET', `/api/polynomials/${id}`),
  getDegrees: () => http('GET', '/api/degrees'),
  deletePolynomial: (id, authUid) => http('DELETE', `/api/polynomials/${id}?authUid=${encodeURIComponent(authUid)}`),
  bulkDeletePolynomials: (authUid, ids) => http('POST', '/api/polynomials/bulk-delete', { authUid, ids }),
  clearHistory: (authUid) => http('DELETE', `/api/users/${authUid}/polynomials`),
}
