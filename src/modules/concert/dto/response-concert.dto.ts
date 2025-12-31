import { Expose, Type } from "class-transformer";
import { ResponseArtistDto } from "src/modules/artist/dto/response-artist.dto";
import { ResponseVenueDto } from "src/modules/venue/dto/response-venue.dto";

export class ResponseDetailsConcertDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    @Type(() => ResponseArtistDto)
    artist: ResponseArtistDto;

    @Expose()
    date: string;

    @Expose()
    time: string;

    @Expose()
    @Type(() => ResponseVenueDto)
    venue: ResponseVenueDto;

    @Expose()
    location: string;

    @Expose()
    description: string;

    @Expose()
    imageUrl: string;

    @Expose()
    price: number;

    @Expose()
    availableTickets: number;

    @Expose()
    totalTickets: number;
}