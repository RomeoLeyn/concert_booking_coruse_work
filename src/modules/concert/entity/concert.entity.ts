import { Artist } from "src/modules/artist/entity/artist.entity";
import { Ticket } from "src/modules/ticket/entity/ticket.entity";
import { Venue } from "src/modules/venue/entity/venue.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('concerts')
export class Concert {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        nullable: true,
        length: 150
    })
    title: string;

    @Column({
        type: 'date',
        nullable: true,
    })
    date: Date;

    @Column({
        type: 'time',
        nullable: true,
    })
    time: string;

    @Column({
        type: 'bigint',
        nullable: true,
    })
    price: number;

    @Column({
        type: 'varchar',
        nullable: true
    })
    location: string;

    @Column({
        type: 'varchar',
        nullable: true,
    })
    description: string;

    @Column({
        type: 'varchar',
        name: 'image_url',
        nullable: true,
    })
    imageUrl: string;

    @OneToMany(() => Ticket, (ticket) => ticket.concert)
    tickets: Ticket[];

    @ManyToMany(() => Artist, (artist) => artist.concerts)
    @JoinTable({
        name: "concert_artists",
        joinColumn: { name: 'concert_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'artist_id', referencedColumnName: 'id' }
    })
    artists: Artist[];

    @ManyToOne(() => Venue, (venue) => venue.concerts)
    @JoinColumn({
        name: "venue_id"
    })
    venue: Venue;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at'
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updated_at'
    })
    updatedAt: Date;

    @DeleteDateColumn({
        name: 'deleted_at'
    })
    deletedAt: Date;
}