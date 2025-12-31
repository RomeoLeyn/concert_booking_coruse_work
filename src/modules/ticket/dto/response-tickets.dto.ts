import { Expose, Type } from "class-transformer";
import { TicketStatus } from "src/common/enums/ticket-status.enum";
import { ResponseDetailsConcertDto } from "src/modules/concert/dto/response-details-concert.dto";

export class ResponseTicketDto {
    @Expose()
    id: number

    @Expose()
    price: number;

    @Expose()
    seat: number;

    @Expose()
    status: TicketStatus;
}