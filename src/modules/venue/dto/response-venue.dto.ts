import { Expose } from "class-transformer";

export class ResponseVenueDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    address: string;

    @Expose()
    capacity: number;
}