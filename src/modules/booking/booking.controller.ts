import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async geyBokkingById(@Param('id') id: number) {
    return this.bookingService.getBookingById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/me/:userId')
  async getUserBookings(@Param('userId') userId: number) {
    return this.bookingService.geAllUserBookings(userId);
  }

  @Get('calculate/total-amount/:userId')
  async calculateUsersOrdersTotal(@Param('userId', ParseIntPipe) userId: number) {
    return this.bookingService.calculateUsersOrdersTotal(userId);
  }
} 
