import { Expose } from "class-transformer";
import { PaymentMethod } from "src/common/enums/payment-method.enum";
import { PaymentStatus } from "src/common/enums/payment-status.enum";

export class ResponsePaymentDto {
    @Expose()
    id: number;

    amount: number;

    @Expose()
    status: PaymentStatus;

    @Expose()
    paymentMethod: PaymentMethod;

    cardNumber: string;

    cardholderName: string;

    expiryDate: string;

    cvv: string;
}