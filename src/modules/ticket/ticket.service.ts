import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entity/ticket.entity';
import { In, Repository } from 'typeorm';
import { Concert } from '../concert/entity/concert.entity';
import { TicketStatus } from 'src/common/enums/ticket-status.enum';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async create(capacity: number, price: number, concert: Concert) {
    const tickets: Ticket[] = [];
    for (let seat = 1; seat <= capacity; seat++) {
      tickets.push(
        this.ticketRepository.create({
          seat,
          status: TicketStatus.AVAILABLE,
          price: price,
          concert,
        }),
      );
    }

    return await this.ticketRepository.save(tickets);
  }

  async updateTicketsStatusAndAddedBooking(ids: number[], bookingId: number) {
    return await this.ticketRepository.update(
      { id: In(ids) },
      {
        status: TicketStatus.BOOKED,
        booking: { id: bookingId },
      },
    );
  }

  async findTicketsByIds(ids: number[]) {
    const tickets = await this.ticketRepository.findBy({
      id: In(ids),
    });
    return tickets;
  }

  async findTicketsByBookingId(bookingId: number) {
    return this.ticketRepository.find({
      where: {
        booking: { id: bookingId },
      },
      relations: {
        concert: {
          venue: true,
        },
      },
    });
  }

  async getTickets(concertId: number) {
    return this.ticketRepository.find({
      where: {
        concert: { id: concertId },
      },
    });
  }

  async countAvailable(concertId: number) {
    const result = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select('COUNT(*)', 'total')
      .addSelect(
        `
            SUM(CASE WHEN ticket.ticket_status = 'AVAILABLE' THEN 1 ELSE 0 END)
        `,
        'available',
      )
      .where('ticket.concert_id = :concertId', { concertId })
      .getRawOne();

    return {
      totalTickets: Number(result.total),
      availableTickets: Number(result.available),
    };
  }

  async countAvailableBulk(concertIds: number[]): Promise<
    {
      concertId: number;
      totalTickets: number;
      availableTickets: number;
    }[]
  > {
    if (concertIds.length === 0) {
      return [];
    }

    const result = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select('ticket.concert_id', 'concertId')
      .addSelect('COUNT(ticket.id)', 'totalTickets')
      .addSelect(
        `SUM(CASE WHEN ticket.ticket_status = 'AVAILABLE' THEN 1 ELSE 0 END)`,
        'availableTickets',
      )
      .where('ticket.concert_id IN (:...concertIds)', { concertIds })
      .groupBy('ticket.concert_id')
      .getRawMany<{
        concertId: number;
        totalTickets: string;
        availableTickets: string;
      }>();

    return result.map((r) => ({
      concertId: Number(r.concertId),
      totalTickets: Number(r.totalTickets),
      availableTickets: Number(r.availableTickets),
    }));
  }
}
