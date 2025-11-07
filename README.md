# Graficadora · Polinomios hasta grado 5

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-563D7C?logo=vite&logoColor=FFD62E&labelColor=242938)
![Plotly](https://img.shields.io/badge/Plotly.js-3B4D61?logo=plotly&logoColor=white)
![KaTeX](https://img.shields.io/badge/KaTeX-1572B6?logo=latex&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3068B7?logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

Aplicación completa para ingresar polinomios de una variable (x) con grado ≤ 5, calcular puntos de la función y graficarlos. Mantiene historial por usuario y permite ver detalle, editar perfil, y borrar elementos del historial (uno, varios o vaciar todo).

## ¿Cómo funciona? (visión lógica)

1) El usuario ingresa un polinomio (por ejemplo: `-4x^5 + 6x^4 + 7x^2 - 2`).
2) El frontend lo muestra en notación bonita con KaTeX y envía la expresión al backend.
3) El backend valida, calcula el grado y genera puntos evaluando la función en un rango.
4) Se guarda el registro en base de datos y se devuelve la gráfica al cliente.
5) El frontend dibuja la curva con Plotly y actualiza el historial del usuario.

Mermaid (flujo simplificado):

```mermaid
sequenceDiagram
		participant UI as Frontend (React)
		participant API as Backend (NestJS)
		participant DB as PostgreSQL

		UI->>UI: Formatea y previsualiza con KaTeX
		UI->>API: POST /api/polynomials {authUid, expresion, rango}
		API->>API: Valida (Zod) y calcula grado (Math.js)
		API->>DB: Inserta usuario/ecuación/gráfica
		DB-->>API: OK (ids + timestamps)
		API-->>UI: {expresion, puntos, grado, ids}
		UI->>UI: Grafica puntos con Plotly y actualiza historial
```

## Arquitectura y tecnologías

- Frontend: React + Vite
	- Visualización: Plotly.js (curvas, responsive)
	- Matemáticas en pantalla: KaTeX (via `react-katex`)
	- Estado de autenticación: Supabase Auth (OAuth Google u otros)
	- UI/UX: Headless UI para modales y transiciones; estilos propios (CSS)
	- Pruebas: Vitest + Testing Library

- Backend: NestJS (JavaScript) sobre Node.js
	- Rutas REST expresadas con el adaptador Express para simplicidad
	- Validación: Zod (`createPolynomialSchema`)
	- Cálculos: Math.js (parse/evaluate) para grado y evaluación de puntos
	- Persistencia: PostgreSQL (driver `pg`)

## Flujo de datos (detalle)

- Entrada del usuario (frontend):
	- Expresión textual del polinomio. Soporta:
		- `x^n` (caret) p.ej. `3*x^2 - 2*x + 1`
		- Forma “implícita” `x5` (frontend la transforma a LaTeX `x^{5}` para mostrar)
	- Rango opcional: `{ xMin, xMax, paso }`
	- Identidad del usuario (`authUid`) provista por Supabase Auth

- Backend procesa:
	- Zod valida el payload: `authUid`, `expresion` obligatorios; `rango` opcional
	- Calcula grado (con `math.js`) y aplica límite: grado ≤ 5 (si no, 400)
	- Asegura el usuario (upsert por `authUid`)
	- Inserta ecuación y genera puntos con `generarPuntos` evaluando `y = f(x)` en el rango
	- Inserta la “gráfica” guardando `puntos` (JSON) para auditoría/detalle

- Respuesta típica (creación):

```jsonc
{
	"idEcuacion": 123,
	"idGrafica": 456,
	"expresion": "-4x^5 + 6x^4 + 7x^2 - 2",
	"grado": 5,
	"puntos": [
		{ "x": -10, "y": 40118 },
		{ "x": -9.5, "y": 29945.3 },
		// ...
	],
	"fechaCreacion": "2025-11-02T23:12:34.567Z"
}
```

- Frontend grafica con Plotly y actualiza el historial del usuario con la nueva entrada.

## API REST

Base: `http://localhost:3000`

- Health
	- GET `/health`
	- GET `/health/db`

