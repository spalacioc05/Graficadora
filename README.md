# Graficadora

Aplicación para ingresar ecuaciones polinómicas, generar puntos y graficarlas. Backend en Node.js (Prisma + Supabase storage) y frontend en Next.js.

Quick start (Windows PowerShell):

Backend

```powershell
cd backend
npm install
#$env:DATABASE_URL='postgresql://USER:PASS@HOST:5432/postgres'
npx prisma generate --schema prisma/schema.prisma
npx prisma db push --schema prisma/schema.prisma
node seed.js
node server.js # o npm run api
```

Frontend

```powershell
cd frontend
npm install
npm run dev
# open http://localhost:3000
```

Endpoints principales (backend)
- POST /api/auth/register { email, nombre }
- POST /api/equations { email, degree, coefficients, range }
- GET /api/equations?email=...
- GET /api/graphs/:id
# Graficadora