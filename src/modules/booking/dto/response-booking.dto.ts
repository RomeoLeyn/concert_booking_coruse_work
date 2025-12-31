import { Expose, Type } from "class-transformer";
import { PaymentStatus } from "src/common/enums/payment-status.enum";
import { ResponseDetailsConcertDto } from "src/modules/concert/dto/response-details-concert.dto";
import { ResponsePaymentDto } from "src/modules/payment/dto/response-payment.dto";
import { ResponseTicketDto } from "src/modules/ticket/dto/response-tickets.dto";
import { ResponseUserDto } from "src/modules/user/dto/response-user.dto";

export class ResponseBookingDto {
    @Expose()
    id: string;

    @Expose()
    @Type(() => ResponseUserDto)
    user: ResponseUserDto;

    @Expose()
    concertId: string;

    @Expose()
    @Type(() => ResponseDetailsConcertDto)
    concert?: ResponseDetailsConcertDto;

    @Expose()
    @Type(() => ResponseTicketDto)
    tickets: ResponseTicketDto[];

    @Expose()
    totalAmount: number;

    @Expose()
    paymentStatus: PaymentStatus;

    @Expose()
    @Type(() => ResponsePaymentDto)
    payment: ResponsePaymentDto;

    status: 'pending' | 'confirmed' | 'cancelled';
    bookingDate: string;
    paymentDate?: string;
}