import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { json, urlencoded } from 'express';
import { PolynomialsService } from './polynomials/polynomials.service';
import { DegreesRepository } from './repositories/degrees.repository';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true });
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));
  // Register REST endpoints without parameter decorators to keep JS+Babel simple
  const expressApp = app.getHttpAdapter().getInstance();
  const polyService = app.get(PolynomialsService);
  const degreesRepo = app.get(DegreesRepository);

  expressApp.post('/api/polynomials', async (req, res) => {
    try {
      const result = await polyService.crearPolinomio(req.body);
      res.status(201).json(result);
    } catch (e) {
      const status = e?.status || 400;
      res.status(status).json(e?.response || { message: e.message || 'Error' });
    }
  });

  expressApp.get('/api/users/:authUid/polynomials', async (req, res) => {
    try {
      const { authUid } = req.params;
      const result = await polyService.historialPorUsuario(authUid);
      res.json(result);
    } catch (e) {
      res.status(400).json({ message: e.message || 'Error' });
    }
  });

  expressApp.get('/api/polynomials/:id', async (req, res) => {
    try {
      const result = await polyService.detalleEcuacion(req.params.id);
      if (!result) return res.status(404).json({ message: 'No encontrado' });
      res.json(result);
    } catch (e) {
      res.status(400).json({ message: e.message || 'Error' });
    }
  });
  
  // Listar grados disponibles desde la tabla tbl_grados
  expressApp.get('/api/degrees', async (_req, res) => {
    try {
      const rows = await degreesRepo.listAll();
      res.json(rows);
    } catch (e) {
      res.status(500).json({ message: e.message || 'Error' });
    }
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
