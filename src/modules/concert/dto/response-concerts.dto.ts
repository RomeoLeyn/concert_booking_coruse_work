import { Expose, Type } from 'class-transformer';
import { ResponseArtistDto } from 'src/modules/artist/dto/response-artist.dto';
import { ResponseVenueDto } from 'src/modules/venue/dto/response-venue.dto';

export class ResponseConcertsDto {
    @Expose()
    id: string;

    @Expose()
    title: string;

    @Expose()
    date: string;

    @Expose()
    time: string;

    @Expose()
    price: number;

    @Expose()
    location: string | null;

    @Expose()
    description: string | null;

    @Expose()
    imageUrl: string | null;

    @Expose()
    @Type(() => ResponseArtistDto)
    artists: ResponseArtistDto[];

    @Expose()
    @Type(() => ResponseVenueDto)
    venue: ResponseVenueDto;

    @Expose()
    totalTickets: number;

    @Expose()
    availableTickets: number;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}
