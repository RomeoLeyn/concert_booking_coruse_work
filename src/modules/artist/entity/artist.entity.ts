import { Genre } from "src/common/enums/genre.enum";
import { Concert } from "src/modules/concert/entity/concert.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('artists')
export class Artist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar'
    })
    name: string;

    @Column({
        type: 'enum',
        enum: Genre
    })
    genre: string;

    @Column({
        type: 'varchar',
        name: 'image_url',
        nullable: true,
    })
    imageUrl: string;

    @Column({
        type: 'varchar'
    })
    description: string

    @OneToMany(() => Concert, (concert) => concert.artists)
    concerts: Concert[];
}