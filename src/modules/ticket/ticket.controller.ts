import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) { }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getTickets(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.getTickets(id);
  }
}
