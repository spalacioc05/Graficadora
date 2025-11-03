import { z } from 'zod';

export const createPolynomialSchema = z.object({
  authUid: z.string().uuid(),
  nombre: z.string().min(1).optional(),
  correo: z.string().email().optional(),
  expresion: z.string().min(1, 'La expresión es requerida').max(500),
  rango: z
    .object({
      xMin: z.number().finite().optional(),
      xMax: z.number().finite().optional(),
      paso: z.number().positive().max(10).optional(),
    })
    .optional(),
});

export const getHistorySchema = z.object({ authUid: z.string().uuid() });
