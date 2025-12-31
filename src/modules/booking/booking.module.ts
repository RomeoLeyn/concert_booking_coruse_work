import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entity/booking.entity';
import { TicketModule } from '../ticket/ticket.module';
import { UserModule } from '../user/user.module';
import { MapperModule } from 'src/common/mapper/mapper.module';
import { ConcertModule } from '../concert/concert.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), TicketModule, UserModule, MapperModule, ConcertModule],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService]
})
export class BookingModule { }
