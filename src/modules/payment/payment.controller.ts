import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @UseGuards(JwtAuthGuard)
  @Post(':bookingId')
  create(@Param('bookingId') bookingId: string, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(Number(bookingId), createPaymentDto);
  }
}
