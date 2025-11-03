import { Injectable, Dependencies } from '@nestjs/common';
import { PG_POOL } from '../database/pg.provider';

@Injectable()
@Dependencies(PG_POOL)
export class GraphsRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async insert({ idEcuacion, puntos }) {
    const { rows } = await this.pool.query(
      `INSERT INTO public.tbl_graficas (id_ecuacion, puntos)
       VALUES ($1, $2)
       RETURNING *`,
      [idEcuacion, JSON.stringify(puntos)],
    );
    return rows[0];
  }

  async findByEquationId(idEcuacion) {
    const { rows } = await this.pool.query(
      `SELECT * FROM public.tbl_graficas WHERE id_ecuacion = $1 ORDER BY fecha_generada DESC LIMIT 1`,
      [idEcuacion],
    );
    return rows[0] || null;
  }
}
