import { Injectable, Dependencies } from '@nestjs/common';
import { PG_POOL } from '../database/pg.provider';

@Injectable()
@Dependencies(PG_POOL)
export class EquationsRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async insert({ idUsuario, idGrado, expresion }) {
    const { rows } = await this.pool.query(
      `INSERT INTO public.tbl_ecuaciones (id_usuario, id_grado, expresion)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [idUsuario, idGrado, expresion],
    );
    return rows[0];
  }

  async findById(idEcuacion) {
    const { rows } = await this.pool.query('SELECT * FROM public.tbl_ecuaciones WHERE id_ecuacion = $1', [idEcuacion]);
    return rows[0] || null;
  }

  async findHistoryByAuthUid(authUid) {
    const { rows } = await this.pool.query(
      `SELECT e.*, g.id_grafica, g.fecha_generada, gr.valor as grado
       FROM public.tbl_usuarios u
       JOIN public.tbl_ecuaciones e ON e.id_usuario = u.id_usuario
       LEFT JOIN LATERAL (
         SELECT id_grafica, fecha_generada, id_ecuacion
         FROM public.tbl_graficas gg
         WHERE gg.id_ecuacion = e.id_ecuacion
         ORDER BY fecha_generada DESC
         LIMIT 1
       ) g ON g.id_ecuacion = e.id_ecuacion
       LEFT JOIN public.tbl_grados gr ON gr.id_grado = e.id_grado
       WHERE u.auth_uid = $1
       ORDER BY e.fecha_creacion DESC`,
      [authUid],
    );
    return rows;
  }
}