- Polinomios
	- POST `/api/polynomials`
		- Body:
			```jsonc
			{
				"authUid": "uuid-de-supabase",
				"nombre": "(opcional)",
				"correo": "(opcional)",
				"expresion": "3*x^2 - 2*x + 1",
				"rango": { "xMin": -10, "xMax": 10, "paso": 1 }
			}
			```
		- Respuesta: objeto con `idEcuacion`, `idGrafica`, `expresion`, `grado`, `puntos[]`, `fechaCreacion`

	- GET `/api/users/:authUid/polynomials` (Historial del usuario)
		- Respuesta:
			```jsonc
			[
				{
					"idEcuacion": 123,
					"expresion": "x^2 + 1",
					"grado": 2,
					"fechaCreacion": "2025-11-02T21:00:00.000Z",
					"idGrafica": 456,
					"fechaGrafica": "2025-11-02T21:00:00.000Z"
				}
			]
			```

	- GET `/api/polynomials/:id` (Detalle)
		- Respuesta: `{ idEcuacion, expresion, idUsuario, idGrado, fechaCreacion, puntos?, idGrafica?, fechaGrafica? }`

- Gestión de historial (borrado)
	- DELETE `/api/polynomials/:id?authUid=:uid` → borra una ecuación del usuario
	- POST `/api/polynomials/bulk-delete` → borra varias
		- Body: `{ "authUid": "...", "ids": [123, 456, ...] }`
	- DELETE `/api/users/:authUid/polynomials` → vacía todo el historial del usuario

Nota: El backend siempre limita operaciones de borrado al `authUid` propietario.

## Base de datos (PostgreSQL)

Tablas utilizadas (nombres deducidos de consultas):

- `public.tbl_usuarios`
	- `id_usuario` (PK)
	- `auth_uid` (UNIQUE) – referencia del usuario en Supabase
	- `nombre` (opcional), `correo` (opcional)

- `public.tbl_grados`
	- `id_grado` (PK)
	- `valor` (int) – grado del polinomio

- `public.tbl_ecuaciones`
	- `id_ecuacion` (PK)
	- `id_usuario` (FK → tbl_usuarios)
	- `id_grado` (FK → tbl_grados)
	- `expresion` (texto)
	- `fecha_creacion` (timestamp)

- `public.tbl_graficas`
	- `id_grafica` (PK)
	- `id_ecuacion` (FK → tbl_ecuaciones)
	- `puntos` (JSON) – arreglo de `{ x, y }`
	- `fecha_generada` (timestamp)

Diagrama (Mermaid ER):

```mermaid
erDiagram
	tbl_usuarios ||--o{ tbl_ecuaciones : tiene
	tbl_grados ||--o{ tbl_ecuaciones : clasifica
	tbl_ecuaciones ||--o{ tbl_graficas : genera

	tbl_usuarios {
		int id_usuario PK
		text auth_uid UNIQUE
		text nombre
		text correo
	}
	tbl_grados {
		int id_grado PK
		int valor
	}
	tbl_ecuaciones {
		int id_ecuacion PK
		int id_usuario FK
		int id_grado FK
		text expresion
		timestamptz fecha_creacion
	}
	tbl_graficas {
		int id_grafica PK
		int id_ecuacion FK
		jsonb puntos
		timestamptz fecha_generada
	}
```

## Lógica de cálculo (Backend)

- Validación (Zod): estructura del payload, longitud de `expresion`, etc.
- Grado: `calcularGrado()` usa `math.js` para analizar la expresión y detectar el mayor exponente de `x`.
- Puntos: `generarPuntos()` evalúa `y = f(x)` con `math.js` sobre `[xMin, xMax]` usando `paso`. Los resultados se almacenan como una lista de pares `{ x, y }` en JSON.
- Límite de grado: si el grado > 5, se responde con 400.

## Render matemático (Frontend)

- `exprToLatex(expr)` transforma expresiones simples a LaTeX (quita `*`, convierte `x^n` y también la forma `x5` → `x^{5}`) para mostrarlas con KaTeX.
- `MathExpr` usa `react-katex` para renderizar inline o en bloque.
- `GraphPlot` usa Plotly.js para graficar los puntos `{x, y}` devueltos por el backend.

## Autenticación y perfil

- Autenticación con Supabase: `useAuth()` gestiona sesión, login OAuth y logout.
- Perfil: menú con avatar (iniciales), vista de perfil `/profile` para editar nombre mostrado (se guarda en `user_metadata.full_name`).

