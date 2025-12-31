import { IsInt, isNotEmpty, IsNotEmpty, IsString } from "class-validator";
import { PaymentMethod } from "src/common/enums/payment-method.enum";
import { PaymentStatus } from "src/common/enums/payment-status.enum";

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsInt()
    amount: number;

    @IsNotEmpty()
    paymentMethod: PaymentMethod;

    @IsNotEmpty()
    status: PaymentStatus;

    @IsNotEmpty()
    @IsString()
    cardNumber: string;

    @IsNotEmpty()
    @IsString()
    cardholderName: string;

    @IsNotEmpty()
    @IsString()
    expiryDate: string;

    @IsNotEmpty()
    @IsString()
    cvv: string;
}