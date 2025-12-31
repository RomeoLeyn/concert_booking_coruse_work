import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getTickets(@Param('id') id: number) {
    return this.ticketService.getTickets(id);
  }
}
