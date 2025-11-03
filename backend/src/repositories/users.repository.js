import { Injectable, Dependencies } from '@nestjs/common';
import { PG_POOL } from '../database/pg.provider';

@Injectable()
@Dependencies(PG_POOL)
export class UsersRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async getByAuthUid(authUid) {
    const { rows } = await this.pool.query(
      'SELECT * FROM public.tbl_usuarios WHERE auth_uid = $1',
      [authUid],
    );
    return rows[0] || null;
  }

  async upsertUser({ authUid, nombre, correo }) {
    // Upsert by auth_uid
    const { rows } = await this.pool.query(
      `INSERT INTO public.tbl_usuarios (auth_uid, nombre, correo)
       VALUES ($1, $2, $3)
       ON CONFLICT (auth_uid) DO UPDATE SET nombre = EXCLUDED.nombre, correo = COALESCE(EXCLUDED.correo, public.tbl_usuarios.correo)
       RETURNING *`,
      [authUid, nombre ?? null, correo ?? null],
    );
    return rows[0];
  }
}
