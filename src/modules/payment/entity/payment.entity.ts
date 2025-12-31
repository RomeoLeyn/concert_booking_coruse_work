import { PaymentMethod } from "src/common/enums/payment-method.enum";
import { PaymentStatus } from "src/common/enums/payment-status.enum";
import { Booking } from "src/modules/booking/entity/booking.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('payments')
export class Payment {

    @PrimaryGeneratedColumn({
        type: "bigint"
    })
    id: number;

    @Column({
        type: 'bigint',
        nullable: true,
    })
    amount: number;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        nullable: true,
        name: 'payment_method'
    })
    paymentMethod: PaymentMethod;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        nullable: true,
    })
    status: PaymentStatus;

    @Column({
        type: 'varchar',
        nullable: true,
        name: 'card_number'
    })
    cardNumber: string;

    @Column({
        type: 'varchar',
        nullable: true,
        name: 'cardholder_name'
    })
    cardholderName: string;

    @Column({
        type: 'varchar',
        nullable: true,
        name: 'expiry_date'
    })
    expiryDate: string;

    @Column({
        type: 'varchar',
        nullable: true,
        name: 'cvv'
    })
    cvv: string;

    @OneToOne(() => Booking, (booking) => booking.payment)
    @JoinColumn({ name: 'booking_id' })
    booking: Booking;

    @CreateDateColumn({
        name: 'created_at'
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at'
    })
    updatedAt: Date;
}