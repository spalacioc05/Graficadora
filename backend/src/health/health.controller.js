import { Controller, Get, Dependencies } from '@nestjs/common';
import { PG_POOL } from '../database/pg.provider';

@Controller('health')
@Dependencies(PG_POOL)
export class HealthController {
  constructor(pool) {
    this.pool = pool;
  }

  @Get()
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('db')
  async getDbHealth() {
    try {
      const res = await this.pool.query('SELECT 1 as ok');
      return { status: 'ok', db: res.rows[0]?.ok === 1 };
    } catch (e) {
      return { status: 'error', db: false, error: e.message };
    }
  }
}
