# Frontend – Graficadora (React + Vite)

Interfaz para ingresar polinomios (grado ≤ 5), enviarlos al backend, graficar los puntos y consultar historial y detalle. Incluye login con Google vía Supabase (o modo demo sin credenciales).

## Requisitos

- Node 18+
- Backend corriendo en `http://localhost:3000` (ver carpeta `backend/`)

## Variables de entorno

Copie `.env.example` a `.env` y ajuste si es necesario:

```
VITE_BACKEND_URL=http://localhost:3000
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Si no define las variables de Supabase, la app mostrará un botón de “Iniciar sesión (demo)” que crea un usuario ficticio para pruebas locales.

## Ejecutar en desarrollo

```powershell
cd frontend
npm install
npm run dev
# Abra http://localhost:5173
```

## Pruebas

```powershell
npm test          # watch
npm run test:run  # una sola vez
```

## Estructura principal

- `src/context/AuthContext.jsx`: Autenticación (Supabase o demo)
- `src/lib/api.js`: Cliente HTTP hacia el backend (`/api/polynomials`, historial y detalle)
- `src/components/PolynomialForm.jsx`: Formulario de coeficientes y rango
- `src/components/GraphPlot.jsx`: Gráfica (Plotly)
- `src/components/HistoryList.jsx`: Historial de polinomios del usuario
- `src/pages/Dashboard.jsx`: Flujo principal (crear y ver resultado + historial)
- `src/pages/Detail.jsx`: Detalle de un polinomio

## Notas

- La variable `VITE_BACKEND_URL` debe apuntar al backend NestJS. Por defecto `http://localhost:3000`.
- El formulario valida mínimo un coeficiente distinto de 0, y que `xMax > xMin` cuando ambos están definidos.
- Las pruebas mockean Plotly para evitar dependencias de canvas en JSDOM.
