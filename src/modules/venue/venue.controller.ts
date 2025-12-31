import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorstors/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('venues')
export class VenueController {
  constructor(private readonly venueService: VenueService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createVenueDto: CreateVenueDto) {
    return this.venueService.create(createVenueDto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('update/:id')
  update(@Param('id') id: number, @Body() updateVenueDto: UpdateVenueDto) {
    return this.venueService.update(+id, updateVenueDto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Get()
  getVenues() {
    return this.venueService.getVenues();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('delete/:id')
  delete(@Param('id') id: number) {
    return this.venueService.delete(+id);
  }
}
