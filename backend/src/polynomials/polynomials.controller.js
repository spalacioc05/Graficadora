import { Controller, Dependencies, Get, Post, Param, Body, BadRequestException } from '@nestjs/common';
import { PolynomialsService } from './polynomials.service';

@Controller()
@Dependencies(PolynomialsService)
export class PolynomialsController {
  constructor(service) {
    this.service = service;
  }

  // Health-like echo on root retained by AppController. We'll expose our own routes under /api
  @Post('api/polynomials')
  async crear(@Body() body) {
    try {
      return await this.service.crearPolinomio(body);
    } catch (e) {
      if (e?.response) throw e; // Nest http exception
      throw new BadRequestException(e.message || 'Error procesando solicitud');
    }
  }

  @Get('api/users/:authUid/polynomials')
  async historial(@Param('authUid') authUid) {
    return await this.service.historialPorUsuario(authUid);
  }

  @Get('api/polynomials/:id')
  async detalle(@Param('id') id) {
    const data = await this.service.detalleEcuacion(id);
    if (!data) return { message: 'No encontrado' };
    return data;
  }
}
