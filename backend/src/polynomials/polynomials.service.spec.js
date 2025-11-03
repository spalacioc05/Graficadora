import { PolynomialsService } from './polynomials.service';

const mockUsersRepo = {
  upsertUser: jest.fn(async ({ authUid }) => ({ id_usuario: 1, auth_uid: authUid })),
};
const mockDegreesRepo = {
  ensureDegree: jest.fn(async (g) => ({ id_grado: g, valor: g })),
};
const mockEquationsRepo = {
  insert: jest.fn(async ({ expresion }) => ({ id_ecuacion: 10, expresion, fecha_creacion: new Date().toISOString() })),
  findById: jest.fn(async (id) => (id === 10 ? { id_ecuacion: 10, id_usuario: 1, id_grado: 2, expresion: 'x^2' } : null)),
  findHistoryByAuthUid: jest.fn(async () => [
    { id_ecuacion: 10, expresion: 'x^2', fecha_creacion: new Date().toISOString(), grado: 2, id_grafica: 20, fecha_generada: new Date().toISOString() },
  ]),
};
const mockGraphsRepo = {
  insert: jest.fn(async ({ idEcuacion, puntos }) => ({ id_grafica: 20, id_ecuacion: idEcuacion, puntos })),
  findByEquationId: jest.fn(async (id) => (id === 10 ? { id_grafica: 20, id_ecuacion: 10, puntos: [{ x: 0, y: 0 }] } : null)),
};

describe('PolynomialsService', () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PolynomialsService(mockUsersRepo, mockDegreesRepo, mockEquationsRepo, mockGraphsRepo);
  });

  it('crea polinomio válido', async () => {
    const res = await service.crearPolinomio({ authUid: '00000000-0000-0000-0000-000000000001', expresion: 'x^2 + 1' });
    expect(res.idEcuacion).toBe(10);
    expect(res.idGrafica).toBe(20);
    expect(res.puntos.length).toBeGreaterThan(0);
  });

  it('rechaza grado mayor a 5', async () => {
    await expect(service.crearPolinomio({ authUid: '00000000-0000-0000-0000-000000000001', expresion: 'x^6' })).rejects.toThrow();
  });

  it('historial por usuario', async () => {
    const rows = await service.historialPorUsuario('00000000-0000-0000-0000-000000000001');
    expect(rows[0].idEcuacion).toBe(10);
  });

  it('detalle ecuación', async () => {
    const d = await service.detalleEcuacion(10);
    expect(d.idGrafica).toBe(20);
    const none = await service.detalleEcuacion(999);
    expect(none).toBeNull();
  });
  
  it('rechaza payload inválido', async () => {
    await expect(service.crearPolinomio({})).rejects.toBeTruthy();
  });
});
