import { Injectable, Dependencies, BadRequestException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { DegreesRepository } from '../repositories/degrees.repository';
import { EquationsRepository } from '../repositories/equations.repository';
import { GraphsRepository } from '../repositories/graphs.repository';
import { createPolynomialSchema } from './polynomials.validation';
import { calcularGrado, generarPuntos } from './polynomials.math';

@Injectable()
@Dependencies(UsersRepository, DegreesRepository, EquationsRepository, GraphsRepository)
export class PolynomialsService {
  constructor(usersRepo, degreesRepo, equationsRepo, graphsRepo) {
    this.usersRepo = usersRepo;
    this.degreesRepo = degreesRepo;
    this.equationsRepo = equationsRepo;
    this.graphsRepo = graphsRepo;
  }

  async crearPolinomio(payload) {
    // Validación
    const parse = createPolynomialSchema.safeParse(payload);
    if (!parse.success) {
      throw new BadRequestException({ message: 'Datos inválidos', issues: parse.error.issues });
    }
    const { authUid, nombre, correo, expresion, rango } = parse.data;

    // Calcular grado y validar límite
    const grado = calcularGrado(expresion);
    if (grado > 5) {
      throw new BadRequestException('El polinomio excede el grado máximo permitido (5)');
    }

    // Asegurar usuario
    const user = await this.usersRepo.upsertUser({ authUid, nombre, correo });

    // Asegurar grado
    const gradoRow = await this.degreesRepo.ensureDegree(grado);

    // Guardar ecuación
    const ecuacion = await this.equationsRepo.insert({ idUsuario: user.id_usuario, idGrado: gradoRow.id_grado, expresion });

    // Generar puntos y guardar gráfica
    const puntos = generarPuntos(expresion, rango);
    const grafica = await this.graphsRepo.insert({ idEcuacion: ecuacion.id_ecuacion, puntos });

    return {
      idEcuacion: ecuacion.id_ecuacion,
      idGrafica: grafica.id_grafica,
      expresion,
      grado,
      puntos,
      fechaCreacion: ecuacion.fecha_creacion,
    };
  }

  async historialPorUsuario(authUid) {
    if (!authUid) throw new BadRequestException('authUid requerido');
    const rows = await this.equationsRepo.findHistoryByAuthUid(authUid);
    return rows.map((r) => ({
      idEcuacion: r.id_ecuacion,
      expresion: r.expresion,
      grado: r.grado,
      fechaCreacion: r.fecha_creacion,
      idGrafica: r.id_grafica || null,
      fechaGrafica: r.fecha_generada || null,
    }));
  }

  async detalleEcuacion(idEcuacion) {
    const eq = await this.equationsRepo.findById(Number(idEcuacion));
    if (!eq) return null;
    const graf = await this.graphsRepo.findByEquationId(eq.id_ecuacion);
    return {
      idEcuacion: eq.id_ecuacion,
      expresion: eq.expresion,
      idUsuario: eq.id_usuario,
      idGrado: eq.id_grado,
      fechaCreacion: eq.fecha_creacion,
      puntos: graf?.puntos || null,
      idGrafica: graf?.id_grafica || null,
      fechaGrafica: graf?.fecha_generada || null,
    };
  }

  async eliminarEcuacion(authUid, idEcuacion) {
    if (!authUid || !idEcuacion) throw new BadRequestException('Parámetros requeridos');
    // Delete dependent graphs, then equation (scoped to user)
    const ids = [Number(idEcuacion)];
    await this.graphsRepo.deleteByEquationIds(ids);
    const deleted = await this.equationsRepo.deleteByIdsForAuthUid(ids, authUid);
    return { deletedIds: deleted };
  }

  async eliminarVarias(authUid, ids) {
    if (!authUid || !Array.isArray(ids)) throw new BadRequestException('Parámetros requeridos');
    const norm = ids.map((n) => Number(n)).filter((n) => Number.isFinite(n));
    if (norm.length === 0) return { deletedIds: [] };
    await this.graphsRepo.deleteByEquationIds(norm);
    const deleted = await this.equationsRepo.deleteByIdsForAuthUid(norm, authUid);
    return { deletedIds: deleted };
  }

  async limpiarHistorial(authUid) {
    if (!authUid) throw new BadRequestException('authUid requerido');
    const ids = await this.equationsRepo.findIdsByAuthUid(authUid);
    if (ids.length === 0) return { deletedIds: [] };
    await this.graphsRepo.deleteByEquationIds(ids);
    const deleted = await this.equationsRepo.deleteByIdsForAuthUid(ids, authUid);
    return { deletedIds: deleted };
  }
}
