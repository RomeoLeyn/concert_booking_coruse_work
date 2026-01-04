import { PaymentStatus } from "src/common/enums/payment-status.enum";
import { Payment } from "src/modules/payment/entity/payment.entity";
import { Ticket } from "src/modules/ticket/entity/ticket.entity";
import { User } from "src/modules/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({
        type: 'date',
        name: 'booking_date'
    })
    bookingDate: Date;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        name: 'payment_status',
        default: 'PENDING'
    })
    paymentStatus: PaymentStatus;

    @ManyToOne(() => User, (user) => user.bookings)
    @JoinColumn({
        name: "user_id"
    })
    user: User;

    @OneToMany(() => Ticket, ticket => ticket.booking)
    tickets: Ticket[];

    @OneToOne(() => Payment, (payment) => payment.booking)
    payment: Payment;
}