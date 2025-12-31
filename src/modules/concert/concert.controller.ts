import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorstors/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('concerts')
export class ConcertController {
  constructor(private readonly concertService: ConcertService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createConcertDto: CreateConcertDto) {
    return this.concertService.create(createConcertDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateConcertDto: UpdateConcertDto
  ) {
    return this.concertService.update(id, updateConcertDto)
  }

  @Get()
  getConcerts() {
    return this.concertService.getConcerts();
  }

  @Get(':id')
  getConcertById(@Param('id', ParseIntPipe) id: number) {
    return this.concertService.findById(id);
  }

  @Get(':id/tickets')
  getTicketsByConcetrtId(@Param('id', ParseIntPipe) id: number) {
    return this.concertService.getConcertTickets(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('delete/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.concertService.delete(id);
  }
}
