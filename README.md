# Graficadora

App completa para ingresar polinomios (grado ≤ 5), generar sus puntos y graficar, guardando historial por usuario.

- Backend: NestJS (JavaScript) + Postgres (pg). Validación con Zod y evaluación con Math.js.
- Frontend: React + Vite. Gráficas con Plotly, login con Supabase (o modo demo) y pruebas con Vitest.

## Requisitos

- Node 18+
- Base de datos Postgres (por ejemplo, Supabase). Configure `DATABASE_URL` en `backend/.env`.

## Arranque rápido (Windows PowerShell)

Backend

```powershell
cd backend
npm install
# Configure .env (PORT y DATABASE_URL). Ejemplo:
# Set-Content -Path .env -Value "PORT=3000`nDATABASE_URL=postgresql://USER:PASS@HOST:5432/DB?sslmode=require"
npm run start
# API en http://localhost:3000
```

Frontend

```powershell
cd ../frontend
npm install
Copy-Item .env.example .env -Force
# Opcional: edite .env para VITE_BACKEND_URL y/o credenciales de Supabase
npm run dev
# UI en http://localhost:5173
```

## Endpoints (backend)

- GET `/health` y `/health/db`
- POST `/api/polynomials` – Body:
	`{ authUid: uuid, nombre?: string, correo?: string, expresion: string, rango?: { xMin?: number, xMax?: number, paso?: number } }`
- GET `/api/users/:authUid/polynomials` – Historial
- GET `/api/polynomials/:id` – Detalle (con puntos guardados)

Notas:
- Se limita el grado a 5 (derivado de la expresión). Si excede, retorna 400.
- CORS habilitado para desarrollo.

## Pruebas

Backend

```powershell
cd backend
npm test       # unit
npm run test:e2e
```

Frontend

```powershell
cd frontend
npm run test:run
```

## Problemas comunes

- 404/500 desde el frontend: verifique `VITE_BACKEND_URL` en `frontend/.env` y que el backend corra en ese puerto.
- Error de autenticación: si no configura Supabase, use el botón “Iniciar sesión (demo)”.

del backend

NODE_ENV=development
PORT=3000

# PostgreSQL connection string (Supabase)
DATABASE_URL=postgresql://postgres.jgwbcymgbjigssgxdeii:casolopera05@aws-1-us-east-2.pooler.supabase.com:5432/postgres

# OAuth callback URL (Supabase Auth)
SUPABASE_AUTH_CALLBACK_URL=https://jgwbcymgbjigssgxdeii.supabase.co/auth/v1/callback

del frontend
# URL del backend (Nest)
VITE_BACKEND_URL=http://localhost:3000

# Supabase (requerido para login con Google)
VITE_SUPABASE_URL=https://jgwbcymgbjigssgxdeii.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impnd2JjeW1nYmppZ3NzZ3hkZWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MDkyMzcsImV4cCI6MjA3NzI4NTIzN30.AzRNiqMFP0IuZ_PScgq7eqdgqjDJUPwcDJ3p_1zUhnw
