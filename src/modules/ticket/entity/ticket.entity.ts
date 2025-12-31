import { TicketStatus } from "src/common/enums/ticket-status.enum";
import { Booking } from "src/modules/booking/entity/booking.entity";
import { Concert } from "src/modules/concert/entity/concert.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('tickets')
export class Ticket {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({
        type: 'bigint',
    })
    seat: number;

    @Column({
        type: 'enum',
        enum: TicketStatus,
        name: 'ticket_status'
    })
    status: TicketStatus;

    @Column({
        type: 'bigint',
    })
    price: number;

    @ManyToOne(() => Concert, (concert) => concert.tickets)
    @JoinColumn({
        name: "concert_id"
    })
    concert: Concert;

    @ManyToOne(() => Booking, booking => booking.tickets, { nullable: true })
    @JoinColumn({ name: "booking_id" })
    booking: Booking | null;
}