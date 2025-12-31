import { Expose } from "class-transformer";
import { Genre } from "src/common/enums/genre.enum";

export class ResponseArtistDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    genre: Genre;

    @Expose()
    description: string;
}