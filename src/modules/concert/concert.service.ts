import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VenueService } from '../venue/venue.service';
import { ArtistService } from '../artist/artist.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { Concert } from './entity/concert.entity';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { TicketService } from '../ticket/ticket.service';
import { ResponseDetailsConcertDto } from './dto/response-details-concert.dto';
import { MapperService } from 'src/common/mapper/mapper.service';
import { TicketStatus } from 'src/common/enums/ticket-status.enum';
import { ResponseConcertsDto } from './dto/response-concerts.dto';

@Injectable()
export class ConcertService {

    constructor(
        @InjectRepository(Concert)
        private readonly concertRepository: Repository<Concert>,
        private readonly venueService: VenueService,
        private readonly artistService: ArtistService,
        private readonly ticketService: TicketService,
        private readonly mapperService: MapperService
    ) { }

    async create(createConcertDto: CreateConcertDto) {

        const artist = await this.artistService.findById(createConcertDto.artistId);
        const venue = await this.venueService.findById(createConcertDto.venueId);

        const concert = this.concertRepository.create({
            title: createConcertDto.title,
            date: createConcertDto.date,
            time: createConcertDto.time,
            price: createConcertDto.price,
            location: createConcertDto.location,
            description: createConcertDto.description,
            imageUrl: createConcertDto.imageUrl,
            artist,
            venue,
        });
        const createdConcert = await this.concertRepository.save(concert);
        await this.ticketService.create(venue.capacity, createConcertDto.price, concert);
        return createdConcert;
    }

    async update(id: number, updateConcertDto: UpdateConcertDto) {
        const artist = await this.artistService.findById(Number(updateConcertDto.artistId));
        const venue = await this.venueService.findById(Number(updateConcertDto.venueId));

        const concert = await this.concertRepository.update(id, {
            title: updateConcertDto.title,
            date: updateConcertDto.date,
            time: updateConcertDto.time,
            price: updateConcertDto.price,
            artist,
            venue,
        });
    }

    async findById(id: number): Promise<ResponseDetailsConcertDto> {
        const concert = await this.concertRepository.findOne({
            where: { id },
            relations: {
                tickets: true,
                venue: true,
                artist: true,
            }
        });

        if (!concert) {
            throw new NotFoundException('Concert not found');
        }

        const totalTickets = concert.tickets.length;
        const availableTickets = concert.tickets.filter(
            (t) => t.status === TicketStatus.AVAILABLE
        ).length;

        return this.mapperService.toDto(ResponseDetailsConcertDto, concert, { totalTickets, availableTickets });
    }

    async getConcerts(): Promise<ResponseConcertsDto[]> {
        const concerts = await this.concertRepository.find({
            relations: {
                artist: true,
                venue: true,
            },
        });

        const mappedConcerts =
            this.mapperService.toDtoArray(ResponseConcertsDto, concerts);

        const concertIds = mappedConcerts.map(c => Number(c.id));

        const stats = await this.ticketService.countAvailableBulk(concertIds);

        const statsMap = new Map<number, { total: number; available: number }>();
        for (const s of stats) {
            statsMap.set(s.concertId, {
                total: s.totalTickets,
                available: s.availableTickets,
            });
        }

        for (const concert of mappedConcerts) {
            const stat = statsMap.get(Number(concert.id));
            concert.totalTickets = stat?.total ?? 0;
            concert.availableTickets = stat?.available ?? 0;
        }

        return mappedConcerts;
    }

    async getConcertTickets(id: number) {
        return await this.ticketService.getTickets(id);
    }

    async delete(id: number) {
        return await this.concertRepository.delete(id);
    }
}
