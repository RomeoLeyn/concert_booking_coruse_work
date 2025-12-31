import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Payment } from './entity/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { BookingService } from '../booking/booking.service';
import { Booking } from '../booking/entity/booking.entity';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        @InjectRepository(Booking)
        private readonly bookingRepository: Repository<Booking>
    ) { }

    async create(bookingId: number, dto: CreatePaymentDto) {
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId },
        });

        if (!booking) {
            throw new NotFoundException("Booking not found");
        }

        const payment = this.paymentRepository.create({
            amount: dto.amount,
            paymentMethod: dto.paymentMethod,
            status: dto.status,
            cardNumber: dto.cardNumber,
            cardholderName: dto.cardholderName,
            expiryDate: dto.expiryDate,
            cvv: dto.cvv,
            booking: { id: booking.id },
        });

        const savedPayment = await this.paymentRepository.save(payment);

        booking.paymentStatus = dto.status;
        await this.bookingRepository.save(booking);

        return savedPayment;
    }
}
