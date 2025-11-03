import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersRepository } from '../repositories/users.repository';
import { DegreesRepository } from '../repositories/degrees.repository';
import { EquationsRepository } from '../repositories/equations.repository';
import { GraphsRepository } from '../repositories/graphs.repository';
import { PolynomialsService } from './polynomials.service';

@Module({
  imports: [DatabaseModule],
  providers: [UsersRepository, DegreesRepository, EquationsRepository, GraphsRepository, PolynomialsService],
  exports: [PolynomialsService],
})
export class PolynomialsModule {}
