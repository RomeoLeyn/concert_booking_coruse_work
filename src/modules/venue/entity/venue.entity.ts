import { Concert } from "src/modules/concert/entity/concert.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('venues')
export class Venue {
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
        name: 'adress',
        type: 'varchar',
        nullable: true
    })
    address: string;

    @Column({
        name: 'capacity',
        type: 'varchar',
        nullable: true
    })
    capacity: number;

    @OneToMany(() => Concert, (concert) => concert.venue)
    concerts: Concert[];
}