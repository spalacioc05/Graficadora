# Backend API – Graficadora

API en NestJS (JavaScript) para recibir polinomios, generar puntos de gráfica, guardar y consultar historial por usuario. Pensado para producción con separación por capas y validación robusta.

## Variables de entorno

Cree un archivo `.env` en `backend/` con:

```
PORT=3000
DATABASE_URL=postgresql://<usuario>:<password>@<host>:<puerto>/<db>
```

Para Supabase, use el connection string provisto por su proyecto (se recomienda habilitar SSL). Este proyecto configura SSL `rejectUnauthorized=false` por defecto.

## Instalación

```bash
npm install
```

## Correr la app

```bash
# desarrollo
npm run start

# modo watch
npm run start:dev
```

La API se expone por defecto en `http://localhost:3000`.

## Endpoints

- GET `/` – Ping básico (Hello World)
- GET `/health` – Health check (status ok)
 - GET `/health` – Health check (status ok)
 - GET `/health/db` – Verifica conexión a la base de datos (SELECT 1)
- POST `/api/polynomials` – Crea polinomio, genera y guarda puntos
	- Body: `{ authUid: uuid, nombre?: string, correo?: string, expresion: string, rango?: { xMin?: number, xMax?: number, paso?: number } }`
- GET `/api/users/:authUid/polynomials` – Historial del usuario
- GET `/api/polynomials/:id` – Detalle de un polinomio (incluye puntos más recientes)

Notas:
- Se valida que el grado máximo permitido sea 5 (derivado desde la expresión con AST).
- Rango por defecto: x ∈ [-10, 10], paso 0.5 (configurable en `rango`).

## Pruebas

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# cobertura
npm run test:cov
```

Las unit tests validan: inserción de polinomio, generación de puntos, historial/detalle y manejo de datos inválidos. El e2e prueba el endpoint de health.

