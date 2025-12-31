import { Expose } from "class-transformer";
import { PaymentStatus } from "src/common/enums/payment-status.enum";

export class ResponsePaymentDto {
    @Expose()
    id: number;

    @Expose()
    amount: number;

    @Expose()
    status: PaymentStatus;

    cardNumber: string;

    @Expose()
    cardholderName: string;

    expiryDate: string;

    cvv: string;
}