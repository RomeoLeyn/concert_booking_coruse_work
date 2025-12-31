import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { BookingModule } from '../booking/booking.module';
import { Booking } from '../booking/entity/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Booking]), BookingModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService]
})
export class PaymentModule { }
