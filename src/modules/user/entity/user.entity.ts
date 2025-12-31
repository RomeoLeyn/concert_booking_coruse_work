import { UserRole } from 'src/common/enums/user-role.enum';
import { Booking } from 'src/modules/booking/entity/booking.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: number;

    @Column({
        name: 'name',
        type: 'varchar',
        nullable: true
    })
    name: string;

    @Column({
        name: 'email',
        type: 'varchar',
        nullable: true
    })
    email: string;

    @Column({
        name: 'password',
        type: 'varchar',
        nullable: true,
        select: false,
    })
    password: string;

    @Column({
        name: 'role',
        enum: UserRole,
        type: 'enum',
        default: 'USER'
    })
    role: UserRole;

    @OneToMany(() => Booking, (booking) => booking.user)
    bookings: Booking[];
}