## Historial del usuario

- Lista de ecuaciones con fecha y grado.
- Acciones:
	- Ver detalle de una ecuación.
	- Eliminar una ecuación.
	- Seleccionar varias y eliminar en lote.
	- Vaciar todo el historial.
- Confirmaciones con un modal (Headless UI) y toasts de feedback.

## Requisitos

- Node 18+
- PostgreSQL (o Supabase) – configure `DATABASE_URL`

## Configuración y arranque (Windows PowerShell)

Backend

```powershell
cd backend
npm install
# Cree backend/.env (ejemplo):
# PORT=3000
# DATABASE_URL=postgresql://USER:PASS@HOST:5432/DB?sslmode=require
npm run start
# API en http://localhost:3000
```

Frontend (local)

```powershell
cd ../frontend
npm install
Copy-Item .env.example .env -Force
# Edite .env si desea apuntar a otro backend o habilitar Supabase:
# VITE_BACKEND_URL=http://localhost:3000
# VITE_SUPABASE_URL=https://<your-project>.supabase.co
# VITE_SUPABASE_ANON_KEY=<your-anon-key>
npm run dev
# UI en http://localhost:5173
```

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

## Buenas prácticas aplicadas

- Validación fuerte con Zod antes de procesar.
- Separación de responsabilidades: servicios, repositorios, control de HTTP.
- Uso de `math.js` para parse/evaluate en vez de evaluar cadenas manualmente.
- CORS habilitado para desarrollo.
- UI reactiva con confirmaciones accesibles (Headless UI) y feedback visual (toasts).
- Tests de frontend con Vitest.

## Resolución de problemas

- 404/500 desde el frontend: verifique `VITE_BACKEND_URL` en `frontend/.env` y que el backend esté ejecutándose.
- Error de autenticación: asegure `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` o implemente un flujo de demo si aplica.
- Grado excedido: el backend rechaza polinomios con grado > 5 (ajuste la expresión).

---

Hecho con ❤️ usando React, NestJS, PostgreSQL y un toque de KaTeX/Plotly.

## Despliegue (Producción)

### Backend en Render

1. Conecta tu repositorio en Render y selecciona el directorio `backend`.
2. Usa el archivo `render.yaml` del repositorio para configuración automática (opcional). Si lo usas:
	- Render detectará: build `npm install --include=dev`, start `npm start`.
3. Variables de entorno reales:
	- `DATABASE_URL` (cadena PostgreSQL real)
	- `PORT` (Render asigna una; si pones 3000 concuerda con local, pero Render la sobrescribe internamente)
4. Health check: `/health`.
5. Obtén la URL pública (ej. `https://graficadora-backend.onrender.com`).

### Frontend en Vercel

Se incluye `frontend/vercel.json` para construir el frontend desde su propia carpeta (Root Directory = `frontend`).

- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Rewrites: todas las rutas → `index.html` (SPA)

Variables de entorno en Vercel (Production):

```
VITE_BACKEND_URL=https://graficadora-backend.onrender.com
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<clave-anon-real>
```

Tras cada push a `main`, Vercel construirá y publicará la última versión del frontend apuntando al backend en Render.

### Supabase Auth (si usas OAuth)
- En el panel de Supabase → Authentication → URL de redirección: añade tu dominio Vercel (ej. `https://tu-app.vercel.app`).
- Ajusta callback si usas `SUPABASE_AUTH_CALLBACK_URL` en el backend.

### Verificación rápida post-deploy

1. Accede a la URL Vercel, abre DevTools → Network y verifica llamadas a `/api/polynomials` apuntan al dominio Render.
2. Crea un polinomio y confirma que se guarda y grafica.
3. Revisa `/health` del backend para asegurar estado OK.
4. Prueba eliminar elementos del historial (single/multi/vaciar).

### Siguientes mejoras opcionales
- Build backend sin babel-node (transpilación a `dist/`).
- Rate limiting (p.ej. `express-rate-limit`) para proteger el POST.
- Monitoreo: Sentry o Logflare.
- CORS restringido solo a tu dominio de producción.
- CD/CI: GitHub Actions para lint/test antes de deploy.
