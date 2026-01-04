import { forwardRef, Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entity/booking.entity';
import { TicketModule } from '../ticket/ticket.module';
import { MapperModule } from 'src/common/mapper/mapper.module';
import { ConcertModule } from '../concert/concert.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), TicketModule, MapperModule, ConcertModule, forwardRef(() => UserModule)],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService]
})
export class BookingModule { }
