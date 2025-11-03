import { Injectable, Dependencies } from '@nestjs/common';
import { PG_POOL } from '../database/pg.provider';

@Injectable()
@Dependencies(PG_POOL)
export class DegreesRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async getByValue(value) {
    const { rows } = await this.pool.query('SELECT * FROM public.tbl_grados WHERE valor = $1', [value]);
    return rows[0] || null;
  }

  async listAll() {
    const { rows } = await this.pool.query('SELECT * FROM public.tbl_grados ORDER BY valor ASC');
    return rows;
  }

  async ensureDegree(value) {
    const existing = await this.getByValue(value);
    if (existing) return existing;
    const { rows } = await this.pool.query(
      'INSERT INTO public.tbl_grados (valor, descripcion) VALUES ($1, $2) RETURNING *',
      [value, `Grado ${value}`],
    );
    return rows[0];
  }
}
