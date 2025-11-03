import { Module } from '@nestjs/common';
import { PgPoolProvider } from './pg.provider';

@Module({
  providers: [PgPoolProvider],
  exports: [PgPoolProvider],
})
export class DatabaseModule {}
